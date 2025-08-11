import { z } from "zod";

// Contact form validation schemas
export const generalContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters")
    .optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  type: z
    .enum([
      "GENERAL",
      "PROJECT_INQUIRY",
      "CONSULTATION",
      "COLLABORATION",
      "SUPPORT",
    ])
    .default("GENERAL"),
});

export const projectInquirySchema = generalContactSchema.extend({
  projectType: z
    .string()
    .min(5, "Please describe the type of project")
    .max(200, "Project type must be less than 200 characters"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),
  requirements: z
    .string()
    .min(20, "Please provide detailed requirements (minimum 20 characters)")
    .max(3000, "Requirements must be less than 3000 characters"),
  type: z.literal("PROJECT_INQUIRY"),
});

export const consultationBookingSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  timezone: z.string().min(1, "Please select your timezone"),
  message: z
    .string()
    .min(10, "Please provide details about your consultation needs")
    .max(1000, "Message must be less than 1000 characters"),
});

// Type exports
export type GeneralContactFormData = z.infer<typeof generalContactSchema>;
export type ProjectInquiryFormData = z.infer<typeof projectInquirySchema>;
export type ConsultationBookingFormData = z.infer<
  typeof consultationBookingSchema
>;

// Budget options
export const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 - $15,000" },
  { value: "15k-30k", label: "$15,000 - $30,000" },
  { value: "30k-50k", label: "$30,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-plus", label: "$100,000+" },
  { value: "discuss", label: "Let's discuss" },
];

// Timeline options
export const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "Within 1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-months-plus", label: "6+ months" },
  { value: "flexible", label: "Flexible" },
];

// Service type options
export const serviceTypeOptions = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-app", label: "Mobile App Development" },
  { value: "full-stack", label: "Full-Stack Development" },
  { value: "consulting", label: "Technical Consulting" },
  { value: "code-review", label: "Code Review & Audit" },
  { value: "performance", label: "Performance Optimization" },
  { value: "maintenance", label: "Maintenance & Support" },
  { value: "other", label: "Other" },
];

// Project type options
export const projectTypeOptions = [
  { value: "website", label: "Website Development" },
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "e-commerce", label: "E-commerce Platform" },
  { value: "api", label: "API Development" },
  { value: "database", label: "Database Design" },
  { value: "integration", label: "Third-party Integration" },
  { value: "migration", label: "Platform Migration" },
  { value: "other", label: "Other" },
];

// Contact method options
export const contactMethods = [
  {
    type: "email",
    label: "Email",
    value: "hello@example.com",
    icon: "Mail",
    primary: true,
  },
  {
    type: "phone",
    label: "Phone",
    value: "+1 (555) 123-4567",
    icon: "Phone",
    primary: false,
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/developer",
    icon: "Linkedin",
    primary: false,
  },
  {
    type: "twitter",
    label: "Twitter",
    value: "@developer",
    icon: "Twitter",
    primary: false,
  },
  {
    type: "github",
    label: "GitHub",
    value: "github.com/developer",
    icon: "Github",
    primary: false,
  },
];
