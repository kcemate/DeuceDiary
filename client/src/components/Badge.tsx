import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  tier: 'free' | 'premium';
  className?: string;
}

export function AchievementBadge(
  { id, name, description, emoji, unlocked, tier, className }: BadgeProps
) {
  const [showDetail, setShowDetail] = useState(false);
  const isGold = tier === 'premium' || id.includes('diamond') || id.includes('throne');

  return (
    <button
      type="button"
      onClick={() => setShowDetail((v) => !v)}
      className={cn(
        "group relative flex flex-col items-center w-20 transition-all duration-200" +
          " bg-transparent border-none cursor-pointer p-0",
        unlocked ? "hover:scale-110" : "opacity-40 grayscale",
        className
      )}
      aria-label={`${name}: ${description}`}
    >
      <div className={cn(
        "w-16 h-16 flex items-center justify-center rounded-2xl text-4xl mb-2 border-2 transition-all",
        unlocked
          ? isGold
            ? "bg-gradient-to-br from-amber-400 to-yellow-600 border-amber-300" +
              " shadow-[0_0_15px_rgb(245,158,11)]"
            : "bg-gradient-to-br from-emerald-400 to-teal-600 border-emerald-300" +
              " shadow-[0_0_12px_rgb(16,185,129)]"
          : "bg-muted border-border"
      )}>
        {emoji}
      </div>

      <div className="text-center">
        <p className={cn(
          "text-[10px] font-bold leading-tight tracking-wider",
          unlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {showDetail ? description : name}
        </p>
      </div>

      {unlocked && (
        <div className={
          "absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full" +
          " flex items-center justify-center text-[10px] text-white font-bold shadow"
        }>
          ✓
        </div>
      )}
    </button>
  );
}
