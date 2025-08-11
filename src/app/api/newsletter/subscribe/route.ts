import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await db.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: "Email is already subscribed" },
          { status: 400 }
        );
      } else {
        // Reactivate existing subscriber
        await db.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            subscribedAt: new Date(),
          },
        });
      }
    } else {
      // Create new subscriber
      await db.newsletterSubscriber.create({
        data: {
          email,
          isActive: true,
          subscribedAt: new Date(),
        },
      });
    }

    // TODO: Send welcome email using Resend
    // This would be implemented in a future enhancement

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to subscribe to newsletter:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
