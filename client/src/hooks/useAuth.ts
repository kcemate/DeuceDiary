import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // If we get a 401 error, the user is definitely not authenticated
  const isUnauthenticated = error && error.message?.includes("401");

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !isUnauthenticated,
    error,
  };
}
