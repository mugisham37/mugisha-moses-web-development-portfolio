import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { consultationBookingSchema } from "@/lib/contact-validation";
import { isRateLimited } from "@/lib/contact-utils";
import {
  sendConsultationConfirmation,
  sendAdminNotification,
} from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIP =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Rate limiting check
    if (isRateLimited(`consultation-${clientIP}`, 2, 300000)) {
      // 2 attempts per 5 minutes
      return NextResponse.json(
        {
          success: false,
          error: "Too many consultation requests. Please try again later.",
        },
        { status: 429 }
      );
    }

    // Validate consultation booking data
    let validatedData;
    try {
      validatedData = consultationBookingSchema.parse(body);
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

    // Create consultation request in database
    const consultation = await db.contactSubmission.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        subject: `Consultation Request - ${validatedData.serviceType}`,
        message: `
Consultation Details:
- Service Type: ${validatedData.serviceType}
- Preferred Date: ${validatedData.preferredDate}
- Preferred Time: ${validatedData.preferredTime}
- Timezone: ${validatedData.timezone}
${validatedData.phone ? `- Phone: ${validatedData.phone}` : ""}
${validatedData.company ? `- Company: ${validatedData.company}` : ""}

Message:
${validatedData.message}
        `.trim(),
        type: "CONSULTATION",
        status: "NEW",
        responded: false,
      },
    });

    // Prepare consultation data for emails
    const consultationData = {
      name: validatedData.name,
      email: validatedData.email,
      serviceType: validatedData.serviceType,
      preferredDate: validatedData.preferredDate,
      preferredTime: validatedData.preferredTime,
      timezone: validatedData.timezone,
      phone: validatedData.phone,
      company: validatedData.company,
      message: validatedData.message,
    };

    // Send admin notification
    const submissionWithType = { ...consultation, type: "CONSULTATION" };
    sendAdminNotification(submissionWithType).catch((error) => {
      console.error(
        "Failed to send admin notification for consultation:",
        error
      );
    });

    // Send consultation confirmation to client
    sendConsultationConfirmation(consultationData).catch((error) => {
      console.error("Failed to send consultation confirmation:", error);
    });

    return NextResponse.json({
      success: true,
      message:
        "Consultation request submitted successfully. You will receive a confirmation email shortly.",
      consultationId: consultation.id,
    });
  } catch (error) {
    console.error("Consultation booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Get available consultation slots (placeholder for calendar integration)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const timezone = searchParams.get("timezone") || "UTC";

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // This is a placeholder for calendar integration
    // In a real implementation, you would integrate with a calendar service
    // like Google Calendar, Calendly, or a custom booking system

    const availableSlots = [
      { time: "09:00", available: true },
      { time: "10:00", available: false },
      { time: "11:00", available: true },
      { time: "14:00", available: true },
      { time: "15:00", available: true },
      { time: "16:00", available: false },
    ];

    return NextResponse.json({
      success: true,
      date,
      timezone,
      availableSlots,
      message: "Available consultation slots retrieved successfully",
    });
  } catch (error) {
    console.error("Get consultation slots error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
