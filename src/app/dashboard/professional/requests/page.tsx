"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Check,
  X,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { ServiceRequestWithDetails } from "@/types";
import {
  getProfessionalIncomingRequestsAction,
  updateServiceRequestStatusAction,
} from "@/app/actions/services";

export default function ProfessionalRequestsPage() {
  const [requestsList, setRequestsList] = useState<ServiceRequestWithDetails[]>([]);
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "active" | "completed">("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestWithDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status transition note modal
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"accepted" | "rejected" | "completed" | null>(null);
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    let isMounted = true;
    getProfessionalIncomingRequestsAction().then((res) => {
      if (isMounted) {
        setRequestsList(res.requests || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshRequests = async () => {
    const res = await getProfessionalIncomingRequestsAction();
    setRequestsList(res.requests || []);
  };

  const filteredRequests = requestsList.filter((r) => {
    if (filterTab === "pending") return r.status === "pending";
    if (filterTab === "active") return r.status === "accepted" || r.status === "in_progress";
    if (filterTab === "completed") return r.status === "completed";
    return true;
  });

  const openActionWithNote = (req: ServiceRequestWithDetails, action: "accepted" | "rejected" | "completed") => {
    setSelectedRequest(req);
    setStatusAction(action);
    setStatusNote(
      action === "accepted"
        ? "Accepted! I can arrive at the requested date. Looking forward to working together."
        : action === "rejected"
        ? "Unfortunately I am fully booked on that date and unable to take this request."
        : "Work has been completed and cleaned up. Ready for customer review."
    );
    setNoteModalOpen(true);
  };

  const handleStartWork = async (requestId: string) => {
    setRequestsList((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: "in_progress" } : r))
    );
    await updateServiceRequestStatusAction({
      requestId,
      status: "in_progress",
    });
    refreshRequests();
  };

  const handleConfirmStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !statusAction) return;

    setIsSubmitting(true);
    try {
      await updateServiceRequestStatusAction({
        requestId: selectedRequest.id,
        status: statusAction,
        statusNote: statusNote,
      });
      await refreshRequests();
      setNoteModalOpen(false);
      setSelectedRequest(null);
      setStatusAction(null);
    } finally {
      setIsSubmitting(false);
    }
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
      case "rejected":
        return <Badge variant="destructive">Declined</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Customer Job Inquiries</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Review, accept, and update service requests sent by local clients.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
        {[
          { key: "all", label: `All (${requestsList.length})` },
          {
            key: "pending",
            label: `Pending Review (${requestsList.filter((r) => r.status === "pending").length})`,
          },
          {
            key: "active",
            label: `Active / Accepted (${requestsList.filter((r) => ["accepted", "in_progress"].includes(r.status)).length})`,
          },
          {
            key: "completed",
            label: `Completed (${requestsList.filter((r) => r.status === "completed").length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key as "all" | "pending" | "active" | "completed")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
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
        {filteredRequests.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No inquiries found"
            description="There are no service requests matching this filter."
          />
        ) : (
          filteredRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white rounded-2xl p-6 border border-border shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <Avatar
                  src={req.customer.avatar_url}
                  alt={req.customer.full_name}
                  size="lg"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-text">{req.title}</h3>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-sm text-text-secondary">
                    Customer: <strong className="text-text">{req.customer.full_name}</strong> • Phone:{" "}
                    <span className="text-text-muted">{req.customer.phone || "+1 (206) 555-9011"}</span>
                  </p>
                  <p className="text-xs text-text-muted max-w-2xl mt-1 leading-relaxed">
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
                        <span className="font-semibold text-text">Customer Budget: ${req.budget}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                {req.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-success text-white hover:bg-success/90"
                      onClick={() => openActionWithNote(req, "accepted")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-error border-error/20 hover:bg-error-light/40"
                      onClick={() => openActionWithNote(req, "rejected")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                  </>
                )}

                {req.status === "accepted" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-primary text-white"
                      onClick={() => handleStartWork(req.id)}
                    >
                      Start Work
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-success border-success/30 hover:bg-success-light"
                      onClick={() => openActionWithNote(req, "completed")}
                    >
                      Complete
                    </Button>
                  </>
                )}

                {req.status === "in_progress" && (
                  <Button
                    size="sm"
                    className="bg-success text-white hover:bg-success/90"
                    onClick={() => openActionWithNote(req, "completed")}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    Complete Job
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRequest(req)}
                >
                  Details
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
      </div>

      {/* ============================================================
          STATUS NOTE CONFIRMATION MODAL
          ============================================================ */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={
          statusAction === "accepted"
            ? "Accept Service Request"
            : statusAction === "rejected"
            ? "Decline Request"
            : "Mark Job as Completed"
        }
        description="Include an optional note to be sent to the customer."
        maxWidth="md"
      >
        <form onSubmit={handleConfirmStatus} className="space-y-4">
          <FormField label="Message to Customer" required>
            <Textarea
              rows={4}
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              required
            />
          </FormField>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setNoteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className={
                statusAction === "rejected"
                  ? "bg-error text-white hover:bg-error/90"
                  : "bg-success text-white hover:bg-success/90"
              }
            >
              {isSubmitting ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============================================================
          REQUEST DETAILS INSPECTION MODAL
          ============================================================ */}
      <Modal
        isOpen={!!selectedRequest && !noteModalOpen}
        onClose={() => setSelectedRequest(null)}
        title="Job Request Details"
        description={`Request ID: ${selectedRequest?.id}`}
        maxWidth="lg"
      >
        {selectedRequest && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="font-semibold text-text">Status</span>
              {getStatusBadge(selectedRequest.status)}
            </div>

            <div>
              <h4 className="font-bold text-text text-base mb-1">{selectedRequest.title}</h4>
              <p className="text-text-secondary leading-relaxed">{selectedRequest.description}</p>
            </div>

            <div className="bg-input-bg/60 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-text-muted">Customer Name:</span>
                <span className="font-semibold text-text">{selectedRequest.customer.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Customer Phone:</span>
                <span className="font-medium text-text">{selectedRequest.customer.phone || "+1 (206) 555-9011"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Service Location:</span>
                <span className="font-medium text-text">{selectedRequest.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Customer Budget:</span>
                <span className="font-bold text-text">${selectedRequest.budget || "Flexible"}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
