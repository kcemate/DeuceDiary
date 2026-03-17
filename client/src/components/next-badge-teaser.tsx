import { useQuery } from "@tanstack/react-query";
import { MILESTONES } from "@/lib/gamification";
import { Link } from "wouter";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  tier: "free" | "premium";
}

interface NextBadgeTeaserProps {
  deuceCount: number;
}

export function NextBadgeTeaser({ deuceCount }: NextBadgeTeaserProps) {
  const { data: badges = [] } = useQuery<BadgeData[]>({
    queryKey: ["/api/user/badges"],
  });

  // First: check milestone progress (we can show exact %)
  const nextMilestone = MILESTONES.find((m) => deuceCount < m.count);
  const prevMilestone = MILESTONES.findLast((m) => deuceCount >= m.count);

  // Second: check for next locked achievement badge
  const nextBadge = badges.find((b) => !b.unlocked);

  // Prefer milestone if close (within 60% progress), otherwise show badge
  if (nextMilestone) {
    const prevCount = prevMilestone?.count ?? 0;
    const progress = ((deuceCount - prevCount) / (nextMilestone.count - prevCount)) * 100;

    return (
      <Link href="/profile">
        <div
          className={
            "bg-card border border-border rounded-2xl p-3 cursor-pointer" +
            " hover:border-primary/30 transition-all active:scale-[0.99]"
          }
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
              <span className="text-xl">{nextMilestone.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-foreground">
                  {nextMilestone.label}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {deuceCount}/{nextMilestone.count}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={
                    "h-full bg-gradient-to-r from-amber-400 to-yellow-500" +
                    " rounded-full transition-all duration-700"
                  }
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {nextMilestone.count - deuceCount} more to unlock
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Show next achievement badge if no milestone progress to show
  if (nextBadge) {
    return (
      <Link href="/profile">
        <div
          className={
            "bg-card border border-border rounded-2xl p-3 cursor-pointer" +
            " hover:border-primary/30 transition-all active:scale-[0.99]"
          }
        >
          <div className="flex items-center gap-3">
            <div
              className={
                "w-10 h-10 rounded-xl bg-amber-500/10 flex items-center" +
                " justify-center shrink-0 opacity-50 grayscale"
              }
            >
              <span className="text-xl">{nextBadge.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground">
                {nextBadge.name}
              </span>
              <p className="text-[9px] text-muted-foreground">
                {nextBadge.description}
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
              Locked
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // All badges unlocked!
  return null;
}
