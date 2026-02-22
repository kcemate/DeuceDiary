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
  const isFree = (user as any)?.subscription !== "premium";

  const { data: groups = [], isLoading: groupsLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
    enabled: !isFree,
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
    enabled: !isFree,
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

  // ── Free tier: stripped-down home ──
  if (isFree) {
    return (
      <div className="pt-6 pb-24 flex flex-col items-center">
        {/* Log Deuce — the one free action */}
        <div className="w-full mb-10">
          <Button
            onClick={() => setShowLogModal(true)}
            className="btn-shimmer w-full text-white py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
          >
            <span className="text-3xl mr-3">🚽</span>
            Log a Deuce
          </Button>
        </div>

        {/* Total Deuces — still visible for free */}
        <div className="w-full relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-2xl mb-10 border border-border">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Total Deuces</p>
              <p className="stat-number text-5xl text-foreground">{(user as any)?.deuceCount || 0}</p>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">💩</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Premium upsell card */}
        <div className="w-full bg-card border border-border rounded-2xl p-6">
          <div className="text-center mb-4">
            <span className="text-4xl">👑</span>
            <h3 className="text-xl font-extrabold text-foreground mt-2">Unlock the Full Throne Experience</h3>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-foreground">
              <span className="text-lg">🏆</span>
              <span className="font-medium">Compete with your squad</span>
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <span className="text-lg">🔥</span>
              <span className="font-medium">Track your streaks</span>
            </li>
            <li className="flex items-center gap-3 text-foreground">
              <span className="text-lg">🎨</span>
              <span className="font-medium">Custom themes</span>
            </li>
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

  // ── Premium tier: full home ──
  return (
    <div className="pt-6 pb-24">
      {/* Log Deuce Button — THE main CTA */}
      <div className="mb-8">
        <Button
          onClick={() => setShowLogModal(true)}
          className="btn-shimmer w-full text-white py-5 text-lg font-bold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-[0.98]"
        >
          <span className="text-2xl mr-3">🚽</span>
          Log a Deuce
        </Button>
      </div>

      {/* Total Deuces — Strava-style stat card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-card to-muted p-6 rounded-2xl mb-8 border border-border">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">Total Deuces</p>
            <p className="stat-number text-5xl text-foreground">{(user as any)?.deuceCount || 0}</p>
          </div>
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">💩</span>
          </div>
        </div>
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      </div>

      {/* Peak Throne Days */}
      <Card className="mb-8 border border-border rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Peak Throne Days</h3>
          {analytics && analytics.count > 0 ? (
            <div className="bg-muted p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Top Day</p>
                  <p className="text-lg font-extrabold text-foreground">{formatDate(analytics.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Count</p>
                  <p className="stat-number text-3xl text-primary">{analytics.count}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center border border-border">
              <p className="text-5xl mb-3">🚽</p>
              <p className="font-extrabold text-foreground text-lg">The throne is quiet.</p>
              <p className="text-sm text-muted-foreground mt-1">Log your first deuce to get the party started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Groups List */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Your Squads</h3>

        {groupsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-3">
            {groups.map((group) => (
              <Link key={group.id} href={`/groups/${group.id}`}>
                <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-all cursor-pointer active:scale-[0.99]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-xl">👥</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {group.memberCount} members • {group.entryCount} deuces
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={group.lastActivity ? "default" : "secondary"} className="mb-1 rounded-full text-xs font-bold">
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
          <div className="bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-6xl mb-4">👻</p>
            <h3 className="text-xl font-extrabold text-foreground mb-2">Nobody's dropped anything yet.</h3>
            <p className="text-sm text-muted-foreground mb-6">
              It's quiet... too quiet. Start a squad and get your crew on the throne.
            </p>
            <Link href="/groups">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-6 py-2">Start a Squad</Button>
            </Link>
          </div>
        )}
      </div>

      <LogDeuceModal open={showLogModal} onOpenChange={setShowLogModal} />
    </div>
  );
}
