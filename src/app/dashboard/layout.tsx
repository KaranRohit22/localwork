"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ClipboardList,
  Heart,
  Star,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getCurrentUserProfileAction, signOutUserAction } from "@/app/actions/auth";
import { Profile } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "My Profile & Activity", icon: User },
  { href: "/dashboard/requests", label: "My Requests", icon: ClipboardList },
  { href: "/dashboard/favorites", label: "Saved Pros", icon: Heart },
  { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;
    getCurrentUserProfileAction().then((res) => {
      if (isMounted && res.profile) {
        setProfile(res.profile);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    await signOutUserAction();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
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
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-200 md:static md:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Logo />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-text-muted hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Pill */}
        <div className="px-6 py-3 bg-card-elevated/40 border-b border-border">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Customer Portal
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
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

        {/* Find a Pro shortcut */}
        <div className="p-4 border-t border-border">
          <Link
            href="/professionals"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary/10 border border-primary/25 text-indigo-300 text-xs font-semibold hover:bg-primary/20 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              Find a Professional
            </span>
            <ExternalLink className="h-3 w-3" />
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
            <h2 className="text-lg font-bold text-text">Customer Portal</h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/notifications"
              className="relative p-2 text-text-muted hover:text-text hover:bg-input-bg rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <Avatar
                src={profile?.avatar_url || undefined}
                alt={profile?.full_name || "Customer"}
                size="sm"
              />
              <span className="text-sm font-semibold text-text">
                {profile?.full_name || "Customer"}
              </span>
            </Link>
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
