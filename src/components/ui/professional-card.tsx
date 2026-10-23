import Link from "next/link";
import { MapPin, ShieldCheck, Star, Clock, Heart } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProfessionalWithProfile } from "@/types";

interface ProfessionalCardProps {
  professional: ProfessionalWithProfile;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function ProfessionalCard({
  professional,
  isFavorite = false,
  onToggleFavorite,
}: ProfessionalCardProps) {
  const {
    id,
    profile,
    headline,
    city,
    service_area,
    hourly_rate,
    years_experience,
    is_available,
    verification_status,
    average_rating,
    review_count,
    categories,
    skills,
  } = professional;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover border-border bg-card">
      {/* Top Section */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar
                src={profile.avatar_url}
                alt={profile.full_name}
                size="lg"
              />
              {is_available ? (
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success ring-2 ring-card"
                  title="Available for new requests"
                />
              ) : (
                <span
                  className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-text-muted ring-2 ring-card"
                  title="Currently busy"
                />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/professionals/${id}`}
                  className="font-semibold text-text hover:text-primary transition-colors text-lg"
                >
                  {profile.full_name}
                </Link>
                {verification_status === "approved" && (
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium text-teal bg-teal-light px-2 py-0.5 rounded-full"
                    title="Identity & skills verified by LocalWork"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">
                {headline}
              </p>

              {/* Rating & Experience */}
              <div className="flex items-center gap-3 mt-2 text-xs text-text-muted flex-wrap">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber text-amber" />
                  <span className="font-semibold text-text">
                    {average_rating ? average_rating.toFixed(1) : "New"}
                  </span>
                  <span>({review_count} {review_count === 1 ? "review" : "reviews"})</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{years_experience} yrs exp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Favorite button */}
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(id);
              }}
              className="p-2 rounded-full text-text-muted hover:text-error hover:bg-error-light/50 transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-error text-error" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Categories & Skills preview */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <Badge key={cat.id} variant="secondary">
              {cat.name}
            </Badge>
          ))}
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="bg-card-elevated text-text-secondary border-border">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-text-muted self-center">
              +{skills.length - 3} more
            </span>
          )}
        </div>

        {/* Location info */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-text-muted" />
          <span className="truncate">
            {city} — <span className="text-text-muted">{service_area}</span>
          </span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card-elevated/40">
        <div>
          <span className="text-xs text-text-muted block">Rate</span>
          <span className="text-lg font-bold text-text">
            {hourly_rate ? `$${hourly_rate}` : "Contact"}
            {hourly_rate && <span className="text-xs font-normal text-text-muted"> / hr</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/professionals/${id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
          <Link href={`/professionals/${id}?request=true`}>
            <Button size="sm">
              Request Service
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
