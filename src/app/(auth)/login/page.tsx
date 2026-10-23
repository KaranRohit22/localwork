"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/validations";
import { createClient } from "@/lib/supabase/client";

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      // In demo / local mode without Supabase connection, allow instant demo login
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url || url.includes("placeholder-project")) {
        if (data.email.toLowerCase().includes("admin")) {
          router.push("/admin");
          return;
        }
        if (
          data.email.toLowerCase().includes("marcus") ||
          data.email.toLowerCase().includes("pro")
        ) {
          router.push("/dashboard/professional");
          return;
        }
        router.push(redirectTo);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      // Get user role for redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          router.push("/admin");
        } else if (profile?.role === "professional") {
          router.push("/dashboard/professional");
        } else {
          router.push(redirectTo);
        }
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleQuickDemo = (emailVal: string, passVal: string, targetPath: string) => {
    setValue("email", emailVal);
    setValue("password", passVal);
    setError(null);
    router.push(targetPath);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Logo size="lg" className="justify-center mb-6" />
        <h1 className="text-2xl font-bold text-navy">Welcome back</h1>
        <p className="text-text-secondary mt-1">
          Sign in to your LocalWork account
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-error-light text-error text-sm">
              {error}
            </div>
          )}

          <FormField
            label="Email"
            htmlFor="email"
            error={errors.email?.message}
            required
          >
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            required
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>

          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-border">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider text-center mb-3">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("admin@localwork.app", "Admin@12345", "/admin")}
              className="p-2.5 rounded-xl bg-card-elevated hover:bg-card border border-border hover:border-primary/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-text group-hover:text-primary">👑 Admin</div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">admin@localwork.app</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("marcus.vance@localwork.app", "Pro@12345", "/dashboard/professional")}
              className="p-2.5 rounded-xl bg-card-elevated hover:bg-card border border-border hover:border-teal/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-text group-hover:text-teal">🔧 Pro</div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">marcus.vance@...</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("sarah.miller@gmail.com", "Customer@12345", "/dashboard")}
              className="p-2.5 rounded-xl bg-card-elevated hover:bg-card border border-border hover:border-amber/50 text-center transition-all group"
            >
              <div className="text-xs font-bold text-text group-hover:text-amber">👤 Customer</div>
              <div className="text-[10px] text-text-muted truncate mt-0.5">sarah.miller@...</div>
            </button>
          </div>
        </div>
      </Card>

      <div className="mt-6 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-hover transition-colors"
        >
          Create an account
        </Link>
      </div>
      <div className="mt-2 text-center text-sm text-text-secondary">
        <Link
          href="/register/professional"
          className="font-medium text-teal hover:text-teal-hover transition-colors"
        >
          Register as a Professional →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md mx-auto py-8 text-center text-text-muted">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
