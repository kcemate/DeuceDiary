import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

interface PremiumAnalytics {
  totalDeuces: number;
  avgPerWeek: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { day: string; count: number };
  groupRankings: { groupId: string; groupName: string; rank: number; total: number }[];
  avgBristolScore: number | null;
  mostUsedLocation: string | null;
}

interface WeeklyReport {
  totalDeuces: number;
  peakDay: { date: string; count: number };
  mostActiveSquad: { name: string; count: number };
  longestStreak: number;
  funniestEntry: { thought: string; reactions: number } | null;
  totalReactionsReceived: number;
  weekOf: string;
}

function BristolLabel(score: number | null): string {
  if (score === null) return "N/A";
  const s = Math.round(score);
  const labels: Record<number, string> = {
    1: "Type 1 — Solid",
    2: "Type 2 — Lumpy",
    3: "Type 3 — Cracked",
    4: "Type 4 — Perfect",
    5: "Type 5 — Soft",
    6: "Type 6 — Fluffy",
    7: "Type 7 — Liquid",
  };
  return labels[s] ?? `Type ${s}`;
}

interface ThroneAnalyticsProps {
  /** If true, show the compact weekly stats card view (for premium page / profile) */
  compact?: boolean;
}

export function ThroneAnalytics({ compact = false }: ThroneAnalyticsProps) {
  const { user } = useAuth();
  const isPremium = user?.subscription === "premium";

  const { data: analytics, isLoading: analyticsLoading } = useQuery<PremiumAnalytics>({
    queryKey: ["/api/analytics/me"],
    enabled: isPremium,
  });

  const { data: weekly, isLoading: weeklyLoading } = useQuery<WeeklyReport>({
    queryKey: ["/api/users/me/weekly-report"],
    enabled: isPremium,
  });

  if (!isPremium) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 text-center">
        <p className="text-3xl mb-2">📊</p>
        <h3 className="font-bold text-foreground mb-1">Throne Analytics</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Deep stats for your throne sessions. Premium only.
        </p>
        <Link href="/premium">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer"
            style={{ color: "hsl(45, 88%, 48%)", backgroundColor: "hsl(45, 88%, 48%, 0.12)" }}>
            Upgrade →
          </span>
        </Link>
      </div>
    );
  }

  if (analyticsLoading || weeklyLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      emoji: "💩",
      value: weekly?.totalDeuces ?? 0,
      label: "Deuces This Week",
    },
    {
      emoji: "🔥",
      value: `${analytics?.currentStreak ?? 0}-day`,
      label: "Current Streak",
    },
    {
      emoji: "📍",
      value: analytics?.mostUsedLocation ?? "None",
      label: "Fave Location",
    },
    {
      emoji: "🔥",
      value: `${analytics?.longestStreak ?? 0}-day`,
      label: "Longest Streak",
    },
    {
      emoji: "📅",
      value: analytics?.bestDay.count ? analytics.bestDay.day : "—",
      label: "Peak Day",
      sublabel: analytics?.bestDay.count ? `${analytics.bestDay.count} logs` : undefined,
    },
    {
      emoji: "⚡",
      value: `${analytics?.avgPerWeek ?? 0}/wk`,
      label: "Weekly Avg",
    },
  ];

  if (compact) {
    // 3-stat compact row for profile page
    return (
      <div className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">📊</span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Throne Analytics
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stats.slice(0, 3).map((stat, i) => (
            <div key={i} className="bg-muted rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-lg leading-none">{stat.emoji}</span>
              <p className="text-sm font-extrabold text-foreground mt-1 leading-tight break-words max-w-full">
                {stat.value}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5 leading-tight">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">📊</span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Throne Analytics
        </h3>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ color: "hsl(45, 88%, 48%)", backgroundColor: "hsl(45, 88%, 48%, 0.12)" }}>
          Premium
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-muted rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-xl leading-none">{stat.emoji}</span>
            <p className="text-base font-extrabold text-foreground mt-1 leading-tight break-words max-w-full">
              {stat.value}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5 leading-tight">
              {stat.label}
            </p>
            {stat.sublabel && (
              <p className="text-[8px] text-muted-foreground mt-0.5 leading-tight">
                {stat.sublabel}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Group Rankings */}
      {analytics?.groupRankings && analytics.groupRankings.length > 0 && (
        <div className="border-t border-border pt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Squad Rankings
          </p>
          <div className="space-y-1.5">
            {analytics.groupRankings.map(r => (
              <div key={r.groupId} className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium truncate flex-1 mr-2">{r.groupName}</span>
                <span className="text-muted-foreground text-xs">
                  #{r.rank} of {r.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
