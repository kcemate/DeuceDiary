```tsx
import { useState, useCallback, useEffect, useRef } from "react";
import logger from "@/lib/logger";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { BattleGrid, GridCell, GridShip, GridAttack } from "@/components/battle-grid";
import { apiRequest } from "@/lib/queryClient";

// ─── Constants ──────────────────────────────────────────────────────────────

const STANDARD_GRID = { cols: 7, rows: 3 };
const QUICK_GRID = { cols: 3, rows: 3 };

const SHIPS_CONFIG = {
  standard: [
    { type: "floater", size: 2, emoji: "🚤", label: "Floater" },
    { type: "log", size: 3, emoji: "🥖", label: "The Log" },
    { type: "battleshit", size: 4, emoji: "💣", label: "Battleshit" },
  ],
  quick: [
    { type: "floater", size: 2, emoji: "🚤", label: "Floater" },
    { type: "log", size: 3, emoji: "🥖", label: "The Log" },
  ],
};

const TAUNTS = [
  { emoji: "💩", label: "Splat!", message: "You're about to be flushed!" },
  { emoji: "🧻", label: "Wipe out!", message: "Hope you brought extra TP!" },
  { emoji: "🚽", label: "Swirl!", message: "Down the drain you go!" },
  { emoji: "💨", label: "Rip one!", message: "That was a warning shot!" },
  { emoji: "🪠", label: "Plunged!", message: "You're backed up now!" },
  { emoji: "🫧", label: "Bubble!", message: "Full of hot air!" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlacedShip {
  type: string;
  cells: GridCell[];
}

interface MatchData {
  match: {
    id: string;
    groupId: string;
    challengerId: string;
    opponentId: string;
    matchType: "standard" | "quick";
    status: "pending" | "placement" | "active" | "completed" | "forfeited" | "voided";
    winnerId?: string;
    placementDeadline: string;
    xpAwarded?: number;
    streakCount?: number;
  };
  myShips: Array<{ type: string; cells: GridCell[]; sunk: boolean }>;
  opponentSunkShips: Array<{ type: string; cells: GridCell[]; sunk: boolean }>;
  myAttacks: Array<{ col: number; row: number; hit: boolean }>;
  opponentAttacks: Array<{ col: number; row: number; hit: boolean }>;
  tokenBalance: { earned: number; spent: number; available: number };
  myPowerups: Array<{
    id: string;
    type: "sonar_ping" | "ghost_wipe";
    used: boolean;
    revealedCell?: GridCell;
  }>;
  opponentPowerupsUsed: number;
}

// ─── Animation Helpers ───────────────────────────────────────────────────────

function useAnimationTrigger<T>(deps: T): boolean {
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef(deps);
  useEffect(() => {
    if (prevRef.current !== deps && deps !== undefined) {
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 800);
      prevRef.current = deps;
      return () => clearTimeout(t);
    }
  }, [deps]);
  return animating;
}

// ─── Ship Placement Phase ────────────────────────────────────────────────────

function PlacementPhase({
  matchId,
  matchType,
  placementDeadline,
  onPlaced,
}: {
  matchId: string;
  matchType: "standard" | "quick";
  placementDeadline: string;
  onPlaced: () => void;
}) {
  const { toast } = useToast();
  const grid = matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
  const shipConfigs = SHIPS_CONFIG[matchType];

  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(shipConfigs[0]?.type ?? null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null);
  const [justPlacedType, setJustPlacedType] = useState<string | null>(null);

  // Countdown timer for placement deadline
  const deadlineTime = new Date(placementDeadline).getTime();
  const [timeLeftMs, setTimeLeftMs] = useState<number>(
    Math.max(0, deadlineTime - Date.now())
  );
  const [isExpired, setIsExpired] = useState<boolean>(deadlineTime <= Date.now());

  useEffect(() => {
    if (isExpired) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeLeft = deadlineTime - now;

      if (timeLeft <= 0) {
        setTimeLeftMs(0);
        setIsExpired(true);
        clearInterval(interval);
      } else {
        setTimeLeftMs(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [deadlineTime, isExpired]);

  const minutesLeft = Math.floor(timeLeftMs / 1000 / 60);
  const secondsLeft = Math.floor(timeLeftMs / 1000) % 60;
  const isUrgent = timeLeftMs < 30000 && !isExpired;

  const placeMutation = useMutationWithToast({
    mutationFn: (ships: PlacedShip[]) =>
      apiRequest(`/api/battle/match/${matchId}/place`, {
        method: "POST",
        body: JSON.stringify({ ships }),
      }),
    errorTitle: "Placement failed",
    errorMessage: (e: Error) => e.message,
    onSuccess: () => {
      toast({
        title: "Ships deployed! ⚓",
        description: "Waiting for battle to begin...",
      });
      onPlaced();
    },
  });

  const getSelectedConfig = useCallback(
    () => shipConfigs.find((s) => s.type === selectedType),
    [selectedType, shipConfigs]
  );

  function getPreviewCells(col: number, row: number): GridCell[] {
    const config = getSelectedConfig();
    if (!config) return [];
    const cells: GridCell[] = [];
    for (let i = 0; i < config.size; i++) {
      if (orientation === "horizontal") {
        cells.push({ col: col + i, row });
      } else {
        cells.push({ col, row: row + i });
      }
    }
    return cells;
  }

  function isPreviewValid(cells: GridCell[]): boolean {
    const config = getSelectedConfig();
    if (!config || cells.length !== config.size) return false;
    for (const cell of cells) {
      if (cell.col < 0 || cell.col >= grid.cols) return false;
      if (cell.row < 0 || cell.row >= grid.rows) return false;
    }
    const occupiedKeys = new Set(
      placedShips.flatMap((s) => s.cells.map((c) => `${c.col}-${c.row}`))
    );
    for (const cell of cells) {
      if (occupiedKeys.has(`${cell.col}-${c.row}`)) return false;
    }
    return true;
  }

  function handleCellClick(col: number, row: number) {
    if (!selectedType) return;
    const preview = getPreviewCells(col, row);
    if (!isPreviewValid(preview)) {
      toast({
        title: "Can't place there!",
        description: "Ship goes out of bounds or overlaps another.",
        variant: "destructive",
      });
      return;
    }
    setPlacedShips((prev) => [
      ...prev.filter((s) => s.type !== selectedType),
      { type: selectedType, cells: preview },
    ]);
    setJustPlacedType(selectedType);

    // Auto-advance to next unplaced ship
    const remaining = shipConfigs.filter(
      (s) =>
        s.type !== selectedType &&
        !placedShips.some((p) => p.type === s.type)
    );
    setSelectedType(remaining[0]?.type ?? null);

    // Clear the placement animation after a beat
    setTimeout(() => setJustPlacedType(null), 600);
  }

  function removeShip(type: string) {
    setPlacedShips((prev) => prev.filter((s) => s.type !== type));
    setSelectedType(type);
  }

  function handleRandomPlacement() {
    const ships: PlacedShip[] = [];
    const occupied = new Set<string>();

    for (const config of shipConfigs) {
      let placed = false;
      for (let attempt = 0; attempt < 200 && !placed; attempt++) {
        const horiz = Math.random() > 0.5;
        const cells: GridCell[] = [];
        for (let i = 0; i < config.size; i++) {
          if (horiz) {
            cells.push({ col: i, row: 0 });
          } else {
            cells.push({ col: 0, row: i });
          }
        }
        const maxCol = horiz ? grid.cols - config.size : grid.cols - 1;
        const maxRow = horiz ? grid.rows - 1 : grid.rows - config.size;
        const startCol = Math.floor(Math.random() * (maxCol + 1));
        const startRow = Math.floor(Math.random() * (maxRow + 1));

        const tryCells: GridCell[] = cells.map((c) => ({
          col: c.col + startCol,
          row: c.row + startRow,
        }));

        const allFree = tryCells.every(
          (c) =>
            c.col >= 0 &&
            c.col < grid.cols &&
            c.row >= 0 &&
            c.row < grid.rows &&
            !occupied.has(`${c.col}-${c.row}`)
        );

        if (allFree) {
          ships.push({ type: config.type, cells: tryCells });
          tryCells.forEach((c) => occupied.add(`${c.col}-${c.row}`));
          placed = true;
        }
      }
    }
    setPlacedShips(ships);
    setSelectedType(null);
    toast({ title: "🎲 Random deployment!", description: "Ships scattered across the bowl." });
  }

  const allPlaced = shipConfigs.every((s) => placedShips.some((p) => p.type === s.type));
  const preview =
    selectedType && hoverCell
      ? getPreviewCells(hoverCell.col, hoverCell.row)
      : [];
  const previewValid = preview.length > 0 && isPreviewValid(preview);

  const gridShips: GridShip[] = placedShips.map((s) => ({
    type: s.type,
    cells: s.cells,
  }));

  return (
    <div className="space-y-4">
      {/* Phase header with timer */}
      <div
        className={`rounded-xl p-3 text-center transition-colors ${
          isUrgent
            ? "bg-red-500/15 border-2 border-red-500/50 animate-pulse"
            : isExpired
            ? "bg-red-500/10 border border-red-500/30"
            : "bg-yellow-500/10 border border-yellow-500/30"
        }`}
      >
        <p className="text-sm font-bold text-yellow-400">⚓ Phase 1: Deploy Your Fleet</p>
        {isExpired ? (
          <p className="text-xs text-red-400 font-bold mt-1">
            ⏰ Time expired — ships will auto-deploy when ready
          </p>
        ) : (
          <>
            <p className="text-xs text-muted-foreground mt-1">
              Select a ship, then tap the grid to place it
            </p>
            <p
              className={`text-xs font-bold mt-1 ${
                isUrgent ? "text-red-400" : "text-muted-foreground"
              }`}
            >
              ⏰ {minutesLeft}:{String(secondsLeft).padStart(2, "0")} remaining
            </p>
          </>
        )}
      </div>

      {/* Orientation toggle */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Direction
        </span>
        <button
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            orientation === "horizontal"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          onClick={() => setOrientation("horizontal")}
        >
          ↔ Horizontal
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
            orientation === "vertical"
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
          onClick={() => setOrientation("vertical")}
        >
          ↕ Vertical
        </button>
      </div>

      {/* Grid */}
      <div
        onMouseLeave={() => setHoverCell(null)}
        onTouchEnd={() => setHoverCell(null)}
      >
        <BattleGrid
          mode="placement"
          cols={grid.cols}
          rows={grid.rows}
          ships={gridShips}
          attacks={[]}
          onCellClick={handleCellClick}
          onCellHover={(col, row) => setHoverCell({ col, row })}
          previewCells={preview}
          previewValid={previewValid}
        />
      </div>

      {/* Ship inventory */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Fleet
          </p>
          <button
            onClick={handleRandomPlacement}
            className="text-[10px] font-bold text-primary hover:text-primary/80 active:scale-95 transition-all"
          >
            🎲 Randomize
          </button>
        </div>
        <div className="space-y-2">
          {shipConfigs.map((ship) => {
            const isPlaced = placedShips.some((p) => p.type === ship.type);
            const isSelected = selectedType === ship.type;
            const justPlaced = justPlacedType === ship.type;
            return (
              <div
                key={ship.type}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${
                  justPlaced
                    ? "border-green-400 bg-green-500/20 scale-[1.02]"
                    : isSelected
                    ? "border-primary bg-primary/10 shadow-sm shadow-primary/20"
                    : isPlaced
                    ? "border-green-500/40 bg-green-500/10"
                    : "border-border hover:border-primary/40"
                }`}
                onClick={() => {
                  if (isPlaced) {
                    removeShip(ship.type);
                  } else {
                    setSelectedType(isSelected ? null : ship.type);
                  }
                }}
              >
                <span className="text-2xl leading-none">{ship.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{ship.label}</p>
                  <div