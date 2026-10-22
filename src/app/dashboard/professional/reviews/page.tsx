import { Star, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { mockReviews } from "@/lib/data/mock-data";

export default function ProfessionalReviewsPage() {
  const reviews = mockReviews; // Marcus Vance's reviews
  const averageRating = 4.95;
  const totalReviews = 48;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Customer Reviews & Ratings</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Authentic feedback left by clients with completed service bookings.
        </p>
      </div>

      {/* Aggregate Score Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-5 text-center md:text-left md:border-r border-border md:pr-8">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Overall Rating
          </span>
          <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
            <span className="text-5xl font-black text-navy">{averageRating}</span>
            <span className="text-text-muted text-lg">/ 5.0</span>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1 my-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-amber text-amber" />
            ))}
          </div>

          <p className="text-xs text-text-muted">
            Based on <strong className="text-text">{totalReviews} verified ratings</strong>
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-7 space-y-2 text-xs">
          {[
            { stars: "5 Stars", pct: 96, count: 46 },
            { stars: "4 Stars", pct: 4, count: 2 },
            { stars: "3 Stars", pct: 0, count: 0 },
            { stars: "2 Stars", pct: 0, count: 0 },
            { stars: "1 Star", pct: 0, count: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3">
              <span className="w-14 text-text-muted font-medium">{bar.stars}</span>
              <div className="flex-1 h-2 rounded-full bg-input-bg overflow-hidden">
                <div
                  className="h-full bg-amber rounded-full"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-text-muted">{bar.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-text">Recent Reviews ({reviews.length})</h2>

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-border shadow-card space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={rev.customer.avatar_url}
                    alt={rev.customer.full_name}
                    size="md"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-text">
                      {rev.customer.full_name}
                    </h4>
                    <span className="text-xs text-text-muted">
                      {new Date(rev.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
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

              <p className="text-sm text-text-secondary leading-relaxed pt-1">
                &ldquo;{rev.comment}&rdquo;
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-[11px] text-teal">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified completed job on LocalWork</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
