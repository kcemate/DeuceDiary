import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface BingoResponse {
  card: {
    id: string;
    completedSquares: number[];
  };
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  hasBingo: boolean;
  hasBlackout: boolean;
}

export function BingoStrip() {
  const { data: bingo, isLoading } = useQuery<BingoResponse>({
    queryKey: ["/api/bingo/current"],
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || !bingo) return null;

  const { completedCount, totalCount, percentComplete, hasBingo, hasBlackout } = bingo;
  const completedSet = new Set(bingo.card.completedSquares);

  // Status label
  const statusLabel = hasBlackout
    ? "BLACKOUT!"
    : hasBingo
      ? "BINGO!"
      : `${completedCount}/${totalCount}`;

  const statusColor = hasBlackout
    ? "#D4AF37"
    : hasBingo
      ? "#22C55E"
      : "var(--primary)";

  return (
    <Link href="/bingo">
      <div className="rounded-2xl border border-border p-3 cursor-pointer hover:border-primary/30 transition-all active:scale-[0.99] bg-card">
        <div className="flex items-center gap-3">
          {/* Mini 5x5 grid */}
          <div className="shrink-0 grid grid-cols-5 gap-[2px] w-8 h-8">
            {Array.from({ length: 25 }, (_, i) => (
              <div
                key={i}
                className="rounded-[1px]"
                style={{
                  backgroundColor: completedSet.has(i)
                    ? statusColor
                    : "var(--muted)",
                }}
              />
            ))}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">🎯</span>
              <span
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: statusColor }}
              >
                {statusLabel}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">
                Bingo
              </span>
            </div>
            {hasBlackout ? (
              <p className="text-[9px] text-accent font-bold">COMPLETE — YOU'RE A LEGEND</p>
            ) : (
              <div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${percentComplete}%`,
                      backgroundColor: statusColor,
                    }}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground mt-0.5">
                  {hasBingo
                    ? `${totalCount - completedCount} more for BLACKOUT`
                    : `${totalCount - completedCount} squares to go`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
