/**
 * Simple in-memory TTL cache backed by a Map.
 * No external dependencies — process-local, resets on restart.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TtlCache<T = unknown> {
  private store = new Map<string, CacheEntry<T>>();

  constructor(private defaultTtlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs ?? this.defaultTtlMs),
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  /** Delete all keys that start with the given prefix */
  deleteByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}

// ---------------------------------------------------------------------------
// Named cache instances — one per domain, shared across route files
// ---------------------------------------------------------------------------

/** Locations list — rarely changes, global to all users (5 min) */
export const locationsCache = new TtlCache<unknown>(5 * 60 * 1000);

/** Leaderboard per group (30 s) */
export const leaderboardCache = new TtlCache<unknown>(30 * 1000);

/** User profile keyed by userId (60 s) */
export const userCache = new TtlCache<unknown>(60 * 1000);

/** Subscription status keyed by userId (60 s) */
export const subscriptionCache = new TtlCache<unknown>(60 * 1000);

/** Group weekly report keyed by groupId (5 min) */
export const weeklyReportCache = new TtlCache<unknown>(5 * 60 * 1000);

/** Premium analytics keyed by userId (60 s) */
export const analyticsCache = new TtlCache<unknown>(60 * 1000);

/** Group streak keyed by groupId (30 s) */
export const streakCache = new TtlCache<unknown>(30 * 1000);
