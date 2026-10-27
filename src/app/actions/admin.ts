"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Profile, ProfessionalWithProfile, ServiceCategory, Report, ReviewWithDetails, PlatformStats } from "@/types";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * Verify caller is an authorized administrator
 */
async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("localwork_admin_authorized")?.value;
  if (adminCookie === "true") return true;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    return profile?.role === "admin";
  } catch {
    return false;
  }
}

/**
 * Platform Overview Statistics (KPIs)
 */
export async function getAdminPlatformStatsAction(): Promise<{
  stats: PlatformStats;
  pendingVerificationsCount: number;
}> {
  const defaultStats: PlatformStats = {
    totalProfessionals: 0,
    totalCustomers: 0,
    totalCompletedRequests: 0,
    totalCategories: 12,
  };

  try {
    const adminClient = createAdminClient();

    const [
      { count: totalPros },
      { count: totalCusts },
      { count: completedReqs },
      { count: totalCats },
      { count: pendingPros },
    ] = await Promise.all([
      adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "professional"),
      adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
      adminClient.from("service_requests").select("*", { count: "exact", head: true }).eq("status", "completed"),
      adminClient.from("service_categories").select("*", { count: "exact", head: true }),
      adminClient.from("professional_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
    ]);

    return {
      stats: {
        totalProfessionals: totalPros ?? 0,
        totalCustomers: totalCusts ?? 0,
        totalCompletedRequests: completedReqs ?? 0,
        totalCategories: totalCats ?? 12,
      },
      pendingVerificationsCount: pendingPros ?? 0,
    };
  } catch {
    return { stats: defaultStats, pendingVerificationsCount: 0 };
  }
}

/**
 * User Directory (Admin)
 */
export async function getAdminUsersAction(): Promise<Profile[]> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return [];

    const adminClient = createAdminClient();
    const { data: users, error } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !users) return [];
    return users as Profile[];
  } catch {
    return [];
  }
}

/**
 * Toggle user active/suspended status
 */
export async function toggleAdminUserStatusAction(userId: string): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { data: user } = await adminClient
      .from("profiles")
      .select("is_active")
      .eq("id", userId)
      .maybeSingle();

    if (!user) return { success: false, error: "User not found" };

    const { error } = await adminClient
      .from("profiles")
      .update({ is_active: !user.is_active })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle status" };
  }
}

/**
 * Verification Queue (Admin)
 */
export async function getAdminVerificationQueueAction(): Promise<ProfessionalWithProfile[]> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return [];

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("professional_profiles")
      .select(`
        *,
        profile:profiles!user_id(*)
      `)
      .order("created_at", { ascending: false });

    if (error || !rows) return [];

    return rows.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      user_id: r.user_id as string,
      headline: r.headline as string,
      bio: (r.bio as string) || null,
      years_experience: Number(r.years_experience) || 0,
      hourly_rate: r.hourly_rate ? Number(r.hourly_rate) : null,
      city: r.city as string,
      service_area: r.service_area,
      is_available: r.is_available,
      verification_status: r.verification_status,
      verified_at: r.verified_at,
      verified_by: r.verified_by,
      rejection_reason: r.rejection_reason,
      skills: r.skills || [],
      created_at: r.created_at,
      updated_at: r.updated_at,
      profile: r.profile || {
        id: r.user_id,
        email: "unknown@localwork.app",
        full_name: "Applicant",
        avatar_url: null,
        phone: null,
        role: "professional",
        is_active: true,
        created_at: r.created_at,
        updated_at: r.created_at,
      },
      categories: [],
      portfolio_images: [],
      average_rating: 5.0,
    })) as unknown as ProfessionalWithProfile[];
  } catch {
    return [];
  }
}

/**
 * Approve or Reject Professional Application
 */
export async function updateAdminProVerificationAction(input: {
  proId: string;
  status: "approved" | "rejected";
  rejectionReason?: string;
}): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const updates: Record<string, unknown> = {
      verification_status: input.status,
      updated_at: new Date().toISOString(),
    };

    if (input.status === "approved") {
      updates.verified_at = new Date().toISOString();
      updates.verified_by = null;
      updates.rejection_reason = null;
    } else {
      updates.rejection_reason = input.rejectionReason?.trim() || "Requirements not met";
    }

    // Try finding by id or user_id
    let { error } = await adminClient
      .from("professional_profiles")
      .update(updates)
      .eq("id", input.proId);

    if (error) {
      const res = await adminClient
        .from("professional_profiles")
        .update(updates)
        .eq("user_id", input.proId);
      error = res.error;
    }

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update verification status" };
  }
}

/**
 * Service Categories (Admin)
 */
export async function getAdminCategoriesAction(): Promise<ServiceCategory[]> {
  try {
    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("service_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !rows) return [];
    return rows as ServiceCategory[];
  } catch {
    return [];
  }
}

export async function addAdminCategoryAction(input: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}): Promise<AdminActionResult<{ category: ServiceCategory }>> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { data: newCat, error } = await adminClient
      .from("service_categories")
      .insert({
        name: input.name.trim(),
        slug: input.slug.trim(),
        description: input.description?.trim() || null,
        icon: input.icon?.trim() || "Wrench",
        is_active: true,
      })
      .select("*")
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: { category: newCat as ServiceCategory } };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create category" };
  }
}

export async function toggleAdminCategoryStatusAction(categoryId: string): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { data: cat } = await adminClient
      .from("service_categories")
      .select("is_active")
      .eq("id", categoryId)
      .maybeSingle();

    if (!cat) return { success: false, error: "Category not found" };

    const { error } = await adminClient
      .from("service_categories")
      .update({ is_active: !cat.is_active })
      .eq("id", categoryId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle category" };
  }
}

/**
 * Moderation Reports (Admin)
 */
export async function getAdminReportsAction(): Promise<Report[]> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return [];

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !rows) return [];
    return rows as Report[];
  } catch {
    return [];
  }
}

export async function resolveAdminReportAction(input: {
  reportId: string;
  status: "resolved" | "dismissed";
  resolutionNote?: string;
}): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("reports")
      .update({
        status: input.status,
        resolution_note: input.resolutionNote?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.reportId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to resolve report" };
  }
}

/**
 * Review Moderation (Admin)
 */
export async function getAdminReviewsAction(): Promise<ReviewWithDetails[]> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return [];

    const adminClient = createAdminClient();
    const { data: rows, error } = await adminClient
      .from("reviews")
      .select(`
        *,
        customer:profiles!customer_id(*),
        professional:profiles!professional_id(*)
      `)
      .order("created_at", { ascending: false });

    if (error || !rows) return [];
    return rows as ReviewWithDetails[];
  } catch {
    return [];
  }
}

export async function toggleAdminReviewVisibilityAction(reviewId: string): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { data: rev } = await adminClient
      .from("reviews")
      .select("is_visible")
      .eq("id", reviewId)
      .maybeSingle();

    if (!rev) return { success: false, error: "Review not found" };

    const { error } = await adminClient
      .from("reviews")
      .update({ is_visible: !rev.is_visible })
      .eq("id", reviewId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to toggle review visibility" };
  }
}

export async function deleteAdminReviewAction(reviewId: string): Promise<AdminActionResult> {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("reviews").delete().eq("id", reviewId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete review" };
  }
}
