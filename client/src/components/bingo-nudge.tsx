import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface BingoSquare {
  id: number;
  title: string;
  description: string;
}

interface BingoResponse {
  card: {
    squares: BingoSquare[];
    completedSquares: number[];
  };
  completedCount: number;
  totalCount: number;
  hasBingo: boolean;
  hasBlackout: boolean;
}

/**
 * Shows a random incomplete bingo challenge as a feed nudge.
 * Returns null if bingo data isn't loaded or all squares are complete.
 */
export function BingoNudge() {
  const { data: bingo } = useQuery<BingoResponse>({
    queryKey: ["/api/bingo/current"],
    staleTime: 5 * 60 * 1000,
  });

  if (!bingo || bingo.hasBlackout) return null;

  const completedSet = new Set(bingo.card.completedSquares);
  const incompleteSquares = bingo.card.squares.filter(
    (sq) => !completedSet.has(sq.id),
  );

  if (incompleteSquares.length === 0) return null;

  // Pick a deterministic-ish challenge based on the day so it doesn't shuffle on re-renders
  const dayOfMonth = new Date().getDate();
  const challenge = incompleteSquares[dayOfMonth % incompleteSquares.length];

  return (
    <Link href="/bingo">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 cursor-pointer hover:border-primary/40 active:scale-[0.99] transition-all">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-lg">🎯</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">
              Bingo Challenge
            </p>
            <p className="text-sm font-bold text-foreground">
              {challenge.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {challenge.description}
            </p>
            <p className="text-[10px] text-primary font-semibold mt-1.5">
              {bingo.completedCount}/{bingo.totalCount} complete — tap to view board →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
