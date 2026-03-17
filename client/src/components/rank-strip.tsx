import { getThroneRank } from "@/lib/gamification";
import { Link } from "wouter";

interface RankStripProps {
  deuceCount: number;
}

export function RankStrip({ deuceCount }: RankStripProps) {
  const { rank, nextRank, level, progressToNext } = getThroneRank(deuceCount);

  return (
    <Link href="/profile">
      <div
        className={
          "bg-card border border-border rounded-2xl p-3 cursor-pointer" +
          " hover:border-primary/30 transition-all active:scale-[0.99]"
        }
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl shrink-0">{rank.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                Lvl {level}
              </span>
              <span className="text-xs font-bold text-primary">{rank.title}</span>
            </div>
            {nextRank ? (
              <div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                    style={{ width: `${progressToNext}%` }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {nextRank.min - deuceCount} more to {nextRank.title} {nextRank.icon}
                </p>
              </div>
            ) : (
              <p className="text-[9px] text-accent font-bold">MAX RANK</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
