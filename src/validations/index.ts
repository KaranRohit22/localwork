import { z } from "zod";

// ============================================================
// Auth Schemas
// ============================================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const customerRegisterSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^[+]?[\d\s()-]{7,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const professionalRegisterSchema = z
  .object({
    full_name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^[+]?[\d\s()-]{7,15}$/, "Please enter a valid phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
    headline: z
      .string()
      .min(5, "Professional title must be at least 5 characters")
      .max(120, "Title is too long"),
    city: z.string().min(2, "City is required"),
    service_area: z.string().min(2, "Service area is required"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

// ============================================================
// Profile Schemas
// ============================================================

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s()-]{7,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const updateProfessionalProfileSchema = z.object({
  headline: z
    .string()
    .min(5, "Headline must be at least 5 characters")
    .max(120, "Headline is too long"),
  bio: z.string().max(2000, "Bio is too long").optional().or(z.literal("")),
  years_experience: z
    .number()
    .int()
    .min(0, "Experience cannot be negative")
    .max(60, "Invalid experience"),
  hourly_rate: z
    .number()
    .min(0, "Rate cannot be negative")
    .max(10000, "Rate seems too high")
    .optional()
    .nullable(),
  city: z.string().min(2, "City is required"),
  service_area: z.string().min(2, "Service area is required"),
  is_available: z.boolean(),
  skills: z
    .array(z.string().max(50))
    .min(1, "Add at least one skill")
    .max(20, "Maximum 20 skills"),
  category_ids: z
    .array(z.string().uuid())
    .min(1, "Select at least one category")
    .max(5, "Maximum 5 categories"),
});

// ============================================================
// Service Request Schemas
// ============================================================

export const createServiceRequestSchema = z.object({
  professional_id: z.string().uuid("Invalid professional"),
  category_id: z.string().uuid("Select a category").optional().nullable(),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title is too long"),
  description: z
    .string()
    .min(20, "Please provide more details (at least 20 characters)")
    .max(2000, "Description is too long"),
  location: z.string().min(2, "Location is required").max(200),
  preferred_date: z.string().optional().nullable(),
  budget: z.number().min(0).max(100000).optional().nullable(),
});

export const updateRequestStatusSchema = z.object({
  request_id: z.string().uuid(),
  status: z.enum([
    "accepted",
    "rejected",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  status_note: z.string().max(500).optional().nullable(),
});

// ============================================================
// Review Schemas
// ============================================================

export const createReviewSchema = z.object({
  request_id: z.string().uuid(),
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .max(1000, "Review is too long")
    .optional()
    .or(z.literal("")),
});

// ============================================================
// Report Schemas
// ============================================================

export const createReportSchema = z.object({
  target_type: z.enum(["profile", "review"]),
  target_id: z.string().uuid(),
  reason: z
    .string()
    .min(3, "Please select a reason")
    .max(100, "Reason is too long"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .optional()
    .or(z.literal("")),
});

// ============================================================
// Admin Schemas
// ============================================================

export const manageCategorySchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  icon: z.string().max(50).optional().or(z.literal("")),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const verificationDecisionSchema = z.object({
  professional_id: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  rejection_reason: z
    .string()
    .max(500)
    .optional()
    .or(z.literal("")),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject is required").max(200),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message is too long"),
});

// ============================================================
// Inferred Types
// ============================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type ProfessionalRegisterInput = z.infer<typeof professionalRegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateProfessionalProfileInput = z.infer<typeof updateProfessionalProfileSchema>;
export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ManageCategoryInput = z.infer<typeof manageCategorySchema>;
export type VerificationDecisionInput = z.infer<typeof verificationDecisionSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
