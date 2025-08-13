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

// Contact method formatting utilities
export interface ContactMethod {
  type: string;
  label: string;
  value: string;
  icon: string;
  primary: boolean;
  description: string;
  link: string;
}

export function formatContactMethod(method: ContactMethod): ContactMethod {
  // Format phone numbers
  if (method.type === "phone") {
    const formatted = method.value.replace(/\D/g, "");
    return {
      ...method,
      value: `+${formatted.slice(0, 3)} ${formatted.slice(3, 6)} ${formatted.slice(6, 9)} ${formatted.slice(9)}`,
    };
  }

  // Format email addresses
  if (method.type === "email") {
    return {
      ...method,
      value: method.value.toLowerCase(),
    };
  }

  // Format social media handles
  if (method.type === "twitter" && !method.value.startsWith("@")) {
    return {
      ...method,
      value: `@${method.value}`,
    };
  }

  // Format URLs
  if (["linkedin", "github", "website"].includes(method.type)) {
    let formattedValue = method.value;
    if (!formattedValue.startsWith("http://") && !formattedValue.startsWith("https://")) {
      formattedValue = `https://${formattedValue}`;
    }
    return {
      ...method,
      link: formattedValue,
      value: formattedValue.replace(/^https?:\/\//, ""),
    };
  }

  return method;
}

export function validateContactMethod(method: ContactMethod): boolean {
  switch (method.type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(method.value);
    
    case "phone":
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      return phoneRegex.test(method.value);
    
    case "linkedin":
      return method.value.includes("linkedin.com") || method.value.includes("/in/");
    
    case "github":
      return method.value.includes("github.com");
    
    case "twitter":
      return method.value.startsWith("@") || method.value.includes("twitter.com");
    
    default:
      return method.value.length > 0;
  }
}

export function getContactMethodIcon(type: string): string {
  const iconMap: Record<string, string> = {
    email: "Mail",
    phone: "Phone",
    linkedin: "Linkedin",
    github: "Github",
    twitter: "Twitter",
    website: "ExternalLink",
  };
  
  return iconMap[type] || "ExternalLink";
}
