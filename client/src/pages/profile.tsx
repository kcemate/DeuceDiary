import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useLocation } from "wouter";
import { EditUsernameModal } from "@/components/edit-username-modal";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { ShareCardModal } from "@/components/ShareCardModal";
import { StreakFrame } from "@/components/streak-frame";
import { Edit2, Share2, Award, Flame, ChevronRight, Gift } from "lucide-react";
import { getUserDisplayName } from "@/lib/userUtils";
import { WeeklyThroneReport } from "@/components/WeeklyThroneReport";
import { AchievementBadge } from "@/components/Badge";
import { StreakInsuranceButton } from "@/components/streak-insurance-button";
import { ThroneAnalytics } from "@/components/throne-analytics";
import { ErrorBoundary } from "@/components/error-boundary";
import { GoldCrownBadge } from "@/components/gold-crown-badge";

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

// ── Throne rank / level system ───────────────────────────────────────────────
const THRONE_RANKS = [
  { min: 0, title: "Throne Rookie", icon: "🪑" },
  { min: 5, title: "Seat Warmer", icon: "🔰" },
  { min: 15, title: "Regular", icon: "📋" },
  { min: 30, title: "Throne Thinker", icon: "🤔" },
  { min: 50, title: "Brown Belt", icon: "🥋" },
  { min: 75, title: "Throne Philosopher", icon: "📜" },
  { min: 100, title: "Centurion", icon: "⚔️" },
  { min: 150, title: "Porcelain Pro", icon: "🏅" },
  { min: 250, title: "Throne Legend", icon: "🏆" },
  { min: 500, title: "Throne Master", icon: "👑" },
  { min: 1000, title: "Deuce Deity", icon: "⚡" },
] as const;

function getThroneRank(deuceCount: number) {
  let rank = THRONE_RANKS[0];
  let nextRank: (typeof THRONE_RANKS)[number] | null = THRONE_RANKS[1];
  for (let i = THRONE_RANKS.length - 1; i >= 0; i--) {
    if (deuceCount >= THRONE_RANKS[i].min) {
      rank = THRONE_RANKS[i];
      nextRank = i < THRONE_RANKS.length - 1 ? THRONE_RANKS[i + 1] : null;
      break;
    }
  }
  const level = THRONE_RANKS.indexOf(rank) + 1;
  const progressToNext = nextRank
    ? ((deuceCount - rank.min) / (nextRank.min - rank.min)) * 100
    : 100;
  return { rank, nextRank, level, progressToNext: Math.min(progressToNext, 100) };
}

// ── Member since formatter ──────────────────────────────────────────────────
function formatMemberSince(dateStr?: string | null): string {
  if (!dateStr) return "OG Member";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Profile() {
  const { user } = useAuth();
  const [editUsernameOpen, setEditUsernameOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [, setLocation] = useLocation();
  const isPremium = user?.subscription === "premium";

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
        <h2 className="text-2xl font-extrabold text-foreground flex items-center justify-center gap-2">
          {user ? getUserDisplayName(user) : "User"}
          <GoldCrownBadge
            subscription={user?.subscription}
            subscriptionExpiresAt={user?.subscriptionExpiresAt}
            size="md"
          />
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

        {(() => {
          const { rank, nextRank, level, progressToNext } = getThroneRank(deuceCount);
          return (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-sm">{rank.icon}</span>
                <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Lvl {level} — {rank.title}
                </span>
              </div>
              {nextRank && (
                <div className="max-w-[200px] mx-auto">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    {nextRank.min - deuceCount} more to {nextRank.title}
                  </p>
                </div>
              )}
            </div>
          );
        })()}
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
        {/* Next tier progress */}
        {(() => {
          const tiers = [0, 7, 30, 90, 365] as const;
          const currentIdx = tiers.findLastIndex((t) => maxStreak >= t);
          const nextThreshold = currentIdx < tiers.length - 1 ? tiers[currentIdx + 1] : null;
          const prevThreshold = tiers[currentIdx];
          if (!nextThreshold) return null;
          const progress = ((maxStreak - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
          const nextTier = getStreakTier(nextThreshold);
          return (
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-medium">
                  Next: {nextTier.icon} {nextTier.label}
                </span>
                <span className="text-[10px] font-bold" style={{ color: nextTier.color }}>
                  {nextThreshold - maxStreak}d to go
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: streakTier.color,
                  }}
                />
              </div>
            </div>
          );
        })()}
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

      {/* ── Deuce Pace Insights ────────────────────────────────────── */}
      {(() => {
        const memberSince = user?.createdAt ? new Date(user.createdAt as unknown as string) : null;
        const daysAsMember = memberSince
          ? Math.max(1, Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24)))
          : 1;
        const perDay = deuceCount / daysAsMember;
        const projectedYearly = Math.round(perDay * 365);
        return deuceCount > 0 ? (
          <div className="flex items-center justify-center gap-3 mb-6 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              📅 <span className="font-semibold text-foreground">{daysAsMember}</span> days active
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              📈 <span className="font-semibold text-foreground">{perDay.toFixed(1)}</span>/day
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              🎯 <span className="font-semibold text-foreground">{projectedYearly}</span>/yr pace
            </span>
          </div>
        ) : null;
      })()}

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

      {/* ── Share Your Profile ──────────────────────────────────── */}
      <button
        onClick={() => setShareOpen(true)}
        className="w-full mb-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 p-4 text-left transition-all active:scale-[0.98]"
        aria-label="Share your streak card"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">Share Your Throne Card</p>
            <p className="text-[11px] text-muted-foreground">
              Show off your {maxStreak > 0 ? `${maxStreak}-day streak` : "profile"} to friends
            </p>
          </div>
          <span className="text-muted-foreground text-sm">→</span>
        </div>
      </button>

      {/* Referral Nudge */}
      {(user?.referralCount ?? 0) < 3 && (
        <button
          onClick={() => setLocation("/referral")}
          className="w-full mb-6 rounded-2xl border border-accent/20 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-4 text-left transition-all active:scale-[0.98]"
          aria-label="Invite friends and earn Premium"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-accent" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">
                Invite {3 - (user?.referralCount ?? 0)} friend{3 - (user?.referralCount ?? 0) === 1 ? "" : "s"}, get Premium free
              </p>
              <p className="text-[11px] text-muted-foreground">
                Share the movement. Earn 30 days of Porcelain Premium.
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-accent shrink-0" />
          </div>
        </button>
      )}

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

      {/* Streak Insurance */}
      <div className="mb-6">
        <ErrorBoundary>
          <StreakInsuranceButton />
        </ErrorBoundary>
      </div>

      {/* Throne Analytics */}
      <div className="mb-6">
        <ErrorBoundary>
          <ThroneAnalytics compact />
        </ErrorBoundary>
      </div>

      {/* Weekly Report */}
      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Weekly Report
        </h3>
        <ErrorBoundary>
          <WeeklyThroneReport />
        </ErrorBoundary>
      </div>

      {/* ── Squads with streak status ─────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
          Your Squads
        </h3>
        <div className="space-y-2">
          {groups.length > 0 ? (
            groups.map((group) => {
              const gs = group.currentStreak ?? 0;
              const tier = getStreakTier(gs);
              return (
                <button
                  key={group.id}
                  onClick={() => setLocation(`/groups/${group.id}`)}
                  className="flex items-center gap-3 w-full rounded-xl p-2 -mx-2 transition-colors hover:bg-muted/50 active:bg-muted text-left"
                >
                  <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-base">{tier.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {group.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {group.memberCount} members · {group.entryCount} deuces
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
                </button>
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

      {/* ── Quick Links (features not in bottom nav) ──────────────── */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-5 pt-5 pb-3">
          Features
        </h3>
        <div className="divide-y divide-border">
          <button
            onClick={() => setLocation("/bingo")}
            className="flex items-center gap-3 w-full px-5 py-3 transition-colors hover:bg-muted/50 active:bg-muted"
          >
            <span className="text-base shrink-0">🎯</span>
            <span className="text-sm font-medium text-foreground flex-1 text-left">Deuce Bingo</span>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setLocation("/premium")}
            className="flex items-center gap-3 w-full px-5 py-3 transition-colors hover:bg-muted/50 active:bg-muted"
          >
            <span className="text-base shrink-0">👑</span>
            <span className="text-sm font-medium text-foreground flex-1 text-left">
              {isPremium ? "Throne Room" : "Go Premium"}
            </span>
            {!isPremium && (
              <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Upgrade
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* ── Settings ─────────────────────────────────────────────── */}
      <button
        onClick={() => setLocation("/settings")}
        className="w-full bg-card border border-border rounded-2xl overflow-hidden mb-6 transition-colors hover:bg-muted/50 active:bg-muted"
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <span className="text-base">⚙️</span>
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-bold text-foreground">Settings</span>
            <p className="text-[11px] text-muted-foreground">
              Theme, notifications, account, privacy
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </button>

      <EditUsernameModal
        open={editUsernameOpen}
        onOpenChange={setEditUsernameOpen}
        currentUsername={user?.username || ""}
      />
      <ShareCardModal open={shareOpen} onOpenChange={setShareOpen} />
    </div>
  );
}
