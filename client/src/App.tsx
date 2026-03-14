import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { NotificationBanner } from "@/components/notification-banner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/error-boundary";

// Route-level code splitting — each page loaded on demand
const Landing = lazy(() => import("@/pages/landing"));
const Home = lazy(() => import("@/pages/home"));
const Groups = lazy(() => import("@/pages/groups"));
const Profile = lazy(() => import("@/pages/profile"));
const GroupDetail = lazy(() => import("@/pages/group-detail"));
const InviteLanding = lazy(() => import("@/pages/invite-landing"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Premium = lazy(() => import("@/pages/premium"));
const Settings = lazy(() => import("@/pages/settings"));
const Legacy = lazy(() => import("@/pages/legacy"));
const Referral = lazy(() => import("@/pages/referral"));
const Bingo = lazy(() => import("@/pages/bingo"));
const Passport = lazy(() => import("@/pages/passport"));

// Lightweight fallback shown while a lazy page chunk loads
function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-64" role="status" aria-label="Loading page">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true" />
    </div>
  );
}

function PageTransition({ locationKey, children }: { locationKey: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const prevKey = useRef(locationKey);

  useEffect(() => {
    if (prevKey.current !== locationKey) {
      prevKey.current = locationKey;
      setIsVisible(false);
      // Trigger re-render with fade-in
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }
  }, [locationKey]);

  return (
    <div
      className={isVisible ? "animate-page-in" : "opacity-0"}
      style={{ minHeight: "50vh" }}
    >
      {children}
    </div>
  );
}

function AppRoutes({
  isLoading,
  isAuthenticated,
  error,
}: {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96" role="status" aria-label="Loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/terms" component={Terms} />
            <Route path="/invite/:code" component={InviteLanding} />
            <Route path="/legacy/:username" component={Legacy} />
            <Route path="*"><Redirect to="/" /></Route>
          </Switch>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
        <Route path="/">{() => <ErrorBoundary><Home /></ErrorBoundary>}</Route>
        <Route path="/groups">{() => <ErrorBoundary><Groups /></ErrorBoundary>}</Route>
        <Route path="/groups/:groupId">{(params) => <ErrorBoundary><GroupDetail /></ErrorBoundary>}</Route>
        <Route path="/invite/:code" component={InviteLanding} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/profile">{() => <ErrorBoundary><Profile /></ErrorBoundary>}</Route>
        <Route path="/premium">{() => <ErrorBoundary><Premium /></ErrorBoundary>}</Route>
        <Route path="/settings">{() => <ErrorBoundary><Settings /></ErrorBoundary>}</Route>
        <Route path="/referral">{() => <ErrorBoundary><Referral /></ErrorBoundary>}</Route>
        <Route path="/bingo">{() => <ErrorBoundary><Bingo /></ErrorBoundary>}</Route>
        <Route path="/passport">{() => <ErrorBoundary><Passport /></ErrorBoundary>}</Route>
        <Route path="/legacy/:username" component={Legacy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function Router() {
  const { isAuthenticated, isLoading, error, user } = useAuth();
  const { lastMessage, joinGroup } = useWebSocket();
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [location, setLocation] = useLocation();
  const [processingInvite, setProcessingInvite] = useState(false);
  const { toast } = useToast();

  // Handle invite link joining
  const joinGroupMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      return await apiRequest<{ message: string; group: { id: string; name: string } }>(`/api/join/${inviteId}`, {
        method: "POST",
      });
    },
    onSuccess: (response: { message: string; group: { id: string; name: string } }) => {
      console.log("Successfully joined group:", response.group);
      setProcessingInvite(false);

      if (response.message === "Already a member of this group") {
        toast({
          title: "Already a member",
          description: `You're already in the group "${response.group.name}"`,
        });
      } else {
        toast({
          title: "Success",
          description: `Joined group "${response.group.name}" successfully!`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setLocation("/groups");
    },
    onError: (error) => {
      setProcessingInvite(false);
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to join group",
        variant: "destructive",
      });
    },
  });

  // Show a toast when a background query fails with a server/network error
  // so the user knows something went wrong rather than seeing stale data silently.
  useEffect(() => {
    return queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const err = event.action.error;
        if (err instanceof Error) {
          const match = err.message.match(/^(\d{3}):/);
          const status = match ? parseInt(match[1], 10) : null;
          // Only surface server errors (5xx) or network failures (no status)
          const isTransient = status === null || status >= 500;
          if (isTransient) {
            toast({
              title: "Connection issue",
              description: "Couldn't reach the server. Pull down to refresh.",
              variant: "destructive",
            });
          }
        }
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle WebSocket notifications
  useEffect(() => {
    if (lastMessage && lastMessage.type === "deuce_logged") {
      // Don't show notification if it's the user's own deuce log
      if (lastMessage.userId && user?.id === lastMessage.userId) {
        return;
      }

      // Refresh feed so the new entry appears
      queryClient.invalidateQueries({ queryKey: ["/api/deuces"] });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });

      setNotificationMessage(lastMessage.message);
      setNotificationVisible(true);
    }
  }, [lastMessage, user]);

  // Handle invite links from URL params
  useEffect(() => {
    // Clerk sign-in redirects to /app — never redirect authenticated users away from /app
    if (isAuthenticated && window.location.pathname.startsWith("/app")) {
      return;
    }

    if (isAuthenticated && (location === "/" || location === "")) {
      const urlParams = new URLSearchParams(window.location.search);
      const joinInviteId = urlParams.get("join");

      if (joinInviteId && !joinGroupMutation.isPending && !processingInvite) {
        console.log("Processing invite link:", joinInviteId);
        setProcessingInvite(true);

        toast({
          title: "Processing invite...",
          description: "Joining group, please wait...",
        });

        window.history.replaceState({}, "", "/");
        joinGroupMutation.mutate(joinInviteId);
      }
    }
  }, [isAuthenticated, location, joinGroupMutation, processingInvite]);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content — keyboard/screen reader shortcut */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <NotificationBanner
        message={notificationMessage}
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Header */}
        {isAuthenticated && (
          <header className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center" aria-hidden="true">
                <svg className="w-5 h-5 text-primary" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2V1h6v1c2.21 0 4 1.79 4 4v2c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V6c0-2.21 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2v1h10V6c0-1.1-.9-2-2-2H9zm-3 8v9c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-9H6zm2 2h2v5H8v-5zm6 0h2v5h-2v-5z" />
                </svg>
              </div>
              <div>
                <span className="text-xl font-bold text-foreground leading-tight">Deuce Diary</span>
                <p className="text-xs text-muted-foreground leading-tight">Your throne. Your legacy.</p>
              </div>
            </div>
          </header>
        )}

        {/* Main content landmark */}
        <main id="main-content">
          <PageTransition locationKey={location}>
            <div className="px-4">
              <ErrorBoundary>
                <AppRoutes
                  isLoading={isLoading}
                  isAuthenticated={isAuthenticated}
                  error={error}
                />
              </ErrorBoundary>
            </div>
          </PageTransition>
        </main>

        {/* Bottom Navigation */}
        {isAuthenticated && <BottomNavigation />}
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
// Force cache bust - 1773004187
// Force cache bust 1773004645
// Force cache bust 1773005560
