// ── Throne rank / level system ───────────────────────────────────────────────
export const THRONE_RANKS = [
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

export function getThroneRank(deuceCount: number) {
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

// ── Streak tier helpers ─────────────────────────────────────────────────────
export function getStreakTier(streak: number) {
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
export const MILESTONES = [
  { count: 10, emoji: "🚽", label: "First Flush" },
  { count: 50, emoji: "💩", label: "Brown Belt" },
  { count: 100, emoji: "🏆", label: "Century Club" },
  { count: 500, emoji: "👑", label: "Throne Master" },
] as const;
