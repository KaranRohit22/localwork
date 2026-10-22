import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  description?: string;
  helper?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  required,
  description,
  helper,
  className,
  children,
}: FormFieldProps) {
  const infoText = description || helper;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-text"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      {infoText && (
        <p className="text-xs text-text-muted">{infoText}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
