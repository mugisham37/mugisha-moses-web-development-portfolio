import { ContactSubmission } from "@prisma/client";

import { ContactFormData, ContactSubmissionResult } from "./types";

// Spam detection utilities
export function isSpamContent(content: string): boolean {
  const spamKeywords = [
    "viagra",
    "cialis",
    "casino",
    "lottery",
    "winner",
    "congratulations",
    "click here",
    "free money",
    "make money fast",
    "work from home",
    "guaranteed",
    "no risk",
    "limited time",
    "act now",
    "urgent",
    "bitcoin",
    "cryptocurrency",
    "investment opportunity",
  ];

  const lowerContent = content.toLowerCase();
  return spamKeywords.some((keyword) => lowerContent.includes(keyword));
}

export function hasExcessiveLinks(content: string): boolean {
  const linkRegex = /(https?:\/\/[^\s]+)/gi;
  const links = content.match(linkRegex) || [];
  return links.length > 3;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function containsSuspiciousPatterns(content: string): boolean {
  // Check for excessive repetition
  const words = content.toLowerCase().split(/\s+/);
  const wordCount = words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // If any word appears more than 10 times, it's suspicious
  return Object.values(wordCount).some((count) => count > 10);
}

// Rate limiting utilities
const submissionCounts = new Map<
  string,
  { count: number; resetTime: number }
>();

export function isRateLimited(
  identifier: string,
  maxAttempts = 3,
  windowMs = 60000
): boolean {
  const now = Date.now();
  const record = submissionCounts.get(identifier);

  if (!record || now > record.resetTime) {
    submissionCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count++;
  return false;
}

// Contact submission processing
export function processContactSubmission(data: ContactFormData): ContactSubmissionResult {
  const errors: string[] = [];
  let isSpam = false;

  // Check for spam content
  if (isSpamContent(data.message)) {
    isSpam = true;
    errors.push("Message contains suspicious content");
  }

  if (hasExcessiveLinks(data.message)) {
    isSpam = true;
    errors.push("Message contains too many links");
  }

  if (containsSuspiciousPatterns(data.message)) {
    isSpam = true;
    errors.push("Message contains suspicious patterns");
  }

  // Validate email format
  if (!isValidEmail(data.email)) {
    errors.push("Invalid email format");
  }

  return {
    isValid: errors.length === 0,
    isSpam,
    errors,
  };
}

// Email template data preparation
export function prepareEmailTemplateData(
  submission: ContactSubmission & { type: string }
) {
  const baseData = {
    name: submission.name,
    email: submission.email,
    subject: submission.subject || "New Contact Form Submission",
    message: submission.message,
    submissionDate: new Date(submission.createdAt).toLocaleDateString(),
    submissionTime: new Date(submission.createdAt).toLocaleTimeString(),
  };

  switch (submission.type) {
    case "PROJECT_INQUIRY":
      return {
        ...baseData,
        projectType: submission.projectType ?? undefined,
        budget: submission.budget ?? undefined,
        timeline: submission.timeline ?? undefined,
        isProjectInquiry: true,
      };

    case "CONSULTATION":
      return {
        ...baseData,
        isConsultation: true,
      };

    default:
      return {
        ...baseData,
        isGeneral: true,
      };
  }
}

// Auto-response message generation
export function generateAutoResponseMessage(
  type: string,
  name: string
): string {
  const firstName = name.split(" ")[0];

  switch (type) {
    case "PROJECT_INQUIRY":
      return `Hi ${firstName},

Thank you for your project inquiry! I've received your message and I'm excited to learn more about your project.

I'll review your requirements and get back to you within 24 hours with:
• Initial thoughts on your project
• Potential approach and timeline
• Next steps for moving forward

In the meantime, feel free to check out my recent work at [portfolio link] to see examples of similar projects.

Best regards,
[Your Name]`;

    case "CONSULTATION":
      return `Hi ${firstName},

Thank you for booking a consultation! I've received your request and will confirm your preferred time slot within 24 hours.

What happens next:
• I'll review your consultation details
• Confirm your preferred date and time
• Send you a calendar invite with meeting details
• Prepare relevant materials for our discussion

If you have any urgent questions before our meeting, feel free to reply to this email.

Looking forward to our conversation!

Best regards,
[Your Name]`;

    case "COLLABORATION":
      return `Hi ${firstName},

Thank you for reaching out about potential collaboration! I'm always interested in connecting with fellow professionals and exploring new opportunities.

I'll review your message and respond within 24-48 hours to discuss:
• How we might work together
• Potential synergies
• Next steps

Best regards,
[Your Name]`;

    default:
      return `Hi ${firstName},

Thank you for getting in touch! I've received your message and appreciate you taking the time to reach out.

I'll review your message and get back to you within 24 hours. If your inquiry is urgent, please don't hesitate to follow up.

Best regards,
[Your Name]`;
  }
}

// Contact method formatting
export function formatContactMethod(type: string, value: string): string {
  switch (type) {
    case "email":
      return `mailto:${value}`;
    case "phone":
      return `tel:${value.replace(/\D/g, "")}`;
    case "linkedin":
      return value.startsWith("http") ? value : `https://${value}`;
    case "twitter":
      return value.startsWith("@")
        ? `https://twitter.com/${value.slice(1)}`
        : `https://twitter.com/${value}`;
    case "github":
      return value.startsWith("http") ? value : `https://${value}`;
    default:
      return value;
  }
}
