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

/**
 * Creates a standard onError handler for useMutation callbacks.
 * Handles 401 auth errors (session expired) and shows a destructive toast.
 *
 * @param toast - toast function from useToast()
 * @param description - error description string, or a function receiving the error
 * @param title - toast title (defaults to "Error")
 */
/** Parse a raw API error message (e.g. `409: {"message":"..."}`) into a clean user-facing string. */
function cleanApiMessage(raw: string): string {
  // Try extracting JSON message after status code prefix ("409: {...}")
  const colonIdx = raw.indexOf(": ");
  if (colonIdx !== -1) {
    const afterStatus = raw.slice(colonIdx + 2).trim();
    try {
      const parsed = JSON.parse(afterStatus);
      if (parsed.message) return parsed.message;
    } catch { /* not JSON, fall through */ }
  }
  // Try parsing the whole string as JSON
  try {
    const parsed = JSON.parse(raw);
    if (parsed.message) return parsed.message;
  } catch { /* not JSON */ }
  return raw;
}

export function mutationErrorHandler(
  toast: ToastFn,
  description: string | ((error: Error) => string),
  title = "Error",
) {
  return (error: Error) => {
    if (handleAuthError(error, toast)) return;
    const desc = typeof description === "function" ? description(error) : description;
    toast({
      title,
      description: cleanApiMessage(desc),
      variant: "destructive",
    });
  };
}
