import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
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

// Simple CSS confetti component
function Confetti({ show }: { show: boolean }) {
  const colors = ["#FFD700", "#FF6B35", "#4CAF50", "#2196F3", "#9C27B0", "#FF4081"];
  const pieces = Array.from({ length: 40 }, (_, i) => i);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((i) => {
        const color = colors[i % colors.length];
        const left = `${(i * 7 + 3) % 100}%`;
        const delay = `${(i * 0.1) % 2}s`;
        const size = 8 + (i % 6) * 2;
        const duration = `${2 + (i % 3) * 0.5}s`;
        return (
          <div
            key={i}
            className="absolute top-0 animate-bounce"
            style={{
              left,
              backgroundColor: color,
              width: size,
              height: size,
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              animationDelay: delay,
              animationDuration: duration,
              transform: `rotate(${i * 45}deg)`,
              animation: `fall ${duration} ${delay} ease-in forwards`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
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
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold text-foreground">Deuce Bingo</h2>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-foreground">7/25</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: "28%" }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">28% complete</p>
      </div>
      <div className="grid grid-cols-5 gap-1 mb-4">
        {PLACEHOLDER_SQUARES.map((sq, index) => {
          const done = completedIndices.has(index);
          return (
            <div
              key={index}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center min-h-[64px]",
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
      <div className="flex gap-2 mb-4">
        <div className="flex-1 h-10 rounded-xl bg-primary/80 flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">Check Progress</span>
        </div>
        <div className="h-10 px-4 rounded-xl border border-border bg-card flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">Leaderboard</span>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-3">
        <p className="text-xs font-bold text-muted-foreground mb-2">How to play</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Complete challenges by logging deuces throughout the month. Hit{" "}
          <span className="font-bold text-foreground">Check Progress</span> to update your card.
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
}: {
  square: BingoSquare;
  index: number;
  isCompleted: boolean;
  isNew: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 p-1.5 text-center transition-all duration-500 select-none",
        "min-h-[64px] cursor-default",
        isCompleted
          ? "border-yellow-400 bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg shadow-yellow-200/50"
          : "border-border bg-card hover:bg-muted/30",
        isNew && "animate-pulse scale-105",
      )}
    >
      {isCompleted ? (
        <>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl">
            <svg
              className="w-8 h-8 text-amber-700 opacity-30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <p className="text-[9px] font-bold text-amber-800 leading-tight z-10 line-clamp-2">
            {square.title}
          </p>
        </>
      ) : (
        <>
          <p className="text-[9px] font-bold text-foreground leading-tight mb-0.5 line-clamp-1">
            {square.title}
          </p>
          <p className="text-[8px] text-muted-foreground leading-tight line-clamp-2">
            {square.description}
          </p>
        </>
      )}
    </div>
  );
}

export default function Bingo() {
  const { toast } = useToast();
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const [newlyCompleted, setNewlyCompleted] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const prevCompleted = useRef<Set<number>>(new Set());

  const { data, isLoading, error } = useQuery<BingoResponse>({
    queryKey: ["/api/bingo/current"],
    retry: false,
  });

  const checkMutation = useMutation({
    mutationFn: () => apiRequest<CheckResponse>("/api/bingo/check", { method: "POST" }),
    onSuccess: (result) => {
      const newSet = new Set(result.completedSquares);
      const fresh = new Set<number>();
      for (const idx of newSet) {
        if (!prevCompleted.current.has(idx)) fresh.add(idx);
      }
      setNewlyCompleted(fresh);
      setCompletedSet(newSet);
      prevCompleted.current = newSet;

      if (result.hasBlackout && fresh.size > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
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
    onError: () => {
      toast({ title: "Error", description: "Failed to check progress", variant: "destructive" });
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
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!isLoading && !error && data && (
        <>
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-xl font-bold text-foreground">Deuce Bingo</h2>
                <p className="text-sm text-muted-foreground">{formatMonth(data.month)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-foreground">{data.completedCount}/25</p>
                {data.hasBingo && (
                  <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                    BINGO!
                  </span>
                )}
                {data.hasBlackout && (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full ml-1">
                    BLACKOUT!
                  </span>
                )}
              </div>
            </div>
            <Progress value={data.percentComplete} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{data.percentComplete}% complete</p>
          </div>

          {/* 5x5 Grid */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            {data.card.squares.map((square, index) => (
              <BingoSquareCell
                key={square.id}
                square={square}
                index={index}
                isCompleted={completedSet.has(index)}
                isNew={newlyCompleted.has(index)}
              />
            ))}
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
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
              <h3 className="font-bold text-sm mb-3 text-foreground">Squad Bingo Rankings</h3>
              {leaderboardData.leaderboard.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No squad members have started yet
                </p>
              ) : (
                <div className="space-y-2">
                  {leaderboardData.leaderboard.map((entry, i) => (
                    <div key={entry.userId} className="flex items-center gap-3">
                      <span className="text-sm font-black text-muted-foreground w-5 text-right">
                        {i + 1}
                      </span>
                      {entry.profileImageUrl ? (
                        <img
                          src={entry.profileImageUrl}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {(entry.username || "?")[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="flex-1 text-sm font-medium text-foreground truncate">
                        {entry.username || "Anonymous"}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        {entry.completedCount}/25
                      </span>
                      <div className="w-16">
                        <Progress value={(entry.completedCount / 25) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="rounded-2xl border border-border bg-card p-3">
            <p className="text-xs font-bold text-muted-foreground mb-2">How to play</p>
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
      <Confetti show={showConfetti} />
      <div className="pt-4">
        <PremiumGate featureName="Deuce Bingo">{BingoContent}</PremiumGate>
      </div>
    </>
  );
}
