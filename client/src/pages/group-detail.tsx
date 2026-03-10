import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { Reactions } from "@/components/reactions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { getUserDisplayName, getInitials } from "@/lib/userUtils";
import { StreakFrame } from "@/components/streak-frame";
import { GoldCrownBadge } from "@/components/gold-crown-badge";
import { GroupLeaderboard } from "@/components/group-leaderboard";
import { GroupWeeklyReport } from "@/components/group-weekly-report";

type TabId = "feed" | "members" | "stats";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  memberCount: number;
  logsToday: Array<{
    userId: string;
    username: string;
    hasLogged: boolean;
    profileImageUrl?: string;
  }>;
}

interface GroupDetail {
  group: {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
  };
  members: Array<{
    id: number;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      profileImageUrl?: string;
      deuceCount: number;
      subscription?: string;
      subscriptionExpiresAt?: string | null;
      personalRecord?: {
        date: string;
        count: number;
      };
    };
  }>;
  entries: Array<{
    id: string;
    thoughts: string;
    location: string;
    loggedAt: string;
    createdAt: string;
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      profileImageUrl?: string;
      subscription?: string;
      subscriptionExpiresAt?: string | null;
    };
  }>;
}

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("feed");
  const [copySuccess, setCopySuccess] = useState(false);

  const { data: groupDetail, isLoading } = useQuery<GroupDetail>({
    queryKey: ["/api/groups", groupId],
    enabled: !!groupId,
  });

  const { data: streakData } = useQuery<StreakData>({
    queryKey: [`/api/groups/${groupId}/streak`],
    enabled: !!groupId,
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/leave`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to leave group");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "You're out",
        description: "You left the squad. They'll miss your wisdom.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setLocation("/groups");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Couldn't leave",
        description: "Something clogged up. Try again.",
        variant: "destructive",
      });
    },
  });

  const inviteCrewMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/groups/${groupId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to create invite");
      return response.json();
    },
    onSuccess: (response: { id: string }) => {
      const code = response.id;
      if (code) setInviteCode(code);
    },
    onError: () => {
      toast({ title: "Error", description: "Couldn't generate invite. Try again.", variant: "destructive" });
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Remove old helper functions - now using utility functions

  const getStreakTier = (streak: number) => {
    if (streak >= 30) return { label: "Diamond", emoji: "💎" };
    if (streak >= 14) return { label: "Gold", emoji: "🥇" };
    if (streak >= 7) return { label: "Silver", emoji: "🥈" };
    if (streak >= 3) return { label: "Bronze", emoji: "🥉" };
    return null;
  };

  const isAdmin = (member: { role: string }) => member.role === "admin";
  const isCurrentUserAdmin = groupDetail?.members.find(m => m.user.id === user?.id)?.role === "admin";

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

  const groupedEntries = (groupDetail?.entries ?? []).reduce((acc, entry) => {
    const group = getDateGroup(entry.loggedAt);
    if (!acc[group]) acc[group] = [];
    acc[group].push(entry);
    return acc;
  }, {} as Record<string, GroupDetail["entries"]>);

  if (isLoading) {
    return (
      <div className="pt-6 pb-24">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mb-6"></div>
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!groupDetail) {
    return (
      <div className="pt-6 pb-24">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-5xl mb-3">🚫</p>
            <h3 className="text-lg font-bold text-foreground mb-2">This squad doesn't exist.</h3>
            <p className="text-muted-foreground mb-4">
              Either it got flushed or you don't have a seat at this table.
            </p>
            <Button onClick={() => setLocation("/groups")}>
              Back to Squads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derive which members logged today for green-dot indicator
  const loggedTodayIds = new Set(
    (streakData?.logsToday ?? []).filter(m => m.hasLogged).map(m => m.userId)
  );

  // Generate a consistent squad emoji from group name
  const squadEmojis = ["🚽", "💩", "🧻", "🏆", "🔥", "⚡", "🌊", "💎"];
  const squadEmoji = squadEmojis[
    groupDetail.group.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % squadEmojis.length
  ];

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: "feed", label: "Feed", count: groupDetail.entries.length },
    { id: "members", label: "Members", count: groupDetail.members.length },
    { id: "stats", label: "Stats" },
  ];

  return (
    <div className="pb-24">
      {/* Squad Hero Header */}
      <div className="pt-4 pb-3 px-1">
        {/* Top action row */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/groups")}
            aria-label="Back to squads"
            className="shrink-0 -ml-2 text-muted-foreground"
          >
            <svg className="w-4 h-4 mr-1" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Squads
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => leaveGroupMutation.mutate()}
            disabled={leaveGroupMutation.isPending}
            aria-label={`Leave ${groupDetail?.group.name ?? "this squad"}`}
            className="text-destructive border-destructive/40 hover:bg-destructive hover:text-destructive-foreground text-xs"
          >
            Dip Out
          </Button>
        </div>

        {/* Squad identity */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shrink-0 border border-primary/20">
            {squadEmoji}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-black text-foreground leading-tight truncate">
              {groupDetail.group.name}
            </h2>
            {groupDetail.group.description && (
              <p className="text-xs text-muted-foreground truncate">{groupDetail.group.description}</p>
            )}
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            👥 {groupDetail.members.length} member{groupDetail.members.length !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            💩 {groupDetail.entries.length} drop{groupDetail.entries.length !== 1 ? "s" : ""}
          </span>
          {streakData && streakData.currentStreak > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 text-xs font-bold text-orange-700 dark:text-orange-400">
              🔥 {streakData.currentStreak}d streak
            </span>
          )}
        </div>
      </div>

      {/* New member onboarding banner */}
      {groupDetail.entries.length > 0 && !groupDetail.entries.some(e => e.user.id === user?.id) && (
        <Card className="shadow-sm mb-3 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-3 flex items-center gap-3">
            <span className="text-2xl shrink-0">👋</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-foreground text-sm">Welcome to {groupDetail.group.name}!</p>
              <p className="text-xs text-muted-foreground">Log your first deuce to join the leaderboard.</p>
            </div>
            <Button size="sm" className="shrink-0 text-xs rounded-xl" onClick={() => setLocation("/")}>
              Log Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border mb-4">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-1 text-xs ${activeTab === tab.id ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── FEED TAB ── */}
      {activeTab === "feed" && (
        <div>
          {groupDetail.entries.length > 0 ? (
            <div className="space-y-1">
              {Object.entries(groupedEntries).map(([dateLabel, entries]) => (
                <div key={dateLabel}>
                  {/* Date divider */}
                  <div className="flex items-center gap-2 py-2 px-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{dateLabel}</span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">{entries.length}</span>
                  </div>
                  {/* Entry cards */}
                  <div className="space-y-3 mb-2">
                    {entries.map((entry) => (
                      <Card key={entry.id} className="shadow-sm border-border/60">
                        <CardContent className="p-3">
                          {/* Author row */}
                          <div className="flex items-center gap-2.5 mb-2">
                            <StreakFrame currentStreak={streakData?.currentStreak ?? 0}>
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={entry.user.profileImageUrl || undefined} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(entry.user)}
                                </AvatarFallback>
                              </Avatar>
                            </StreakFrame>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                                {getUserDisplayName(entry.user)}
                                <GoldCrownBadge
                                  subscription={entry.user.subscription}
                                  subscriptionExpiresAt={entry.user.subscriptionExpiresAt}
                                />
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formatTime(entry.loggedAt)}
                            </span>
                          </div>

                          {/* Thoughts */}
                          {entry.thoughts && (
                            <p className="text-sm text-foreground mb-2 leading-relaxed">
                              {entry.thoughts}
                            </p>
                          )}

                          {/* Location pill + Reactions footer */}
                          <div className="flex items-center justify-between">
                            {entry.location ? (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                                <svg className="w-3 h-3 shrink-0" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {entry.location}
                              </span>
                            ) : <span />}
                          </div>
                          <div className="mt-2">
                            <Reactions entryId={entry.id} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty feed state */
            <div className="text-center py-16 px-6">
              <p className="text-6xl mb-4">🫥</p>
              <p className="font-extrabold text-foreground text-xl mb-1">Dead air on the throne.</p>
              <p className="text-sm text-muted-foreground mb-6">
                No drops in this squad yet. Be the legend who goes first.
              </p>
              <Button
                onClick={() => setLocation("/")}
                className="rounded-2xl px-8 font-bold"
              >
                Drop the First Deuce
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {activeTab === "members" && (
        <div>
          {/* Invite section */}
          <Card className="shadow-sm mb-4 border-primary/20 bg-primary/5">
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Grow your squad</p>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    const res = await inviteCrewMutation.mutateAsync();
                    if (!res) return;
                    const link = `${window.location.origin}/invite/${res.id}`;
                    try {
                      await navigator.clipboard.writeText(link);
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                    } catch {
                      toast({ title: "Invite ready", description: link });
                    }
                  }}
                  disabled={inviteCrewMutation.isPending}
                  size="sm"
                  variant="outline"
                  className={`flex-1 rounded-xl text-xs font-bold transition-all ${
                    copySuccess ? "border-green-500 text-green-600 bg-green-50" : ""
                  }`}
                >
                  {copySuccess ? "✅ Link Copied!" : inviteCrewMutation.isPending ? "Generating..." : "📋 Copy Invite Link"}
                </Button>
                <Button
                  onClick={async () => {
                    let code = inviteCode;
                    if (!code) {
                      const res = await inviteCrewMutation.mutateAsync();
                      code = res?.id ?? null;
                    }
                    if (!code) return;
                    const link = `${window.location.origin}/invite/${code}`;
                    const text = `Join my squad "${groupDetail.group.name}" on Deuce Diary! 🚽\n${link}`;
                    if (navigator.share) {
                      try { await navigator.share({ title: "Join my squad!", text }); } catch {}
                    } else {
                      try { await navigator.clipboard.writeText(text); toast({ title: "Copied!", description: "Share with your crew." }); } catch {}
                    }
                  }}
                  disabled={inviteCrewMutation.isPending}
                  size="sm"
                  className="flex-1 rounded-xl text-xs font-bold"
                >
                  📤 Share
                </Button>
              </div>
              {inviteCode && (
                <p className="text-[10px] text-muted-foreground mt-2 text-center font-mono break-all">
                  {window.location.origin}/invite/{inviteCode}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Member list */}
          <div className="space-y-2">
            {(() => {
              const maxDeuces = Math.max(...groupDetail.members.map(m => m.user.deuceCount || 0), 1);
              const sortedMembers = [...groupDetail.members].sort((a, b) => (b.user.deuceCount || 0) - (a.user.deuceCount || 0));
              return sortedMembers.map((member, index) => {
                const count = member.user.deuceCount || 0;
                const pct = Math.round((count / maxDeuces) * 100);
                const loggedToday = loggedTodayIds.has(member.user.id);
                const isCurrentUser = member.user.id === user?.id;
                return (
                  <Card
                    key={member.id}
                    className={`shadow-sm border-border/60 ${isCurrentUser ? "border-primary/30 bg-primary/5" : ""}`}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        {/* Rank badge */}
                        <span className={`w-6 text-center text-xs font-black shrink-0 ${
                          index === 0 ? "text-amber-500" :
                          index === 1 ? "text-slate-400" :
                          index === 2 ? "text-amber-700" :
                          "text-muted-foreground"
                        }`}>
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                        </span>

                        {/* Avatar with today's check-in ring */}
                        <div className="relative shrink-0">
                          <StreakFrame currentStreak={streakData?.currentStreak ?? 0}>
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.user.profileImageUrl || undefined} />
                              <AvatarFallback>{getInitials(member.user)}</AvatarFallback>
                            </Avatar>
                          </StreakFrame>
                          {/* Today's check-in dot */}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center text-[8px] ${
                              loggedToday ? "bg-green-500" : "bg-muted"
                            }`}
                            title={loggedToday ? "Logged today ✅" : "Not yet logged today"}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <p className={`font-semibold truncate text-sm ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                              {getUserDisplayName(member.user)}
                              {isCurrentUser && <span className="text-muted-foreground font-normal ml-1 text-xs">(you)</span>}
                            </p>
                            <GoldCrownBadge
                              subscription={member.user.subscription}
                              subscriptionExpiresAt={member.user.subscriptionExpiresAt}
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex-1 bg-muted rounded-full h-1">
                              <div
                                className="bg-primary/60 h-1 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {count} drop{count !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Role + today status */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {isAdmin(member) && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">Admin</Badge>
                          )}
                          <span className="text-sm" title={loggedToday ? "Logged today" : "Not logged today"}>
                            {loggedToday ? "✅" : "⏳"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* ── STATS TAB ── */}
      {activeTab === "stats" && (
        <div>
          {/* Streak Card */}
          {streakData && (
            <Card className="shadow-sm mb-4 border-orange-200 dark:border-orange-900">
              <CardContent className="p-4">
                {/* Streak number + tier */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">🔥</span>
                    <div>
                      <p className="text-3xl font-extrabold text-foreground leading-none">
                        {streakData.currentStreak}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {streakData.currentStreak > 0
                          ? `${streakData.currentStreak}-day streak`
                          : "Start a streak — log today!"}
                      </p>
                    </div>
                  </div>
                  {(() => {
                    const tier = getStreakTier(streakData.currentStreak);
                    return tier ? (
                      <Badge variant="secondary" className="text-sm px-3 py-1">
                        {tier.emoji} {tier.label}
                      </Badge>
                    ) : null;
                  })()}
                </div>

                {streakData.longestStreak > 0 && streakData.longestStreak > streakData.currentStreak && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Best: {streakData.longestStreak}-day streak
                  </p>
                )}

                {/* Today's check-in — horizontal avatar row */}
                <div className="border-t pt-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                    Today's Check-in
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {streakData.logsToday.map((member) => (
                      <div
                        key={member.userId}
                        className="flex flex-col items-center gap-1"
                        title={`${member.username} — ${member.hasLogged ? "logged ✅" : "not yet ⏳"}`}
                      >
                        <div className={`relative rounded-full p-0.5 ${
                          member.hasLogged
                            ? "ring-2 ring-green-400 ring-offset-1"
                            : "ring-2 ring-muted ring-offset-1"
                        }`}>
                          <Avatar className="w-9 h-9">
                            <AvatarImage src={member.profileImageUrl || undefined} />
                            <AvatarFallback className="text-xs">
                              {(member.username || "?")[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute -bottom-0.5 -right-0.5 text-xs leading-none">
                            {member.hasLogged ? "✅" : "⏳"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[40px]">
                          {member.username?.split(" ")[0] ?? "?"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Milestone progress bar */}
                {streakData.currentStreak < 30 && (
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className={streakData.currentStreak >= 3 ? "text-foreground font-semibold" : ""}>🥉 3</span>
                      <span className={streakData.currentStreak >= 7 ? "text-foreground font-semibold" : ""}>🥈 7</span>
                      <span className={streakData.currentStreak >= 14 ? "text-foreground font-semibold" : ""}>🥇 14</span>
                      <span className={streakData.currentStreak >= 30 ? "text-foreground font-semibold" : ""}>💎 30</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((streakData.currentStreak / 30) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {streakData.currentStreak === 0 && (
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Every member logs today to kick off a streak!
                  </p>
                )}

                {/* Streak rescue */}
                {streakData.currentStreak > 0 && streakData.logsToday.some(m => !m.hasLogged) && (
                  <div className="border-t pt-3 mt-3">
                    <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <div>
                          <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-tight">Streak at risk!</p>
                          <p className="text-xs text-red-500 leading-tight">
                            {streakData.logsToday.filter(m => !m.hasLogged).map(m => m.username).join(", ")}
                            {" "}still need{streakData.logsToday.filter(m => !m.hasLogged).length === 1 ? "s" : ""} to log.
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm"
                        onClick={async () => {
                          const groupName = groupDetail?.group.name ?? "our squad";
                          const streak = streakData.currentStreak;
                          const message = `🚨 STREAK ALERT 🔥\n\n"${groupName}" is on a ${streak}-day streak — but it's at risk!\n\nLog your deuce TODAY to keep it alive 🚽\n\n👉 ${window.location.origin}`;
                          if (navigator.share) {
                            try { await navigator.share({ title: "Save Our Streak!", text: message }); } catch {}
                          } else {
                            try {
                              await navigator.clipboard.writeText(message);
                              toast({ title: "Rescue message copied! 📋", description: "Paste it in your group chat." });
                            } catch {
                              toast({ title: "Share this:", description: message });
                            }
                          }
                        }}
                      >
                        🆘 Save Our Streak!
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Leaderboard */}
          {groupId && <GroupLeaderboard groupId={groupId} />}

          {/* Weekly Throne Report */}
          {groupId && <GroupWeeklyReport groupId={groupId} />}
        </div>
      )}
    </div>
  );
}
