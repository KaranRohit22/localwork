import Link from "next/link";
import { Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-24 w-24 rounded-3xl bg-primary-light text-primary flex items-center justify-center mx-auto shadow-sm">
          <span className="text-4xl font-extrabold">404</span>
        </div>

        <h1 className="text-3xl font-extrabold text-navy">
          Page Not Found
        </h1>

        <p className="text-text-secondary text-sm leading-relaxed">
          The page or professional you are looking for doesn&apos;t exist, has been moved, or is temporarily unavailable.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="w-full sm:w-auto font-semibold">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </Button>
          </Link>
          <Link href="/professionals">
            <Button variant="outline" className="w-full sm:w-auto font-semibold">
              <Search className="h-4 w-4 mr-2" />
              Find Professionals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
