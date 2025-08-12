import { ContactSubmission, ContactType, ContactStatus } from "@prisma/client";
import { ConsultationData } from "./contact-validation";

// Email service interface (implement with your preferred email provider)
interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Mock email sending function - replace with actual email service
async function sendEmail(data: EmailData): Promise<void> {
  console.log("Sending email:", data);
  // In production, integrate with services like:
  // - Resend
  // - SendGrid
  // - AWS SES
  // - Nodemailer
}

export async function sendAdminNotification(
  submission: ContactSubmission
): Promise<void> {
  const emailData: EmailData = {
    to: process.env.ADMIN_EMAIL || "admin@example.com",
    subject: `New Contact Submission: ${submission.type}`,
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Type:</strong> ${submission.type}</p>
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
      <p><strong>Subject:</strong> ${submission.subject || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${submission.message.replace(/\n/g, "<br>")}</p>
      ${submission.projectType ? `<p><strong>Project Type:</strong> ${submission.projectType}</p>` : ""}
      ${submission.budget ? `<p><strong>Budget:</strong> ${submission.budget}</p>` : ""}
      ${submission.timeline ? `<p><strong>Timeline:</strong> ${submission.timeline}</p>` : ""}
      <p><strong>Submitted:</strong> ${submission.createdAt.toISOString()}</p>
    `,
  };

  await sendEmail(emailData);
}

export async function sendAutoResponse(
  submission: ContactSubmission
): Promise<void> {
  const emailData: EmailData = {
    to: submission.email,
    subject: "Thank you for contacting us",
    html: `
      <h2>Thank you for your message!</h2>
      <p>Hi ${submission.name},</p>
      <p>Thank you for reaching out. We have received your message and will get back to you within 24 hours.</p>
      <p><strong>Your message:</strong></p>
      <p>${submission.message.replace(/\n/g, "<br>")}</p>
      <p>Best regards,<br>The Team</p>
    `,
  };

  await sendEmail(emailData);
}

export async function sendConsultationConfirmation(
  data: ConsultationData
): Promise<void> {
  const emailData: EmailData = {
    to: data.email,
    subject: "Consultation Request Received",
    html: `
      <h2>Consultation Request Confirmed</h2>
      <p>Hi ${data.name},</p>
      <p>Thank you for requesting a consultation. We have received your request with the following details:</p>
      <ul>
        <li><strong>Service Type:</strong> ${data.serviceType}</li>
        <li><strong>Preferred Date:</strong> ${data.preferredDate}</li>
        <li><strong>Preferred Time:</strong> ${data.preferredTime}</li>
        <li><strong>Timezone:</strong> ${data.timezone}</li>
        ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ""}
        ${data.company ? `<li><strong>Company:</strong> ${data.company}</li>` : ""}
      </ul>
      <p>We will review your request and send you a calendar invitation within 24 hours.</p>
      <p>Best regards,<br>The Team</p>
    `,
  };

  await sendEmail(emailData);
}
