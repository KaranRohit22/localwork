"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Trees,
  Thermometer,
  Home,
  Truck,
  Camera,
  GraduationCap,
  PawPrint,
  Search,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockCategories, mockProfessionals } from "@/lib/data/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Zap,
  Hammer,
  Paintbrush,
  Sparkles,
  Trees,
  Thermometer,
  Home,
  Truck,
  Camera,
  GraduationCap,
  PawPrint,
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  plumbing: { bg: "bg-blue-500/10 border border-blue-500/20", text: "text-blue-400" },
  electrical: { bg: "bg-amber-500/10 border border-amber-500/20", text: "text-amber-400" },
  carpentry: { bg: "bg-orange-500/10 border border-orange-500/20", text: "text-orange-400" },
  painting: { bg: "bg-purple-500/10 border border-purple-500/20", text: "text-purple-400" },
  cleaning: { bg: "bg-teal-500/10 border border-teal-500/20", text: "text-teal-400" },
  landscaping: { bg: "bg-emerald-500/10 border border-emerald-500/20", text: "text-emerald-400" },
  hvac: { bg: "bg-rose-500/10 border border-rose-500/20", text: "text-rose-400" },
  roofing: { bg: "bg-slate-500/10 border border-slate-500/20", text: "text-slate-300" },
  moving: { bg: "bg-indigo-500/10 border border-indigo-500/20", text: "text-indigo-400" },
  photography: { bg: "bg-pink-500/10 border border-pink-500/20", text: "text-pink-400" },
  tutoring: { bg: "bg-cyan-500/10 border border-cyan-500/20", text: "text-cyan-400" },
  "pet-care": { bg: "bg-yellow-500/10 border border-yellow-500/20", text: "text-yellow-400" },
};

export default function CategoriesPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = mockCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-background min-h-screen py-10 md:py-16">
      <div className="page-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-text tracking-tight">
            Explore All Categories
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary">
            Find verified, top-rated local professionals across every trade and service need.
          </p>

          {/* Quick search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search categories (e.g. plumbing, cleaning)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-border bg-input-bg text-text placeholder:text-text-muted text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => {
            const Icon = (cat.icon && iconMap[cat.icon]) || Wrench;
            const colors = categoryColors[cat.slug] || {
              bg: "bg-primary-light",
              text: "text-primary",
            };

            // Count mock pros for this category
            const count = mockProfessionals.filter((p) =>
              p.categories.some((c) => c.slug === cat.slug)
            ).length;
            const proDisplayCount = Math.max(count, 12); // Realistic display count

            return (
              <Link
                key={cat.id}
                href={`/professionals?category=${cat.slug}`}
                className="group"
              >
                <Card className="h-full p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover border-border flex flex-col justify-between">
                  <div>
                    <div
                      className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${colors.bg} ${colors.text} mb-5 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                      {cat.name}
                    </h3>

                    <p className="mt-2 text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-muted">
                      {proDisplayCount}+ Pros Available
                    </span>
                    <span className="font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Browse
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-navy rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Are you a skilled local service professional?
            </h2>
            <p className="text-white/70 text-sm md:text-base mb-6">
              Join LocalWork to showcase your work, connect with verified local clients, and grow your independent business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register/professional">
                <Button size="lg" className="w-full sm:w-auto font-semibold">
                  Join as a Professional
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
