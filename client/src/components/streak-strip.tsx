import { getStreakTier } from "@/lib/gamification";
import { Flame } from "lucide-react";
import { Link } from "wouter";

interface StreakStripProps {
  maxStreak: number;
}

const STREAK_TIERS = [0, 7, 30, 90, 365] as const;

export function StreakStrip({ maxStreak }: StreakStripProps) {
  const tier = getStreakTier(maxStreak);
  const currentIdx = STREAK_TIERS.findLastIndex((t) => maxStreak >= t);
  const nextThreshold = currentIdx < STREAK_TIERS.length - 1 ? STREAK_TIERS[currentIdx + 1] : null;
  const prevThreshold = STREAK_TIERS[currentIdx];
  const progress = nextThreshold
    ? ((maxStreak - prevThreshold) / (nextThreshold - prevThreshold)) * 100
    : 100;
  const nextTier = nextThreshold ? getStreakTier(nextThreshold) : null;

  return (
    <Link href="/profile">
      <div
        className="rounded-2xl border border-border p-3 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99]"
        style={{ backgroundColor: `color-mix(in srgb, ${tier.color} 5%, transparent)` }}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl shrink-0">{tier.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: tier.color }}>
                {maxStreak}d streak
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">
                {tier.label}
              </span>
            </div>
            {nextThreshold && nextTier ? (
              <div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: tier.color,
                    }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {nextThreshold - maxStreak}d to {nextTier.icon} {nextTier.label}
                </p>
              </div>
            ) : (
              <p className="text-[9px] text-accent font-bold">MAX TIER</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
