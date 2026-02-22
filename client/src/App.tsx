import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { NotificationBanner } from "@/components/notification-banner";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Groups from "@/pages/groups";
import Profile from "@/pages/profile";
import GroupDetail from "@/pages/group-detail";
import InviteLanding from "@/pages/invite-landing";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Premium from "@/pages/premium";
import Settings from "@/pages/settings";
import Legacy from "@/pages/legacy";

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
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/invite/:code" component={InviteLanding} />
        <Route path="/legacy/:username" component={Legacy} />
        <Route path="*">
          {error?.message?.includes("401") ? (
            <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
              <p className="text-center text-muted-foreground">
                Your session timed out — back to the throne!
              </p>
              <Button onClick={() => (window.location.href = "/api/login")}>
                Log In Again
              </Button>
            </div>
          ) : (
            <NotFound />
          )}
        </Route>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/groups" component={Groups} />
      <Route path="/groups/:groupId" component={GroupDetail} />
      <Route path="/invite/:code" component={InviteLanding} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/profile" component={Profile} />
      <Route path="/premium" component={Premium} />
      <Route path="/settings" component={Settings} />
      <Route path="/legacy/:username" component={Legacy} />
      <Route component={NotFound} />
    </Switch>
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
      return await apiRequest(`/api/join/${inviteId}`, {
        method: "POST",
      });
    },
    onSuccess: (response: any) => {
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

  // Handle WebSocket notifications
  useEffect(() => {
    if (lastMessage && lastMessage.type === "deuce_logged") {
      // Don't show notification if it's the user's own deuce log
      if (lastMessage.userId && (user as any)?.id === lastMessage.userId) {
        return;
      }

      setNotificationMessage(lastMessage.message);
      setNotificationVisible(true);
    }
  }, [lastMessage, user]);

  // Handle invite links from URL params
  useEffect(() => {
    if (isAuthenticated && location === "/") {
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
      <NotificationBanner
        message={notificationMessage}
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />

      <div className="max-w-md mx-auto bg-background min-h-screen relative">
        {/* Header */}
        {isAuthenticated && (
          <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 2V1h6v1c2.21 0 4 1.79 4 4v2c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V6c0-2.21 1.79-4 4-4zm0 2c-1.1 0-2 .9-2 2v1h10V6c0-1.1-.9-2-2-2H9zm-3 8v9c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-9H6zm2 2h2v5H8v-5zm6 0h2v5h-2v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground leading-tight">Deuce Diary</h1>
                <p className="text-xs text-muted-foreground leading-tight">Your throne. Your legacy.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-4">
          <AppRoutes
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            error={error}
          />
        </div>

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
