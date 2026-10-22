"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

const publicLinks = [
  { href: "/professionals", label: "Find Professionals" },
  { href: "/categories", label: "Categories" },
  { href: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", authUser.id)
            .single();
          setUser(profile);
        }
      } catch {
        // Not authenticated
      } finally {
        setIsLoading(false);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
        } else if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setUser(profile);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
    router.push("/");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "professional"
      ? "/dashboard/professional"
      : "/dashboard";

  // Close mobile menu on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
      setIsDropdownOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-user-dropdown]")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav className="page-container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-text hover:bg-input-bg"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search button (mobile) */}
            <Link
              href="/professionals"
              className="md:hidden p-2 text-text-secondary hover:text-text rounded-lg hover:bg-input-bg transition-colors"
              aria-label="Search professionals"
            >
              <Search className="h-5 w-5" />
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <Link
                      href={`${dashboardLink}/notifications`}
                      className="relative p-2 text-text-secondary hover:text-text rounded-lg hover:bg-input-bg transition-colors"
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5" />
                    </Link>

                    {/* User dropdown */}
                    <div className="relative" data-user-dropdown>
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-input-bg transition-colors"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                      >
                        <Avatar
                          src={user.avatar_url}
                          alt={user.full_name}
                          size="sm"
                        />
                        <span className="hidden lg:block text-sm font-medium text-text max-w-[120px] truncate">
                          {user.full_name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "hidden lg:block h-4 w-4 text-text-muted transition-transform",
                            isDropdownOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-border shadow-dropdown py-1 animate-fade-in">
                          <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-medium text-text truncate">
                              {user.full_name}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {user.email}
                            </p>
                          </div>
                          <Link
                            href={dashboardLink}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-input-bg transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href={`${dashboardLink}/settings`}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-secondary hover:text-text hover:bg-input-bg transition-colors"
                          >
                            <User className="h-4 w-4" />
                            Account Settings
                          </Link>
                          <div className="border-t border-border my-1" />
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error-light transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register/professional">
                      <Button size="sm">Join as Pro</Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text rounded-lg hover:bg-input-bg transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary-light"
                      : "text-text-secondary hover:text-text hover:bg-input-bg"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <>
                  <div className="border-t border-border my-2" />
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register/professional" className="mt-1">
                    <Button className="w-full">Join as Professional</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
