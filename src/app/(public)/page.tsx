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
  { name: "Plumbing", slug: "plumbing", icon: "Wrench", color: "bg-blue-50 text-blue-600" },
  { name: "Electrical", slug: "electrical", icon: "Zap", color: "bg-amber-50 text-amber-600" },
  { name: "Carpentry", slug: "carpentry", icon: "Hammer", color: "bg-orange-50 text-orange-600" },
  { name: "Painting", slug: "painting", icon: "Paintbrush", color: "bg-purple-50 text-purple-600" },
  { name: "Cleaning", slug: "cleaning", icon: "Sparkles", color: "bg-teal-50 text-teal-600" },
  { name: "Landscaping", slug: "landscaping", icon: "Trees", color: "bg-green-50 text-green-600" },
  { name: "HVAC", slug: "hvac", icon: "Thermometer", color: "bg-red-50 text-red-600" },
  { name: "Roofing", slug: "roofing", icon: "Home", color: "bg-slate-100 text-slate-600" },
  { name: "Moving", slug: "moving", icon: "Truck", color: "bg-indigo-50 text-indigo-600" },
  { name: "Photography", slug: "photography", icon: "Camera", color: "bg-pink-50 text-pink-600" },
  { name: "Tutoring", slug: "tutoring", icon: "GraduationCap", color: "bg-cyan-50 text-cyan-600" },
  { name: "Pet Care", slug: "pet-care", icon: "PawPrint", color: "bg-yellow-50 text-yellow-700" },
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
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="page-container relative py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Shield className="h-4 w-4 text-teal" />
              <span className="text-sm text-white/80">Verified & Trusted Professionals</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Trusted Local{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal">
                Professionals
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Connect with verified experts in your area. From plumbing to photography,
              get quality service you can count on.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form action="/professionals" method="GET">
                <div className="flex flex-col sm:flex-row gap-3 bg-white rounded-xl p-2 shadow-modal">
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
                      placeholder="City or area"
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
      <section className="py-16 md:py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
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
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-light text-primary mb-4 relative">
                  <step.icon className="h-7 w-7" />
                  <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">
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
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Trust & Safety First
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We take trust seriously. Our platform is designed to protect both customers and professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature) => (
              <Card key={feature.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-teal-light text-teal mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-navy mb-2">
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Are You a Service Professional?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Join LocalWork to showcase your skills, reach new customers, and grow your local business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register/professional">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                Join as a Professional
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
