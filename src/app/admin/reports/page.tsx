"use client";

import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { Textarea } from "@/components/ui/textarea";
import { Report } from "@/types";
import { getAdminReportsAction, resolveAdminReportAction } from "@/app/actions/admin";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getAdminReportsAction().then((reports) => {
      if (isMounted) {
        setReports(reports || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshReports = async () => {
    const reports = await getAdminReportsAction();
    setReports(reports || []);
  };

  const handleAction = async (status: "resolved" | "dismissed") => {
    if (!activeReport) return;

    setIsSubmitting(true);
    try {
      const note = resolutionNote || (status === "resolved" ? "Action taken" : "Dismissed after investigation");
      await resolveAdminReportAction({
        reportId: activeReport.id,
        status,
        resolutionNote: note,
      });
      await refreshReports();
      setActiveReport(null);
      setResolutionNote("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Community Safety & Moderation</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Review user reports on suspicious profiles, abusive communications, and fraudulent activity.
        </p>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Moderation queue is clear"
            description="No active flags, complaints, or safety reports submitted by community members."
          />
        ) : (
          reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl p-6 border border-border shadow-card flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-text text-base">
                  {rep.reason}
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono uppercase">
                  Target: {rep.target_type}
                </span>
                {rep.status === "pending" && <Badge variant="warning">Pending Review</Badge>}
                {rep.status === "resolved" && <Badge variant="success">Resolved</Badge>}
                {rep.status === "dismissed" && <Badge variant="secondary">Dismissed</Badge>}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
                {rep.description || "No additional commentary provided."}
              </p>

              <div className="text-xs text-text-muted flex items-center gap-4">
                <span>Report ID: {rep.id}</span>
                <span>•</span>
                <span>
                  Filed on{" "}
                  {new Date(rep.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {rep.resolution_note && (
                  <>
                    <span>•</span>
                    <span className="text-text font-medium">Note: {rep.resolution_note}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              {rep.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => {
                    setActiveReport(rep);
                    setResolutionNote("");
                  }}
                >
                  Review Report
                </Button>
              )}
            </div>
          </div>
        ))
      )}
      </div>

      {/* Moderation Action Modal */}
      <Modal
        isOpen={!!activeReport}
        onClose={() => setActiveReport(null)}
        title="Resolve Moderation Report"
        description={`Report ID: ${activeReport?.id}`}
        maxWidth="md"
      >
        {activeReport && (
          <div className="space-y-4 text-sm">
            <div className="p-4 rounded-xl bg-input-bg/60 space-y-1">
              <p className="text-xs text-text-muted uppercase font-bold">Reason</p>
              <p className="font-semibold text-text">{activeReport.reason}</p>
              <p className="text-xs text-text-secondary mt-1">{activeReport.description}</p>
            </div>

            <FormField label="Resolution Note" required>
              <Textarea
                rows={3}
                placeholder="Explain the investigative findings and action taken..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              />
            </FormField>

            <div className="pt-3 border-t border-border flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isSubmitting}
                onClick={() => handleAction("dismissed")}
              >
                Dismiss Report
              </Button>
              <Button
                size="sm"
                disabled={isSubmitting}
                className="bg-success text-white hover:bg-success/90"
                onClick={() => handleAction("resolved")}
              >
                {isSubmitting ? "Processing..." : "Resolve & Sanction"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
