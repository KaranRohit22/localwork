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
          "relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-teal text-white shadow-md shadow-primary/30 transition-all duration-200 group-hover:scale-105 group-hover:shadow-primary/50",
          sizeClasses[size]
        )}
      >
        <MapPin className="h-[58%] w-[58%]" strokeWidth={2.5} />
      </div>
      {showText && (
        <span
          className={cn(
            "font-extrabold tracking-tight text-text",
            textSizeClasses[size]
          )}
        >
          Local<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal font-black">Work</span>
        </span>
      )}
    </Link>
  );
}
