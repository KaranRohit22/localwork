import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-light text-indigo-300 border border-primary/25",
        secondary: "bg-card-elevated text-text-secondary border border-border",
        success: "bg-success-light text-emerald-400 border border-emerald-500/25",
        warning: "bg-warning-light text-amber-300 border border-amber-500/25",
        error: "bg-error-light text-rose-300 border border-rose-500/25",
        destructive: "bg-error-light text-rose-300 border border-rose-500/25",
        teal: "bg-teal-light text-purple-300 border border-purple-500/25",
        outline: "border border-border text-text-secondary bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}
