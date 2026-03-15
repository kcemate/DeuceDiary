import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStreakTier } from "@/lib/gamification";

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

export function formatWeekRange(weekOf: string): string {
  const start = new Date(weekOf + "T00:00:00Z");
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function formatDayName(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}

export function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export function getWeeklyHeadline(report: WeeklyReport): string {
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
      <div className="flex items-end gap-1" style={{ height: "52px" }}>
        {dailyCounts.map((day) => {
          const isPeak = day.date === peakDate && day.count > 0;
          const heightPct = (day.count / max) * 100;
          const barH = Math.max(heightPct, day.count > 0 ? 15 : 5);

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center">
              {/* Count label above bar */}
              <span
                className="text-[7px] font-black leading-none mb-0.5"
                style={{ color: isPeak ? "hsl(45, 65%, 38%)" : "transparent" }}
              >
                {day.count > 0 ? day.count : " "}
              </span>
              <div className="w-full flex items-end" style={{ height: "34px" }}>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${barH}%`,
                    background: isPeak
                      ? "linear-gradient(180deg, hsl(45,88%,55%) 0%, hsl(45,88%,40%) 100%)"
                      : day.count > 0
                      ? "hsl(142, 60%, 45%)"
                      : "hsl(25, 12%, 82%)",
                    minHeight: "3px",
                    boxShadow: isPeak ? "0 0 6px hsl(45 88% 48% / 0.5)" : undefined,
                  }}
                />
              </div>
              <span
                className="text-[7px] font-bold leading-none mt-0.5"
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
        {/* Streak tier badge */}
        {report.longestStreak > 0 && (() => {
          const tier = getStreakTier(report.longestStreak);
          return (
            <div className="flex justify-center mt-2">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: "hsl(38, 28%, 88%)",
                  color: tier.color,
                  border: `1px solid ${tier.color}33`,
                }}
              >
                {tier.icon} {tier.label} Streak
              </span>
            </div>
          );
        })()}
      </div>

      {/* Daily bar chart */}
      {report.dailyCounts && report.dailyCounts.length > 0 && (
        <DailyBarChart dailyCounts={report.dailyCounts} peakDate={report.peakDay.date} />
      )}

      {/* Hero stat — total deuces + weekly score progress */}
      <div className="px-4 pb-1">
        <div
          className="rounded-xl px-4 py-2.5 flex items-center justify-between"
          style={{
            background: "linear-gradient(135deg, hsl(45,88%,95%) 0%, hsl(38,70%,90%) 100%)",
            border: "1.5px solid hsl(45, 60%, 72%)",
          }}
        >
          <div className="flex-1">
            <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "hsl(45,65%,38%)" }}>
              Deuces This Week
            </p>
            <p
              className="text-3xl font-black leading-none"
              style={{ color: "hsl(45, 88%, 38%)", fontVariantNumeric: "tabular-nums" }}
            >
              {report.totalDeuces}
            </p>
            {/* Weekly score bar — 7 = perfect week */}
            <div className="mt-2">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "hsl(45,65%,38%)" }}>
                  Weekly Score
                </span>
                <span className="text-[8px] font-bold" style={{ color: "hsl(45,65%,38%)" }}>
                  {Math.min(Math.round((report.totalDeuces / 7) * 100), 100)}%
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: "5px", background: "hsl(45, 40%, 80%)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((report.totalDeuces / 7) * 100, 100)}%`,
                    background: report.totalDeuces >= 7
                      ? "linear-gradient(90deg, hsl(142,60%,42%) 0%, hsl(142,60%,50%) 100%)"
                      : "linear-gradient(90deg, hsl(45,88%,42%) 0%, hsl(45,88%,55%) 100%)",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p className="text-[8px] text-muted-foreground mt-0.5">
                {report.totalDeuces >= 7 ? "Perfect week! 🏆" : `${7 - report.totalDeuces} to go for a perfect week`}
              </p>
            </div>
          </div>
          <span className="text-4xl ml-3">💩</span>
        </div>
      </div>

      {/* Stats Grid — 4 stats in 2×2 grid */}
      <div className="grid grid-cols-2 gap-2 px-4 pb-2">
        {stats.slice(1).map((stat, i) => (
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

      {/* Funniest entry — full-width quote card */}
      {report.funniestEntry && (
        <div className="px-4 pb-2">
          <div
            className="rounded-xl px-3 py-2.5"
            style={{
              background: "hsl(38, 22%, 94%)",
              border: "1px solid hsl(38, 18%, 84%)",
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              ✍️ Best Throne Thought
            </p>
            <p
              className="text-[12px] italic text-foreground leading-snug"
              style={{ color: "hsl(25, 25%, 28%)" }}
            >
              &ldquo;{truncate(report.funniestEntry.thought, 72)}&rdquo;
            </p>
            <p className="text-[9px] text-muted-foreground mt-1 font-medium">
              {report.funniestEntry.reactions} reaction{report.funniestEntry.reactions !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

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
