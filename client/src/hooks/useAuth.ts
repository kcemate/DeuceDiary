import { useQuery } from "@tanstack/react-query";
import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setTokenGetter } from "@/lib/auth-token";

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// ---------- dev mode ----------

function useDevAuth() {
  const { data: user, isLoading, error } = useQuery({
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

  // Keep the token getter in sync so queryClient can attach Bearer headers
  useEffect(() => {
    if (isSignedIn) {
      setTokenGetter(() => getToken());
    } else {
      setTokenGetter(null);
    }
    return () => setTokenGetter(null);
  }, [isSignedIn, getToken]);

  // Fetch app-specific user data once signed in
  const { data: user, isLoading: appLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: !!isSignedIn,
  });

  return {
    user,
    isLoading: !isLoaded || (isSignedIn && appLoading),
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
