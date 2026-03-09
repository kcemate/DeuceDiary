import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface LeaderboardEntry {
  userId: string;
  username: string | null;
  profileImageUrl: string | null;
  weekly: { totalDeuces: number; reactionsReceived: number };
  monthly: { totalDeuces: number; reactionsReceived: number };
  allTime: { totalDeuces: number; reactionsReceived: number; currentStreak: number };
  isMvp: boolean;
}

type TimeRange = "weekly" | "monthly" | "allTime";

const timeRangeLabels: Record<TimeRange, string> = {
  weekly: "This Week",
  monthly: "This Month",
  allTime: "All Time",
};

const rankMedals = ["🥇", "🥈", "🥉"];

export function GroupLeaderboard({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");

  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: [`/api/groups/${groupId}/leaderboard`],
    enabled: !!groupId,
  });

  if (isLoading) {
    return (
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="h-5 bg-muted rounded w-1/3 mb-4 animate-pulse" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-6 h-6 bg-muted rounded" />
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 h-4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) return null;

  const sorted = [...leaderboard].sort((a, b) => {
    const aData = a[timeRange];
    const bData = b[timeRange];
    const aDeuces = "totalDeuces" in aData ? aData.totalDeuces : 0;
    const bDeuces = "totalDeuces" in bData ? bData.totalDeuces : 0;
    if (bDeuces !== aDeuces) return bDeuces - aDeuces;
    const aRx = "reactionsReceived" in aData ? aData.reactionsReceived : 0;
    const bRx = "reactionsReceived" in bData ? bData.reactionsReceived : 0;
    return bRx - aRx;
  });

  return (
    <Card className="shadow-sm mb-6 border-amber-200 dark:border-amber-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <span className="text-lg">🏆</span> Leaderboard
          </h3>
          {leaderboard.some(e => e.isMvp) && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs font-bold">
              ⭐ MVP of the Week
            </Badge>
          )}
        </div>

        {/* Time range tabs */}
        <div className="flex gap-1 mb-4 bg-muted/50 rounded-xl p-1">
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 text-xs font-bold py-1.5 rounded-lg transition-all ${
                timeRange === range
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>

        {/* Rankings */}
        <div className="space-y-2">
          {sorted.map((entry, index) => {
            const data = entry[timeRange];
            const deuces = "totalDeuces" in data ? data.totalDeuces : 0;
            const reactions = "reactionsReceived" in data ? data.reactionsReceived : 0;
            const streak = timeRange === "allTime" && "currentStreak" in data ? data.currentStreak : null;
            const isCurrentUser = entry.userId === user?.id;
            const medal = rankMedals[index];

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 py-2 px-2 rounded-xl transition-all ${
                  isCurrentUser
                    ? "bg-primary/5 border border-primary/20"
                    : index === 0 && deuces > 0
                    ? "bg-amber-50 dark:bg-amber-950/20"
                    : ""
                }`}
              >
                {/* Rank */}
                <span className="w-6 text-center shrink-0">
                  {medal && deuces > 0 ? (
                    <span className="text-base">{medal}</span>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                  )}
                </span>

                {/* Avatar */}
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarImage src={entry.profileImageUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {(entry.username || "?")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className={`text-sm truncate ${isCurrentUser ? "font-bold" : "font-medium"} text-foreground`}>
                      {entry.username || "Anonymous"}
                      {isCurrentUser && <span className="text-muted-foreground ml-1">(you)</span>}
                    </span>
                    {entry.isMvp && <span className="text-xs" title="MVP of the Week">⭐</span>}
                  </div>
                  {reactions > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {reactions} reaction{reactions !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">
                    {deuces}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {deuces === 1 ? "deuce" : "deuces"}
                  </p>
                </div>

                {/* Streak (all-time only) */}
                {streak !== null && streak > 0 && (
                  <div className="text-right shrink-0 ml-1">
                    <p className="text-xs font-bold text-orange-600">🔥{streak}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state for time range */}
        {sorted.every(e => {
          const d = e[timeRange];
          return ("totalDeuces" in d ? d.totalDeuces : 0) === 0;
        }) && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            No deuces logged {timeRange === "weekly" ? "this week" : timeRange === "monthly" ? "this month" : ""} yet. Time to claim the throne!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
