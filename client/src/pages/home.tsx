import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { LogDeuceModal } from "@/components/log-deuce-modal";
import { Onboarding } from "@/components/Onboarding";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  entryCount: number;
  lastActivity?: string;
}

interface Analytics {
  date: string;
  count: number;
}

// ── Pull-to-refresh hook ────────────────────────────────────────────────────
function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const THRESHOLD = 80;

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (startY.current === null || isRefreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && window.scrollY === 0) {
        setIsPulling(true);
        setPullDistance(Math.min(delta * 0.5, THRESHOLD + 20));
        if (delta > 10) e.preventDefault();
      }
    },
    [isRefreshing],
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    if (pullDistance >= THRESHOLD) {
      setIsRefreshing(true);
      setIsPulling(false);
      setPullDistance(0);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    } else {
      setIsPulling(false);
      setPullDistance(0);
    }
    startY.current = null;
  }, [isPulling, pullDistance, onRefresh]);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isPulling, pullDistance, isRefreshing };
}

// ── Skeleton for group cards ────────────────────────────────────────────────
function GroupCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <div className="text-right space-y-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────
function EmptyFeedState() {
  return (
    <div className="bg-card border border-border rounded-2xl p-10 text-center">
      {/* ASCII-ish toilet emoji art */}
      <div className="flex flex-col items-center mb-4 leading-none select-none">
        <span className="text-5xl">🚽</span>
        <span className="text-2xl mt-1">✨</span>
      </div>
      <h3 className="text-xl font-extrabold text-foreground mb-2">
        Your throne room awaits.
      </h3>
      <p className="text-sm text-muted-foreground">
        Log your first deuce!
      </p>
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { joinGroup } = useWebSocket();
  const queryClient = useQueryClient();
  const [showLogModal, setShowLogModal] = useState(false);
  const isFree = user?.subscription !== "premium";

  const {
    data: groups = [],
    isLoading: groupsLoading,
    isError: groupsError,
  } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
    enabled: !isFree,
  });

  // Join WebSocket channels for all user's groups
  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach((group) => joinGroup(group.id));
    }
  }, [groups, joinGroup]);

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/most-deuces"],
    enabled: !isFree,
  });

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/most-deuces"] }),
    ]);
  }, [queryClient]);

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActivityTime = (lastActivity?: string) => {
    if (!lastActivity) return "Radio silence from the throne room.";
    const now = new Date();
    const activity = new Date(lastActivity);
    const diffInMinutes = Math.floor(
      (now.getTime() - activity.getTime()) / (1000 * 60),
    );
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // ── New user onboarding ──────────────────────────────────────────────────
  if (!user?.username) {
    return (
      <>
        <Onboarding onComplete={() => setShowLogModal(true)} />
        <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
      </>
    );
  }

  // ── Pull-to-refresh indicator ────────────────────────────────────────────
  const PTRIndicator = () => (
    <div
      className="flex items-center justify-center overflow-hidden transition-all duration-200"
      style={{ height: isPulling || isRefreshing ? `${Math.max(pullDistance, isRefreshing ? 48 : 0)}px` : 0 }}
    >
      <div
        className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center transition-transform ${
          isRefreshing ? "animate-spin border-b-transparent" : ""
        }`}
        style={{ transform: `rotate(${Math.min(pullDistance / THRESHOLD_DEG, 1) * 360}deg)` }}
      >
        {!isRefreshing && <span className="text-sm">↓</span>}
      </div>
    </div>
  );

  const THRESHOLD_DEG = 80;

  // ── Free tier ───────────────────────────────────────────────────────────
  if (isFree) {
    return (
      <div className="pt-6 pb-24 flex flex-col items-center">
        {/* Log Deuce */}
        <div className="w-full mb-10">
          <Button
            onClick={() => setShowLogModal(true)}
            className="btn-shimmer w-full text-white py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            <span className="text-3xl mr-3">🚽</span>
            Log a Deuce
          </Button>
        </div>

        {/* Total Deuces */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-2xl mb-10 border border-border">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
                Total Deuces
              </p>
              <p className="stat-number text-5xl text-foreground">
                {user?.deuceCount || 0}
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">💩</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Premium upsell */}
        <div className="w-full bg-card border border-border rounded-2xl p-6">
          <div className="text-center mb-4">
            <span className="text-4xl">👑</span>
            <h3 className="text-xl font-extrabold text-foreground mt-2">
              Unlock the Full Throne Experience
            </h3>
          </div>
          <ul className="space-y-3 mb-6">
            {[
              ["🏆", "Compete with your squad"],
              ["🎯", "Deuce Bingo"],
              ["🛡️", "Streak Insurance"],
              ["🎨", "Custom themes"],
            ].map(([emoji, text]) => (
              <li key={text} className="flex items-center gap-3 text-foreground">
                <span className="text-lg">{emoji}</span>
                <span className="font-medium">{text}</span>
              </li>
            ))}
          </ul>
          <Link href="/premium">
            <Button className="btn-shimmer w-full text-white py-4 text-base font-bold rounded-xl">
              Go Premium
            </Button>
          </Link>
        </div>

        <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
      </div>
    );
  }

  // ── Premium tier: full home ─────────────────────────────────────────────
  return (
    <div className="pt-6 pb-24">
      {/* Pull-to-refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height:
            isPulling || isRefreshing
              ? `${Math.max(pullDistance, isRefreshing ? 48 : 0)}px`
              : 0,
          transition: isPulling ? "none" : "height 0.2s ease",
        }}
      >
        <div
          className={`w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary ${
            isRefreshing ? "animate-spin border-b-transparent" : ""
          }`}
        >
          {!isRefreshing && <span className="text-sm leading-none">↓</span>}
        </div>
      </div>

      {/* Log Deuce Button */}
      <div className="mb-8">
        <Button
          onClick={() => setShowLogModal(true)}
          className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
        >
          <span className="text-2xl mr-3">🚽</span>
          Log a Deuce
        </Button>
      </div>

      {/* Total Deuces */}
      <div className="relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-2xl mb-8 border border-border">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
              Total Deuces
            </p>
            <p className="stat-number text-5xl text-foreground">
              {user?.deuceCount ?? 0}
            </p>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">💩</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Peak Throne Days */}
      <Card className="mb-8 border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Peak Throne Days
          </h3>
          {analytics && analytics.count > 0 ? (
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Top Day
                  </p>
                  <p className="text-lg font-extrabold text-foreground">
                    {formatDate(analytics.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Count
                  </p>
                  <p className="stat-number text-3xl text-primary">
                    {analytics.count}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center border border-border">
              <p className="text-5xl mb-3">🚽</p>
              <p className="font-extrabold text-foreground text-lg">
                The throne is quiet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Log your first deuce to get the party started
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Premium Perks Hub */}
      <Card className="mb-8 border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">👑</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Your Premium Perks
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/bingo">
              <div className="bg-muted rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-muted/80 active:scale-[0.97] transition-all">
                <span className="text-2xl mb-1">🎯</span>
                <span className="text-xs font-bold text-foreground">Deuce Bingo</span>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-muted rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-muted/80 active:scale-[0.97] transition-all">
                <span className="text-2xl mb-1">🛡️</span>
                <span className="text-xs font-bold text-foreground">Streak Insurance</span>
                <span
                  className={`text-[10px] font-bold mt-0.5 ${
                    user?.streakInsuranceUsed ? "text-muted-foreground" : "text-green-500"
                  }`}
                >
                  {user?.streakInsuranceUsed ? "Used" : "Active"}
                </span>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-muted rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-muted/80 active:scale-[0.97] transition-all">
                <span className="text-2xl mb-1">🏆</span>
                <span className="text-xs font-bold text-foreground">Gold Badge</span>
                <span
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: "hsl(45, 88%, 48%)" }}
                >
                  Yours
                </span>
              </div>
            </Link>

            <Link href="/profile">
              <div className="bg-muted rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-muted/80 active:scale-[0.97] transition-all">
                <span className="text-2xl mb-1">📊</span>
                <span className="text-xs font-bold text-foreground">
                  Throne Analytics
                </span>
              </div>
            </Link>

            <Link href="/settings">
              <div className="col-span-2 bg-muted rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:bg-muted/80 active:scale-[0.97] transition-all">
                <span className="text-2xl mb-1">🎨</span>
                <span className="text-xs font-bold text-foreground">Custom Themes</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Groups List */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Your Squads
        </h3>

        {groupsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <GroupCardSkeleton key={i} />
            ))}
          </div>
        ) : groupsError ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-bold text-foreground mb-1">Couldn't load your squads.</p>
            <p className="text-sm text-muted-foreground">
              Check your connection and try refreshing.
            </p>
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-3">
            {groups.map((group, idx) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <div
                  className="feed-entry bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.99]"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-xl">👥</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground truncate">
                          {group.name}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {group.memberCount} members · {group.entryCount} deuces
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge
                        variant={group.lastActivity ? "default" : "secondary"}
                        className="mb-1 rounded-full text-xs font-bold"
                      >
                        {group.lastActivity ? "Active" : "Quiet"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {getActivityTime(group.lastActivity)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyFeedState />
        )}
      </div>

      <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
    </div>
  );
}
