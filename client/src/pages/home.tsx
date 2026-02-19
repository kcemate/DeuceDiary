import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { LogDeuceModal } from "@/components/log-deuce-modal";

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

export default function Home() {
  const { user } = useAuth();
  const { joinGroup } = useWebSocket();
  const [showLogModal, setShowLogModal] = useState(false);

  const { data: groups = [], isLoading: groupsLoading } = useQuery<Group[]>({
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

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/most-deuces"],
  });

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
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="pt-6 pb-24">
      {/* Log Deuce Button */}
      <div className="mb-6">
        <Button
          onClick={() => setShowLogModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-semibold rounded-2xl shadow-lg"
        >
          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log a Deuce
        </Button>
      </div>

      {/* Personal Stats */}
      <div className="bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground p-6 rounded-2xl mb-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-secondary-foreground/80 text-sm">Total Deuces</p>
            <p className="text-3xl font-bold">{(user as any)?.deuceCount || 0}</p>
          </div>
          <div className="w-16 h-16 bg-secondary-foreground/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5h5.5l1.5 11zM10 16L8.5 5h5l-1.5 11zM15 16L13.5 5H19l-2 11z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Peak Throne Days */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Peak Throne Days</h3>
          {analytics && analytics.count > 0 ? (
            <div className="bg-secondary text-secondary-foreground p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm">Top Day</p>
                  <p className="text-lg font-bold">{formatDate(analytics.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-secondary-foreground/80 text-sm">Count</p>
                  <p className="text-2xl font-bold">{analytics.count}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center">
              <p className="text-4xl mb-3">🚽</p>
              <p className="font-bold text-foreground">The throne is quiet.</p>
              <p className="text-sm text-muted-foreground mt-1">Log your first deuce to get the party started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groups List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Groups</h3>

        {groupsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{group.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {group.memberCount} members • {group.entryCount} entries
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={group.lastActivity ? "default" : "secondary"} className="mb-1">
                          {group.lastActivity ? "Active" : "Quiet"}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {getActivityTime(group.lastActivity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center bg-muted rounded-xl">
              <p className="text-4xl mb-3">💩</p>
              <h3 className="text-lg font-bold text-foreground mb-1">No squads yet — start a poop posse!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gather your dudes. Your throne wisdom deserves an audience.
              </p>
              <Link href="/groups">
                <Button variant="outline">Create Group</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
    </div>
  );
}
