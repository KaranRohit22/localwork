import Link from "next/link";
import {
  Search,
  MapPin,
  Shield,
  CheckCircle2,
  Star,
  ArrowRight,
  Users,
  Briefcase,
  Clock,
  Award,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LocalWork — Find Trusted Local Professionals",
  description:
    "Connect with verified local service professionals. Find plumbers, electricians, cleaners, and more trusted experts in your area.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench, Zap, Hammer, Paintbrush, Sparkles, Trees,
  Thermometer, Home, Truck, Camera, GraduationCap, PawPrint,
};

const categories = [
  { name: "Plumbing", slug: "plumbing", icon: "Wrench", color: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  { name: "Electrical", slug: "electrical", icon: "Zap", color: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  { name: "Carpentry", slug: "carpentry", icon: "Hammer", color: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
  { name: "Painting", slug: "painting", icon: "Paintbrush", color: "bg-purple-500/10 text-purple-400 border border-purple-500/20" },
  { name: "Cleaning", slug: "cleaning", icon: "Sparkles", color: "bg-teal-500/10 text-teal-400 border border-teal-500/20" },
  { name: "Landscaping", slug: "landscaping", icon: "Trees", color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  { name: "HVAC", slug: "hvac", icon: "Thermometer", color: "bg-rose-500/10 text-rose-400 border border-rose-500/20" },
  { name: "Roofing", slug: "roofing", icon: "Home", color: "bg-slate-500/10 text-slate-300 border border-slate-500/20" },
  { name: "Moving", slug: "moving", icon: "Truck", color: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
  { name: "Photography", slug: "photography", icon: "Camera", color: "bg-pink-500/10 text-pink-400 border border-pink-500/20" },
  { name: "Tutoring", slug: "tutoring", icon: "GraduationCap", color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" },
  { name: "Pet Care", slug: "pet-care", icon: "PawPrint", color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
];

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse verified professionals by category, location, rating, and availability.",
  },
  {
    icon: Users,
    title: "Compare & Choose",
    description: "Review profiles, portfolios, ratings, and pricing to find your perfect match.",
  },
  {
    icon: Briefcase,
    title: "Submit a Request",
    description: "Describe your project, set your budget, and choose a preferred date.",
  },
  {
    icon: CheckCircle2,
    title: "Get It Done",
    description: "Your professional accepts, completes the work, and you leave a review.",
  },
];

const trustFeatures = [
  {
    icon: Shield,
    title: "Verified Professionals",
    description: "Every professional goes through our verification process before appearing in search.",
  },
  {
    icon: Star,
    title: "Genuine Reviews",
    description: "Reviews come from real customers with completed service requests — no fakes.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "We hold professionals to high standards and respond quickly to service concerns.",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "Most professionals respond to service requests within hours, not days.",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Radiant Ambient Glow Effect */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[360px] bg-gradient-to-b from-primary/30 via-teal/20 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="page-container relative py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md border border-primary/30 rounded-full px-4 py-1.5 mb-6 shadow-sm shadow-primary/20">
              <Shield className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-indigo-200">Verified & Trusted Professionals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              Find Trusted Local{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-black">
                Professionals
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with verified experts in your neighborhood. From plumbing to smart home installation, get master craftsman quality you can count on.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form action="/professionals" method="GET">
                <div className="flex flex-col sm:flex-row gap-2.5 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-2.5 shadow-2xl shadow-black/60">
                  <div className="flex-1 flex items-center gap-2 px-3">
                    <Search className="h-5 w-5 text-text-muted shrink-0" />
                    <input
                      type="text"
                      name="q"
                      placeholder="What service do you need?"
                      className="w-full py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none bg-transparent"
                      aria-label="Search for services"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 sm:border-l border-border">
                    <MapPin className="h-5 w-5 text-text-muted shrink-0" />
                    <input
                      type="text"
                      name="city"
                      placeholder="City or zip code"
                      className="w-full py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none bg-transparent"
                      aria-label="Location"
                    />
                  </div>
                  <Button type="submit" size="lg" className="sm:px-8">
                    <Search className="h-4 w-4 sm:hidden" />
                    <span className="hidden sm:inline">Find Pros</span>
                    <span className="sm:hidden">Search</span>
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick stats */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Verified Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Real Reviews Only</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CATEGORIES SECTION
          ================================================================ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Popular Service Categories
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Browse our most requested service categories to find the professional you need.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon];
              return (
                <Link
                  key={cat.slug}
                  href={`/professionals?category=${cat.slug}`}
                  className="group"
                >
                  <Card hover className="text-center py-6 px-3 h-full">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${cat.color} mb-3 mx-auto transition-transform group-hover:scale-110`}>
                      {IconComponent && <IconComponent className="h-6 w-6" />}
                    </div>
                    <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                      {cat.name}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                View All Categories
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS SECTION
          ================================================================ */}
      {/* ================================================================
          HOW IT WORKS SECTION
          ================================================================ */}
      <section className="py-16 md:py-24 bg-card/40 border-y border-border">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              How LocalWork Works
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Getting quality service is simple. Here&apos;s how it works in four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center relative">
                {/* Connector line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[1px] bg-border" />
                )}
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 border border-primary/25 text-indigo-400 mb-4 relative shadow-md shadow-primary/10">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-gradient-to-r from-primary to-teal text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-text mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TRUST & SAFETY SECTION
          ================================================================ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Trust & Safety First
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We take trust seriously. Our platform is designed to protect both customers and professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature) => (
              <Card key={feature.title} className="text-center p-6 bg-card/80 border-border hover:border-primary/40">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal/15 text-purple-300 border border-teal/20 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA SECTION
          ================================================================ */}
      <section className="py-16 md:py-24">
        <div className="page-container">
          <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-10 md:p-16 text-center border border-primary/40 shadow-2xl shadow-primary/20 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Are You a Service Professional?
              </h2>
              <p className="text-lg text-slate-300 max-w-xl mx-auto mb-8">
                Join LocalWork to showcase your craft, reach verified local clients, and scale your business with zero lead bidding fees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register/professional">
                  <Button
                    size="lg"
                    className="bg-white text-navy font-bold hover:bg-slate-100 shadow-xl shadow-white/10 hover:scale-[1.02]"
                  >
                    Join as a Professional
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
