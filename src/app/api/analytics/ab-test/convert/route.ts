import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, experimentName, variant } = body;

    // Find the experiment and assignment
    const experiment = await db.aBTestExperiment.findFirst({
      where: {
        name: experimentName,
        isActive: true,
      },
    });

    if (!experiment) {
      return NextResponse.json({
        success: false,
        error: "Experiment not found",
      });
    }

    // Update assignment with conversion
    await db.aBTestAssignment.updateMany({
      where: {
        experimentId: experiment.id,
        sessionId,
        hasConverted: false,
      },
      data: {
        hasConverted: true,
        convertedAt: new Date(),
      },
    });

    // Update experiment conversion counts
    if (variant === "control") {
      await db.aBTestExperiment.update({
        where: { id: experiment.id },
        data: { controlConversions: { increment: 1 } },
      });
    } else {
      await db.aBTestExperiment.update({
        where: { id: experiment.id },
        data: { variantConversions: { increment: 1 } },
      });
    }

    // Calculate statistical significance if we have enough data
    const updatedExperiment = await db.aBTestExperiment.findUnique({
      where: { id: experiment.id },
    });

    if (
      updatedExperiment &&
      updatedExperiment.controlViews > 100 &&
      updatedExperiment.variantViews > 100
    ) {
      const controlRate =
        updatedExperiment.controlConversions / updatedExperiment.controlViews;
      const variantRate =
        updatedExperiment.variantConversions / updatedExperiment.variantViews;

      // Simple statistical significance calculation (chi-square test approximation)
      const pooledRate =
        (updatedExperiment.controlConversions +
          updatedExperiment.variantConversions) /
        (updatedExperiment.controlViews + updatedExperiment.variantViews);

      const se = Math.sqrt(
        pooledRate *
          (1 - pooledRate) *
          (1 / updatedExperiment.controlViews +
            1 / updatedExperiment.variantViews)
      );
      const zScore = Math.abs(controlRate - variantRate) / se;
      const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

      const isSignificant = pValue < 0.05;
      const winner = isSignificant
        ? variantRate > controlRate
          ? "variant"
          : "control"
        : null;

      await db.aBTestExperiment.update({
        where: { id: experiment.id },
        data: {
          pValue,
          isSignificant,
          winner,
          confidenceLevel: isSignificant ? 0.95 : null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to track A/B test conversion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Approximation of normal cumulative distribution function
function normalCDF(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

// Error function approximation
function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y =
    1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
