import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CreateGroupModal } from "@/components/create-group-modal";
// PremiumGate removed from squads — core social feature, free for all users

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  entryCount: number;
  lastActivity?: string;
  currentStreak: number;
  longestStreak: number;
}

export default function Groups() {
  const { user } = useAuth();
  const { joinGroup } = useWebSocket();
  const [showCreateModal, setShowCreateModal] = useState(false);
  // Squads are free for all users — premium gates only on add-on features

  const { data: groups = [], isLoading, isError } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  // Join WebSocket channels for all user's groups
  useEffect(() => {
    if (groups.length > 0) {
      groups.forEach(group => {
        joinGroup(group.id);
      });
    }
  }, [groups, joinGroup]);

  const getActivityTime = (lastActivity?: string) => {
    if (!lastActivity) return "Radio silence from the throne room.";

    const now = new Date();
    const activity = new Date(lastActivity);
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground">Squads</h2>
      </div>

      {/* Create Group — always-visible CTA */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          aria-label="Start a new squad"
        >
          <span className="mr-2">+</span> Start a Squad
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" role="status" aria-label="Loading squads">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-1/3 rounded" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="w-8 h-8 rounded-full border-2 border-background" />
                  ))}
                </div>
                <Skeleton className="h-3 w-16 rounded ml-3" />
              </div>
              <Skeleton className="h-4 w-full rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">⚠️</p>
          <p className="font-bold text-foreground mb-1">Couldn't load your squads.</p>
          <p className="text-sm text-muted-foreground">Check your connection and try refreshing.</p>
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map((group, idx) => (
            <Link key={group.id} href={`/groups/${group.id}`}>
              <div
                className="feed-entry bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all active:scale-[0.98] cursor-pointer"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground truncate">{group.name}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    {group.currentStreak > 0 && (
                      <Badge variant="secondary" className="rounded-full text-xs font-bold bg-orange-100 text-orange-700 border-orange-200">
                        🔥 {group.currentStreak}d
                      </Badge>
                    )}
                    <Badge variant={group.lastActivity ? "default" : "secondary"} className="rounded-full text-xs font-bold">
                      {group.lastActivity ? "Active" : "Quiet"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(group.memberCount, 3) }).map((_, i) => (
                      <Avatar key={i} className="w-7 h-7 border-2 border-background">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.id}-${i}`} />
                        <AvatarFallback className="text-xs">M{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="w-7 h-7 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-[10px] font-bold text-muted-foreground">+{group.memberCount - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 font-medium">
                    {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {group.entryCount} deuce{group.entryCount !== 1 ? "s" : ""} • {getActivityTime(group.lastActivity)}
                  </p>
                  {group.longestStreak > 0 && group.longestStreak > group.currentStreak && (
                    <p className="text-[10px] text-muted-foreground">
                      Best: {group.longestStreak}d
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-6xl mb-4">🪑</p>
          <h3 className="text-xl font-extrabold text-foreground mb-2">No squads yet. Lonely throne vibes.</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Every great movement starts with one person. Start a squad and rally your crew.
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 py-2"
          >
            Start a Squad
          </Button>
        </div>
      )}

      <CreateGroupModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
