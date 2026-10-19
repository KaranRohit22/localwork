// ============================================================
// LocalWork — Core Type Definitions
// ============================================================

export type UserRole = "customer" | "professional" | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected";

export type RequestStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";

export type ReportTargetType = "profile" | "review";

// ============================================================
// Database Row Types
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  headline: string;
  bio: string | null;
  years_experience: number;
  hourly_rate: number | null;
  city: string;
  service_area: string;
  is_available: boolean;
  verification_status: VerificationStatus;
  verified_at: string | null;
  verified_by: string | null;
  rejection_reason: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProfessionalCategory {
  professional_id: string;
  category_id: string;
}

export interface PortfolioImage {
  id: string;
  professional_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  professional_id: string;
  category_id: string | null;
  title: string;
  description: string;
  location: string;
  preferred_date: string | null;
  budget: number | null;
  status: RequestStatus;
  status_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  request_id: string;
  customer_id: string;
  professional_id: string;
  rating: number;
  comment: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  customer_id: string;
  professional_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  description: string | null;
  status: ReportStatus;
  resolved_by: string | null;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ============================================================
// Joined / Composite Types (for queries with relations)
// ============================================================

export interface ProfessionalWithProfile extends ProfessionalProfile {
  profile: Profile;
  categories: ServiceCategory[];
  portfolio_images: PortfolioImage[];
  average_rating: number | null;
  review_count: number;
}

export interface ServiceRequestWithDetails extends ServiceRequest {
  customer: Profile;
  professional: Profile;
  professional_profile: ProfessionalProfile;
  category: ServiceCategory | null;
  review: Review | null;
}

export interface ReviewWithDetails extends Review {
  customer: Profile;
  professional: Profile;
}

export interface NotificationWithDetails extends Notification {}

// ============================================================
// Form / Input Types
// ============================================================

export interface SearchFilters {
  query?: string;
  category?: string;
  city?: string;
  minRating?: number;
  minExperience?: number;
  isAvailable?: boolean;
  sortBy?: "rating" | "experience" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================
// Platform Stats
// ============================================================

export interface PlatformStats {
  totalProfessionals: number;
  totalCustomers: number;
  totalCompletedRequests: number;
  totalCategories: number;
}
