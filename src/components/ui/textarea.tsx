import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-xl border border-border bg-input-bg px-3.5 py-2 text-sm text-text placeholder:text-text-muted transition-all duration-200 resize-y",
            "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-card",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus:ring-error/30 focus:border-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
