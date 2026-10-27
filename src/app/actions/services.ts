"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { RequestStatus, ServiceRequestWithDetails, ReviewWithDetails, Notification } from "@/types";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

interface RawDbRequestRow {
  id: string;
  customer_id: string;
  professional_id: string;
  category_id?: string | null;
  title: string;
  description: string;
  location: string;
  preferred_date?: string | null;
  budget?: number | string | null;
  status: RequestStatus;
  status_note?: string | null;
  created_at: string;
  updated_at: string;
  customer?: ServiceRequestWithDetails["customer"];
  professional?: ServiceRequestWithDetails["professional"];
  category?: ServiceRequestWithDetails["category"];
  review?: ServiceRequestWithDetails["review"] | ServiceRequestWithDetails["review"][];
}

/**
 * Helper to resolve a valid professional user UUID from either a user_id,
 * professional_profile.id, or mock ID.
 */
async function resolveProfessionalUserId(rawId: string): Promise<string | null> {
  const adminClient = createAdminClient();

  if (UUID_REGEX.test(rawId)) {
    // 1. Check if it's already a profile id
    const { data: prof } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", rawId)
      .maybeSingle();

    if (prof) return prof.id;

    // 2. Check if it's a professional_profile id
    const { data: proRecord } = await adminClient
      .from("professional_profiles")
      .select("user_id")
      .eq("id", rawId)
      .maybeSingle();

    if (proRecord) return proRecord.user_id;
  }

  // 3. Fallback: Find the first registered professional in the database
  const { data: anyPro } = await adminClient
    .from("profiles")
    .select("id")
    .eq("role", "professional")
    .limit(1)
    .maybeSingle();

  return anyPro?.id || null;
}

/**
 * Create a new service request in Supabase
 */
export async function createServiceRequestAction(input: {
  professional_id: string;
  title: string;
  description: string;
  location: string;
  preferred_date?: string | null;
  budget?: number | null;
  category_id?: string | null;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: "You must be signed in to submit a service request. Please sign in or create an account.",
      };
    }

    const title = input.title.trim();
    const description = input.description.trim();
    const location = input.location.trim();
    const budget = input.budget ? Number(input.budget) : null;
    const preferredDate = input.preferred_date || null;

    if (!title || !description || !location) {
      return {
        success: false,
        error: "Job title, description, and project location are required.",
      };
    }

    const resolvedProUserId = await resolveProfessionalUserId(input.professional_id);
    if (!resolvedProUserId) {
      return {
        success: false,
        error: "Unable to find the assigned professional. Please try again.",
      };
    }

    const adminClient = createAdminClient();

    // Verify category_id if provided
    let validCategoryId: string | null = null;
    if (input.category_id && UUID_REGEX.test(input.category_id)) {
      const { data: cat } = await adminClient
        .from("service_categories")
        .select("id")
        .eq("id", input.category_id)
        .maybeSingle();
      if (cat) validCategoryId = cat.id;
    }

    const { data: newRequest, error: insertError } = await adminClient
      .from("service_requests")
      .insert({
        customer_id: user.id,
        professional_id: resolvedProUserId,
        category_id: validCategoryId,
        title,
        description,
        location,
        preferred_date: preferredDate,
        budget,
        status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !newRequest) {
      return {
        success: false,
        error: insertError?.message || "Failed to create service request.",
      };
    }

    // Create notification for the professional
    try {
      await adminClient.from("notifications").insert({
        user_id: resolvedProUserId,
        title: "New Service Request",
        message: `You received a new inquiry: "${title}" in ${location}.`,
        type: "request",
        link: "/dashboard/professional/requests",
        is_read: false,
      });
    } catch {
      // Non-fatal
    }

    return {
      success: true,
      data: { id: newRequest.id },
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected server error occurred.",
    };
  }
}

/**
 * Update request status (accept, decline, in_progress, completed, cancelled)
 */
export async function updateServiceRequestStatusAction(input: {
  requestId: string;
  status: RequestStatus;
  statusNote?: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const adminClient = createAdminClient();
    const { data: existing, error: fetchErr } = await adminClient
      .from("service_requests")
      .select("id, customer_id, professional_id, title")
      .eq("id", input.requestId)
      .maybeSingle();

    if (fetchErr || !existing) {
      return { success: false, error: "Service request not found." };
    }

    // Verify user is authorized
    const isCustomer = existing.customer_id === user.id;
    const isPro = existing.professional_id === user.id;

    if (!isCustomer && !isPro) {
      return { success: false, error: "You are not authorized to update this request." };
    }

    const { error: updateErr } = await adminClient
      .from("service_requests")
      .update({
        status: input.status,
        status_note: input.statusNote?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.requestId);

    if (updateErr) {
      return { success: false, error: updateErr.message };
    }

    // Notify the other party
    const targetUserId = isCustomer ? existing.professional_id : existing.customer_id;
    const targetLink = isCustomer
      ? "/dashboard/professional/requests"
      : "/dashboard/requests";

    try {
      await adminClient.from("notifications").insert({
        user_id: targetUserId,
        title: `Request Status: ${input.status.replace("_", " ").toUpperCase()}`,
        message: `Status of "${existing.title}" was updated to ${input.status.replace("_", " ")}.`,
        type: "status",
        link: targetLink,
        is_read: false,
      });
    } catch {
      // Non-fatal
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update status.",
    };
  }
}

/**
 * Submit a customer review for a completed service request
 */
export async function submitReviewAction(input: {
  requestId: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const rating = Math.max(1, Math.min(5, Math.round(input.rating)));
    const comment = input.comment.trim();

    if (!comment) {
      return { success: false, error: "Please enter your review feedback." };
    }

    const adminClient = createAdminClient();
    const { data: request, error: reqErr } = await adminClient
      .from("service_requests")
      .select("id, customer_id, professional_id, status")
      .eq("id", input.requestId)
      .maybeSingle();

    if (reqErr || !request) {
      return { success: false, error: "Service request not found." };
    }

    if (request.customer_id !== user.id) {
      return { success: false, error: "You can only review your own service requests." };
    }

    const { error: insertErr } = await adminClient.from("reviews").insert({
      request_id: request.id,
      customer_id: user.id,
      professional_id: request.professional_id,
      rating,
      comment,
      is_visible: true,
    });

    if (insertErr) {
      return { success: false, error: insertErr.message };
    }

    // Notify professional
    try {
      await adminClient.from("notifications").insert({
        user_id: request.professional_id,
        title: "New Customer Review",
        message: `A client left a ${rating}-star review for your completed job.`,
        type: "review",
        link: "/dashboard/professional/reviews",
        is_read: false,
      });
    } catch {
      // Non-fatal
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit review.",
    };
  }
}

/**
 * Fetch service requests belonging to currently authenticated customer
 */
export async function getCustomerDetailedRequestsAction(): Promise<{
  authenticated: boolean;
  requests: ServiceRequestWithDetails[];
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authenticated: false, requests: [] };
    }

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("service_requests")
      .select(`
        *,
        customer:profiles!customer_id(*),
        professional:profiles!professional_id(*),
        category:service_categories(*),
        review:reviews(*)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !rows) {
      return { authenticated: true, requests: [] };
    }

    const mapped: ServiceRequestWithDetails[] = (rows as unknown as RawDbRequestRow[]).map((r: RawDbRequestRow) => ({
      id: r.id,
      customer_id: r.customer_id,
      professional_id: r.professional_id,
      category_id: r.category_id ?? null,
      title: r.title,
      description: r.description,
      location: r.location,
      preferred_date: r.preferred_date ?? null,
      budget: r.budget ? Number(r.budget) : null,
      status: r.status,
      status_note: r.status_note ?? null,
      created_at: r.created_at,
      updated_at: r.updated_at,
      customer: r.customer || {
        id: user.id,
        email: user.email || "",
        full_name: "Customer",
        avatar_url: null,
        phone: null,
        role: "customer",
        is_active: true,
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      professional: r.professional || {
        id: r.professional_id,
        email: "pro@localwork.app",
        full_name: "Local Service Pro",
        avatar_url: null,
        phone: null,
        role: "professional",
        is_active: true,
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      professional_profile: {
        id: r.professional_id,
        user_id: r.professional_id,
        headline: "Verified Professional",
        bio: null,
        years_experience: 3,
        hourly_rate: 75,
        city: r.location || "Local",
        service_area: "Service Area",
        is_available: true,
        verification_status: "approved",
        verified_at: null,
        verified_by: null,
        rejection_reason: null,
        skills: [],
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      category: r.category || null,
      review: Array.isArray(r.review) ? r.review[0] || null : r.review || null,
    }));

    return { authenticated: true, requests: mapped };
  } catch {
    return { authenticated: false, requests: [] };
  }
}

/**
 * Fetch service requests incoming to currently authenticated professional
 */
export async function getProfessionalIncomingRequestsAction(): Promise<{
  authenticated: boolean;
  requests: ServiceRequestWithDetails[];
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authenticated: false, requests: [] };
    }

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("service_requests")
      .select(`
        *,
        customer:profiles!customer_id(*),
        professional:profiles!professional_id(*),
        category:service_categories(*)
      `)
      .eq("professional_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !rows) {
      return { authenticated: true, requests: [] };
    }

    const mapped: ServiceRequestWithDetails[] = (rows as unknown as RawDbRequestRow[]).map((r: RawDbRequestRow) => ({
      id: r.id,
      customer_id: r.customer_id,
      professional_id: r.professional_id,
      category_id: r.category_id ?? null,
      title: r.title,
      description: r.description,
      location: r.location,
      preferred_date: r.preferred_date ?? null,
      budget: r.budget ? Number(r.budget) : null,
      status: r.status,
      status_note: r.status_note ?? null,
      created_at: r.created_at,
      updated_at: r.updated_at,
      customer: r.customer || {
        id: r.customer_id,
        email: "customer@example.com",
        full_name: "Customer",
        avatar_url: null,
        phone: null,
        role: "customer",
        is_active: true,
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      professional: r.professional || {
        id: user.id,
        email: user.email || "",
        full_name: "Professional",
        avatar_url: null,
        phone: null,
        role: "professional",
        is_active: true,
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      professional_profile: {
        id: user.id,
        user_id: user.id,
        headline: "Verified Professional",
        bio: null,
        years_experience: 3,
        hourly_rate: 75,
        city: r.location || "Local",
        service_area: "Service Area",
        is_available: true,
        verification_status: "approved",
        verified_at: null,
        verified_by: null,
        rejection_reason: null,
        skills: [],
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      category: r.category || null,
      review: null,
    }));

    return { authenticated: true, requests: mapped };
  } catch {
    return { authenticated: false, requests: [] };
  }
}

/**
 * Fetch reviews for current customer
 */
export async function getCustomerReviewsAction(): Promise<{
  authenticated: boolean;
  reviews: ReviewWithDetails[];
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authenticated: false, reviews: [] };
    }

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("reviews")
      .select(`
        *,
        customer:profiles!customer_id(*),
        professional:profiles!professional_id(*)
      `)
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !rows) {
      return { authenticated: true, reviews: [] };
    }

    return { authenticated: true, reviews: rows as ReviewWithDetails[] };
  } catch {
    return { authenticated: false, reviews: [] };
  }
}

/**
 * Fetch reviews for a professional
 */
export async function getProfessionalReviewsAction(proUserId?: string): Promise<{
  reviews: ReviewWithDetails[];
  averageRating: number;
  reviewCount: number;
}> {
  try {
    const adminClient = createAdminClient();
    let targetId = proUserId;

    if (!targetId) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      targetId = user?.id;
    }

    if (!targetId) {
      return { reviews: [], averageRating: 0, reviewCount: 0 };
    }

    const { data: rows, error } = await adminClient
      .from("reviews")
      .select(`
        *,
        customer:profiles!customer_id(*),
        professional:profiles!professional_id(*)
      `)
      .eq("professional_id", targetId)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error || !rows || rows.length === 0) {
      return { reviews: [], averageRating: 0, reviewCount: 0 };
    }

    const sum = rows.reduce((acc, r) => acc + (r.rating || 0), 0);
    const avg = Number((sum / rows.length).toFixed(1));

    return {
      reviews: rows as ReviewWithDetails[],
      averageRating: avg,
      reviewCount: rows.length,
    };
  } catch {
    return { reviews: [], averageRating: 0, reviewCount: 0 };
  }
}

/**
 * Favorites: Toggle favorite professional
 */
export async function toggleFavoriteAction(proId: string): Promise<ActionResult<{ isFavorite: boolean }>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please sign in to save professionals to your favorites." };
    }

    const resolvedProUserId = await resolveProfessionalUserId(proId);
    if (!resolvedProUserId) {
      return { success: false, error: "Professional not found." };
    }

    const adminClient = createAdminClient();
    const { data: existing } = await adminClient
      .from("favorites")
      .select("id")
      .eq("customer_id", user.id)
      .eq("professional_id", resolvedProUserId)
      .maybeSingle();

    if (existing) {
      await adminClient.from("favorites").delete().eq("id", existing.id);
      return { success: true, data: { isFavorite: false } };
    } else {
      await adminClient.from("favorites").insert({
        customer_id: user.id,
        professional_id: resolvedProUserId,
      });
      return { success: true, data: { isFavorite: true } };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle favorite.",
    };
  }
}

/**
 * Fetch current user's favorite professional IDs
 */
export async function getUserFavoriteIdsAction(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const adminClient = createAdminClient();
    const { data: rows } = await adminClient
      .from("favorites")
      .select("professional_id")
      .eq("customer_id", user.id);

    return rows?.map((r) => r.professional_id) || [];
  } catch {
    return [];
  }
}

/**
 * Fetch notifications for authenticated user
 */
export async function getUserNotificationsAction(): Promise<{
  notifications: Notification[];
  unreadCount: number;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { notifications: [], unreadCount: 0 };

    const adminClient = createAdminClient();
    const { data: rows } = await adminClient
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const notifications = (rows as Notification[]) || [];
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return { notifications, unreadCount };
  } catch {
    return { notifications: [], unreadCount: 0 };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationReadAction(notificationId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Authentication required." };

    const adminClient = createAdminClient();
    await adminClient
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update notification." };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Authentication required." };

    const adminClient = createAdminClient();
    await adminClient
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to mark all as read." };
  }
}

/**
 * Update authenticated user's password via Supabase Auth
 */
export async function updateUserPasswordAction(password: string): Promise<ActionResult> {
  try {
    if (!password || password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update password.",
    };
  }
}

/**
 * Fetch professional profile data for authenticated pro
 */
export async function getProfessionalProfileDataAction(): Promise<{
  authenticated: boolean;
  profile: {
    id: string;
    headline: string;
    bio: string | null;
    years_experience: number;
    hourly_rate: number | null;
    city: string;
    service_area: string;
    skills: string[];
    is_available: boolean;
    verification_status: string;
  } | null;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { authenticated: false, profile: null };
    }

    const adminClient = createAdminClient();
    const { data: pro } = await adminClient
      .from("professional_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!pro) {
      return { authenticated: true, profile: null };
    }

    return {
      authenticated: true,
      profile: {
        id: pro.id,
        headline: pro.headline,
        bio: pro.bio,
        years_experience: pro.years_experience,
        hourly_rate: pro.hourly_rate ? Number(pro.hourly_rate) : null,
        city: pro.city,
        service_area: pro.service_area,
        skills: pro.skills || [],
        is_available: pro.is_available,
        verification_status: pro.verification_status,
      },
    };
  } catch {
    return { authenticated: false, profile: null };
  }
}

/**
 * Update professional profile data
 */
export async function updateProfessionalProfileDataAction(input: {
  headline: string;
  bio?: string | null;
  years_experience?: number;
  hourly_rate?: number | null;
  city: string;
  service_area: string;
  skills?: string[];
  is_available?: boolean;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const adminClient = createAdminClient();

    // Check if professional_profiles record exists
    const { data: existing } = await adminClient
      .from("professional_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      const { error: updateErr } = await adminClient
        .from("professional_profiles")
        .update({
          headline: input.headline.trim(),
          bio: input.bio?.trim() || null,
          years_experience: input.years_experience !== undefined ? Number(input.years_experience) : 1,
          hourly_rate: input.hourly_rate ? Number(input.hourly_rate) : null,
          city: input.city.trim(),
          service_area: input.service_area.trim(),
          skills: input.skills || [],
          is_available: input.is_available !== undefined ? input.is_available : true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateErr) return { success: false, error: updateErr.message };
    } else {
      const { error: insertErr } = await adminClient
        .from("professional_profiles")
        .insert({
          user_id: user.id,
          headline: input.headline.trim(),
          bio: input.bio?.trim() || null,
          years_experience: input.years_experience !== undefined ? Number(input.years_experience) : 1,
          hourly_rate: input.hourly_rate ? Number(input.hourly_rate) : null,
          city: input.city.trim(),
          service_area: input.service_area.trim(),
          skills: input.skills || [],
          is_available: input.is_available !== undefined ? input.is_available : true,
          verification_status: "pending",
        });

      if (insertErr) return { success: false, error: insertErr.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update professional profile.",
    };
  }
}

/**
 * Submit community safety report
 */
export async function submitReportAction(input: {
  target_type: "profile" | "review";
  target_id: string;
  reason: string;
  description?: string;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const reporterId = user?.id || null;
    if (!reporterId) {
      return { success: false, error: "Please sign in to submit a safety report." };
    }

    const adminClient = createAdminClient();

    // Resolve target UUID if possible
    let targetUuid = input.target_id;
    if (!UUID_REGEX.test(targetUuid)) {
      targetUuid = reporterId; // fallback
    }

    const { error } = await adminClient.from("reports").insert({
      reporter_id: reporterId,
      target_type: input.target_type,
      target_id: targetUuid,
      reason: input.reason,
      description: input.description?.trim() || null,
      status: "pending",
    });

    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit report.",
    };
  }
}
