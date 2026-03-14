import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getAuthToken } from "./auth-token";
import { toast } from "@/hooks/use-toast";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/** Build auth headers — attaches Bearer token in Clerk mode, empty otherwise. */
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Default request timeout in milliseconds — 20s for mutations, 15s for queries. */
const REQUEST_TIMEOUT_MS = 20_000;

export async function apiRequest<T = unknown>(
  url: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
  }
): Promise<T> {
  const auth = await authHeaders();
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? REQUEST_TIMEOUT_MS,
  );

  try {
    const res = await fetch(url, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...auth,
        ...options?.headers,
      },
      body: options?.body,
      credentials: "include",
      signal: controller.signal,
    });

    await throwIfResNotOk(res);
    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`Request timed out after ${options?.timeoutMs ?? REQUEST_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
const QUERY_TIMEOUT_MS = 15_000;

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal: reactQuerySignal }) => {
    const auth = await authHeaders();

    // Combine React Query's own abort signal with a hard timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), QUERY_TIMEOUT_MS);
    // If React Query cancels the query, also abort ours
    reactQuerySignal?.addEventListener("abort", () => controller.abort());

    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
        headers: auth,
        signal: controller.signal,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // Don't surface timeout errors for cancelled queries (navigation away)
        if (reactQuerySignal?.aborted) throw err;
        throw new Error(`Query timed out after ${QUERY_TIMEOUT_MS}ms`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  };

/** Returns true if the error is a server error (5xx) or pure network failure. */
function isTransientError(error: unknown): boolean {
  if (error instanceof Error) {
    const match = error.message.match(/^(\d{3}):/);
    if (match) {
      const status = parseInt(match[1], 10);
      return status >= 500;
    }
    // No HTTP status = network/fetch failure
    return true;
  }
  return false;
}

/** Retry on network errors and 5xx responses; skip 4xx (auth/validation failures). */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 3) return false;
  if (error instanceof Error) {
    // Extract HTTP status from "NNN: ..." error messages produced by throwIfResNotOk
    const match = error.message.match(/^(\d{3}):/);
    if (match) {
      const status = parseInt(match[1], 10);
      // 4xx = client error, do not retry
      if (status >= 400 && status < 500) return false;
    }
    // Network errors (no status) or 5xx → retry
    return true;
  }
  return false;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
    mutations: {
      retry: false,
    },
  },
});

// Show a toast for transient server/network errors after all retries are exhausted.
// Only fires once per failure (not per retry attempt).
queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.action.error;
    if (isTransientError(error)) {
      toast({
        title: "Connection issue",
        description: "Couldn't reach the server. Check your connection and pull down to refresh.",
        variant: "destructive",
      });
    }
  }
});
