export async function track(event: string, userId?: string, props?: Record<string, unknown>) {
  try {
    const { db } = await import("../db");
    const { analyticsEvents } = await import("@shared/schema");
    if (typeof db?.insert === "function") {
      await db.insert(analyticsEvents).values({
        userId: userId ?? null,
        event,
        properties: props ? JSON.stringify(props) : null,
      });
    }
  } catch (e) {
    // Analytics should never break the app — fail silently
    if (process.env.NODE_ENV !== "test") {
      console.error("[analytics]", e);
    }
  }
}

/** Alias with userId-first signature for clarity at call sites. */
export async function trackEvent(userId: string, event: string, properties?: Record<string, unknown>) {
  return track(event, userId, properties);
}

// Named event helpers for type safety and discoverability
export const Events = {
  userSignup: (userId: string) => track("user_signup", userId),
  deuceLogged: (userId: string, props?: Record<string, unknown>) => track("deuce_logged", userId, props),
  groupJoined: (userId: string, groupId: string) => track("group_joined", userId, { groupId }),
  streakMilestone: (userId: string, groupId: string, streak: number) =>
    track("streak_milestone", userId, { groupId, streak }),
  premiumUpgrade: (userId: string, source: string) => track("premium_upgrade", userId, { source }),
};
