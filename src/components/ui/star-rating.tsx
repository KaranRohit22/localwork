import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  reviewCount,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: maxRating }, (_, i) => {
          const filled = i < Math.floor(rating);
          const partial = !filled && i < rating;
          return (
            <Star
              key={i}
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-amber-400 text-amber-400"
                  : partial
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-none text-border-hover"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-text-secondary ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-text-muted">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

interface InteractiveStarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
}

export function InteractiveStarRating({
  value,
  onChange,
  maxRating = 5,
}: InteractiveStarRatingProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
          aria-label={`Rate ${i + 1} star${i === 0 ? "" : "s"}`}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              i < value
                ? "fill-amber-400 text-amber-400"
                : "fill-none text-border-hover hover:text-amber-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
