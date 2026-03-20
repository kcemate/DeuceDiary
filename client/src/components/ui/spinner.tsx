import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-b-2",
  md: "h-8 w-8 border-b-2",
  lg: "h-12 w-12 border-b-2",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-primary",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Full-page centered loading state */
export function PageSpinner({ minHeight = "min-h-64" }: { minHeight?: string }) {
  return (
    <div className={cn("flex items-center justify-center", minHeight)} role="status" aria-label="Loading">
      <Spinner />
    </div>
  );
}
