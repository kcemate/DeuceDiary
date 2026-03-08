import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
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
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const queryClient = useQueryClient();
  const prevSignedIn = useRef(false);
  const [tokenReady, setTokenReady] = useState(false);

  // Keep the token getter in sync so queryClient can attach Bearer headers
  // tokenReady gates the query so it doesn't fire before Bearer is available
  useEffect(() => {
    if (isSignedIn) {
      setTokenGetter(() => getToken());
      setTokenReady(true);
    } else {
      setTokenGetter(null);
      setTokenReady(false);
    }
    return () => setTokenGetter(null);
  }, [isSignedIn, getToken]);

  // When Clerk sign-in state changes, invalidate cached auth data
  // This busts any stale 401 errors from before the user signed in
  useEffect(() => {
    if (isLoaded && isSignedIn && !prevSignedIn.current) {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    }
    prevSignedIn.current = !!isSignedIn;
  }, [isLoaded, isSignedIn, queryClient]);

  // Fetch app-specific user data — only after token getter is wired up
  const { data: user, isLoading: appLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 5000),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!isSignedIn && tokenReady,
  });

  // Debug: log auth state to console (temporary)
  const authState = {
    isLoaded, isSignedIn: !!isSignedIn, tokenReady, appLoading,
    hasUser: !!user, error: error?.message ?? null,
  };
  if (typeof window !== 'undefined') {
    (window as any).__authDebug = authState;
    console.log('[AUTH]', JSON.stringify(authState));
  }

  return {
    user,
    isLoading: !isLoaded || (isSignedIn && (appLoading || !tokenReady)),
    isAuthenticated: !!isSignedIn && !!user,
    error,
  };
}

// ---------- public API ----------

/**
 * Dual-mode auth hook.
 * CLERK_ENABLED is a build-time constant (from Vite's import.meta.env)
 * so the branch is deterministic and hook call order is stable.
 */
export const useAuth = CLERK_ENABLED ? useClerkAuthHook : useDevAuth;
