import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { Button } from "@/components/ui/button";
import { Spinner, PageSpinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PremiumGate } from "@/components/premium-gate";
import { cn } from "@/lib/utils";
import type { BingoSquare } from "@shared/schema";

interface BingoCard {
  id: string;
  userId: string;
  month: string;
  squares: BingoSquare[];
  completedSquares: number[];
}

interface BingoResponse {
  card: BingoCard;
  month: string;
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  hasBlackout: boolean;
  hasBingo: boolean;
}

interface CheckResponse {
  completedSquares: number[];
  completedCount: number;
  totalCount: number;
  percentComplete: number;
  hasBlackout: boolean;
  hasBingo: boolean;
  newlyCompleted: number;
}

interface LeaderboardEntry {
  userId: string;
  username: string | null;
  profileImageUrl: string | null;
  completedCount: number;
}

function formatMonth(month: string): string {
  const [year, mon] = month.split("-").map(Number);
  return new Date(year, mon - 1, 1).toLocaleString("default", { month: "long", year: "numeric" });
}

// Compute which square indices are part of a completed bingo line
function computeBingoLineIndices(completedSet: Set<number>): Set<number> {
  const lines: number[][] = [];
  // Rows
  for (let r = 0; r < 5; r++) lines.push([r * 5, r * 5 + 1, r * 5 + 2, r * 5 + 3, r * 5 + 4]);
  // Cols
  for (let c = 0; c < 5; c++) lines.push([c, c + 5, c + 10, c + 15, c + 20]);
  // Diagonals
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);

  const bingoIndices = new Set<number>();
  for (const line of lines) {
    if (line.every((idx) => completedSet.has(idx))) {
      for (const idx of line) bingoIndices.add(idx);
    }
  }
  return bingoIndices;
}

// Confetti celebration component
function Confetti({ show, blackout }: { show: boolean; blackout?: boolean }) {
  const colors = ["#FFD700", "#FF6B35", "#4CAF50", "#2196F3", "#9C27B0", "#FF4081", "#00BCD4", "#FF9800"];
  const count = blackout ? 70 : 40;
  const pieces = Array.from({ length: count }, (_, i) => i);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) translateX(0) rotate(0deg); opacity: 1; }
          50%  { transform: translateY(50vh) translateX(var(--sway, 0px)) rotate(360deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(calc(var(--sway, 0px) * 2)) rotate(720deg); opacity: 0; }
        }
        @keyframes blackoutBanner {
          0%   { transform: translateY(-60px) scale(0.8); opacity: 0; }
          20%  { transform: translateY(0) scale(1.05); opacity: 1; }
          80%  { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(0.9); opacity: 0; }
        }
      `}</style>
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = `${(i * 7 + 3) % 100}%`;
        const delay = `${(i * 0.06) % 2.5}s`;
        const size = 6 + (i % 8) * 1.5;
        const duration = `${2.5 + (i % 4) * 0.5}s`;
        const sway = `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 10)}px`;
        return (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left,
              backgroundColor: color,
              width: size,
              height: size,
              borderRadius: i % 4 === 0 ? "50%" : i % 4 === 1 ? "2px" : "1px",
              ["--sway" as string]: sway,
              animation: `confettiFall ${duration} ${delay} ease-in forwards`,
            }}
          />
        );
      })}
      {blackout && (
        <div
          className="absolute top-16 left-0 right-0 flex justify-center"
          style={{ animation: "blackoutBanner 4s ease-in-out forwards" }}
        >
          <div className={cn(
            "bg-gradient-to-r from-amber-500 to-yellow-400 rounded-2xl",
            "px-6 py-3 shadow-2xl shadow-amber-500/50 border-2 border-yellow-300"
          )}>
            <p className="text-white font-black text-2xl tracking-wider text-center drop-shadow">
              🏆 BLACKOUT! 🏆
            </p>
            <p className="text-yellow-100 text-sm text-center font-semibold mt-0.5">All 25 squares complete!</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Static placeholder squares for premium gate preview
const PLACEHOLDER_SQUARES = [
  { title: "Back-to-Back", description: "Two deuces in one day" },
  { title: "Power Hour", description: "Deuce between 12–1pm" },
  { title: "Morning Glory", description: "First deuce before 9am" },
  { title: "Night Owl", description: "Late night deuce after 11pm" },
  { title: "Streak Week", description: "7 days straight" },
  { title: "Double Down", description: "Log two sessions today" },
  { title: "Speed Demon", description: "Under 3 minutes" },
  { title: "The Legend", description: "Longest session ever" },
  { title: "Social Butterfly", description: "Deuce at a friend's place" },
  { title: "Road Warrior", description: "Deuce while traveling" },
  { title: "Lunch Break", description: "Noon deuce on a weekday" },
  { title: "Zen Mode", description: "No phone during deuce" },
  { title: "FREE", description: "Center square" },
  { title: "Marathon", description: "20+ minute session" },
  { title: "Early Bird", description: "Before sunrise" },
  { title: "Holiday Deuce", description: "On a public holiday" },
  { title: "Work From Home", description: "Home office special" },
  { title: "Gym Hero", description: "Post-workout deuce" },
  { title: "Coffee Chaser", description: "Right after coffee" },
  { title: "Weekend Warrior", description: "Saturday or Sunday" },
  { title: "Perfect Week", description: "Every day Mon–Sun" },
  { title: "Soundtrack", description: "With music playing" },
  { title: "Reading Time", description: "With a book or article" },
  { title: "New Location", description: "Somewhere new" },
  { title: "Blackout!", description: "Complete all 25 squares" },
];

function PlaceholderBingoGrid() {
  const completedIndices = new Set([0, 4, 6, 12, 18, 20, 24]);
  return (
    <div className="pb-24 pt-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">Deuce Bingo</h2>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <div className="text-right">
            <p className="stat-number text-2xl text-foreground/40">?/25</p>
            <p className="text-xs text-muted-foreground">Premium only</p>
          </div>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary/30 rounded-full" style={{ width: "28%" }} />
        </div>
      </div>

      {/* Grid with lock overlay */}
      <div className="relative mb-4">
        <div className="grid grid-cols-5 gap-1 blur-[2px] pointer-events-none select-none">
          {PLACEHOLDER_SQUARES.map((sq, index) => {
            const done = completedIndices.has(index);
            return (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col items-center justify-center",
                  "rounded-xl border-2 p-1.5 text-center min-h-[64px]",
                  done
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg shadow-yellow-200/50"
                    : "border-border bg-card",
                )}
              >
                {done ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                      <svg className="w-8 h-8 text-amber-700 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <p className="text-[9px] font-bold text-amber-800 leading-tight z-10 line-clamp-2">{sq.title}</p>
                  </>
                ) : (
                  <>
                    <p className="text-[9px] font-bold text-foreground leading-tight mb-0.5 line-clamp-1">{sq.title}</p>
                    <p className="text-[8px] text-muted-foreground leading-tight line-clamp-2">{sq.description}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {/* Frosted lock overlay */}
        <div className={cn(
          "absolute inset-0 flex flex-col items-center justify-center",
          "rounded-2xl bg-background/70 backdrop-blur-[1px]"
        )}>
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className={cn(
              "w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30",
              "flex items-center justify-center"
            )}>
              <svg
                className="w-6 h-6 text-primary"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="text-sm font-black text-foreground">Unlock Deuce Bingo</p>
            <p className="text-xs text-muted-foreground leading-snug">
              25 monthly challenges. Complete rows, columns, and diagonals for{" "}
              <span className="font-bold text-yellow-600">BINGO!</span>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground mb-2">How it works</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete challenges by logging deuces throughout the month.
          Complete a row, column, or diagonal for{" "}
          <span className="font-bold text-yellow-600">BINGO!</span> Complete all 25 for a{" "}
          <span className="font-bold text-amber-600">BLACKOUT!</span>
        </p>
      </div>
    </div>
  );
}

function BingoSquareCell({
  square,
  index,
  isCompleted,
  isNew,
  isOnBingoLine,
}: {
  square: BingoSquare;
  index: number;
  isCompleted: boolean;
  isNew: boolean;
  isOnBingoLine: boolean;
}) {
  return (
    <>
      <style>{`
        @keyframes squarePop {
          0%   { transform: scale(1); }
          30%  { transform: scale(1.18); }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .square-pop { animation: squarePop 0.5s ease-out forwards; }
      `}</style>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center",
          "rounded-xl border-2 p-1.5 text-center transition-all duration-500 select-none",
          "min-h-[64px] cursor-default",
          isOnBingoLine
            ? "border-green-500 bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg shadow-green-400/40 ring-2 ring-green-400 ring-offset-1"
            : isCompleted
            ? "border-yellow-400 bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg shadow-yellow-200/50"
            : index === 12
            ? "border-primary/40 bg-card"
            : "border-border/70 bg-card hover:bg-muted/30",
          isNew && "square-pop",
        )}
      >
        {isCompleted ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center rounded-xl">
              {isOnBingoLine ? (
                <svg className="w-10 h-10 text-green-700 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ) : (
                <svg
                  className="w-10 h-10 text-amber-700 opacity-25"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <p className={cn(
              "text-[9px] font-bold leading-tight z-10 line-clamp-2",
              isOnBingoLine ? "text-green-900" : "text-amber-800",
            )}>
              {square.title}
            </p>
          </>
        ) : index === 12 ? (
          /* FREE center square */
          <>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5" />
            <p className="text-[11px] font-black text-primary z-10 tracking-wide">FREE</p>
            <p className="text-[8px] text-primary/70 z-10 leading-tight">Center</p>
          </>
        ) : (
          <>
            <p className="text-[9px] font-extrabold text-foreground leading-tight mb-0.5 line-clamp-1">
              {square.title}
            </p>
            <p className="text-[8px] text-muted-foreground/90 leading-tight line-clamp-2">
              {square.description}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default function Bingo() {
  const { toast } = useToast();
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [newlyCompleted, setNewlyCompleted] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIsBlackout, setConfettiIsBlackout] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const prevCompleted = useRef<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<BingoResponse>({
    queryKey: ["/api/bingo/current"],
    retry: false,
  });

  const checkMutation = useMutationWithToast({
    mutationFn: () => apiRequest<CheckResponse>("/api/bingo/check", { method: "POST" }),
    errorMessage: "Failed to check progress",
    onSuccess: (result) => {
      const newSet = new Set(result.completedSquares);
      const fresh = new Set<number>();
      for (const idx of Array.from(newSet)) {
        if (!prevCompleted.current.has(idx)) fresh.add(idx);
      }
      setNewlyCompleted(fresh);
      setCompletedSet(newSet);
      prevCompleted.current = newSet;

      if (fresh.size > 0) {
        setConfettiIsBlackout(result.hasBlackout);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), result.hasBlackout ? 5000 : 2500);
      }

      if (result.newlyCompleted > 0) {
        toast({
          title: result.hasBingo ? "BINGO!" : `${result.newlyCompleted} square${result.newlyCompleted > 1 ? "s" : ""} completed!`,
          description: result.hasBlackout
            ? "BLACKOUT! You completed all 25 squares!"
            : `${result.completedCount} / 25 squares done`,
        });
      } else {
        toast({ title: "No new completions yet", description: "Keep logging to unlock more squares!" });
      }

      queryClient.invalidateQueries({ queryKey: ["/api/bingo/current"] });
      setTimeout(() => setNewlyCompleted(new Set()), 3000);
    },
  });

  const { data: leaderboardData } = useQuery<{ month: string; leaderboard: LeaderboardEntry[] }>({
    queryKey: ["/api/bingo/leaderboard"],
    enabled: showLeaderboard,
    retry: false,
  });

  // Sync completed state from server
  useEffect(() => {
    if (data?.card?.completedSquares) {
      const s = new Set(data.card.completedSquares);
      setCompletedSet(s);
      prevCompleted.current = s;
    }
  }, [data?.card?.completedSquares]);

  const isPremiumError =
    error instanceof Error && (error.message.includes("Premium") || error.message.includes("upgrade"));

  const BingoContent = isPremiumError ? (
    <PlaceholderBingoGrid />
  ) : (
    <div className="pb-24 pt-4">
      {isLoading && <PageSpinner minHeight="py-20" />}

      {!isLoading && error && !isPremiumError && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-4xl mb-3">🚽</p>
          <p className="font-bold text-foreground mb-1">Couldn't load your bingo card</p>
          <p className="text-sm text-muted-foreground mb-4">Check your connection and try again.</p>
          <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/bingo/current"] })}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-foreground">Deuce Bingo</h2>
                <p className="text-sm text-muted-foreground">{formatMonth(data.month)}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="stat-number text-2xl text-foreground">{data.completedCount}/25</p>
                <div className="flex gap-1">
                  {data.hasBingo && (
                    <span className="text-[10px] font-black text-yellow-700 bg-yellow-100 border border-yellow-300 px-2 py-0.5 rounded-full tracking-wide">
                      BINGO!
                    </span>
                  )}
                  {data.hasBlackout && (
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full tracking-wide">
                      BLACKOUT!
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Progress bar with milestone ticks */}
            <div className="relative">
              <Progress value={data.percentComplete} className="h-3 rounded-full" />
              {/* Milestone ticks at 5, 10, 15, 20 squares (20%, 40%, 60%, 80%) */}
              {[20, 40, 60, 80].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-0 h-3 w-px bg-background/60"
                  style={{ left: `${pct}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">0</span>
              {[5, 10, 15, 20].map((n) => (
                <span key={n} className={cn(
                  "text-[10px]",
                  data.completedCount >= n ? "text-primary font-bold" : "text-muted-foreground",
                )}>{n}</span>
              ))}
              <span className={cn(
                "text-[10px]",
                data.completedCount === 25 ? "text-amber-600 font-bold" : "text-muted-foreground",
              )}>25</span>
            </div>
          </div>

          {/* 5x5 Grid */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            {(() => {
              const bingoLineIndices = computeBingoLineIndices(completedSet);
              return data.card.squares.map((square, index) => (
                <BingoSquareCell
                  key={square.id}
                  square={square}
                  index={index}
                  isCompleted={completedSet.has(index)}
                  isNew={newlyCompleted.has(index)}
                  isOnBingoLine={bingoLineIndices.has(index)}
                />
              ));
            })()}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mb-4">
            <Button
              className="flex-1 rounded-xl font-bold"
              onClick={() => checkMutation.mutate()}
              disabled={checkMutation.isPending}
            >
              {checkMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner size="sm" className="border-white" />
                  Checking...
                </span>
              ) : (
                "Check Progress"
              )}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              {showLeaderboard ? "Hide" : "Leaderboard"}
            </Button>
          </div>

          {/* Leaderboard */}
          {showLeaderboard && leaderboardData && (
            <div className="rounded-2xl border border-border bg-card p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Squad Rankings</h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{formatMonth(leaderboardData.month)}</span>
              </div>
              {leaderboardData.leaderboard.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No squad members have started yet
                </p>
              ) : (
                <div className="space-y-2">
                  {leaderboardData.leaderboard.map((entry, i) => {
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
                    const pct = Math.round((entry.completedCount / 25) * 100);
                    const barColor = entry.completedCount === 25
                      ? "bg-amber-500"
                      : entry.completedCount >= 15
                      ? "bg-green-500"
                      : "bg-primary";
                    return (
                      <div
                        key={entry.userId}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-2 py-1.5",
                          i === 0 && "bg-yellow-50 border border-yellow-200",
                        )}
                      >
                        <span className="w-6 text-center text-base">
                          {medal ?? <span className="text-xs font-black text-muted-foreground">{i + 1}</span>}
                        </span>
                        {entry.profileImageUrl ? (
                          <img
                            src={entry.profileImageUrl}
                            alt={`${entry.username || "User"}'s avatar`}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">
                              {(entry.username || "?")[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="flex-1 text-sm font-medium text-foreground truncate">
                          {entry.username || "Anonymous"}
                        </span>
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {entry.completedCount}/25
                        </span>
                        <div className="w-14">
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">How to play</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete challenges by logging deuces throughout the month. Hit{" "}
              <span className="font-bold text-foreground">Check Progress</span> to update your card.
              Complete a row, column, or diagonal for{" "}
              <span className="font-bold text-yellow-600">BINGO!</span> Complete all 25 for a{" "}
              <span className="font-bold text-amber-600">BLACKOUT!</span>
            </p>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <Confetti show={showConfetti} blackout={confettiIsBlackout} />
      <div className="pt-4">
        <PremiumGate featureName="Deuce Bingo">{BingoContent}</PremiumGate>
      </div>
    </>
  );
}
