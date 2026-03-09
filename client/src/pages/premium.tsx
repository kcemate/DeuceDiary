import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { BackHeader } from "@/components/back-header";
import { StreakInsuranceButton } from "@/components/streak-insurance-button";
import { ThroneAnalytics } from "@/components/throne-analytics";
import { ErrorBoundary } from "@/components/error-boundary";

const features = [
  {
    emoji: "🎯",
    title: "Deuce Bingo",
    description: "Hit the squares, own the throne.",
    free: false,
  },
  {
    emoji: "🔥",
    title: "Streak Insurance",
    description: "Miss a day? We've got you.",
    free: false,
  },
  {
    emoji: "🏆",
    title: "Gold Badge",
    description: "Show the squad who's boss.",
    free: false,
  },
  {
    emoji: "🎨",
    title: "Custom Themes",
    description: "Make it yours.",
    free: false,
  },
  {
    emoji: "📊",
    title: "Throne Analytics",
    description: "Know your numbers.",
    free: false,
  },
];

export default function Premium() {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [upgraded, setUpgraded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const upgradeMutation = useMutation({
    mutationFn: () =>
      apiRequest("/api/subscription/upgrade", {
        method: "POST",
        body: JSON.stringify({ plan }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setUpgraded(true);
    },
    onError: (error) => {
      toast({
        title: "Upgrade failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  // Already premium — show premium features dashboard
  if (upgraded || user?.subscription === "premium") {
    return (
      <div className="pt-6 pb-24 space-y-6">
        <BackHeader to="/profile" label="Profile" />
        {/* Header */}
        <div className="text-center">
          <p className="text-7xl mb-4">👑</p>
          <h1
            className="text-3xl font-extrabold text-foreground mb-1"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Throne Room
          </h1>
          <p className="text-muted-foreground">
            Your premium perks, all in one place.
          </p>
        </div>

        {/* Streak Insurance */}
        <ErrorBoundary>
          <StreakInsuranceButton />
        </ErrorBoundary>

        {/* Throne Analytics */}
        <ErrorBoundary>
          <ThroneAnalytics />
        </ErrorBoundary>

        {/* Gold Badge info */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">👑</span>
            <div>
              <h3 className="font-bold text-foreground">Gold Badge</h3>
              <p className="text-xs text-muted-foreground">
                Your gold crown shows next to your name in group feeds and leaderboards.
              </p>
            </div>
          </div>
          <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="font-bold text-foreground">{user?.username ?? user?.firstName ?? "You"}</span>
            <span className="text-base leading-none" title="Porcelain Premium">👑</span>
            <span className="text-xs text-muted-foreground ml-1">← that's you</span>
          </div>
        </div>

        {/* Custom Themes link */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-bold text-foreground">Custom Themes</h3>
              <p className="text-xs text-muted-foreground">Personalize your throne aesthetic.</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-xl font-bold"
            onClick={() => setLocation("/settings")}
          >
            Open Theme Settings →
          </Button>
        </div>

      </div>
    );
  }

  return (
    <div className="pt-6 pb-24">
      {/* Hero */}
      <div className="text-center mb-8">
        <p className="text-6xl mb-4">👑</p>
        <h1
          className="text-3xl font-extrabold text-foreground mb-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Go Porcelain Premium
        </h1>
        <p className="text-muted-foreground">
          Elevate your throne experience.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="space-y-3 mb-8">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4"
          >
            <span className="text-3xl">{feature.emoji}</span>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-accent bg-accent/10">
              Premium
            </span>
          </div>
        ))}
      </div>

      {/* Free Tier Reminder */}
      <div className="bg-muted/50 border border-border rounded-2xl p-4 mb-8">
        <h3 className="font-bold text-foreground text-sm mb-2">
          Free forever
        </h3>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="bg-background px-2.5 py-1 rounded-full">
            💩 Log Deuces
          </span>
          <span className="bg-background px-2.5 py-1 rounded-full">
            👥 Groups
          </span>
          <span className="bg-background px-2.5 py-1 rounded-full">
            🔥 Streaks
          </span>
          <span className="bg-background px-2.5 py-1 rounded-full">
            👏 Reactions
          </span>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setPlan("monthly")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            plan === "monthly"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Monthly — $3.99
        </button>
        <button
          onClick={() => setPlan("annual")}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
            plan === "annual"
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground"
          }`}
        >
          Annual — $29.99
        </button>
      </div>

      {plan === "annual" && (
        <p className="text-center text-xs font-bold mb-6 text-green-500">
          Save 37% with annual billing
        </p>
      )}

      {/* CTA */}
      <Button
        onClick={() => upgradeMutation.mutate()}
        disabled={upgradeMutation.isPending}
        className="w-full rounded-2xl font-bold py-6 text-lg btn-shimmer shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
      >
        {upgradeMutation.isPending ? "Upgrading..." : "Upgrade to Premium"}
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Dev mode — no real payment will be charged.
      </p>
    </div>
  );
}
