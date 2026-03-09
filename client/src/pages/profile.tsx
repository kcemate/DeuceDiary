import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";
import { EditUsernameModal } from "@/components/edit-username-modal";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { ShareCardModal } from "@/components/ShareCardModal";
import { StreakFrame } from "@/components/streak-frame";
import { Edit2, Share2, Award, Flame } from "lucide-react";
import { getUserDisplayName } from "@/lib/userUtils";
import { WeeklyThroneReport } from "@/components/WeeklyThroneReport";
import { useToast } from "@/hooks/use-toast";
import { AchievementBadge } from "@/components/Badge";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  tier: "free" | "premium";
}

interface Analytics {
  date: string;
  count: number;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  entryCount: number;
  currentStreak?: number;
}

// ── Streak tier helpers ─────────────────────────────────────────────────────
function getStreakTier(streak: number): {
  label: string;
  color: string;
  bg: string;
  icon: string;
} {
  if (streak >= 365)
    return { label: "Diamond", color: "#67e8f9", bg: "bg-cyan-500/10", icon: "💎" };
  if (streak >= 90)
    return { label: "Gold", color: "hsl(45,88%,48%)", bg: "bg-amber-500/10", icon: "🥇" };
  if (streak >= 30)
    return { label: "Silver", color: "#9ca3af", bg: "bg-gray-400/10", icon: "🥈" };
  if (streak >= 7)
    return { label: "Bronze", color: "#b45309", bg: "bg-amber-700/10", icon: "🥉" };
  return { label: "Starter", color: "hsl(var(--muted-foreground))", bg: "bg-muted", icon: "🔥" };
}

// ── Deuce count milestone badges ───────────────────────────────────────────
const MILESTONES = [
  { count: 10, emoji: "🚽", label: "First Flush" },
  { count: 50, emoji: "💩", label: "Brown Belt" },
  { count: 100, emoji: "🏆", label: "Century Club" },
  { count: 500, emoji: "👑", label: "Throne Master" },
];

function MilestoneBadge({
  milestone,
  unlocked,
}: {
  milestone: (typeof MILESTONES)[number];
  unlocked: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${
        unlocked
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-muted/50 opacity-40 grayscale"
      }`}
    >
      <span className="text-2xl">{milestone.emoji}</span>
      <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight text-foreground">
        {milestone.label}
      </span>
      <span className="text-[9px] text-muted-foreground font-medium">
        {milestone.count}+
      </span>
    </div>
  );
}

// ── Member since formatter ──────────────────────────────────────────────────
function formatMemberSince(dateStr?: string | null): string {
  if (!dateStr) return "OG Member";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Profile() {
  const { user } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: analytics } = useQuery<Analytics>({
    queryKey: ["/api/analytics/most-deuces"],
  });

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const { data: badges = [] } = useQuery<BadgeData[]>({
    queryKey: ["/api/user/badges"],
    enabled: !!user?.id,
  });

  const bestDayCount = analytics?.count || 0;
  const maxStreak = Math.max(0, ...groups.map((g) => g.currentStreak ?? 0));
  const streakTier = getStreakTier(maxStreak);
  const deuceCount = user?.deuceCount ?? 0;

  return (
    <div className="pt-6 pb-24">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <StreakFrame
            currentStreak={maxStreak}
            className="ring-[3px] ring-primary ring-offset-2 ring-offset-background rounded-full"
          >
            <ProfilePictureUpload user={user} size="lg" />
          </StreakFrame>
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
            aria-label="Edit username"
          >
            <Edit2 className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>

        {/* Member since */}
        <p className="text-xs text-muted-foreground mt-1">
          Member since {formatMemberSince(user?.createdAt as unknown as string)}
        </p>

        <span className="inline-block mt-2 bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Throne Philosopher
        </span>
      </div>

      {/* ── Streak Card ──────────────────────────────────────────────── */}
      <div
        className={`rounded-2xl border border-border p-5 mb-6 ${streakTier.bg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{streakTier.icon}</div>
            <div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <p
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: streakTier.color }}
                >
                  {streakTier.label} Tier
                </p>
              </div>
              <p className="stat-number text-4xl text-foreground leading-none mt-0.5">
                {maxStreak}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                day streak
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              {(
                [
                  [7, "Bronze", "#b45309"],
                  [30, "Silver", "#9ca3af"],
                  [90, "Gold", "hsl(45,88%,48%)"],
                  [365, "Diamond", "#67e8f9"],
                ] as const
              ).map(([threshold, tierLabel, color]) => (
                <div key={tierLabel} className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor:
                        maxStreak >= threshold ? color : "transparent",
                      border: `1.5px solid ${color}`,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold"
                    style={{
                      color: maxStreak >= threshold ? color : "hsl(var(--muted-foreground))",
                    }}
                  >
                    {tierLabel} {threshold}d
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative bg-gradient-to-b from-muted/50 to-transparent p-4 -mx-4 mb-6 rounded-2xl">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-3xl text-primary">{deuceCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
              Deuces
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-3xl text-secondary">{groups.length}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
              Squads
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="stat-number text-3xl text-accent">{bestDayCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
              Peak Day
            </p>
          </div>
        </div>
      </div>

      {/* ── Milestone Badges ─────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">🚀</span>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Milestones
          </h3>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-primary font-medium">
            {MILESTONES.filter((m) => deuceCount >= m.count).length} /{" "}
            {MILESTONES.length}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {MILESTONES.map((m) => (
            <MilestoneBadge key={m.count} milestone={m} unlocked={deuceCount >= m.count} />
          ))}
        </div>
      </div>

      {/* Share Streak */}
      <div className="mb-6">
        <Button
          onClick={() => setShareOpen(true)}
          variant="secondary"
          className="w-full rounded-xl font-bold"
          aria-label="Share your streak card"
        >
          <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
          Share Your Streak
        </Button>
      </div>

      {/* Achievement Badges */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Achievements
          </h3>
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-amber-500 font-medium">
            {badges.filter((b) => b.unlocked).length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4 bg-card border border-border rounded-3xl p-6">
          {badges.length > 0 ? (
            badges.map((badge) => (
              <AchievementBadge
                key={badge.id}
                id={badge.id}
                name={badge.name}
                description={badge.description}
                emoji={badge.emoji}
                unlocked={badge.unlocked}
                tier={badge.tier}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-muted-foreground">
              <p className="text-2xl mb-2">🏆</p>
              <p className="font-medium">Log more deuces to unlock badges</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Report */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Weekly Report
        </h3>
        <WeeklyThroneReport />
      </div>

      {/* ── Squads with streak status ─────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Your Squads
        </h3>
        <div className="space-y-3">
          {groups.length > 0 ? (
            groups.slice(0, 5).map((group) => {
              const gs = group.currentStreak ?? 0;
              const tier = getStreakTier(gs);
              return (
                <div key={group.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-base">{tier.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.entryCount} deuces
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-xs font-black"
                      style={{ color: tier.color }}
                    >
                      🔥 {gs}d
                    </p>
                    <p
                      className="text-[10px] font-bold"
                      style={{ color: tier.color }}
                    >
                      {tier.label}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-muted rounded-xl p-8 text-center border border-border">
              <p className="text-5xl mb-3">🦗</p>
              <p className="font-extrabold text-foreground text-lg">
                Nothing to see here yet.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Join a squad and start dropping wisdom.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="push-notifications"
              className="text-sm font-medium text-foreground"
            >
              Throne Alerts
            </Label>
            <Switch
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <button
            onClick={() => setLocation("/settings")}
            className="flex items-center justify-between w-full"
          >
            <span className="text-sm font-medium text-foreground">Theme</span>
            <span className="text-sm text-muted-foreground">Customize →</span>
          </button>
          <button
            onClick={() => setLocation("/referral")}
            className="flex items-center justify-between w-full"
          >
            <span className="text-sm font-medium text-foreground">
              Refer Friends 🎁
            </span>
            <span className="text-sm text-muted-foreground">Share →</span>
          </button>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <Button
          onClick={() => (window.location.href = "/api/logout")}
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
      <ShareCardModal open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
