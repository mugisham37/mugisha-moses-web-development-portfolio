import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, experimentName, variant } = body;

    // Check if experiment exists and is active
    const experiment = await db.aBTestExperiment.findFirst({
      where: {
        name: experimentName,
        isActive: true,
      },
    });

    if (!experiment) {
      return NextResponse.json({
        success: false,
        error: "Experiment not found or inactive",
      });
    }

    // Create assignment
    await db.aBTestAssignment.upsert({
      where: {
        experimentId_sessionId: {
          experimentId: experiment.id,
          sessionId,
        },
      },
      update: {
        variant,
      },
      create: {
        experimentId: experiment.id,
        sessionId,
        variant,
        assignedAt: new Date(),
      },
    });

    // Update experiment view counts
    if (variant === "control") {
      await db.aBTestExperiment.update({
        where: { id: experiment.id },
        data: { controlViews: { increment: 1 } },
      });
    } else {
      await db.aBTestExperiment.update({
        where: { id: experiment.id },
        data: { variantViews: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to assign A/B test variant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
