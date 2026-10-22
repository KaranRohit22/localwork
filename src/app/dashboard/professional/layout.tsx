"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  UserCheck,
  Image as ImageIcon,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const proNavItems = [
  { href: "/dashboard/professional", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/professional/requests", label: "Job Inquiries", icon: Inbox },
  { href: "/dashboard/professional/profile", label: "Business Profile", icon: UserCheck },
  { href: "/dashboard/professional/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/dashboard/professional/reviews", label: "Customer Reviews", icon: Star },
  { href: "/dashboard/professional/settings", label: "Settings", icon: Settings },
];

export default function ProfessionalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-40">
        <Logo />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-input-bg"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-navy text-white flex flex-col transition-transform duration-200 md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white">
              Local<span className="text-primary">Work</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal/20 text-teal px-2 py-0.5 rounded-full">
              Pro
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pro Status Summary */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/70">Availability</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                isAvailable ? "bg-success" : "bg-white/20"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  isAvailable ? "translate-x-4" : "translate-x-0"
                )}
              />
            </button>
          </div>
          <div className="text-[11px] text-white/50 flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isAvailable ? "bg-success" : "bg-white/40"
              )}
            />
            {isAvailable ? "Accepting new jobs" : "Paused / Booked"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {proNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard/professional"
                ? pathname === "/dashboard/professional"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Public Profile Link */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/professionals/pro-1"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 text-white text-xs font-semibold hover:bg-white/15 transition-colors"
          >
            <span>View Public Profile</span>
            <ExternalLink className="h-3.5 w-3.5 text-white/60" />
          </Link>
        </div>

        {/* Footer with sign out */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error-light/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-text">Pro Business Portal</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal-light px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Pro
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="Marcus Vance"
              size="sm"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-text leading-none">Marcus Vance</p>
              <p className="text-[11px] text-text-muted mt-0.5">Master Electrician</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
