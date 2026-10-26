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

function persistAdminSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("localwork_admin_authorized", "true");
    localStorage.setItem("localwork_admin_authorized", "true");
    document.cookie =
      "localwork_admin_authorized=true; path=/; max-age=86400; SameSite=Lax";
  }
}

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
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const emailLower = data.email.trim().toLowerCase();
      const isAdminAccount =
        emailLower === "admin@localwork.app" || emailLower === "admin";
      const isMasterPass =
        data.password === "Admin@12345" ||
        data.password === "LocalWorkAdmin2026!" ||
        data.password.toLowerCase() === "admin@12345";

      // 1. Private Master Administrator Direct Access
      if (isAdminAccount) {
        if (isMasterPass) {
          persistAdminSession();
          router.push("/admin");
          router.refresh();
          return;
        } else {
          setError(
            "Invalid administrator password. Access restricted. (Key: Admin@12345)"
          );
          return;
        }
      }

      // 2. In local / demo mode without active Supabase connection:
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url || url.includes("placeholder-project")) {
        if (
          emailLower.includes("marcus") ||
          emailLower.includes("pro")
        ) {
          router.push("/dashboard/professional");
          router.refresh();
          return;
        }

        router.push(redirectTo);
        router.refresh();
        return;
      }

      // 3. Authenticate with Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
      });

      if (authError) {
        const msg = authError.message.toLowerCase();
        if (msg.includes("email not confirmed")) {
          setError(
            "Your email is not confirmed yet. Please verify your email inbox or disable 'Confirm email' under Supabase Dashboard -> Authentication -> Providers -> Email."
          );
        } else if (msg.includes("invalid login credentials")) {
          setError(
            "Invalid email or password. If you haven't created this account yet, please click 'Sign up' below first."
          );
        } else if (msg.includes("fetch")) {
          setError(
            "Unable to reach Supabase. Please check your internet connection or Vercel environment variables."
          );
        } else {
          setError(authError.message);
        }
        return;
      }

      // 4. Determine user role and redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let targetDestination = redirectTo;
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin") {
          persistAdminSession();
          targetDestination = "/admin";
        } else if (profile?.role === "professional") {
          targetDestination = "/dashboard/professional";
        } else {
          targetDestination = redirectTo;
        }
      }

      router.push(targetDestination);
      router.refresh();
    } catch {
      setError("An unexpected error occurred during sign in. Please try again.");
    }
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
