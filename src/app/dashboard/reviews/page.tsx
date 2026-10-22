"use client";

import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { mockReviews } from "@/lib/data/mock-data";

export default function CustomerReviewsPage() {
  // Reviews by customer "Sarah Miller" (cust-1)
  const myReviews = mockReviews.filter((r) => r.customer_id === "cust-1");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">My Reviews</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Reviews you have written for completed jobs.
        </p>
      </div>

      {myReviews.length > 0 ? (
        <div className="space-y-4">
          {myReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-border shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={rev.professional.avatar_url}
                    alt={rev.professional.full_name}
                    size="md"
                  />
                  <div>
                    <h3 className="text-base font-bold text-text">
                      <Link
                        href="/professionals/pro-1"
                        className="hover:text-primary transition-colors"
                      >
                        {rev.professional.full_name}
                      </Link>
                    </h3>
                    <p className="text-xs text-text-muted">
                      Reviewed on{" "}
                      {new Date(rev.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
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

              <p className="mt-4 text-sm text-text-secondary leading-relaxed bg-input-bg/40 p-4 rounded-xl border border-border/40">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquare}
          title="No reviews submitted yet"
          description="Once you complete a service request with a professional, you'll be able to leave an authentic review here."
          actionLabel="View My Requests"
          actionHref="/dashboard/requests"
        />
      )}
    </div>
  );
}
