import { Button } from "@/components/ui/button";
import { useAuth, usePremium } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { BackHeader } from "@/components/back-header";
import { StreakInsuranceButton } from "@/components/streak-insurance-button";
import { ThroneAnalytics } from "@/components/throne-analytics";
import { ErrorBoundary } from "@/components/error-boundary";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Premium() {
  const { user } = useAuth();
  const isPremium = usePremium();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [upgrading, setUpgrading] = useState<"monthly" | "annual" | null>(null);

  async function handleUpgrade(plan: "monthly" | "annual") {
    setUpgrading(plan);
    try {
      await apiRequest("/api/subscription/upgrade", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Welcome to Porcelain Premium! 👑" });
    } catch {
      toast({ title: "Upgrade failed — try again", variant: "destructive" });
    } finally {
      setUpgrading(null);
    }
  }

  // Already premium — show premium features dashboard
  if (isPremium) {
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
      <BackHeader to="/profile" label="Profile" />

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

      {/* Feature list */}
      <div className="space-y-3 mb-8 px-2">
        {[
          { emoji: "🎨", title: "Custom Themes", desc: "4 premium themes — Porcelain, Royal Flush, Splash Zone & more" },
          { emoji: "🛡️", title: "Streak Insurance", desc: "Miss a day, keep your streak. 1 free save per month." },
          { emoji: "📊", title: "Throne Analytics", desc: "Daily, weekly & monthly trend breakdowns" },
          { emoji: "👑", title: "Gold Crown Badge", desc: "Stand out in group feeds and leaderboards" },
          { emoji: "🏆", title: "Weekly Throne Report", desc: "Shareable stats and personal records" },
          { emoji: "🎯", title: "Deuce Bingo", desc: "Weekly bingo cards for extra fun" },
        ].map((f) => (
          <div key={f.title} className="flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3">
            <span className="text-xl mt-0.5">{f.emoji}</span>
            <div>
              <p className="text-sm font-bold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing cards */}
      <div className="space-y-3 px-2">
        <button
          onClick={() => handleUpgrade("monthly")}
          disabled={!!upgrading}
          className="w-full bg-card border-2 border-border hover:border-primary rounded-2xl p-5 text-left transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-extrabold text-foreground">Monthly</p>
              <p className="text-xs text-muted-foreground">Cancel anytime</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-foreground">$3.99</p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>
          {upgrading === "monthly" && <p className="text-xs text-primary mt-2 animate-pulse">Upgrading...</p>}
        </button>

        <button
          onClick={() => handleUpgrade("annual")}
          disabled={!!upgrading}
          className="w-full border-2 border-primary rounded-2xl p-5 text-left transition-all relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(45 80% 96%) 0%, hsl(38 60% 92%) 100%)" }}
        >
          <span className="absolute top-2 right-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            Save 37%
          </span>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-extrabold text-foreground">Annual</p>
              <p className="text-xs text-muted-foreground">Best value</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-foreground">$29.99</p>
              <p className="text-xs text-muted-foreground">/year</p>
            </div>
          </div>
          {upgrading === "annual" && <p className="text-xs text-primary mt-2 animate-pulse">Upgrading...</p>}
        </button>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-4 px-4">
        Payment processing coming soon. Upgrade is instant during beta.
      </p>
    </div>
  );
}
