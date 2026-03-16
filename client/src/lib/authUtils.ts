export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

type ToastFn = (opts: { title: string; description?: string; variant?: "default" | "destructive" }) => void;

/**
 * Handles 401 unauthorized errors by showing a toast and redirecting to login.
 * Returns true if handled — callers should early-return when this returns true.
 */
export function handleAuthError(error: Error, toast: ToastFn): boolean {
  if (!isUnauthorizedError(error)) return false;
  toast({
    title: "Session expired",
    description: "You are logged out. Logging in again...",
    variant: "destructive",
  });
  setTimeout(() => {
    window.location.href = "/api/login";
  }, 500);
  return true;
}