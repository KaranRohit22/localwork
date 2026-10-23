import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-input-bg px-3.5 py-2 text-sm text-text placeholder:text-text-muted transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-card",
            "disabled:cursor-not-allowed disabled:opacity-50",
            Boolean(error) && "border-error focus:ring-error/30 focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {typeof error === "string" && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
