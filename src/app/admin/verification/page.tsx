"use client";

import { useState } from "react";
import {
  Check,
  X,
  Eye,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { mockProfessionals } from "@/lib/data/mock-data";
import { ProfessionalWithProfile } from "@/types";

export default function AdminVerificationPage() {
  const [pros, setPros] = useState<ProfessionalWithProfile[]>(mockProfessionals);
  const [tab, setTab] = useState<"pending" | "approved" | "all">("pending");

  // Inspect Modal
  const [inspectPro, setInspectPro] = useState<ProfessionalWithProfile | null>(null);

  // Reject Modal
  const [rejectingPro, setRejectingPro] = useState<ProfessionalWithProfile | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const filteredPros = pros.filter((p) => {
    if (tab === "pending") return p.verification_status === "pending";
    if (tab === "approved") return p.verification_status === "approved";
    return true;
  });

  const handleApprove = (id: string) => {
    setPros((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              verification_status: "approved",
              verified_at: new Date().toISOString(),
              verified_by: "super_admin",
            }
          : p
      )
    );
    if (inspectPro && inspectPro.id === id) {
      setInspectPro(null);
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPro) return;

    setPros((prev) =>
      prev.map((p) =>
        p.id === rejectingPro.id
          ? {
              ...p,
              verification_status: "rejected",
              rejection_reason: rejectReason,
            }
          : p
      )
    );

    setRejectingPro(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Professional Verification Queue</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Screen and approve contractor credentials before public listing activation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        {[
          {
            key: "pending",
            label: `Pending Review (${pros.filter((p) => p.verification_status === "pending").length})`,
          },
          {
            key: "approved",
            label: `Approved Pros (${pros.filter((p) => p.verification_status === "approved").length})`,
          },
          {
            key: "all",
            label: `All Records (${pros.length})`,
          },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "pending" | "approved" | "all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tab === t.key
                ? "bg-slate-900 text-white shadow-sm"
                : "text-text-secondary hover:text-text hover:bg-input-bg"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pros Queue List */}
      <div className="space-y-4">
        {filteredPros.map((pro) => (
          <div
            key={pro.id}
            className="bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4">
              <Avatar
                src={pro.profile.avatar_url}
                alt={pro.profile.full_name}
                size="lg"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-text text-lg">
                    {pro.profile.full_name}
                  </h3>
                  {pro.verification_status === "pending" && (
                    <Badge variant="warning">Pending Verification</Badge>
                  )}
                  {pro.verification_status === "approved" && (
                    <Badge variant="success">Verified Pro</Badge>
                  )}
                  {pro.verification_status === "rejected" && (
                    <Badge variant="destructive">Application Rejected</Badge>
                  )}
                </div>

                <p className="text-sm text-text-secondary font-medium">
                  {pro.headline}
                </p>

                <div className="flex items-center gap-4 text-xs text-text-muted pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {pro.city} ({pro.service_area})
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {pro.years_experience} years experience
                  </span>
                  <span>•</span>
                  <span>Rate: ${pro.hourly_rate || 70}/hr</span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {pro.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] bg-input-bg text-text-secondary px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInspectPro(pro)}
              >
                <Eye className="h-4 w-4 mr-1.5" />
                Inspect Details
              </Button>

              {pro.verification_status === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="bg-success text-white hover:bg-success/90"
                    onClick={() => handleApprove(pro.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-error border-error/20 hover:bg-error-light/50"
                    onClick={() => setRejectingPro(pro)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Modal */}
      <Modal
        isOpen={!!inspectPro}
        onClose={() => setInspectPro(null)}
        title="Applicant Verification Details"
        description={`Application ID: ${inspectPro?.id}`}
        maxWidth="lg"
      >
        {inspectPro && (
          <div className="space-y-6 text-sm">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-input-bg/50">
              <Avatar
                src={inspectPro.profile.avatar_url}
                alt={inspectPro.profile.full_name}
                size="lg"
              />
              <div>
                <h3 className="font-bold text-text text-base">
                  {inspectPro.profile.full_name}
                </h3>
                <p className="text-xs text-text-muted">{inspectPro.profile.email}</p>
                <p className="text-xs text-text-muted">{inspectPro.profile.phone || "+1 (503) 555-0155"}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-text mb-1">Headline & Trade Bio</h4>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {inspectPro.bio || "No extended bio provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-input-bg/40 p-4 rounded-xl">
              <div>
                <span className="text-text-muted block">Primary Location:</span>
                <span className="font-semibold text-text">{inspectPro.city}</span>
              </div>
              <div>
                <span className="text-text-muted block">Experience:</span>
                <span className="font-semibold text-text">{inspectPro.years_experience} Years</span>
              </div>
              <div>
                <span className="text-text-muted block">Hourly Rate:</span>
                <span className="font-semibold text-text">${inspectPro.hourly_rate || 70}/hr</span>
              </div>
              <div>
                <span className="text-text-muted block">Current Status:</span>
                <span className="font-bold text-primary uppercase">{inspectPro.verification_status}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              {inspectPro.verification_status === "pending" && (
                <Button
                  size="sm"
                  className="bg-success text-white hover:bg-success/90"
                  onClick={() => handleApprove(inspectPro.id)}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve Application
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setInspectPro(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={!!rejectingPro}
        onClose={() => setRejectingPro(null)}
        title="Reject Verification Application"
        description="Provide a clear reason that will be saved to the applicant's record."
        maxWidth="md"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <FormField label="Rejection Reason" required>
            <Textarea
              rows={4}
              placeholder="e.g. Missing contractor licensing proof or invalid identification..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </FormField>

          <div className="pt-3 border-t border-border flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setRejectingPro(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="destructive" size="sm">
              Confirm Rejection
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
