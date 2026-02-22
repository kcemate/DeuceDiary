import type { RequestHandler } from "express";

/**
 * Middleware that gates routes behind Porcelain Premium.
 * Checks that the authenticated user has an active premium subscription.
 */
export const requiresPremium: RequestHandler = (req: any, res, next) => {
  const user = req.user;

  if (
    user?.subscription === "premium" &&
    user.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  ) {
    return next();
  }

  return res.status(403).json({ message: "Premium required", upgrade: true });
};

/**
 * Factory: returns requiresPremium middleware that includes the feature name
 * in the 403 response so clients can show targeted upgrade prompts.
 */
export function requiresPremiumFor(feature: string): RequestHandler {
  return (req: any, res, next) => {
    const user = req.user;

    if (
      user?.subscription === "premium" &&
      user.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) > new Date()
    ) {
      return next();
    }

    return res.status(403).json({ message: "Premium required", upgrade: true, feature });
  };
}
