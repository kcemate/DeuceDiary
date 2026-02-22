const CHALLENGES = [
  'Log before 8 AM',
  'Log at work',
  'Log on a weekend',
  '3-day streak',
  'Log twice today',
] as const;

export type Challenge = (typeof CHALLENGES)[number];

/** Returns today's challenge, seeded by day of year so it rotates deterministically. */
export function getTodayChallenge(): Challenge {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return CHALLENGES[dayOfYear % CHALLENGES.length];
}

/** Returns the YYYY-MM-DD string for today in UTC. */
export function todayChallengeDate(): string {
  return new Date().toISOString().slice(0, 10);
}
