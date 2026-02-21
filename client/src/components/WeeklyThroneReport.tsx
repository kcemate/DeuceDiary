import { useQuery } from "@tanstack/react-query";

interface WeeklyReport {
  totalDeuces: number;
  peakDay: { date: string; count: number };
  mostActiveSquad: { name: string; count: number };
  longestStreak: number;
  funniestEntry: { thought: string; reactions: number } | null;
  totalReactionsReceived: number;
  weekOf: string;
}

function formatWeekRange(weekOf: string): string {
  const start = new Date(weekOf + "T00:00:00Z");
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDayName(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export function WeeklyThroneReport() {
  const { data: report, isLoading } = useQuery<WeeklyReport>({
    queryKey: ["/api/users/me/weekly-report"],
  });

  if (isLoading) {
    return (
      <div className="w-[320px] h-[480px] mx-auto rounded-2xl border-2 border-accent bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading report...</p>
      </div>
    );
  }

  if (!report) return null;

  const stats = [
    { emoji: "\uD83D\uDCA9", value: report.totalDeuces, label: "Deuces This Week" },
    { emoji: "\uD83D\uDD25", value: `${report.longestStreak}-Day`, label: "Best Streak" },
    { emoji: "\uD83C\uDFC6", value: report.mostActiveSquad.name, label: "Top Squad" },
    {
      emoji: "\u23F0",
      value: report.peakDay.count > 0 ? formatDayName(report.peakDay.date) : "—",
      label: report.peakDay.count > 0 ? `${report.peakDay.count} deuces` : "Peak Day",
    },
    { emoji: "\u2764\uFE0F", value: report.totalReactionsReceived, label: "Reactions Received" },
    {
      emoji: "\u270D\uFE0F",
      value: report.funniestEntry ? `'${truncate(report.funniestEntry.thought, 28)}'` : "—",
      label: report.funniestEntry ? `${report.funniestEntry.reactions} reactions` : "Best Thought",
    },
  ];

  return (
    <div className="w-[320px] h-[480px] mx-auto rounded-2xl border-2 border-accent bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center pt-5 pb-3 px-4">
        <p className="text-3xl mb-1">{"\uD83D\uDEBD"}</p>
        <h3 className="text-lg font-extrabold text-foreground tracking-tight">
          Weekly Throne Report
        </h3>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {formatWeekRange(report.weekOf)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 px-4 flex-1">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-2.5 flex flex-col items-center justify-center text-center"
          >
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

      {/* Footer */}
      <div className="text-center py-3 px-4">
        <p className="text-[10px] text-muted-foreground font-medium">
          Deuce Diary &middot; Drop a thought. Leave a mark.
        </p>
      </div>
    </div>
  );
}
