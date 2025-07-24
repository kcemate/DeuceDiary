import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
    if (!lastActivity) return "No activity";
    
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
        <h2 className="text-xl font-bold text-foreground">Groups</h2>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Create Group
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-5 bg-muted rounded w-1/3"></div>
                  <div className="h-6 bg-muted rounded w-16"></div>
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
              </CardContent>
            </Card>
          ))}
        </div>
      ) : groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id} className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{group.name}</h3>
                  <Badge variant={group.lastActivity ? "default" : "secondary"}>
                    {group.lastActivity ? "Active" : "Quiet"}
                  </Badge>
                </div>
                
                <div className="flex items-center mb-3">
                  <div className="flex -space-x-2">
                    {/* Mock member avatars */}
                    {Array.from({ length: Math.min(group.memberCount, 3) }).map((_, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${group.id}-${i}`} />
                        <AvatarFallback className="text-xs">M{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.memberCount > 3 && (
                      <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium text-muted-foreground">+{group.memberCount - 3}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground ml-3">
                    {group.memberCount} members
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {group.entryCount} entries • {getActivityTime(group.lastActivity)}
                  </p>
                  <Link href={`/groups/${group.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first group to start sharing throne thoughts with your dudes
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Group
            </Button>
          </CardContent>
        </Card>
      )}

      <CreateGroupModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
