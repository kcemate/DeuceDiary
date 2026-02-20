import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { CreateGroupModal } from "@/components/create-group-modal";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  entryCount: number;
  lastActivity?: string;
}

export default function Groups() {
  const { joinGroup } = useWebSocket();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: groups = [], isLoading } = useQuery<Group[]>({
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
        <h2 className="text-2xl font-extrabold text-foreground">Groups</h2>
      </div>

      {/* Create Group — always-visible CTA */}
      <div className="mb-6">
        <Button
          onClick={() => setShowCreateModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-base font-bold rounded-2xl shadow-lg shadow-primary/20"
        >
          <span className="mr-2">+</span> Create Group
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-5 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded-full w-16"></div>
              </div>
              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="w-8 h-8 bg-muted rounded-full border-2 border-background"></div>
                  ))}
                </div>
                <div className="h-3 bg-muted rounded w-16 ml-3"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.id} className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-foreground">{group.name}</h3>
                <Badge variant={group.lastActivity ? "default" : "secondary"} className="rounded-full text-xs font-bold">
                  {group.lastActivity ? "Active" : "Quiet"}
                </Badge>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(group.memberCount, 3) }).map((_, i) => (
                    <Avatar key={i} className="w-8 h-8 border-2 border-background">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.id}-${i}`} />
                      <AvatarFallback className="text-xs">M{i + 1}</AvatarFallback>
                    </Avatar>
                  ))}
                  {group.memberCount > 3 && (
                    <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">+{group.memberCount - 3}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-muted-foreground ml-3 font-medium">
                  {group.memberCount} members
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {group.entryCount} entries • {getActivityTime(group.lastActivity)}
                </p>
                <Link href={`/groups/${group.id}`}>
                  <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs border-border hover:border-primary/50">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <p className="text-6xl mb-4">💩</p>
          <h3 className="text-xl font-extrabold text-foreground mb-2">No squads yet.</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Create a group and invite your dudes
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-8 py-2"
          >
            Create Group
          </Button>
        </div>
      )}

      <CreateGroupModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
