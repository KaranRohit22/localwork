"use client";

import { useState } from "react";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockReviews } from "@/lib/data/mock-data";
import { ReviewWithDetails } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>(mockReviews);

  const toggleVisibility = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_visible: !r.is_visible } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Review Moderation</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Monitor platform ratings, verify review authenticity, and remove violating feedback.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-2xl p-6 border shadow-card transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${
              rev.is_visible ? "border-border" : "border-error/40 bg-error-light/10 opacity-75"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Avatar
                  src={rev.customer.avatar_url}
                  alt={rev.customer.full_name}
                  size="md"
                />
                <div>
                  <h4 className="font-bold text-text text-sm">
                    {rev.customer.full_name}{" "}
                    <span className="font-normal text-text-muted text-xs">
                      reviewed{" "}
                      <strong className="text-text">{rev.professional.full_name}</strong>
                    </span>
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating
                            ? "fill-amber text-amber"
                            : "text-border fill-border"
                        }`}
                      />
                    ))}
                    <span className="text-[11px] text-text-muted ml-2">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed bg-input-bg/40 p-3 rounded-xl border border-border/40">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-text-muted">Review ID: {rev.id}</span>
                <span>•</span>
                <span
                  className={
                    rev.is_visible ? "text-success font-medium" : "text-error font-medium"
                  }
                >
                  {rev.is_visible ? "Publicly Visible" : "Hidden / Flagged"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVisibility(rev.id)}
              >
                {rev.is_visible ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-1.5 text-text-muted" />
                    Hide Review
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-1.5 text-success" />
                    Make Visible
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-error hover:bg-error-light/50"
                onClick={() => deleteReview(rev.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
