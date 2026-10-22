import { MapPin } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 group", className)}
      aria-label="LocalWork Home"
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-primary text-white transition-transform duration-200 group-hover:scale-105",
          sizeClasses[size]
        )}
      >
        <MapPin className="h-[60%] w-[60%]" strokeWidth={2.5} />
      </div>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight text-navy",
            textSizeClasses[size]
          )}
        >
          Local<span className="text-primary">Work</span>
        </span>
      )}
    </Link>
  );
}
