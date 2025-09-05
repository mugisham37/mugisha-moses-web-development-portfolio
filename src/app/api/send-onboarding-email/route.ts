import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OnboardingEmailData {
  name: string;
  company: string;
  email: string;
  role: string;
  projectType: string;
  projectDescription: string;
  timeline: string;
  budget: string;
  requirements: string;
  phoneNumber: string;
  preferCall: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const formData: OnboardingEmailData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Create email content
    const emailHtml = generateEmailTemplate(formData);
    const emailText = generateEmailText(formData);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Onboarding System <onboarding@yourdomain.com>", // Replace with your verified domain
      to: ["mugisham505@gmail.com"],
      subject: `New Project Inquiry from ${formData.name}`,
      html: emailHtml,
      text: emailText,
      replyTo: formData.email,
    });

    if (error) {
      console.error("Email sending error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Email sent successfully", id: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateEmailTemplate(data: OnboardingEmailData): string {
  const formatProjectType = (type: string) => {
    const types: { [key: string]: string } = {
      website: "Website",
      "web-app": "Web Application",
      "mobile-app": "Mobile Application",
      "e-commerce": "E-commerce Platform",
      portfolio: "Portfolio Website",
      other: "Other",
    };
    return types[type] || type;
  };

  const formatTimeline = (timeline: string) => {
    const timelines: { [key: string]: string } = {
      asap: "ASAP",
      "1-2-months": "1-2 months",
      "3-6-months": "3-6 months",
      "just-exploring": "Just exploring",
    };
    return timelines[timeline] || timeline;
  };

  const formatBudget = (budget: string) => {
    const budgets: { [key: string]: string } = {
      "under-5k": "Under $5,000",
      "5k-15k": "$5,000 - $15,000",
      "15k-30k": "$15,000 - $30,000",
      "30k-50k": "$30,000 - $50,000",
      "50k-plus": "$50,000+",
      discuss: "Let's discuss",
    };
    return budgets[budget] || budget;
  };

  const formatRole = (role: string) => {
    const roles: { [key: string]: string } = {
      "startup-founder": "Startup Founder",
      "business-owner": "Business Owner",
      "product-manager": "Product Manager",
      "marketing-manager": "Marketing Manager",
      developer: "Developer",
      designer: "Designer",
      other: "Other",
    };
    return roles[role] || role;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Project Inquiry</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #000;
        }
        .header h1 {
          color: #000;
          margin: 0;
          font-size: 24px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section h2 {
          color: #000;
          font-size: 18px;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #eee;
        }
        .field {
          margin-bottom: 12px;
        }
        .field-label {
          font-weight: 600;
          color: #555;
          display: inline-block;
          width: 140px;
        }
        .field-value {
          color: #333;
        }
        .description-box {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #000;
          margin-top: 8px;
        }
        .contact-info {
          background-color: #000;
          color: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
        }
        .priority-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .priority-high { background-color: #ff4444; color: white; }
        .priority-medium { background-color: #ffaa00; color: white; }
        .priority-low { background-color: #00aa44; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Project Inquiry</h1>
          <p style="margin: 10px 0 0 0; color: #666;">Received: ${new Date().toLocaleString()}</p>
        </div>

        <div class="section">
          <h2>👤 Client Information</h2>
          <div class="field">
            <span class="field-label">Name:</span>
            <span class="field-value">${data.name}</span>
          </div>
          <div class="field">
            <span class="field-label">Email:</span>
            <span class="field-value">${data.email}</span>
          </div>
          ${
            data.company
              ? `
          <div class="field">
            <span class="field-label">Company:</span>
            <span class="field-value">${data.company}</span>
          </div>
          `
              : ""
          }
          ${
            data.role
              ? `
          <div class="field">
            <span class="field-label">Role:</span>
            <span class="field-value">${formatRole(data.role)}</span>
          </div>
          `
              : ""
          }
          ${
            data.phoneNumber
              ? `
          <div class="field">
            <span class="field-label">Phone:</span>
            <span class="field-value">${data.phoneNumber}</span>
          </div>
          `
              : ""
          }
          ${
            data.preferCall
              ? `
          <div class="field">
            <span class="field-label">Prefers:</span>
            <span class="field-value">📞 Phone call</span>
          </div>
          `
              : ""
          }
        </div>

        <div class="section">
          <h2>💼 Project Details</h2>
          <div class="field">
            <span class="field-label">Project Type:</span>
            <span class="field-value">${formatProjectType(
              data.projectType
            )}</span>
          </div>
          <div class="field">
            <span class="field-label">Timeline:</span>
            <span class="field-value">${formatTimeline(data.timeline)} ${
    data.timeline === "asap"
      ? '<span class="priority-badge priority-high">High Priority</span>'
      : data.timeline === "1-2-months"
      ? '<span class="priority-badge priority-medium">Medium Priority</span>'
      : '<span class="priority-badge priority-low">Standard</span>'
  }</span>
          </div>
          <div class="field">
            <span class="field-label">Budget:</span>
            <span class="field-value">${formatBudget(data.budget)}</span>
          </div>
          
          ${
            data.projectDescription
              ? `
          <div class="field">
            <span class="field-label">Description:</span>
            <div class="description-box">
              ${data.projectDescription.replace(/\n/g, "<br>")}
            </div>
          </div>
          `
              : ""
          }
          
          ${
            data.requirements
              ? `
          <div class="field">
            <span class="field-label">Requirements:</span>
            <div class="description-box">
              ${data.requirements.replace(/\n/g, "<br>")}
            </div>
          </div>
          `
              : ""
          }
        </div>

        <div class="contact-info">
          <h3 style="margin-top: 0;">📧 Quick Actions</h3>
          <p style="margin: 10px 0;">
            <a href="mailto:${
              data.email
            }?subject=Re: Your Project Inquiry" style="color: white; text-decoration: underline;">Reply to ${
    data.name
  }</a>
          </p>
          ${
            data.phoneNumber && data.preferCall
              ? `
          <p style="margin: 10px 0;">
            <a href="tel:${data.phoneNumber}" style="color: white; text-decoration: underline;">Call ${data.phoneNumber}</a>
          </p>
          `
              : ""
          }
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(data: OnboardingEmailData): string {
  return `
NEW PROJECT INQUIRY
===================

Client Information:
- Name: ${data.name}
- Email: ${data.email}
${data.company ? `- Company: ${data.company}` : ""}
${data.role ? `- Role: ${data.role}` : ""}
${data.phoneNumber ? `- Phone: ${data.phoneNumber}` : ""}
${data.preferCall ? "- Prefers phone call" : ""}

Project Details:
- Type: ${data.projectType}
- Timeline: ${data.timeline}
- Budget: ${data.budget}

${data.projectDescription ? `Description:\n${data.projectDescription}\n` : ""}
${data.requirements ? `Requirements:\n${data.requirements}\n` : ""}

Received: ${new Date().toLocaleString()}
  `;
}
