"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, SlidersHorizontal, RotateCcw } from "lucide-react";
import { ProfessionalCard } from "@/components/ui/professional-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { mockProfessionals, mockCategories } from "@/lib/data/mock-data";

function ProfessionalsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialCity = searchParams.get("city") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [minRating, setMinRating] = useState<number>(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "experience" | "rate_asc" | "rate_desc">("rating");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setCityFilter("");
    setMinRating(0);
    setOnlyAvailable(false);
    setSortBy("rating");
  };

  const filteredProfessionals = useMemo(() => {
    return mockProfessionals
      .filter((pro) => {
        // Only show approved pros in public directory
        if (pro.verification_status !== "approved") return false;

        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = pro.profile.full_name.toLowerCase().includes(q);
          const matchesHeadline = pro.headline.toLowerCase().includes(q);
          const matchesBio = pro.bio?.toLowerCase().includes(q) || false;
          const matchesSkills = pro.skills.some((s) => s.toLowerCase().includes(q));
          const matchesCategory = pro.categories.some((c) => c.name.toLowerCase().includes(q));
          if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills && !matchesCategory) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory) {
          const hasCategory = pro.categories.some(
            (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
                   c.name.toLowerCase() === selectedCategory.toLowerCase()
          );
          if (!hasCategory) return false;
        }

        // City filter
        if (cityFilter.trim()) {
          const c = cityFilter.toLowerCase();
          const matchesCity = pro.city.toLowerCase().includes(c);
          const matchesArea = pro.service_area.toLowerCase().includes(c);
          if (!matchesCity && !matchesArea) return false;
        }

        // Min rating
        if (minRating > 0 && (pro.average_rating || 0) < minRating) {
          return false;
        }

        // Availability
        if (onlyAvailable && !pro.is_available) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return (b.average_rating || 0) - (a.average_rating || 0);
        }
        if (sortBy === "experience") {
          return b.years_experience - a.years_experience;
        }
        if (sortBy === "rate_asc") {
          return (a.hourly_rate || 0) - (b.hourly_rate || 0);
        }
        if (sortBy === "rate_desc") {
          return (b.hourly_rate || 0) - (a.hourly_rate || 0);
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, cityFilter, minRating, onlyAvailable, sortBy]);

  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            Find Trusted Local Professionals
          </h1>
          <p className="mt-2 text-text-secondary">
            Discover verified experts, compare transparent rates, read reviews, and hire with confidence.
          </p>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="bg-card rounded-2xl p-4 shadow-card border border-border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by skill, service, or name (e.g. EV charger, plumber)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-input-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div className="md:col-span-4 relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="text"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                placeholder="City or neighborhood (e.g. Seattle, Portland)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border text-sm bg-input-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <Button
                variant="outline"
                className="md:hidden flex-1"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "rating" | "experience" | "rate_asc" | "rate_desc"
                  )
                }
                className="w-full py-2.5 px-3 rounded-xl border border-border text-sm bg-input-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Most Experienced</option>
                <option value="rate_asc">Rate: Low to High</option>
                <option value="rate_desc">Rate: High to Low</option>
              </select>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-3 border-t border-border/60 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("")}
              className={`text-xs font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === ""
                  ? "bg-gradient-to-r from-primary to-teal text-white shadow-sm shadow-primary/25 font-semibold"
                  : "bg-card-elevated text-text-secondary hover:text-white hover:bg-card-elevated/80 border border-border"
              }`}
            >
              All Categories
            </button>
            {mockCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat.slug ? "" : cat.slug)
                }
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-gradient-to-r from-primary to-teal text-white shadow-sm shadow-primary/25 font-semibold"
                    : "bg-card-elevated text-text-secondary hover:text-white hover:bg-card-elevated/80 border border-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop + Mobile expandable) */}
          <div
            className={`lg:block ${
              showMobileFilters ? "block" : "hidden"
            } space-y-6`}
          >
            <div className="bg-card rounded-2xl p-6 shadow-card border border-border sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  Filter Options
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {/* Minimum Rating */}
              <div className="py-4 border-b border-border">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2.5">
                  Minimum Rating
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: "Any Rating", val: 0 },
                    { label: "4.5 & above ★★★★★", val: 4.5 },
                    { label: "4.8 & above ★★★★★", val: 4.8 },
                  ].map((r) => (
                    <label
                      key={r.val}
                      className="flex items-center gap-2 text-sm text-text cursor-pointer hover:text-primary transition-colors"
                    >
                      <input
                        type="radio"
                        name="minRating"
                        checked={minRating === r.val}
                        onChange={() => setMinRating(r.val)}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="py-4 border-b border-border">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted block mb-2.5">
                  Availability
                </label>
                <label className="flex items-center gap-2.5 text-sm text-text cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span>Available for work now</span>
                </label>
              </div>

              {/* Trust & Safety Assurance */}
              <div className="pt-4">
                <div className="bg-primary-light/50 rounded-xl p-4 text-xs text-navy space-y-1.5 border border-primary/10">
                  <p className="font-semibold text-primary">✓ 100% Verified Directory</p>
                  <p className="text-text-secondary">
                    All professionals listed have had their credentials and identity verified by our team.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-text-secondary">
                Showing{" "}
                <strong className="text-text">
                  {filteredProfessionals.length}
                </strong>{" "}
                verified professionals
              </span>
            </div>

            {filteredProfessionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfessionals.map((pro) => (
                  <ProfessionalCard
                    key={pro.id}
                    professional={pro}
                    isFavorite={favorites.includes(pro.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No professionals match your criteria"
                description="Try loosening your search terms, changing the category, or clearing the location filter."
                actionLabel="Reset All Filters"
                onAction={resetFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div className="page-container py-12 text-center text-text-muted">Loading directory...</div>}>
      <ProfessionalsContent />
    </Suspense>
  );
}
