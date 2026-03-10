import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

// Generic fallback bullets for unknown feature names
const PREMIUM_FEATURES = [
  { emoji: "🎨", text: "Exclusive themes (Porcelain, Royal Flush & more)" },
  { emoji: "📊", text: "Weekly Throne Report with shareable stats" },
  { emoji: "🏆", text: "Full leaderboards & achievement badges" },
  { emoji: "🛡️", text: "Streak Insurance — miss a day, keep your streak" },
];

// Feature-specific bullets shown in the gate overlay
const FEATURE_BULLETS: Record<string, { emoji: string; text: string }[]> = {
  "Deuce Bingo": [
    { emoji: "🎯", text: "Weekly bingo cards updated every Monday" },
    { emoji: "🏆", text: "Hit all squares, win squad bragging rights" },
  ],
  "Streak Insurance": [
    { emoji: "🛡️", text: "1 free miss per month, streak stays intact" },
    { emoji: "🔥", text: "Proven by Duolingo to 3× premium conversion" },
  ],
  "Custom Themes": [
    { emoji: "🎨", text: "4 premium themes: Porcelain, Royal Flush & more" },
    { emoji: "✨", text: "Switch anytime from Settings" },
  ],
  "Throne Analytics": [
    { emoji: "📊", text: "Daily, weekly & monthly trend breakdowns" },
    { emoji: "🏅", text: "Compare your output vs squad averages" },
  ],
  "Gold Badge": [
    { emoji: "👑", text: "Premium gold badge on your profile" },
    { emoji: "✨", text: "Stand out in squad leaderboards" },
  ],
};

interface PremiumGateProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGate({ featureName, children }: PremiumGateProps) {
  const { user } = useAuth();
  const isFree = user?.subscription !== "premium";

  if (!isFree) return <>{children}</>;

  const bullets = FEATURE_BULLETS[featureName] ?? PREMIUM_FEATURES;

  return (
    <div className="relative">
      {/* Blurred content underneath */}
      <div className="pointer-events-none select-none blur-sm opacity-40">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-sm rounded-2xl p-6">
        <span className="text-4xl mb-2">👑</span>
        <p className="text-base font-extrabold text-foreground text-center mb-1 leading-tight">
          Unlock {featureName}
        </p>
        <p className="text-xs text-muted-foreground text-center mb-3">
          Join thousands living their best throne life.
        </p>

        {/* Feature-specific bullets */}
        <ul className="w-full max-w-xs mb-4 space-y-1.5">
          {bullets.map((f) => (
            <li key={f.text} className="flex items-start gap-2 text-xs text-foreground">
              <span className="text-sm leading-none mt-0.5">{f.emoji}</span>
              <span className="leading-snug">{f.text}</span>
            </li>
          ))}
        </ul>

        <Link href="/premium" className="w-full max-w-xs">
          <Button className="btn-shimmer rounded-xl font-bold px-8 py-2 text-white w-full">
            Upgrade to Premium
          </Button>
        </Link>
        <p className="text-[10px] text-muted-foreground mt-2">
          From $2.99/mo &middot; Cancel anytime
        </p>
      </div>
    </div>
  );
}
