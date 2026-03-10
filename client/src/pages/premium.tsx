import { PricingTable } from "@clerk/clerk-react";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { BackHeader } from "@/components/back-header";
import { StreakInsuranceButton } from "@/components/streak-insurance-button";
import { ThroneAnalytics } from "@/components/throne-analytics";
import { ErrorBoundary } from "@/components/error-boundary";

export default function Premium() {
  const { user } = useAuth();
  const { has } = useClerkAuth();
  const [, setLocation] = useLocation();

  // Check Clerk billing plan first, fall back to DB subscription field
  const isPremium = has?.({ plan: "premium" }) || user?.subscription === "premium";

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

      {/* Clerk Billing PricingTable */}
      <PricingTable />
    </div>
  );
}
