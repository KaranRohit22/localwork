import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer text-sm active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-teal text-white hover:opacity-95 shadow-md shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01]",
        secondary:
          "bg-card-elevated border border-border text-text hover:bg-card hover:border-border-hover shadow-sm",
        outline:
          "border border-border bg-card/60 backdrop-blur-sm text-text hover:bg-card hover:border-border-hover hover:text-white",
        ghost: "text-text-secondary hover:bg-card hover:text-text",
        destructive: "bg-error text-white hover:bg-rose-600 shadow-md shadow-error/20",
        link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
        success: "bg-success text-white hover:bg-emerald-600 shadow-md shadow-success/20",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-5",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
