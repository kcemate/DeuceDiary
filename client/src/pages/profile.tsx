import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
          <ProfilePictureUpload user={user} size="lg" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
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
        <p className="text-muted-foreground text-sm">Throne Philosopher</p>
      </div>

      {/* Stats Grid — 2x2 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{user?.deuceCount || 0}</p>
            <p className="text-sm text-muted-foreground">Total Deuces</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{groups.length}</p>
            <p className="text-sm text-muted-foreground">Groups</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">🔥 {streak}</p>
            <p className="text-sm text-muted-foreground">Streak</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{bestDayCount}</p>
            <p className="text-sm text-muted-foreground">Best Day</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {groups.length > 0 ? (
              groups.slice(0, 3).map((group) => (
                <div key={group.id} className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-3"></div>
                  <span className="text-sm text-muted-foreground flex-1">
                    Member of {group.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {group.entryCount} entries
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-muted rounded-xl p-8 text-center">
                <p className="text-4xl mb-2">📜</p>
                <p className="font-bold text-foreground">Your legacy begins here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="shadow-sm mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-sm text-foreground">
                Throne Alerts
              </Label>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-sm text-foreground">
                Dark Mode
              </Label>
              <Switch
                id="dark-mode"
                checked={isDark}
                onCheckedChange={toggleDark}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <Button
            onClick={() => window.location.href = "/api/logout"}
            variant="destructive"
            className="w-full"
          >
            Leave the Throne Room
          </Button>
        </CardContent>
      </Card>

      <EditUsernameModal
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        currentUsername={user?.username || ""}
      />
    </div>
  );
}
