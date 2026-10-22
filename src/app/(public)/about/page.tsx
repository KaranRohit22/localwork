import Link from "next/link";
import { Shield, HeartHandshake, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | LocalWork",
  description:
    "Learn about LocalWork's mission to connect homeowners with verified local service professionals with honesty and transparency.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Integrity & Verification",
      desc: "We rigorously verify professional credentials so homeowners can hire with complete peace of mind.",
    },
    {
      icon: HeartHandshake,
      title: "Fair For Craftsmen",
      desc: "No aggressive lead bidding wars. Professionals work directly with clients on their own transparent terms.",
    },
    {
      icon: Award,
      title: "Genuine Accountability",
      desc: "Only customers with completed bookings can leave reviews, creating a truthful standard for service quality.",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container max-w-5xl">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary-light px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text mt-4">
            Rebuilding Trust in Local Services
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary leading-relaxed">
            LocalWork was founded to solve the broken home services market. We bridge neighbors with skilled, licensed professionals through transparency, verified work, and direct communication.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20 bg-white rounded-3xl p-8 md:p-12 border border-border shadow-card">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-navy">
              Why We Built LocalWork
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              Finding reliable home repair used to mean gambling on unverified directory sites or dealing with aggressive lead-generation middlemen who charged contractors hundreds just to answer an inquiry.
            </p>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              We asked: <em>What if the marketplace aligned incentives for both parties?</em> What if customers could browse verified credentials and real photos of past work, while local craftsmen could build an honest, lasting reputation without paying per click?
            </p>
            <div className="pt-2">
              <Link href="/professionals">
                <Button>Explore Directory</Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 via-teal/10 to-navy/10 rounded-2xl p-8 border border-border/80">
            <h3 className="text-lg font-bold text-navy mb-4">Our Platform By The Numbers</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-extrabold text-primary">100%</p>
                <p className="text-xs text-text-secondary mt-1">Manually verified tradespeople</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-teal">0$</p>
                <p className="text-xs text-text-secondary mt-1">Lead fees charged to pros</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-navy">4.9/5</p>
                <p className="text-xs text-text-secondary mt-1">Average verified job satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-amber">12+</p>
                <p className="text-xs text-text-secondary mt-1">Specialized service categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-text mb-10">
            Principles We Stand By
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl border border-border shadow-card flex flex-col items-center text-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-text mb-2">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
