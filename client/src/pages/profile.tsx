import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { EditUsernameModal } from "@/components/edit-username-modal";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { Edit2 } from "lucide-react";
import { getUserDisplayName } from "@/lib/userUtils";

interface Analytics {
  date: string;
  count: number;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  entryCount: number;
}

export default function Profile() {
  const { user } = useAuth();
  const { isDark, toggleDark } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/most-deuces"],
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const streak = user?.deuceCount || 0;
  const bestDayCount = analytics?.count || 0;

  return (
    <div className="pt-6 pb-24">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="ring-[3px] ring-primary ring-offset-2 ring-offset-background rounded-full">
            <ProfilePictureUpload user={user} size="lg" />
          </div>
        </div>
        <h2 className="text-2xl font-extrabold text-foreground">
          {user ? getUserDisplayName(user) : "User"}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-muted-foreground">
            {user?.username ? `@${user.username}` : "Set a username"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditUsernameOpen(true)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
        <span className="inline-block mt-2 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Throne Philosopher
        </span>
      </div>

      {/* Stats Grid — 2x2 with gradient background */}
      <div className="relative bg-gradient-to-b from-muted/50 to-transparent p-4 -mx-4 mb-6 rounded-2xl">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-4xl text-primary">{user?.deuceCount || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Total Deuces</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-4xl text-blue-500">{groups.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Groups</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-4xl text-amber-500">🔥 {streak}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Streak</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-4xl text-purple-500">{bestDayCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Best Day</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {groups.length > 0 ? (
            groups.slice(0, 3).map((group) => (
              <div key={group.id} className="flex items-center">
                <div className="w-2.5 h-2.5 bg-primary rounded-full mr-3"></div>
                <span className="text-sm text-foreground flex-1 font-medium">
                  Member of {group.name}
                </span>
                <span className="text-xs text-muted-foreground font-bold">
                  {group.entryCount} entries
                </span>
              </div>
            ))
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center border border-border">
              <p className="text-5xl mb-3">📜</p>
              <p className="font-extrabold text-foreground text-lg">Your legacy begins here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="text-sm font-medium text-foreground">
              Throne Alerts
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-sm font-medium text-foreground">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={isDark}
              onCheckedChange={toggleDark}
            />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <Button
          onClick={() => window.location.href = "/api/logout"}
          variant="destructive"
          className="w-full rounded-xl font-bold"
        >
          Leave the Throne Room
        </Button>
      </div>

      <EditUsernameModal
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        currentUsername={user?.username || ""}
      />
    </div>
  );
}
