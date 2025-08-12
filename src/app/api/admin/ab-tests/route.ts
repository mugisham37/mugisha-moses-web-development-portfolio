import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const experiments = await db.aBTestExperiment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ experiments });
  } catch (error) {
    console.error("Failed to fetch A/B tests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      trafficSplit,
      targetPages,
      component,
      controlVersion,
      variantVersion,
      primaryGoal,
      successMetric,
    } = body;

    const experiment = await db.aBTestExperiment.create({
      data: {
        name,
        description,
        trafficSplit: trafficSplit || 50,
        targetPages,
        component,
        controlVersion,
        variantVersion,
        primaryGoal,
        successMetric,
        isActive: false,
      },
    });

    return NextResponse.json({ experiment });
  } catch (error) {
    console.error("Failed to create A/B test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
