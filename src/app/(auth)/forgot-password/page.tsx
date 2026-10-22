"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validations";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setServerError(error.message);
        return;
      }

      setIsSubmitted(true);
    } catch {
      // Fallback for offline demo
      setIsSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="h-14 w-14 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-text">Check Your Email</h2>
            <p className="text-sm text-text-secondary">
              If an account exists with that email address, we have sent a secure password reset link. Please check your inbox and spam folder.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-text">Reset Password</h1>
              <p className="text-sm text-text-secondary mt-1">
                Enter your email address to receive password reset instructions.
              </p>
            </div>

            {serverError && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-error-light text-error text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                label="Email Address"
                error={errors.email?.message}
                required
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <Input
                    type="email"
                    className="pl-9"
                    placeholder="you@example.com"
                    {...register("email")}
                    error={!!errors.email}
                  />
                </div>
              </FormField>

              <Button
                type="submit"
                className="w-full py-2.5 font-semibold"
                isLoading={isSubmitting}
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
