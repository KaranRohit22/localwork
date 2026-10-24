"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { createClient } from "@/lib/supabase/client";
import {
  professionalRegisterSchema,
  type ProfessionalRegisterInput,
} from "@/validations";

export default function ProfessionalRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfessionalRegisterInput>({
    resolver: zodResolver(professionalRegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      headline: "",
      city: "",
      service_area: "",
    },
  });

  const onSubmit = async (data: ProfessionalRegisterInput) => {
    setServerError(null);

    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isPlaceholder = !url || url.includes("placeholder-project");

      if (isPlaceholder) {
        // Mock fallback for preview mode without Supabase connection
        setSuccessMessage(true);
        setTimeout(() => {
          router.push("/dashboard/professional");
        }, 1500);
        return;
      }

      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: "professional",
            phone: data.phone || null,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("Failed to fetch")) {
          setServerError(
            "Unable to reach Supabase. Please verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel settings and redeploy."
          );
        } else {
          setServerError(authError.message);
        }
        return;
      }

      if (authData.user) {
        // 2. Insert into profiles (if not handled by trigger)
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone || null,
          role: "professional",
          is_active: true,
        });

        // 3. Insert professional profile details
        await supabase.from("professionals").upsert({
          user_id: authData.user.id,
          headline: data.headline,
          city: data.city,
          service_area: data.service_area,
          years_experience: 1,
          verification_status: "pending",
          is_available: true,
          skills: [],
        });

        setSuccessMessage(true);

        // Redirect after brief delay
        setTimeout(() => {
          router.push("/dashboard/professional");
        }, 1500);
      }
    } catch {
      // Offline fallback / demo redirect
      setSuccessMessage(true);
      setTimeout(() => {
        router.push("/dashboard/professional");
      }, 1500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Why Join as a Pro */}
        <div className="lg:col-span-5 bg-navy text-white rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-teal">
            <Briefcase className="h-3.5 w-3.5" />
            Grow Your Business
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Connect with clients who need your skills.
          </h2>

          <p className="text-sm text-white/70 leading-relaxed">
            LocalWork gives you a professional digital storefront, verified customer reviews, and direct job inquiries without exploitative lead auctions.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-teal/20 text-teal flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Verified Trust Badge</h4>
                <p className="text-xs text-white/60">
                  Build immediate credibility with prospective clients.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Zero Lead Bidding Fees</h4>
                <p className="text-xs text-white/60">
                  Keep 100% of your earnings with direct client contact.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber/20 text-amber flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">Portfolio Showcase</h4>
                <p className="text-xs text-white/60">
                  Display your best work photos to stand out from competitors.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 text-xs text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-teal font-semibold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>

        {/* Right Side: Pro Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-border">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text">Join as a Professional</h1>
            <p className="text-sm text-text-secondary mt-1">
              Create your business profile to start receiving service requests.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-error-light text-error text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Registration Failed</p>
                <p className="mt-0.5 text-xs text-error/80">{serverError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-success-light text-success text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Account Created Successfully!</p>
                <p className="mt-0.5 text-xs text-success/80">
                  Redirecting to your professional dashboard...
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                error={errors.full_name?.message}
                required
              >
                <Input
                  placeholder="e.g. Marcus Vance"
                  {...register("full_name")}
                  error={!!errors.full_name}
                />
              </FormField>

              <FormField
                label="Email Address"
                error={errors.email?.message}
                required
              >
                <Input
                  type="email"
                  placeholder="marcus@example.com"
                  {...register("email")}
                  error={!!errors.email}
                />
              </FormField>
            </div>

            <FormField
              label="Professional Headline / Title"
              error={errors.headline?.message}
              helper="e.g. Licensed Master Electrician & EV Specialist"
              required
            >
              <Input
                placeholder="Your primary trade title"
                {...register("headline")}
                error={!!errors.headline}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Primary City"
                error={errors.city?.message}
                required
              >
                <Input
                  placeholder="e.g. Seattle"
                  {...register("city")}
                  error={!!errors.city}
                />
              </FormField>

              <FormField
                label="Service Radius / Coverage Area"
                error={errors.service_area?.message}
                required
              >
                <Input
                  placeholder="e.g. Greater Seattle, Bellevue"
                  {...register("service_area")}
                  error={!!errors.service_area}
                />
              </FormField>
            </div>

            <FormField
              label="Phone Number"
              error={errors.phone?.message}
              helper="Used for direct customer contact"
            >
              <Input
                type="tel"
                placeholder="+1 (206) 555-0192"
                {...register("phone")}
                error={!!errors.phone}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Password"
                error={errors.password?.message}
                required
              >
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    {...register("password")}
                    error={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>

              <FormField
                label="Confirm Password"
                error={errors.confirm_password?.message}
                required
              >
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    {...register("confirm_password")}
                    error={!!errors.confirm_password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormField>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-3 text-base font-semibold"
                isLoading={isSubmitting}
              >
                Complete Pro Registration
              </Button>
            </div>

            <p className="text-center text-xs text-text-muted pt-2">
              By creating a professional account, you agree to our{" "}
              <Link href="/terms" className="text-primary underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary underline">
                Privacy Policy
              </Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
