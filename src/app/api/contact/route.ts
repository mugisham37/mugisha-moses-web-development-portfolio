import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  generalContactSchema,
  projectInquirySchema,
} from "@/lib/contact-validation";
import { processContactSubmission, isRateLimited } from "@/lib/contact-utils";
import { sendAdminNotification, sendAutoResponse } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting check
    if (isRateLimited(clientIP, 3, 60000)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Validate based on contact type
    let validatedData;
    try {
      if (body.type === "PROJECT_INQUIRY") {
        validatedData = projectInquirySchema.parse(body);
      } else {
        validatedData = generalContactSchema.parse(body);
      }
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors?.map((e: any) => e.message) || [
            "Invalid form data",
          ],
        },
        { status: 400 }
      );
    }

    // Process submission for spam detection
    const processingResult = processContactSubmission(validatedData);

    if (!processingResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Submission validation failed",
          details: processingResult.errors,
        },
        { status: 400 }
      );
    }

    // If spam is detected, log but don't save to database
    if (processingResult.isSpam) {
      console.warn("Spam submission detected:", {
        email: validatedData.email,
        ip: clientIP,
        errors: processingResult.errors,
      });

      // Return success to avoid revealing spam detection
      return NextResponse.json({
        success: true,
        message: "Thank you for your message. We will get back to you soon.",
      });
    }

    // Save to database
    const submission = await db.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        type: validatedData.type,
        projectType:
          "projectType" in validatedData ? validatedData.projectType : null,
        budget: "budget" in validatedData ? validatedData.budget : null,
        timeline: "timeline" in validatedData ? validatedData.timeline : null,
        status: "NEW",
        responded: false,
      },
    });

    // Send emails asynchronously
    const submissionWithType = { ...submission, type: validatedData.type };

    // Send admin notification
    sendAdminNotification(submissionWithType).catch((error) => {
      console.error("Failed to send admin notification:", error);
    });

    // Send auto-response
    sendAutoResponse(submissionWithType).catch((error) => {
      console.error("Failed to send auto-response:", error);
    });

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your message. We will get back to you within 24 hours.",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // This endpoint can be used to get contact form statistics or test the API
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "stats") {
      const stats = await db.contactSubmission.groupBy({
        by: ["type", "status"],
        _count: {
          id: true,
        },
        orderBy: {
          type: "asc",
        },
      });

      return NextResponse.json({ success: true, stats });
    }

    if (action === "test") {
      return NextResponse.json({
        success: true,
        message: "Contact API is working",
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Contact API GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
