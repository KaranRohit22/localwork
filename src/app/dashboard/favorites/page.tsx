"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { ProfessionalCard } from "@/components/ui/professional-card";
import { EmptyState } from "@/components/ui/empty-state";
import { mockProfessionals } from "@/lib/data/mock-data";
import { getUserFavoriteIdsAction, toggleFavoriteAction } from "@/app/actions/services";

export default function CustomerFavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    getUserFavoriteIdsAction().then((ids) => {
      if (isMounted) {
        setFavoriteIds(ids);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (id: string) => {
    // Optimistic update
    setFavoriteIds((prev) => prev.filter((favId) => favId !== id));
    await toggleFavoriteAction(id);
  };

  const favoritePros = mockProfessionals.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-text">Saved Professionals</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Your bookmarked contractors and tradespeople for quick access and future projects.
        </p>
      </div>

      {favoritePros.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePros.map((pro) => (
            <ProfessionalCard
              key={pro.id}
              professional={pro}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved professionals yet"
          description="Browse our verified directory and click the heart icon on any profile to save them here."
          actionLabel="Find Professionals"
          actionHref="/professionals"
        />
      )}
    </div>
  );
}
