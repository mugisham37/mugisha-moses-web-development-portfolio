import { ContactFormData } from "./contact-validation";

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(
  key: string,
  maxAttempts: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxAttempts) {
    return true;
  }

  record.count++;
  return false;
}

export interface ProcessingResult {
  isValid: boolean;
  isSpam: boolean;
  errors: string[];
}

export function processContactSubmission(
  data: ContactFormData
): ProcessingResult {
  const errors: string[] = [];
  let isSpam = false;

  // Basic spam detection
  const spamKeywords = [
    "viagra",
    "casino",
    "lottery",
    "winner",
    "congratulations",
    "click here",
    "free money",
  ];
  const messageText =
    `${data.name} ${data.email} ${data.message}`.toLowerCase();

  if (spamKeywords.some((keyword) => messageText.includes(keyword))) {
    isSpam = true;
    errors.push("Potential spam detected");
  }

  // Check for suspicious patterns
  if (data.message.includes("http://") || data.message.includes("https://")) {
    // Allow some URLs but flag excessive ones
    const urlCount = (data.message.match(/https?:\/\//g) || []).length;
    if (urlCount > 2) {
      isSpam = true;
      errors.push("Too many URLs in message");
    }
  }

  // Check for repeated characters
  if (/(.)\1{10,}/.test(data.message)) {
    isSpam = true;
    errors.push("Suspicious character patterns");
  }

  return {
    isValid: errors.length === 0 || !isSpam,
    isSpam,
    errors,
  };
}
