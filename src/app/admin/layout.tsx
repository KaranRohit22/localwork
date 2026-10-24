"use client";

import { useState, useEffect } from "react";
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
  Lock,
  KeyRound,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const [showPasskey, setShowPasskey] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [unlockSuccess, setUnlockSuccess] = useState<boolean>(false);
  const supabase = createClient();

  // Validate admin authorization on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // 1. Check local session storage key
        const storedAuth =
          typeof window !== "undefined"
            ? sessionStorage.getItem("localwork_admin_authorized") ||
              localStorage.getItem("localwork_admin_authorized")
            : null;

        if (storedAuth === "true") {
          setIsAuthorized(true);
          setIsChecking(false);
          return;
        }

        // 2. Check Supabase authenticated role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile?.role === "admin") {
            setIsAuthorized(true);
            sessionStorage.setItem("localwork_admin_authorized", "true");
            setIsChecking(false);
            return;
          }
        }
      } catch {
        // Access restricted
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminStatus();
  }, [supabase]);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const input = passkeyInput.trim();

    // Helpful check if user typed an email address instead of the security passkey
    if (input.toLowerCase().includes("@localwork.app") || input.toLowerCase() === "admin") {
      setAuthError("You entered an email. Please enter the Master Security Key: Admin@12345 or LocalWorkAdmin2026!");
      return;
    }

    // Private Admin Passkey Verification (Case-tolerant & supports default keys)
    const masterKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "LocalWorkAdmin2026!";
    if (
      input === masterKey ||
      input === "Admin@12345" ||
      input.toLowerCase() === "admin@12345" ||
      input.toLowerCase() === "localworkadmin2026!"
    ) {
      setUnlockSuccess(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("localwork_admin_authorized", "true");
        localStorage.setItem("localwork_admin_authorized", "true");
      }
      setTimeout(() => {
        setIsAuthorized(true);
        setUnlockSuccess(false);
      }, 500);
    } else {
      setAuthError("Access denied. Incorrect administrator security key. (Key: Admin@12345)");
    }
  };

  const handleSignOut = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("localwork_admin_authorized");
      localStorage.removeItem("localwork_admin_authorized");
    }
    await supabase.auth.signOut();
    setIsAuthorized(false);
    router.push("/");
  };

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted">Verifying administrative security credentials...</p>
        </div>
      </div>
    );
  }

  // Restricted Access Challenge Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-black text-text tracking-tight">
              Private Administrator Console
            </h1>
            <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
              This area is strictly restricted to platform administrators. Please authenticate with your master security key.
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-card space-y-5 backdrop-blur-md">
            {authError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-error-light/30 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {unlockSuccess && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Security key verified. Granting console access...</span>
              </div>
            )}

            <form onSubmit={handleUnlockAdmin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Administrator Master Key
                </label>
                <div className="relative">
                  <Input
                    type={showPasskey ? "text" : "password"}
                    placeholder="Enter security key..."
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    required
                    autoFocus
                    className="pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPasskey(!showPasskey)}
                      className="text-text-muted hover:text-text transition-colors p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPasskey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <KeyRound className="h-4 w-4 text-text-muted pointer-events-none" />
                  </div>
                </div>
                <p className="text-[11px] text-text-muted">
                  Default Key: <code className="text-primary font-mono font-semibold">Admin@12345</code> or <code className="text-primary font-mono font-semibold">LocalWorkAdmin2026!</code>
                </p>
              </div>

              <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20">
                Unlock Admin Console
              </Button>
            </form>

            <div className="pt-2 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <span>Lock & Sign Out</span>
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
