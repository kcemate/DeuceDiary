import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { InviteModal } from "@/components/invite-modal";
import { Reactions } from "@/components/reactions";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { getUserDisplayName, getInitials, getUserSecondaryInfo } from "@/lib/userUtils";

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
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: groupDetail, isLoading } = useQuery<GroupDetail>({
    queryKey: ["/api/groups", groupId],
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
        title: "Success",
        description: "You have left the group",
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
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
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
            <h3 className="text-lg font-semibold text-foreground mb-2">Group not found</h3>
            <p className="text-muted-foreground mb-4">
              The group you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button onClick={() => setLocation("/groups")}>
              Back to Groups
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
          Leave Group
        </Button>
      </div>

      {/* Members */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Members ({groupDetail.members.length})</h3>
            <Button
              onClick={() => setShowInviteModal(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add a Dude
            </Button>
          </div>
          <div className="space-y-3">
            {groupDetail.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={member.user.profileImageUrl || undefined} />
                    <AvatarFallback>
                      {getInitials(member.user)}
                    </AvatarFallback>
                  </Avatar>
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
          <h3 className="font-semibold text-foreground mb-4">Recent Entries</h3>
          {groupDetail.entries.length > 0 ? (
            <div className="space-y-4">
              {groupDetail.entries.map((entry) => (
                <div key={entry.id} className="border-l-4 border-primary pl-4 py-2">
                  <div className="flex items-center mb-2">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={entry.user.profileImageUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(entry.user)}
                      </AvatarFallback>
                    </Avatar>
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
            <div className="text-center py-8 text-muted-foreground">
              <p>No entries yet</p>
              <p className="text-sm">Be the first to share your throne thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <InviteModal
        open={showInviteModal}
        onOpenChange={setShowInviteModal}
        groupId={groupId!}
      />
    </div>
  );
}
