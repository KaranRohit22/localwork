"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { customerRegisterSchema, type CustomerRegisterInput } from "@/validations";
import { createClient } from "@/lib/supabase/client";

export default function CustomerRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerRegisterInput>({
    resolver: zodResolver(customerRegisterSchema),
  });

  const onSubmit = async (data: CustomerRegisterInput) => {
    setError(null);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isPlaceholder = !url || url.includes("placeholder-project");

      if (isPlaceholder) {
        // Fallback for preview/demo when Supabase credentials are not connected in Vercel
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "localwork_demo_user",
            JSON.stringify({
              id: "demo-cust-1",
              full_name: data.full_name,
              email: data.email,
              role: "customer",
            })
          );
        }
        setSuccess(true);
        return;
      }

      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: "customer",
          },
        },
      });

      if (authError) {
        if (authError.message.includes("Failed to fetch")) {
          setError(
            "Unable to reach Supabase. Please verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel settings and redeploy."
          );
        } else {
          setError(authError.message);
        }
        return;
      }

      // Update phone if provided
      if (data.phone) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("profiles")
            .update({ phone: data.phone })
            .eq("id", user.id);
        }
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("Failed to fetch") || message.includes("fetch")) {
        setError(
          "Connection failed: Supabase URL is unreachable. Please verify your Vercel Environment Variables."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md text-center">
        <Logo size="lg" className="justify-center mb-6" />
        <Card className="p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success-light text-success mb-4">
              <UserPlus className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">Account Created!</h2>
            <p className="text-text-secondary mb-6">
              Please check your email to verify your account, then sign in.
            </p>
            <Link href="/login">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <Logo size="lg" className="justify-center mb-6" />
        <h1 className="text-2xl font-bold text-navy">Create your account</h1>
        <p className="text-text-secondary mt-1">
          Join LocalWork to find trusted professionals
        </p>
      </div>

      <Card className="p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-error-light text-error text-sm">
              {error}
            </div>
          )}

          <FormField label="Full Name" htmlFor="full_name" error={errors.full_name?.message} required>
            <Input
              id="full_name"
              placeholder="John Doe"
              autoComplete="name"
              {...register("full_name")}
            />
          </FormField>

          <FormField label="Email" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
            />
          </FormField>

          <FormField label="Phone (optional)" htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
              {...register("phone")}
            />
          </FormField>

          <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <FormField
            label="Confirm Password"
            htmlFor="confirm_password"
            error={errors.confirm_password?.message}
            required
          >
            <Input
              id="confirm_password"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("confirm_password")}
            />
          </FormField>

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            <UserPlus className="h-4 w-4" />
            Create Account
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </div>
      <div className="mt-2 text-center text-sm text-text-secondary">
        <Link href="/register/professional" className="font-medium text-teal hover:text-teal-hover">
          Register as a Professional →
        </Link>
      </div>
    </div>
  );
}
