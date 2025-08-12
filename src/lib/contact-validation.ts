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

// Union type for all contact schemas
export type ContactFormData =
  | z.infer<typeof generalContactSchema>
  | z.infer<typeof projectInquirySchema>;
export type ConsultationData = z.infer<typeof consultationBookingSchema>;
