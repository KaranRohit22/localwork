"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if configured
    console.error("LocalWork Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-error-light text-error flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="h-10 w-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-navy">
          Something went wrong
        </h1>

        <p className="text-text-secondary text-sm leading-relaxed">
          An unexpected error occurred while loading this page. Our technical team has been notified.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button onClick={() => reset()} className="w-full sm:w-auto font-semibold">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto font-semibold">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
