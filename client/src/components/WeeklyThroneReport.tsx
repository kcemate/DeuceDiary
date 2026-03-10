import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeeklyReport {
  totalDeuces: number;
  peakDay: { date: string; count: number };
  mostActiveSquad: { name: string; count: number };
  longestStreak: number;
  funniestEntry: { thought: string; reactions: number } | null;
  totalReactionsReceived: number;
  weekOf: string;
  dailyCounts: { date: string; count: number }[];
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

function getWeeklyHeadline(report: WeeklyReport): string {
  const { totalDeuces, longestStreak, totalReactionsReceived } = report;
  if (totalDeuces === 0) return "A quiet week on the throne 🤫";
  if (totalDeuces >= 14) return "Absolutely relentless. Respect. 👑";
  if (longestStreak >= 7) return "7-day warrior. The throne bows. 🔥";
  if (totalReactionsReceived >= 10) return "The crowd loves you. 🎉";
  if (totalDeuces >= 7) return "Solid output. Keep it coming. 💪";
  if (totalDeuces >= 4) return "Decent week. The streak lives. ✅";
  return "Every deuce counts. Stay consistent. 🚽";
}

function DailyBarChart({
  dailyCounts,
  peakDate,
}: {
  dailyCounts: { date: string; count: number }[];
  peakDate: string;
}) {
  const max = Math.max(...dailyCounts.map((d) => d.count), 1);

  return (
    <div className="px-4 pb-2">
      <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
        Daily Activity
      </p>
      <div className="flex items-end gap-1 h-12">
        {dailyCounts.map((day) => {
          const isPeak = day.date === peakDate && day.count > 0;
          const heightPct = (day.count / max) * 100;
          const barH = Math.max(heightPct, day.count > 0 ? 12 : 4);

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end" style={{ height: "36px" }}>
                <div
                  className="w-full rounded-t-sm transition-all duration-500"
                  style={{
                    height: `${barH}%`,
                    background: isPeak
                      ? "hsl(45, 88%, 48%)"
                      : day.count > 0
                      ? "hsl(142, 60%, 45%)"
                      : "hsl(25, 12%, 82%)",
                    minHeight: "3px",
                  }}
                />
              </div>
              <span
                className="text-[7px] font-bold leading-none"
                style={{ color: isPeak ? "hsl(45, 65%, 38%)" : "hsl(25, 12%, 52%)" }}
              >
                {formatDayName(day.date).slice(0, 1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function WeeklyThroneReport() {
  const { data: report, isLoading } = useQuery<WeeklyReport>({
    queryKey: ["/api/users/me/weekly-report"],
  });
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="w-[320px] h-[480px] mx-auto rounded-2xl border-2 border-accent bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading report...</p>
      </div>
    );
  }

  if (!report) return null;

  const stats = [
    { emoji: "💩", value: report.totalDeuces, label: "Deuces This Week" },
    { emoji: "🔥", value: `${report.longestStreak}-Day`, label: "Best Streak" },
    { emoji: "🏆", value: report.mostActiveSquad.name, label: "Top Squad" },
    {
      emoji: "⏰",
      value: report.peakDay.count > 0 ? formatDayName(report.peakDay.date) : "—",
      label: report.peakDay.count > 0 ? `${report.peakDay.count} deuces` : "Peak Day",
    },
    { emoji: "❤️", value: report.totalReactionsReceived, label: "Reactions Received" },
    {
      emoji: "✍️",
      value: report.funniestEntry ? `'${truncate(report.funniestEntry.thought, 28)}'` : "—",
      label: report.funniestEntry ? `${report.funniestEntry.reactions} reactions` : "Best Thought",
    },
  ];

  const handleShare = async () => {
    const text = [
      `📊 Weekly Throne Report — ${formatWeekRange(report.weekOf)}`,
      `💩 ${report.totalDeuces} deuces logged`,
      `🔥 ${report.longestStreak}-day best streak`,
      report.totalReactionsReceived > 0 ? `❤️ ${report.totalReactionsReceived} reactions` : null,
      `\n🚽 Deuce Diary — Drop a log. Leave a mark.`,
    ]
      .filter(Boolean)
      .join("\n");

    if (navigator.share) {
      try {
        await navigator.share({ title: "My Weekly Throne Report", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    }
  };

  return (
    <div className="w-[320px] mx-auto rounded-2xl border-2 border-accent bg-background flex flex-col overflow-hidden">
      {/* Gold accent bar */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, hsl(45,88%,48%) 0%, hsl(38,90%,58%) 100%)" }}
      />

      {/* Header */}
      <div className="text-center pt-4 pb-2 px-4">
        <p className="text-3xl mb-1">🚽</p>
        <h3 className="text-lg font-extrabold text-foreground tracking-tight">
          Weekly Throne Report
        </h3>
        <p className="text-xs text-muted-foreground font-medium mt-0.5">
          {formatWeekRange(report.weekOf)}
        </p>
        {/* Personalized headline */}
        <p className="text-[11px] font-semibold text-foreground mt-1.5 italic">
          {getWeeklyHeadline(report)}
        </p>
      </div>

      {/* Daily bar chart */}
      {report.dailyCounts && report.dailyCounts.length > 0 && (
        <DailyBarChart dailyCounts={report.dailyCounts} peakDate={report.peakDay.date} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-2 flex-1">
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

      {/* Share button + footer */}
      <div className="px-4 pb-3 pt-1 flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-xl font-bold text-xs border-accent"
          onClick={handleShare}
        >
          <Share2 className="w-3 h-3 mr-1.5" />
          Share This Week
        </Button>
        <p className="text-[10px] text-muted-foreground font-medium">
          Deuce Diary &middot; Drop a thought. Leave a mark.
        </p>
      </div>
    </div>
  );
}
