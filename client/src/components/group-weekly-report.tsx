import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WeeklyReport {
  groupId: string;
  groupName: string;
  weekOf: string;
  weekEnding: string;
  groupStats: {
    currentStreak: number;
    longestStreak: number;
    totalDeucesThisWeek: number;
  };
  members: Array<{
    userId: string;
    username: string | null;
    profileImageUrl: string | null;
    deucesThisWeek: number;
    streakStatus: "active" | "at_risk" | "inactive";
  }>;
  mvp: {
    userId: string;
    username: string | null;
    profileImageUrl: string | null;
    deuceCount: number;
  } | null;
  funnyStats: {
    longestGap: { userId: string; username: string | null; gapDays: number } | null;
    mostReactionsReceived: { userId: string; username: string | null; reactionCount: number } | null;
    funniestEntry: { userId: string; username: string | null; thought: string; reactions: number } | null;
  };
}

const statusConfig = {
  active: { label: "Active", color: "bg-green-100 text-green-700 border-green-200" },
  at_risk: { label: "At Risk", color: "bg-red-100 text-red-700 border-red-200" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-500 border-gray-200" },
};

export function GroupWeeklyReport({ groupId }: { groupId: string }) {
  const [expanded, setExpanded] = useState(false);

  const { data: report, isLoading } = useQuery<WeeklyReport>({
    queryKey: [`/api/groups/${groupId}/weekly-report`],
    enabled: !!groupId,
  });

  if (isLoading || !report) return null;

  return (
    <Card className="shadow-sm mb-6 border-purple-200 dark:border-purple-900">
      <CardContent className="p-4">
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">📊</span> Weekly Throne Report
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{report.weekOf} — {report.weekEnding}</span>
            <span className="text-muted-foreground text-sm">{expanded ? "▲" : "▼"}</span>
          </div>
        </button>

        {/* Summary stats — always visible */}
        <div className="flex gap-4 mt-3">
          <div className="text-center flex-1">
            <p className="text-2xl font-extrabold text-foreground">{report.groupStats.totalDeucesThisWeek}</p>
            <p className="text-xs text-muted-foreground">Deuces</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-2xl font-extrabold text-foreground">{report.groupStats.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
          {report.mvp && (
            <div className="text-center flex-1">
              <div className="flex justify-center mb-0.5">
                <Avatar className="w-7 h-7">
                  <AvatarImage src={report.mvp.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {(report.mvp.username || "?")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <p className="text-xs text-muted-foreground">⭐ MVP</p>
            </div>
          )}
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* MVP highlight */}
            {report.mvp && (
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-3 flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={report.mvp.profileImageUrl || undefined} />
                  <AvatarFallback>{(report.mvp.username || "?")[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-foreground text-sm">
                    ⭐ {report.mvp.username || "Anonymous"} — MVP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {report.mvp.deuceCount} deuce{report.mvp.deuceCount !== 1 ? "s" : ""} this week
                  </p>
                </div>
              </div>
            )}

            {/* Member breakdown */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Member Activity
              </p>
              <div className="space-y-2">
                {report.members
                  .sort((a, b) => b.deucesThisWeek - a.deucesThisWeek)
                  .map((member) => {
                    const status = statusConfig[member.streakStatus];
                    return (
                      <div key={member.userId} className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 shrink-0">
                          <AvatarImage src={member.profileImageUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {(member.username || "?")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground flex-1 truncate">
                          {member.username || "Anonymous"}
                        </span>
                        <span className="text-sm font-bold text-foreground shrink-0">
                          {member.deucesThisWeek}
                        </span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${status.color}`}>
                          {status.label}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Fun facts */}
            {(report.funnyStats.longestGap || report.funnyStats.mostReactionsReceived || report.funnyStats.funniestEntry) && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Fun Facts
                </p>
                <div className="space-y-1.5">
                  {report.funnyStats.longestGap && (
                    <p className="text-xs text-muted-foreground">
                      💤 <span className="font-medium text-foreground">{report.funnyStats.longestGap.username || "Someone"}</span> — longest gap: {report.funnyStats.longestGap.gapDays} day{report.funnyStats.longestGap.gapDays !== 1 ? "s" : ""}
                    </p>
                  )}
                  {report.funnyStats.mostReactionsReceived && (
                    <p className="text-xs text-muted-foreground">
                      🎭 <span className="font-medium text-foreground">{report.funnyStats.mostReactionsReceived.username || "Someone"}</span> — most reactions: {report.funnyStats.mostReactionsReceived.reactionCount}
                    </p>
                  )}
                  {report.funnyStats.funniestEntry && (
                    <p className="text-xs text-muted-foreground">
                      😂 Best quote: "{report.funnyStats.funniestEntry.thought}" — <span className="font-medium text-foreground">{report.funnyStats.funniestEntry.username || "Anonymous"}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Share button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-xl text-xs font-bold"
              onClick={async () => {
                const text = [
                  `📊 ${report.groupName} — Weekly Throne Report`,
                  `Week of ${report.weekOf}`,
                  ``,
                  `💩 ${report.groupStats.totalDeucesThisWeek} deuces logged`,
                  `🔥 ${report.groupStats.currentStreak}-day streak`,
                  report.mvp ? `⭐ MVP: ${report.mvp.username} (${report.mvp.deuceCount} deuces)` : null,
                  ``,
                  `Track your throne time with your squad on Deuce Diary!`,
                ].filter(Boolean).join("\n");

                if (navigator.share) {
                  try { await navigator.share({ title: "Weekly Throne Report", text }); } catch {
                    // user cancelled or share not supported — no action needed
                  }
                } else {
                  try {
                    await navigator.clipboard.writeText(text);
                  } catch (err) {
                    console.warn("[share] clipboard write failed", err);
                  }
                }
              }}
            >
              📤 Share Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
