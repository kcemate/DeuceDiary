/**
 * GoldCrownBadge — renders a small gold crown inline with premium users' names.
 * Usage: <GoldCrownBadge subscription={user.subscription} subscriptionExpiresAt={user.subscriptionExpiresAt} />
 */
interface GoldCrownBadgeProps {
  subscription?: string | null;
  subscriptionExpiresAt?: string | Date | null;
  size?: "sm" | "md";
}

function isPremium(subscription?: string | null, expiresAt?: string | Date | null): boolean {
  if (subscription !== "premium") return false;
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
}

export function GoldCrownBadge({ subscription, subscriptionExpiresAt, size = "sm" }: GoldCrownBadgeProps) {
  if (!isPremium(subscription, subscriptionExpiresAt)) return null;

  const sizeClass = size === "md" ? "text-base" : "text-xs";

  return (
    <span
      className={`inline-flex items-center ${sizeClass} leading-none`}
      title="Porcelain Premium"
      aria-label="Premium member"
    >
      👑
    </span>
  );
}
