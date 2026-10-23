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
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
        <Logo />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-card-elevated"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border text-text flex flex-col transition-transform duration-200 md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal">Work</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal/15 text-purple-300 border border-teal/20 px-2 py-0.5 rounded-full">
              Pro
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pro Status Summary */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-card-elevated/60 border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-secondary">Availability</span>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                isAvailable ? "bg-success" : "bg-card-elevated"
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
          <div className="text-[11px] text-text-muted flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isAvailable ? "bg-success" : "bg-text-muted"
              )}
            />
            {isAvailable ? "Accepting new jobs" : "Paused / Booked"}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
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
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-teal text-white shadow-md shadow-primary/25 font-semibold"
                    : "text-text-secondary hover:text-white hover:bg-card-elevated"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* View Public Profile Link */}
        <div className="p-4 border-t border-border">
          <Link
            href="/professionals/pro-1"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card-elevated text-text text-xs font-semibold hover:text-white hover:bg-card-elevated/80 border border-border transition-colors"
          >
            <span>View Public Profile</span>
            <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
          </Link>
        </div>

        {/* Footer with sign out */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-error-light/30 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-card/60 backdrop-blur-md border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-text">Pro Business Portal</h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 bg-teal/15 border border-teal/20 px-2.5 py-0.5 rounded-full">
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
