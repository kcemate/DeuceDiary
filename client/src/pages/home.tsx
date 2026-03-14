import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { LogDeuceModal } from "@/components/log-deuce-modal";
import { Onboarding } from "@/components/Onboarding";
import { Reactions } from "@/components/reactions";
import { RankStrip } from "@/components/rank-strip";
import { StreakStrip } from "@/components/streak-strip";
import { NextBadgeTeaser } from "@/components/next-badge-teaser";
import { BingoStrip } from "@/components/bingo-strip";
import { BingoNudge } from "@/components/bingo-nudge";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  entryCount: number;
  lastActivity?: string;
  currentStreak?: number;
}

interface Analytics {
  date: string;
  count: number;
}

interface FeedEntry {
  id: string;
  userId: string;
  groupId: string;
  location: string;
  thoughts: string | null;
  ghost: boolean;
  loggedAt: string;
  user: {
    id: string;
    username: string | null;
    profileImageUrl: string | null;
  };
  reactions: Array<{
    id: number;
    entryId: string;
    userId: string;
    emoji: string;
  }>;
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

// ── Feed entry skeleton ──────────────────────────────────────────────────
function FeedEntrySkeleton() {
  return (
    <div className="border-l-4 border-muted pl-3 py-2">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="w-7 h-7 rounded-full" />
        <Skeleton className="h-3.5 w-24 rounded" />
        <Skeleton className="h-3 w-12 rounded ml-auto" />
      </div>
      <Skeleton className="h-3 w-3/4 rounded mb-1.5" />
      <Skeleton className="h-3 w-16 rounded" />
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

  const {
    data: feedEntries = [],
    isLoading: feedLoading,
    isError: feedError,
  } = useQuery<FeedEntry[]>({
    queryKey: ["/api/deuces", { limit: 15 }],
    enabled: !isFree,
  });

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/most-deuces"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/deuces"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/bingo/current"] }),
    ]);
  }, [queryClient]);

  const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(handleRefresh);

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

  const THRESHOLD_DEG = 80;

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "Up late";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Late night";
  };

  // Feed helpers
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDateGroup = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const entryDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (entryDate.getTime() === today.getTime()) return "Today";
    if (entryDate.getTime() === yesterday.getTime()) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  // Build group name lookup from loaded groups
  const groupNameMap = new Map(groups.map(g => [g.id, g.name]));

  // Group feed entries by date
  const groupedFeedEntries = feedEntries.reduce((acc, entry) => {
    const group = getDateGroup(entry.loggedAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(entry);
    return acc;
  }, {} as Record<string, FeedEntry[]>);

  // ── Free tier ───────────────────────────────────────────────────────────
  if (isFree) {
    return (
      <div className="pt-6 pb-24">
        {/* Personalized greeting */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">
            {getGreeting()}, {user?.username || "friend"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user?.deuceCount === 0
              ? "Your throne room awaits its first royal visit."
              : `${user?.deuceCount ?? 0} lifetime deuces and counting.`}
          </p>
        </div>

        {/* Motivation strips */}
        <div className="space-y-2 mb-4">
          <RankStrip deuceCount={user?.deuceCount ?? 0} />
          <NextBadgeTeaser deuceCount={user?.deuceCount ?? 0} />
          {/* Bingo teaser for free users */}
          <Link href="/premium">
            <div className="rounded-2xl border border-border p-3 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99] bg-card">
              <div className="flex items-center gap-3">
                <div className="shrink-0 grid grid-cols-5 gap-[2px] w-8 h-8 opacity-40">
                  {Array.from({ length: 25 }, (_, i) => (
                    <div
                      key={i}
                      className="rounded-[1px]"
                      style={{
                        backgroundColor: [0, 6, 12, 18, 24].includes(i) ? "var(--primary)" : "var(--muted)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🎯</span>
                    <span className="text-xs font-bold text-foreground">Deuce Bingo</span>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full ml-auto">
                      Premium
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    25 monthly challenges — complete lines for BINGO!
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Log Deuce */}
        <div className="w-full mb-6">
          <Button
            onClick={() => setShowLogModal(true)}
            className="btn-shimmer w-full text-white py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
            aria-label="Log a new deuce"
          >
            <span className="text-3xl mr-3">🚽</span>
            Log a Deuce
          </Button>
        </div>

        {/* Total Deuces */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-2xl mb-6 border border-border">
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

      {/* Personalized greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          {getGreeting()}, {user?.username || "friend"} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {user?.deuceCount === 0
            ? "Your throne room awaits its first royal visit."
            : `${user?.deuceCount ?? 0} lifetime deuces and counting.`}
        </p>
      </div>

      {/* Motivation strips */}
      <div className="space-y-2 mb-4">
        <RankStrip deuceCount={user?.deuceCount ?? 0} />
        <StreakStrip maxStreak={Math.max(0, ...groups.map((g) => g.currentStreak ?? 0))} />
        <NextBadgeTeaser deuceCount={user?.deuceCount ?? 0} />
        <BingoStrip />
      </div>

      {/* Log Deuce Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowLogModal(true)}
          className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          aria-label="Log a new deuce"
        >
          <span className="text-2xl mr-3">🚽</span>
          Log a Deuce
        </Button>
      </div>

      {/* Compact stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="stat-number text-2xl text-foreground">{user?.deuceCount ?? 0}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Total</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="stat-number text-2xl text-primary">
            {analytics && analytics.count > 0 ? analytics.count : "—"}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Best Day</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="stat-number text-2xl text-foreground">{groups.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">Squads</p>
        </div>
      </div>

      {/* Premium Quick Links — horizontal scroll strip */}
      <div className="mb-6 -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { href: "/bingo", emoji: "🎯", label: "Bingo", highlight: true },
            { href: "/profile", emoji: "🛡️", label: user?.streakInsuranceUsed ? "Insurance (Used)" : "Insurance" },
            { href: "/profile", emoji: "📊", label: "Analytics" },
            { href: "/passport", emoji: "🗺️", label: "Passport" },
            { href: "/settings", emoji: "⚙️", label: "Settings" },
          ].map(({ href, emoji, label, highlight }) => (
            <Link key={label} href={href}>
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap cursor-pointer active:scale-[0.97] transition-all ${
                highlight
                  ? "bg-primary/10 border border-primary/30 hover:border-primary/50"
                  : "bg-card border border-border hover:border-primary/30"
              }`}>
                <span className="text-sm">{emoji}</span>
                <span className={`text-xs font-semibold ${highlight ? "text-primary" : "text-foreground"}`}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Recent Drops
        </h3>

        <div className="mb-4">
          <BingoNudge />
        </div>

        {feedLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <FeedEntrySkeleton key={i} />
            ))}
          </div>
        ) : feedError ? (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-bold text-foreground mb-1">Couldn't load your feed.</p>
            <p className="text-sm text-muted-foreground">Pull down to refresh.</p>
          </div>
        ) : feedEntries.length > 0 ? (
          <div className="space-y-1">
            {Object.entries(groupedFeedEntries).map(([dateLabel, entries]) => (
              <div key={dateLabel}>
                <div className="flex items-center gap-2 py-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{dateLabel}</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{entries.length}</span>
                </div>
                <div className="space-y-3 mb-3">
                  {entries.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-primary pl-3 py-1.5">
                      <div className="flex items-center mb-1.5">
                        <Avatar className="w-7 h-7 mr-2">
                          <AvatarImage src={entry.ghost ? undefined : (entry.user.profileImageUrl || undefined)} />
                          <AvatarFallback className="text-xs">
                            {entry.ghost ? "👻" : (entry.user.username || "?")[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {entry.ghost ? "Ghost Drop" : (entry.user.username || "Anonymous")}
                        </span>
                        {groupNameMap.get(entry.groupId) && (
                          <Link href={`/groups/${entry.groupId}`}>
                            <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0 rounded-full cursor-pointer hover:bg-muted/80">
                              {groupNameMap.get(entry.groupId)}
                            </Badge>
                          </Link>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatTime(entry.loggedAt)}
                        </span>
                      </div>
                      {entry.thoughts && !entry.ghost && (
                        <p className="text-sm text-foreground mb-1.5">{entry.thoughts}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <svg className="w-3 h-3" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{entry.location}</span>
                      </div>
                      <div className="mt-2">
                        <Reactions entryId={entry.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-3xl mb-2">🫥</p>
            <p className="font-bold text-foreground text-sm">No drops yet.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Be the first to log — your squads are waiting!
            </p>
          </div>
        )}
      </div>

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
