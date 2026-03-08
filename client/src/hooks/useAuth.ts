import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useRef, useCallback } from "react";
import { setTokenGetter } from "@/lib/auth-token";
import type { User } from "@shared/schema";

const CLERK_ENABLED = true;

// ---------- dev mode ----------

function useDevAuth() {
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const isUnauthenticated = error && error.message?.includes("401");

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isUnauthenticated,
    error,
  };
}

// ---------- Clerk mode ----------

function useClerkAuthHook() {
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const { getToken } = useClerkAuth();
  const queryClient = useQueryClient();
  const prevSignedIn = useRef(false);

  // Keep global token getter in sync for apiRequest() calls elsewhere
  useEffect(() => {
    if (isSignedIn) {
      setTokenGetter(() => getToken());
    } else {
      setTokenGetter(null);
    }
    return () => setTokenGetter(null);
  }, [isSignedIn, getToken]);

  // Invalidate cache when sign-in state flips
  useEffect(() => {
    if (isLoaded && isSignedIn && !prevSignedIn.current) {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }
    prevSignedIn.current = !!isSignedIn;
  }, [isLoaded, isSignedIn, queryClient]);

  // Custom query function that gets the token DIRECTLY from Clerk
  // This avoids the race condition where the global token getter isn't set yet
  const fetchUser = useCallback(async (): Promise<User> => {
    const token = await getToken();
    if (!token) {
      throw new Error("401: No auth token available");
    }
    const res = await fetch("/api/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text}`);
    }
    return res.json();
  }, [getToken]);

  const { data: user, isLoading: appLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: fetchUser,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!isSignedIn && isLoaded,
  });

  // Debug logging (temporary)
  if (typeof window !== 'undefined') {
    const state = { isLoaded, isSignedIn: !!isSignedIn, appLoading, hasUser: !!user, error: error?.message ?? null };
    (window as any).__authDebug = state;
    console.log('[AUTH]', JSON.stringify(state));
  }

  return {
    user,
    isLoading: !isLoaded || (isSignedIn === true && appLoading),
    isAuthenticated: !!isSignedIn && !!user,
    error,
  };
}

// ---------- public API ----------

export const useAuth = CLERK_ENABLED ? useClerkAuthHook : useDevAuth;
