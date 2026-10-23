import Link from "next/link";
import {
  UserCheck,
  FileCheck,
  Lock,
  Flag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Trust & Safety | LocalWork",
  description:
    "How LocalWork protects customers and service professionals with identity verification, authentic reviews, and proactive moderation.",
};

export default function TrustSafetyPage() {
  const safetyPillars = [
    {
      icon: UserCheck,
      title: "1. Identity & License Screening",
      desc: "Before a professional can receive the Verified badge, our team screens government-issued ID, professional licensing where required by state law, and verified business background information.",
    },
    {
      icon: FileCheck,
      title: "2. Zero Fake Reviews",
      desc: "On LocalWork, a review can only be posted by a customer with an accepted and completed service request. There are zero anonymous reviews and zero paid endorsements allowed.",
    },
    {
      icon: Lock,
      title: "3. Privacy & Secure Comms",
      desc: "Your full address and personal contact phone number are only shared with the professional you explicitly choose to hire. We never sell your personal data to third-party telemarketers.",
    },
    {
      icon: Flag,
      title: "4. Rapid Community Moderation",
      desc: "Both customers and professionals can flag inappropriate activity, inaccurate listings, or unsafe conduct. Every report is manually investigated by our trust team within 24 hours.",
    },
  ];

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container max-w-5xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider uppercase text-teal bg-teal-light px-3 py-1 rounded-full">
            Our Commitment
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-navy mt-4">
            Trust & Community Safety
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary leading-relaxed">
            Inviting someone into your home or providing services to a new customer requires mutual trust. Here is how LocalWork guarantees platform integrity.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {safetyPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-border shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-teal-light text-teal flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">{p.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Tips for Customers */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-border shadow-card mb-16 space-y-6">
          <h2 className="text-2xl font-bold text-navy">
            Recommended Practices When Hiring
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-text-secondary">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
              <span>Always verify the professional&apos;s portfolio photos and scope of work.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
              <span>Confirm written estimates and timelines in the service request description.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
              <span>Never send wire transfers or untraceable gift cards as deposits.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal shrink-0 mt-0.5" />
              <span>Submit a review after completion to guide your fellow neighbors.</span>
            </div>
          </div>
        </div>

        {/* Report / Help banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-center bg-gradient-to-r from-card via-card-elevated to-card border border-primary/30 shadow-2xl shadow-primary/10">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-text mb-2">Have a Trust or Safety Concern?</h3>
            <p className="text-text-muted text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              If you ever encounter suspicious behavior, report the profile directly or contact our safety team immediately.
            </p>
            <Link href="/contact">
              <Button size="lg" className="font-semibold px-8 shadow-lg shadow-primary/25">
                Contact Safety Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
