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
import { getUserDisplayName, getInitials, getUserSecondaryInfo } from "@/lib/userUtils";
import { StreakFrame } from "@/components/streak-frame";
import { GoldCrownBadge } from "@/components/gold-crown-badge";
import { GroupLeaderboard } from "@/components/group-leaderboard";
import { GroupWeeklyReport } from "@/components/group-weekly-report";

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
    onSuccess: async (response: { id: string }) => {
      const code = response.id;
      if (!code) return;
      setInviteCode(code);
      const link = `${window.location.origin}/invite/${code}`;
      try {
        await navigator.clipboard.writeText(link);
        toast({ title: "Invite link copied! 🚽", description: "Send it to your crew." });
      } catch {
        toast({ title: "Invite ready", description: link });
      }
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
  }, {} as Record<string, typeof groupDetail.entries>);

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

  return (
    <div className="pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/groups")}
            aria-label="Back to squads"
            className="shrink-0"
          >
            <svg className="w-4 h-4 mr-1" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
          <h2 className="text-xl font-bold text-foreground truncate">{groupDetail.group.name}</h2>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => leaveGroupMutation.mutate()}
          disabled={leaveGroupMutation.isPending}
          aria-label={`Leave ${groupDetail?.group.name ?? "this squad"}`}
        >
          Dip Out
        </Button>
      </div>

      {/* Streak Card */}
      {streakData && (
        <Card className="shadow-sm mb-6 border-orange-200 dark:border-orange-900">
          <CardContent className="p-4">
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

            {/* Member checklist */}
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Today's Check-in
              </p>
              <div className="space-y-2">
                {streakData.logsToday.map((member) => (
                  <div key={member.userId} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={member.profileImageUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {(member.username || "?")[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground flex-1 truncate">
                      {member.username}
                    </span>
                    <span className="text-base">{member.hasLogged ? "✅" : "⏳"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone roadmap */}
            {streakData.currentStreak < 30 && (
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className={streakData.currentStreak >= 3 ? "text-foreground font-semibold" : ""}>🥉 3</span>
                  <span className={streakData.currentStreak >= 7 ? "text-foreground font-semibold" : ""}>🥈 7</span>
                  <span className={streakData.currentStreak >= 14 ? "text-foreground font-semibold" : ""}>🥇 14</span>
                  <span className={streakData.currentStreak >= 30 ? "text-foreground font-semibold" : ""}>💎 30</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((streakData.currentStreak / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {streakData.currentStreak === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                Start a streak — every member logs today to begin!
              </p>
            )}

            {/* ── Streak Rescue button — shown when streak is active but someone hasn't logged ── */}
            {streakData.currentStreak > 0 && streakData.logsToday.some(m => !m.hasLogged) && (
              <div className="border-t pt-3 mt-3">
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-red-700 leading-tight">Streak at risk!</p>
                      <p className="text-xs text-red-500 leading-tight">
                        {streakData.logsToday.filter(m => !m.hasLogged).map(m => m.username).join(", ")}
                        {" "}still need{streakData.logsToday.filter(m => !m.hasLogged).length === 1 ? "s" : ""} to log today.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm text-sm"
                    onClick={async () => {
                      const groupName = groupDetail?.group.name ?? "our squad";
                      const streak = streakData.currentStreak;
                      const message = `🚨 STREAK ALERT 🔥\n\n"${groupName}" is on a ${streak}-day streak — but it's at risk!\n\nLog your deuce TODAY to keep it alive 🚽\n\n👉 ${window.location.origin}`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: "Save Our Streak!", text: message });
                        } catch {
                          // User cancelled — that's fine
                        }
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

      {/* Members */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-foreground">Members ({groupDetail.members.length})</h3>
            <Button
              onClick={() => inviteCrewMutation.mutate()}
              disabled={inviteCrewMutation.isPending}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 text-xs"
            >
              {inviteCrewMutation.isPending ? "Generating..." : "Invite Crew"}
            </Button>
          </div>
          {inviteCode && (
            <p className="text-xs text-muted-foreground mb-3 text-center font-mono break-all">
              Invite code: {inviteCode}
            </p>
          )}
          <div className="space-y-3">
            {(() => {
              const maxDeuces = Math.max(...groupDetail.members.map(m => m.user.deuceCount || 0), 1);
              const sortedMembers = [...groupDetail.members].sort((a, b) => (b.user.deuceCount || 0) - (a.user.deuceCount || 0));
              return sortedMembers.map((member) => {
                const count = member.user.deuceCount || 0;
                const pct = Math.round((count / maxDeuces) * 100);
                return (
                  <div key={member.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <StreakFrame currentStreak={streakData?.currentStreak ?? 0} className="shrink-0">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.user.profileImageUrl || undefined} />
                            <AvatarFallback>
                              {getInitials(member.user)}
                            </AvatarFallback>
                          </Avatar>
                        </StreakFrame>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate flex items-center gap-1">
                            {getUserDisplayName(member.user)}
                            <GoldCrownBadge
                              subscription={member.user.subscription}
                              subscriptionExpiresAt={member.user.subscriptionExpiresAt}
                            />
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {count} deuce{count !== 1 ? "s" : ""} total
                          </p>
                        </div>
                      </div>
                      <Badge variant={isAdmin(member) ? "default" : "secondary"} className="shrink-0">
                        {isAdmin(member) ? "Admin" : "Member"}
                      </Badge>
                    </div>
                    <div className="ml-[52px]">
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary/60 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Drops</h3>
          {groupDetail.entries.length > 0 ? (
            <div className="space-y-1">
              {Object.entries(groupedEntries).map(([dateLabel, entries]) => (
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
                          <StreakFrame currentStreak={streakData?.currentStreak ?? 0} className="mr-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={entry.user.profileImageUrl || undefined} />
                              <AvatarFallback className="text-xs">
                                {getInitials(entry.user)}
                              </AvatarFallback>
                            </Avatar>
                          </StreakFrame>
                          <span className="text-sm font-medium text-foreground flex items-center gap-1">
                            {getUserDisplayName(entry.user)}
                            <GoldCrownBadge
                              subscription={entry.user.subscription}
                              subscriptionExpiresAt={entry.user.subscriptionExpiresAt}
                            />
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTime(entry.loggedAt)}
                          </span>
                        </div>
                        {entry.thoughts && (
                          <p className="text-sm text-foreground mb-1.5">{entry.thoughts}</p>
                        )}
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <svg className="w-3 h-3 mr-1" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{entry.location}</span>
                          </div>
                        </div>
                        <Reactions entryId={entry.id} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-5xl mb-3">🫥</p>
              <p className="font-extrabold text-foreground text-lg">Dead air on the throne.</p>
              <p className="text-sm text-muted-foreground mt-1">No deuces in this squad yet. Be the first to drop one.</p>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
