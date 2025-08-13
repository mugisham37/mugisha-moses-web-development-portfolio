import { z } from "zod";

// Base contact schema
export const baseContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message is too long"),
});

// General contact schema
export const generalContactSchema = baseContactSchema.extend({
  type: z.enum(["GENERAL", "SUPPORT", "COLLABORATION"]).default("GENERAL"),
});

// Project inquiry schema
export const projectInquirySchema = baseContactSchema.extend({
  type: z.literal("PROJECT_INQUIRY"),
  projectType: z.string().min(1, "Project type is required"),
  budget: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  requirements: z.string().optional(),
});

// Consultation booking schema
export const consultationBookingSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Service type is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  timezone: z.string().min(1, "Timezone is required"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

// Type definitions
export type GeneralContactFormData = z.infer<typeof generalContactSchema>;
export type ProjectInquiryFormData = z.infer<typeof projectInquirySchema>;
export type ConsultationBookingFormData = z.infer<typeof consultationBookingSchema>;

// Union type for all contact schemas
export type ContactFormData =
  | GeneralContactFormData
  | ProjectInquiryFormData;
export type ConsultationData = ConsultationBookingFormData;

// Project type options
export const projectTypeOptions = [
  { value: "web-application", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "e-commerce", label: "E-commerce Platform" },
  { value: "landing-page", label: "Landing Page" },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "blog", label: "Blog Platform" },
  { value: "cms", label: "Content Management System" },
  { value: "api", label: "API Development" },
  { value: "database", label: "Database Design" },
  { value: "consulting", label: "Technical Consulting" },
  { value: "other", label: "Other" },
];

// Budget options
export const budgetOptions = [
  { value: "1000-5000", label: "$1,000 - $5,000" },
  { value: "5000-10000", label: "$5,000 - $10,000" },
  { value: "10000-25000", label: "$10,000 - $25,000" },
  { value: "25000-50000", label: "$25,000 - $50,000" },
  { value: "50000+", label: "$50,000+" },
  { value: "discuss", label: "Let's Discuss" },
];

// Timeline options
export const timelineOptions = [
  { value: "1-2-weeks", label: "1-2 Weeks" },
  { value: "1-month", label: "1 Month" },
  { value: "2-3-months", label: "2-3 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6+months", label: "6+ Months" },
  { value: "flexible", label: "Flexible" },
];

// Service type options for consultation
export const serviceTypeOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "fullstack-development", label: "Full-Stack Development" },
  { value: "api-development", label: "API Development" },
  { value: "database-design", label: "Database Design" },
  { value: "performance-optimization", label: "Performance Optimization" },
  { value: "code-review", label: "Code Review" },
  { value: "architecture-consulting", label: "Architecture Consulting" },
  { value: "technical-audit", label: "Technical Audit" },
  { value: "mentoring", label: "Technical Mentoring" },
];

// Contact methods
export const contactMethods = [
  {
    type: "email",
    label: "Email",
    value: "mugisha.moses.dev@gmail.com",
    icon: "Mail",
    primary: true,
    description: "Best for detailed inquiries and project discussions",
    link: "mailto:mugisha.moses.dev@gmail.com",
  },
  {
    type: "phone",
    label: "Phone",
    value: "+250 788 123 456",
    icon: "Phone",
    primary: false,
    description: "Available for urgent matters and consultations",
    link: "tel:+250788123456",
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/mugisha-moses",
    icon: "Linkedin",
    primary: false,
    description: "Professional networking and career discussions",
    link: "https://linkedin.com/in/mugisha-moses",
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/mugisham37",
    icon: "Github",
    primary: false,
    description: "View my code and contribute to open source projects",
    link: "https://github.com/mugisham37",
  },
  {
    type: "twitter",
    label: "Twitter",
    value: "@mugisha_moses",
    icon: "Twitter",
    primary: false,
    description: "Tech discussions and industry updates",
    link: "https://twitter.com/mugisha_moses",
  },
];
