"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Briefcase,
  Star,
  ShieldCheck,
  UserCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"customers" | "pros">("customers");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const customerSteps = [
    {
      step: "01",
      icon: Search,
      title: "Discover Local Experts",
      description:
        "Enter what you need done and your location. Filter through verified professionals by category, rating, experience, and hourly rate.",
    },
    {
      step: "02",
      icon: Star,
      title: "Review Transparent Profiles",
      description:
        "Browse past work portfolios, credentials, and genuine reviews from verified customers who completed actual jobs.",
    },
    {
      step: "03",
      icon: Briefcase,
      title: "Submit Your Service Request",
      description:
        "Describe your project needs, your preferred timeline, and your estimated budget directly to your chosen professional.",
    },
    {
      step: "04",
      icon: CheckCircle2,
      title: "Job Done & Verified Review",
      description:
        "Your pro reviews and confirms the job. Once completed satisfactorily, submit a verified rating to help your local community.",
    },
  ];

  const proSteps = [
    {
      step: "01",
      icon: UserCheck,
      title: "Build Your Professional Profile",
      description:
        "Highlight your skills, service radius, hourly rate, and upload high-resolution photos of your best completed projects.",
    },
    {
      step: "02",
      icon: ShieldCheck,
      title: "Get Verified & Build Trust",
      description:
        "Our team reviews your credentials and business details to award you the verified pro badge that attracts 3x more bookings.",
    },
    {
      step: "03",
      icon: Briefcase,
      title: "Receive Direct Inquiries",
      description:
        "No wasteful pay-per-lead charges. Customers in your local area reach out directly with real job scopes and defined budgets.",
    },
    {
      step: "04",
      icon: Star,
      title: "Complete Jobs & Grow Reputation",
      description:
        "Accept requests that fit your schedule, complete quality work, and collect authentic 5-star reviews to rank at the top.",
    },
  ];

  const faqs = [
    {
      q: "Is LocalWork free for customers?",
      a: "Yes! Searching for professionals, comparing portfolios, reading reviews, and submitting service requests is 100% free for homeowners and customers.",
    },
    {
      q: "How are professionals verified?",
      a: "Every professional undergoes credential, license, and identity verification before receiving our Verified badge. Our moderation team manually reviews submissions to ensure platform integrity.",
    },
    {
      q: "Does LocalWork charge professionals per lead?",
      a: "No! Unlike legacy lead generation platforms that charge pros just to open a message, LocalWork is designed to connect clients directly without deceptive lead auction fees.",
    },
    {
      q: "Who can write a review?",
      a: "Only customers with an accepted and completed service request can submit a review for a professional. This strictly prevents fake or competitor reviews.",
    },
  ];

  const activeSteps = activeTab === "customers" ? customerSteps : proSteps;

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="page-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary-light px-3 py-1 rounded-full">
            Simple & Transparent Process
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-text mt-4">
            How LocalWork Operates
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-secondary">
            Whether you need a licensed plumber or are an artisan growing your client base, LocalWork makes local commerce transparent and reliable.
          </p>

          {/* Tab Selector */}
          <div className="mt-8 inline-flex p-1.5 bg-card border border-border rounded-2xl shadow-inner">
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "customers"
                  ? "bg-gradient-to-r from-primary to-teal text-white shadow-lg shadow-primary/25 font-bold"
                  : "text-text-muted hover:text-text"
              }`}
            >
              For Customers
            </button>
            <button
              onClick={() => setActiveTab("pros")}
              className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === "pros"
                  ? "bg-gradient-to-r from-primary to-teal text-white shadow-lg shadow-primary/25 font-bold"
                  : "text-text-muted hover:text-text"
              }`}
            >
              For Service Professionals
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {activeSteps.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.step}
                className="p-6 relative overflow-hidden border-border transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-card-hover group"
              >
                <div className="text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-4 select-none">
                  {item.step}
                </div>

                <div className="h-12 w-12 rounded-xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-bold text-text mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              Everything you need to know about the platform
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-border bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-semibold text-text text-sm sm:text-base hover:bg-input-bg/40 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to experience better local services?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto text-sm md:text-base mb-6">
            Join thousands of neighbors and verified craftsmen who trust LocalWork every day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/professionals">
              <Button size="lg" className="w-full sm:w-auto font-semibold">
                Find a Professional
              </Button>
            </Link>
            <Link href="/register/professional">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
              >
                Join as a Professional
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
