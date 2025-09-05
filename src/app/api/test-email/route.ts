import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    // Send a simple test email
    const { data, error } = await resend.emails.send({
      from: "Test <onboarding@resend.dev>", // Using Resend's default domain for testing
      to: ["mugisham505@gmail.com"],
      subject: "Email Integration Test - Success!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000;">🎉 Email Integration Working!</h1>
          <p>This is a test email to confirm your email integration is working correctly.</p>
          <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Setup Status:</h3>
            <ul>
              <li>✅ Resend API configured</li>
              <li>✅ Email route working</li>
              <li>✅ Template rendering</li>
              <li>✅ Ready for production!</li>
            </ul>
          </div>
          <p>Your onboarding form is now ready to send professional project inquiry emails.</p>
          <p style="color: #666; font-size: 14px;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `
Email Integration Test - Success!

This is a test email to confirm your email integration is working correctly.

Setup Status:
✅ Resend API configured
✅ Email route working  
✅ Template rendering
✅ Ready for production!

Your onboarding form is now ready to send professional project inquiry emails.

Sent at: ${new Date().toLocaleString()}
      `,
    });

    if (error) {
      console.error("Test email error:", error);
      return NextResponse.json(
        { error: "Failed to send test email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Test email sent successfully!",
        id: data?.id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
