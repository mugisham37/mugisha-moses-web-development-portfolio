import { Resend } from "resend";
import { ContactSubmission } from "@prisma/client";
import {
  prepareEmailTemplateData,
  generateAutoResponseMessage,
} from "./contact-utils";

const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || "noreply@example.com",
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  replyTo: process.env.REPLY_TO_EMAIL || "hello@example.com",
};

// Email templates
export const emailTemplates = {
  // Admin notification template
  adminNotification: (data: any) => ({
    subject: `New ${data.isProjectInquiry ? "Project Inquiry" : data.isConsultation ? "Consultation Request" : "Contact"} from ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Submission</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              background-color: #000000;
              color: #ffffff;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 4px solid #ffffff;
              padding: 20px;
              background-color: #000000;
            }
            .header {
              background-color: #ffff00;
              color: #000000;
              padding: 20px;
              margin: -20px -20px 20px -20px;
              text-transform: uppercase;
              font-weight: bold;
              font-size: 18px;
              letter-spacing: 2px;
            }
            .field {
              margin-bottom: 15px;
              border-bottom: 2px solid #333333;
              padding-bottom: 10px;
            }
            .label {
              color: #ffff00;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 1px;
              margin-bottom: 5px;
            }
            .value {
              color: #ffffff;
              font-size: 14px;
            }
            .message {
              background-color: #1a1a1a;
              border: 2px solid #ffffff;
              padding: 15px;
              margin: 20px 0;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #333333;
              font-size: 12px;
              color: #cccccc;
            }
            .urgent {
              background-color: #ff0000;
              color: #ffffff;
              padding: 10px;
              margin-bottom: 20px;
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              New Contact Submission
            </div>
            
            ${data.isProjectInquiry ? '<div class="urgent">Project Inquiry - High Priority</div>' : ""}
            
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${data.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${data.email}</div>
            </div>
            
            ${
              data.subject
                ? `
            <div class="field">
              <div class="label">Subject</div>
              <div class="value">${data.subject}</div>
            </div>
            `
                : ""
            }
            
            ${
              data.projectType
                ? `
            <div class="field">
              <div class="label">Project Type</div>
              <div class="value">${data.projectType}</div>
            </div>
            `
                : ""
            }
            
            ${
              data.budget
                ? `
            <div class="field">
              <div class="label">Budget</div>
              <div class="value">${data.budget}</div>
            </div>
            `
                : ""
            }
            
            ${
              data.timeline
                ? `
            <div class="field">
              <div class="label">Timeline</div>
              <div class="value">${data.timeline}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
              <div class="label">Message</div>
              <div class="message">${data.message}</div>
            </div>
            
            <div class="footer">
              Submitted on ${data.submissionDate} at ${data.submissionTime}
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
New Contact Submission

Name: ${data.name}
Email: ${data.email}
${data.subject ? `Subject: ${data.subject}` : ""}
${data.projectType ? `Project Type: ${data.projectType}` : ""}
${data.budget ? `Budget: ${data.budget}` : ""}
${data.timeline ? `Timeline: ${data.timeline}` : ""}

Message:
${data.message}

Submitted on ${data.submissionDate} at ${data.submissionTime}
    `,
  }),

  // Auto-response template
  autoResponse: (data: any, responseMessage: string) => ({
    subject: `Thank you for contacting me, ${data.name}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Thank you for your message</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              background-color: #000000;
              color: #ffffff;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              border: 4px solid #ffffff;
              padding: 20px;
              background-color: #000000;
            }
            .header {
              background-color: #ffff00;
              color: #000000;
              padding: 20px;
              margin: -20px -20px 20px -20px;
              text-transform: uppercase;
              font-weight: bold;
              font-size: 18px;
              letter-spacing: 2px;
              text-align: center;
            }
            .content {
              font-size: 14px;
              line-height: 1.8;
              white-space: pre-line;
            }
            .signature {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #333333;
              font-size: 12px;
              color: #cccccc;
            }
            .cta {
              background-color: #1a1a1a;
              border: 2px solid #ffff00;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .cta a {
              color: #ffff00;
              text-decoration: none;
              font-weight: bold;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              Message Received
            </div>
            
            <div class="content"></div>            ${responseMessage}
            </div>
            
            <div class="cta">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://example.com"}" target="_blank">
                View My Portfolio
              </a>
            </div>
            
            <div class="signature">
              This is an automated response. Please do not reply to this email.
              <br>
              For urgent matters, contact me directly at ${EMAIL_CONFIG.replyTo}
            </div>
          </div>
        </body>
      </html>
    `,
    text: responseMessage,
  }),
};

// Send admin notification email
export async function sendAdminNotification(
  submission: ContactSubmission & { type: string }
) {
  try {
    const templateData = prepareEmailTemplateData(submission);
    const template = emailTemplates.adminNotification(templateData);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmail,
      replyTo: submission.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    return { success: false, error };
  }
}

// Send auto-response email
export async function sendAutoResponse(
  submission: ContactSubmission & { type: string }
) {
  try {
    const templateData = prepareEmailTemplateData(submission);
    const responseMessage = generateAutoResponseMessage(
      submission.type,
      submission.name
    );
    const template = emailTemplates.autoResponse(templateData, responseMessage);

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: submission.email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send auto-response:", error);
    return { success: false, error };
  }
}

// Send consultation confirmation email
export async function sendConsultationConfirmation(data: {
  name: string;
  email: string;
  serviceType: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
}) {
  try {
    const template = {
      subject: `Consultation Confirmed - ${data.serviceType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Consultation Confirmed</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                background-color: #000000;
                color: #ffffff;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 4px solid #ffffff;
                padding: 20px;
                background-color: #000000;
              }
              .header {
                background-color: #ffff00;
                color: #000000;
                padding: 20px;
                margin: -20px -20px 20px -20px;
                text-transform: uppercase;
                font-weight: bold;
                font-size: 18px;
                letter-spacing: 2px;
                text-align: center;
              }
              .details {
                background-color: #1a1a1a;
                border: 2px solid #ffffff;
                padding: 20px;
                margin: 20px 0;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #333333;
              }
              .label {
                color: #ffff00;
                font-weight: bold;
                text-transform: uppercase;
              }
              .value {
                color: #ffffff;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Consultation Confirmed
              </div>
              
              <p>Hi ${data.name.split(" ")[0]},</p>
              
              <p>Your consultation has been confirmed! Here are the details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span class="value">${data.serviceType}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span class="value">${data.preferredDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Time:</span>
                  <span class="value">${data.preferredTime} (${data.timezone})</span>
                </div>
              </div>
              
              <p>I'll send you a calendar invite with the meeting link shortly.</p>
              
              <p>Looking forward to our conversation!</p>
              
              <p>Best regards,<br>[Your Name]</p>
            </div>
          </body>
        </html>
      `,
    };

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.email,
      replyTo: EMAIL_CONFIG.replyTo,
      subject: template.subject,
      html: template.html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send consultation confirmation:", error);
    return { success: false, error };
  }
}

// Test email configuration
export async function testEmailConfiguration() {
  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: EMAIL_CONFIG.adminEmail,
      subject: "Email Configuration Test",
      html: "<p>Email configuration is working correctly!</p>",
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return { success: false, error };
  }
}
