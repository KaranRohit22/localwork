"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { InteractiveStarRating } from "@/components/ui/star-rating";
import { mockRequests } from "@/lib/data/mock-data";
import { ServiceRequestWithDetails } from "@/types";

export default function CustomerRequestsPage() {
  const [requestsList, setRequestsList] = useState<ServiceRequestWithDetails[]>(mockRequests);
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");

  // Selected request for detail modal
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestWithDetails | null>(null);

  // Review modal state
  const [reviewRequest, setReviewRequest] = useState<ServiceRequestWithDetails | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Filter requests
  const filteredRequests = requestsList.filter((r) => {
    if (filterTab === "active") {
      return r.status === "pending" || r.status === "accepted" || r.status === "in_progress";
    }
    if (filterTab === "completed") {
      return r.status === "completed";
    }
    return true;
  });

  const handleCancelRequest = (id: string) => {
    setRequestsList((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "cancelled", status_note: "Cancelled by customer." } : r
      )
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev ? { ...prev, status: "cancelled", status_note: "Cancelled by customer." } : null
      );
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRequest) return;

    // Attach review to request
    setRequestsList((prev) =>
      prev.map((r) =>
        r.id === reviewRequest.id
          ? {
              ...r,
              review: {
                id: `rev-${Date.now()}`,
                request_id: r.id,
                customer_id: r.customer_id,
                professional_id: r.professional_id,
                rating: reviewRating,
                comment: reviewComment,
                is_visible: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            }
          : r
      )
    );

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewRequest(null);
      setReviewComment("");
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "accepted":
        return <Badge variant="default">Accepted</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">My Service Requests</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Manage your service inquiries, track status updates, and submit reviews.
          </p>
        </div>

        <Link href="/professionals">
          <Button size="sm" className="font-semibold">
            + New Request
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {[
          { key: "all", label: `All Requests (${requestsList.length})` },
          {
            key: "active",
            label: `Active (${requestsList.filter((r) => ["pending", "accepted", "in_progress"].includes(r.status)).length})`,
          },
          {
            key: "completed",
            label: `Completed (${requestsList.filter((r) => r.status === "completed").length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key as "all" | "active" | "completed")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              filterTab === tab.key
                ? "bg-navy text-white shadow-sm"
                : "text-text-secondary hover:text-text hover:bg-input-bg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Avatar
                  src={req.professional.avatar_url}
                  alt={req.professional.full_name}
                  size="lg"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-text">{req.title}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-text-secondary">
                    Professional:{" "}
                    <Link
                      href={`/professionals/${req.professional_profile?.id || "pro-1"}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {req.professional.full_name}
                    </Link>
                  </p>
                  <p className="text-xs text-text-muted line-clamp-2 max-w-2xl mt-1">
                    {req.description}
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-xs text-text-muted flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {req.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {req.preferred_date ? new Date(req.preferred_date).toLocaleDateString() : "Flexible"}
                    </span>
                    {req.budget && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-text">Budget: ${req.budget}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRequest(req)}
                >
                  View Details
                </Button>

                {req.status === "completed" && !req.review && (
                  <Button
                    size="sm"
                    className="bg-amber text-navy hover:bg-amber/90 font-semibold"
                    onClick={() => setReviewRequest(req)}
                  >
                    <Star className="h-4 w-4 mr-1.5 fill-navy" />
                    Leave Review
                  </Button>
                )}

                {req.review && (
                  <span className="text-xs font-semibold text-success bg-success-light px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Reviewed (★ {req.review.rating})
                  </span>
                )}

                {["pending", "accepted"].includes(req.status) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-error hover:bg-error-light/50"
                    onClick={() => handleCancelRequest(req.id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============================================================
          REQUEST DETAILS MODAL
          ============================================================ */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Service Request Details"
        description={`Request ID: ${selectedRequest?.id}`}
        maxWidth="lg"
      >
        {selectedRequest && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="font-semibold text-text">Current Status</span>
              {getStatusBadge(selectedRequest.status)}
            </div>

            <div>
              <h4 className="font-bold text-text text-base mb-1">{selectedRequest.title}</h4>
              <p className="text-text-secondary leading-relaxed">{selectedRequest.description}</p>
            </div>

            <div className="bg-input-bg/60 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-text-muted">Assigned Professional:</span>
                <span className="font-semibold text-text">{selectedRequest.professional.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Pro Phone:</span>
                <span className="font-medium text-text">{selectedRequest.professional.phone || "+1 (206) 555-0192"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Project Address:</span>
                <span className="font-medium text-text">{selectedRequest.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Target Date:</span>
                <span className="font-medium text-text">{selectedRequest.preferred_date || "Flexible"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Budget:</span>
                <span className="font-bold text-text">${selectedRequest.budget || "TBD"}</span>
              </div>
            </div>

            {selectedRequest.status_note && (
              <div className="p-4 rounded-xl bg-primary-light/40 border border-primary/20 text-text">
                <span className="font-semibold block text-xs text-primary mb-1">Status Note:</span>
                <p className="text-xs">{selectedRequest.status_note}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              {["pending", "accepted"].includes(selectedRequest.status) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelRequest(selectedRequest.id)}
                >
                  Cancel Request
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================
          LEAVE A REVIEW MODAL
          ============================================================ */}
      <Modal
        isOpen={!!reviewRequest}
        onClose={() => setReviewRequest(null)}
        title={`Review ${reviewRequest?.professional.full_name}`}
        description="Share your honest experience to guide neighbors and reward quality craftsmanship."
        maxWidth="md"
      >
        {reviewSuccess ? (
          <div className="py-6 text-center space-y-3">
            <div className="h-12 w-12 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-text">Review Published!</h3>
            <p className="text-xs text-text-secondary">
              Thank you! Your verified review is now live on this professional&apos;s profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <FormField label="Your Rating" required>
              <div className="py-2">
                <InteractiveStarRating
                  value={reviewRating}
                  onChange={setReviewRating}
                />
              </div>
            </FormField>

            <FormField label="Your Feedback" required>
              <Textarea
                rows={4}
                placeholder="Describe their punctuality, quality of work, cleanliness, and communication..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
              />
            </FormField>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewRequest(null)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Publish Verified Review
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
