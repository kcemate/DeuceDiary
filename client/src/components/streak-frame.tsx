import type { ReactNode } from "react";

interface StreakFrameProps {
  currentStreak: number;
  children: ReactNode;
  className?: string;
}

/**
 * Animated ring around profile picture based on streak length.
 *  30+ days  = gold ring
 *  60+ days  = pulsing gold ring
 * 100+ days  = rainbow shimmer ring
 */
export function StreakFrame({ currentStreak, children, className = "" }: StreakFrameProps) {
  if (currentStreak < 30) {
    return <div className={className}>{children}</div>;
  }

  let frameClass = "streak-frame";
  if (currentStreak >= 100) {
    frameClass += " streak-rainbow";
  } else if (currentStreak >= 60) {
    frameClass += " streak-pulse";
  } else {
    frameClass += " streak-gold";
  }

  return (
    <div className={`${frameClass} ${className}`}>
      {children}
      <style>{streakCSS}</style>
    </div>
  );
}

const streakCSS = `
  .streak-frame {
    position: relative;
    display: inline-block;
    border-radius: 9999px;
    padding: 3px;
  }

  /* 30+ days: solid gold ring */
  .streak-gold {
    background: linear-gradient(135deg, #C8A951, #FFD700, #C8A951);
    box-shadow: 0 0 8px rgba(200, 169, 81, 0.5);
  }

  /* 60+ days: pulsing gold ring */
  .streak-pulse {
    background: linear-gradient(135deg, #C8A951, #FFD700, #C8A951);
    animation: streak-pulse-glow 2s ease-in-out infinite;
  }

  @keyframes streak-pulse-glow {
    0%, 100% {
      box-shadow: 0 0 8px rgba(200, 169, 81, 0.4);
    }
    50% {
      box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(200, 169, 81, 0.3);
    }
  }

  /* 100+ days: rainbow shimmer ring */
  .streak-rainbow {
    background: linear-gradient(
      270deg,
      #ff0000, #ff8000, #ffff00, #00ff00,
      #0080ff, #8000ff, #ff0080, #ff0000
    );
    background-size: 600% 600%;
    animation: streak-rainbow-shift 3s ease infinite;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
  }

  @keyframes streak-rainbow-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;
