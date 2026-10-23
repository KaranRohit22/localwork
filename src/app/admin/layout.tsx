"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Layers,
  Flag,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const adminNavItems = [
  { href: "/admin", label: "KPI Overview", icon: LayoutDashboard },
  { href: "/admin/verification", label: "Verification Queue", icon: ShieldCheck, badge: "1" },
  { href: "/admin/users", label: "User Directory", icon: Users },
  { href: "/admin/categories", label: "Service Categories", icon: Layers },
  { href: "/admin/reports", label: "Moderation Queue", icon: Flag },
  { href: "/admin/reviews", label: "Review Moderation", icon: Star },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-teal text-white shadow-md shadow-primary/25 font-semibold"
                    : "text-text-secondary hover:text-white hover:bg-card-elevated"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Public Site Shortcut */}
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-card-elevated text-text text-xs font-semibold hover:text-white hover:bg-card-elevated/80 border border-border transition-colors"
          >
            <span>Exit to Public Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-text-muted" />
          </Link>
        </div>

        {/* Sign Out */}
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
        {/* Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-card/60 backdrop-blur-md border-b border-border sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-text">System Administration</h2>
            <span className="text-xs bg-card-elevated border border-border text-text-secondary px-2.5 py-0.5 rounded-full font-medium">
              v1.0 Production
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
              alt="Admin"
              size="sm"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-text leading-none">Security Officer</p>
              <p className="text-[11px] text-text-muted mt-0.5">super_admin</p>
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
