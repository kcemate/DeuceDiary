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
      profileImageUrl?: string;
      deuceCount: number;
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
      profileImageUrl?: string;
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
    onSuccess: async (response: any) => {
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

  const isAdmin = (member: any) => member.role === "admin";
  const isCurrentUserAdmin = groupDetail?.members.find(m => m.user.id === user?.id)?.role === "admin";

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/groups")}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Button>
          <h2 className="text-xl font-bold text-foreground">{groupDetail.group.name}</h2>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => leaveGroupMutation.mutate()}
          disabled={leaveGroupMutation.isPending}
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
          </CardContent>
        </Card>
      )}

      {/* Members */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Members ({groupDetail.members.length})</h3>
            <Button
              onClick={() => inviteCrewMutation.mutate()}
              disabled={inviteCrewMutation.isPending}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {inviteCrewMutation.isPending ? "Generating..." : "Invite Your Crew"}
            </Button>
          </div>
          {inviteCode && (
            <p className="text-xs text-muted-foreground mb-3 text-center font-mono break-all">
              Invite code: {inviteCode}
            </p>
          )}
          <div className="space-y-3">
            {groupDetail.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <StreakFrame currentStreak={streakData?.currentStreak ?? 0}>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {getInitials(member.user)}
                      </AvatarFallback>
                    </Avatar>
                  </StreakFrame>
                  <div>
                    <p className="font-medium text-foreground">
                      {getUserDisplayName(member.user)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getUserSecondaryInfo(member.user)}
                    </p>
                    {member.user.personalRecord && (
                      <p className="text-xs text-muted-foreground">
                        PR: {formatDate(member.user.personalRecord.date)} - {member.user.personalRecord.count} deuce{member.user.personalRecord.count !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={isAdmin(member) ? "default" : "secondary"}>
                  {isAdmin(member) ? "Admin" : "Member"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Recent Drops</h3>
          {groupDetail.entries.length > 0 ? (
            <div className="space-y-4">
              {groupDetail.entries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-primary pl-4 py-2">
                  <div className="flex items-center mb-2">
                    <StreakFrame currentStreak={streakData?.currentStreak ?? 0} className="mr-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={entry.user.profileImageUrl || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(entry.user)}
                        </AvatarFallback>
                      </Avatar>
                    </StreakFrame>
                    <span className="text-sm font-medium text-foreground">
                      {getUserDisplayName(entry.user)}
                    </span>
                    <div className="text-xs text-muted-foreground ml-auto text-right">
                      <div>{formatDate(entry.loggedAt)}</div>
                      <div>{formatTime(entry.loggedAt)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-2">{entry.thoughts}</p>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{entry.location}</span>
                  </div>
                  <Reactions entryId={entry.id} />
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
