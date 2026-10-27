"use client";

import { useState, use, useEffect, Suspense } from "react";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  Heart,
  Share2,
  Flag,
  DollarSign,
  Briefcase,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockProfessionals, mockReviews } from "@/lib/data/mock-data";
import {
  createServiceRequestAction,
  toggleFavoriteAction,
  getUserFavoriteIdsAction,
  submitReportAction,
} from "@/app/actions/services";

interface PageProps {
  params: Promise<{ id: string }>;
}

function ProfessionalProfileContent({ params }: PageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const shouldOpenRequest = searchParams.get("request") === "true";

  const professional = mockProfessionals.find((p) => p.id === resolvedParams.id);

  if (!professional) {
    notFound();
  }

  // Modals state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(shouldOpenRequest);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Request form state
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [requestLocation, setRequestLocation] = useState(professional.city);
  const [requestDate, setRequestDate] = useState("");
  const [requestBudget, setRequestBudget] = useState(
    professional.hourly_rate ? `${professional.hourly_rate * 4}` : "300"
  );
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  // Report form state
  const [reportReason, setReportReason] = useState("inaccurate_info");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Check initial favorite status
  useEffect(() => {
    let isMounted = true;
    getUserFavoriteIdsAction().then((favIds) => {
      if (isMounted && favIds.includes(professional.id)) {
        setIsFavorite(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [professional.id]);

  // Relevant reviews for this pro
  const reviews = mockReviews.filter(
    (r) => r.professional_id === professional.id || r.professional.id === professional.profile.id
  );

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleToggleFav = async () => {
    const res = await toggleFavoriteAction(professional.id);
    if (res.success && res.data) {
      setIsFavorite(res.data.isFavorite);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestError(null);
    setIsSubmittingRequest(true);

    const result = await createServiceRequestAction({
      professional_id: professional.id,
      title: requestTitle,
      description: requestDescription,
      location: requestLocation,
      preferred_date: requestDate || null,
      budget: requestBudget ? Number(requestBudget) : null,
      category_id: professional.categories[0]?.id || null,
    });

    setIsSubmittingRequest(false);

    if (!result.success) {
      setRequestError(result.error || "Failed to submit request.");
      return;
    }

    setRequestSubmitted(true);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    await submitReportAction({
      target_type: "profile",
      target_id: professional.id,
      reason: reportReason,
      description: reportDetails,
    });
    setIsSubmittingReport(false);
    setReportSubmitted(true);
  };

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-navy-light/10 border-b border-border py-4">
        <div className="page-container flex items-center justify-between text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/professionals"
              className="hover:text-primary transition-colors"
            >
              Professionals
            </Link>
            <span>/</span>
            <span className="text-text font-medium truncate max-w-[200px] sm:max-w-none">
              {professional.profile.full_name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium text-text-secondary hover:text-text hover:bg-input-bg transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-xs font-medium text-text-muted hover:text-error hover:bg-error-light/40 transition-colors"
              title="Report this profile"
            >
              <Flag className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="page-container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <Avatar
                    src={professional.profile.avatar_url}
                    alt={professional.profile.full_name}
                    size="xl"
                    className="h-24 w-24 sm:h-28 sm:w-28 text-2xl shadow-sm"
                  />
                  {professional.is_available ? (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-success ring-4 ring-card"
                      title="Available for bookings"
                    />
                  ) : (
                    <span
                      className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-text-muted ring-4 ring-card"
                      title="Currently busy"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-bold text-text">
                      {professional.profile.full_name}
                    </h1>
                    {professional.verification_status === "approved" && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-2.5 py-1 rounded-full">
                        <ShieldCheck className="h-4 w-4" />
                        Verified Pro
                      </span>
                    )}
                  </div>

                  <p className="text-base text-text-secondary mt-1 font-medium">
                    {professional.headline}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-text-muted flex-wrap">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber text-amber" />
                      <span className="font-bold text-text">
                        {professional.average_rating
                          ? professional.average_rating.toFixed(2)
                          : "New"}
                      </span>
                      <span>
                        ({professional.review_count} {professional.review_count === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-text-muted" />
                      <span>{professional.years_experience} Years Experience</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-text-muted" />
                      <span>{professional.city}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {professional.categories.map((c) => (
                      <Badge key={c.id} variant="secondary" className="px-3 py-1">
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
              <h2 className="text-xl font-bold text-text mb-4">
                About the Professional
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {professional.bio ||
                  "This professional has not provided an extended bio yet."}
              </p>

              <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-teal-light text-teal">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text">Identity Verified</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      Government ID and background verification confirmed.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary-light text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text">Service Area Coverage</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      {professional.service_area}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Specialties */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
              <h2 className="text-xl font-bold text-text mb-4">
                Skills & Specialties
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {professional.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-input-bg border border-border text-sm font-medium text-text"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-teal" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Gallery */}
            {professional.portfolio_images && professional.portfolio_images.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
                <h2 className="text-xl font-bold text-text mb-4">
                  Past Work & Portfolio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {professional.portfolio_images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative rounded-xl overflow-hidden border border-border bg-input-bg aspect-video"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image_url}
                        alt={img.caption || "Portfolio item"}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-4 text-white">
                          <p className="text-xs font-medium">{img.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text">Customer Reviews</h2>
                  <p className="text-xs text-text-muted mt-0.5">
                    Verified reviews from completed service requests
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-light/30 px-3 py-1 rounded-lg border border-amber/20">
                    <Star className="h-4 w-4 fill-amber text-amber" />
                    <span className="font-bold text-text">
                      {professional.average_rating ? professional.average_rating.toFixed(1) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6 divide-y divide-border">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={rev.customer.avatar_url}
                            alt={rev.customer.full_name}
                            size="md"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-text">
                              {rev.customer.full_name}
                            </h4>
                            <p className="text-xs text-text-muted">
                              {new Date(rev.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`h-4 w-4 ${
                                s <= rev.rating
                                  ? "fill-amber text-amber"
                                  : "text-border fill-border"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-text-muted text-sm">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-text-muted/60" />
                  No reviews yet. Be the first to book and share your experience!
                </div>
              )}
            </div>
          </div>

          {/* Sticky Action Sidebar (1 col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-border sticky top-24">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Hourly Rate
                </span>
                <span className="text-3xl font-extrabold text-text">
                  {professional.hourly_rate ? `$${professional.hourly_rate}` : "Quote"}
                  {professional.hourly_rate && (
                    <span className="text-sm font-normal text-text-muted"> / hour</span>
                  )}
                </span>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center justify-between py-2 border-y border-border">
                  <span className="text-text-muted">Response Time</span>
                  <span className="font-medium text-text">Usually &lt; 2 hours</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Availability</span>
                  <span
                    className={`font-medium ${
                      professional.is_available ? "text-success" : "text-error"
                    }`}
                  >
                    {professional.is_available ? "Available Now" : "Currently Booked"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-text-muted">Location</span>
                  <span className="font-medium text-text truncate max-w-[140px]">
                    {professional.city}
                  </span>
                </div>
              </div>

              {/* Main Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="w-full text-base py-3 font-semibold shadow-md"
                  size="lg"
                  disabled={!professional.is_available}
                >
                  <Briefcase className="h-5 w-5 mr-2" />
                  Request Service
                </Button>

                <Button
                  variant="outline"
                  onClick={handleToggleFav}
                  className="w-full"
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isFavorite ? "fill-error text-error" : ""
                    }`}
                  />
                  {isFavorite ? "Saved to Favorites" : "Save to Favorites"}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-2.5 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal shrink-0" />
                  <span>LocalWork Guarantee Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                  <span>No upfront payment required to request</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          REQUEST SERVICE MODAL
          ============================================================ */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title={`Request Service from ${professional.profile.full_name}`}
        description="Fill out the project details. The professional will review and respond with confirmation or a quote."
        maxWidth="lg"
      >
        {requestSubmitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-text">Service Request Sent!</h3>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Your request has been submitted to <strong>{professional.profile.full_name}</strong>.
              You will receive an email and dashboard notification when they accept.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link href="/dashboard/requests">
                <Button>Go to My Requests</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setRequestSubmitted(false);
                  setIsRequestModalOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            {requestError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-error-light text-error text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{requestError}</span>
              </div>
            )}

            <FormField label="Service / Job Title" required>
              <Input
                placeholder="e.g. Install new ceiling fan and dimmer switch"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                required
              />
            </FormField>

            <FormField label="Describe What You Need Done" required>
              <Textarea
                rows={4}
                placeholder="Provide details about the issue, materials, current state, or any special requirements..."
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                required
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Project Location / Address" required>
                <Input
                  placeholder="Street or neighborhood, City"
                  value={requestLocation}
                  onChange={(e) => setRequestLocation(e.target.value)}
                  required
                />
              </FormField>

              <FormField label="Preferred Date">
                <Input
                  type="date"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Estimated Budget ($)" helper="Optional estimate or maximum you wish to spend">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                <Input
                  type="number"
                  className="pl-8"
                  placeholder="300"
                  value={requestBudget}
                  onChange={(e) => setRequestBudget(e.target.value)}
                />
              </div>
            </FormField>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmittingRequest}
                onClick={() => setIsRequestModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmittingRequest}>
                {isSubmittingRequest ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ============================================================
          REPORT MODAL
          ============================================================ */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Profile"
        description="Help us maintain a trustworthy community. Reports are reviewed by our moderation team within 24 hours."
        maxWidth="md"
      >
        {reportSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="h-12 w-12 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Report Submitted</h3>
            <p className="text-xs text-text-secondary">
              Thank you for keeping LocalWork safe. Our safety team will review this profile immediately.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReportSubmitted(false);
                setIsReportModalOpen(false);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="space-y-4">
            <FormField label="Reason for Report" required>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="inaccurate_info">Inaccurate profile or license information</option>
                <option value="unprofessional_behavior">Unprofessional or abusive conduct</option>
                <option value="fraud">Suspected fraud or scam</option>
                <option value="spam">Spam or fake listings</option>
                <option value="other">Other safety concern</option>
              </select>
            </FormField>

            <FormField label="Additional Details" required>
              <Textarea
                rows={3}
                placeholder="Explain the specific issue with this profile..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                required
              />
            </FormField>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsReportModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" size="sm" disabled={isSubmittingReport}>
                {isSubmittingReport ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default function ProfessionalProfilePage(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="page-container py-12 text-center text-text-muted">
          Loading profile...
        </div>
      }
    >
      <ProfessionalProfileContent {...props} />
    </Suspense>
  );
}
