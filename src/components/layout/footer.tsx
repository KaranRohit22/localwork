"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const footerLinks = {
  platform: [
    { href: "/professionals", label: "Find Professionals" },
    { href: "/categories", label: "Service Categories" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/register/professional", label: "Become a Pro" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/trust-safety", label: "Trust & Safety" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card/80 border-t border-border/80 backdrop-blur-md text-text-muted mt-auto relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-primary/10 blur-3xl pointer-events-none rounded-full" />
      <div className="page-container py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-sm text-text-muted max-w-xs mb-6">
              Connecting customers with trusted local professionals. Find the
              right expert for every job.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@localwork.app</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; 2026 LocalWork. All rights reserved.
          </p>
          <p className="text-xs text-text-muted/60">
            Built with trust, transparency, and care.
          </p>
        </div>
      </div>
    </footer>
  );
}
