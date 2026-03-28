import { useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageSpinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useMutationWithToast } from "@/hooks/useMutationWithToast";
import { BattleGrid, GridCell, GridShip, GridAttack } from "@/components/battle-grid";

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
  };
  myShips: Array<{ type: string; cells: GridCell[]; sunk: boolean }>;
  opponentSunkShips: Array<{ type: string; cells: GridCell[]; sunk: boolean }>;
  myAttacks: Array<{ col: number; row: number; hit: boolean }>;
  opponentAttacks: Array<{ col: number; row: number; hit: boolean }>;
  tokenBalance: { earned: number; spent: number; available: number };
  myPowerups: Array<{ id: string; type: "sonar_ping" | "ghost_wipe"; used: boolean; revealedCell?: GridCell }>;
  opponentPowerupsUsed: number;
}

// ─── Ship Placement Phase ────────────────────────────────────────────────────

function PlacementPhase({
  matchId,
  matchType,
  onPlaced,
}: {
  matchId: string;
  matchType: "standard" | "quick";
  onPlaced: () => void;
}) {
  const { toast } = useToast();
  const grid = matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
  const shipConfigs = SHIPS_CONFIG[matchType];

  const [placedShips, setPlacedShips] = useState<PlacedShip[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [hoverCell, setHoverCell] = useState<GridCell | null>(null);

  const placeMutation = useMutationWithToast({
    mutationFn: (ships: PlacedShip[]) =>
      apiRequest(`/api/battle/match/${matchId}/place`, {
        method: "POST",
        body: JSON.stringify({ ships }),
      }),
    errorTitle: "Placement failed",
    errorMessage: (e: Error) => e.message,
    onSuccess: () => {
      toast({ title: "Ships placed! ⚓", description: "Waiting for battle to begin..." });
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
    // Check overlaps with already-placed ships
    const occupiedKeys = new Set(
      placedShips.flatMap((s) => s.cells.map((c) => `${c.col}-${c.row}`))
    );
    for (const cell of cells) {
      if (occupiedKeys.has(`${cell.col}-${cell.row}`)) return false;
    }
    return true;
  }

  function handleCellClick(col: number, row: number) {
    if (!selectedType) return;
    const preview = getPreviewCells(col, row);
    if (!isPreviewValid(preview)) {
      toast({
        title: "Can't place there!",
        description: "Ship goes out of bounds or overlaps.",
        variant: "destructive",
      });
      return;
    }
    setPlacedShips((prev) => [...prev.filter((s) => s.type !== selectedType), { type: selectedType, cells: preview }]);
    // Auto-advance to next unplaced ship
    const nextShip = shipConfigs.find(
      (s) => s.type !== selectedType && !placedShips.some((p) => p.type === s.type) &&
        !preview.some(() => s.type === selectedType)
    );
    setSelectedType(nextShip?.type ?? null);
  }

  function removeShip(type: string) {
    setPlacedShips((prev) => prev.filter((s) => s.type !== type));
    setSelectedType(type);
  }

  const allPlaced = shipConfigs.every((s) => placedShips.some((p) => p.type === s.type));
  const preview = selectedType && hoverCell ? getPreviewCells(hoverCell.col, hoverCell.row) : [];
  const previewValid = preview.length > 0 && isPreviewValid(preview);

  const gridShips: GridShip[] = placedShips.map((s) => ({ type: s.type, cells: s.cells }));

  return (
    <div className="space-y-4">
      {/* Phase header */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
        <p className="text-sm font-bold text-yellow-400">⚓ Phase 1: Deploy Your Fleet</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select a ship, then tap the grid to place it
        </p>
      </div>

      {/* Orientation toggle */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Direction:</span>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            orientation === "horizontal"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
          onClick={() => setOrientation("horizontal")}
        >
          ← Horizontal
        </button>
        <button
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            orientation === "vertical"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
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
          previewCells={preview}
          previewValid={previewValid}
        />
      </div>

      {/* Ship inventory */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Fleet</p>
        <div className="space-y-2">
          {shipConfigs.map((ship) => {
            const isPlaced = placedShips.some((p) => p.type === ship.type);
            const isSelected = selectedType === ship.type;
            return (
              <div
                key={ship.type}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10"
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
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{ship.label}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: ship.size }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-4 rounded-sm ${
                          isPlaced ? "bg-green-500" : isSelected ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold text-muted-foreground">
                  {isPlaced ? "✓ Placed" : isSelected ? "← Tap grid" : "Tap to select"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ready button */}
      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold
          rounded-2xl py-5 shadow-lg shadow-primary/20"
        disabled={!allPlaced || placeMutation.isPending}
        onClick={() => placeMutation.mutate(placedShips)}
      >
        {placeMutation.isPending
          ? "Deploying..."
          : allPlaced
          ? "⚓ Ready for Battle!"
          : `Place all ships (${placedShips.length}/${shipConfigs.length})`}
      </Button>
    </div>
  );
}

// ─── Active Battle Phase ─────────────────────────────────────────────────────

function BattlePhase({
  matchId,
  matchType,
  data,
  onRefresh,
}: {
  matchId: string;
  matchType: "standard" | "quick";
  data: MatchData;
  onRefresh: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"enemy" | "mine">("enemy");
  const [lastResult, setLastResult] = useState<{ hit: boolean; sunk?: boolean; shipType?: string } | null>(null);

  const grid = matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
  const { myShips, myAttacks, opponentAttacks, tokenBalance, myPowerups } = data;

  const attackMutation = useMutationWithToast({
    mutationFn: (cell: GridCell) =>
      apiRequest<{ hit: boolean; sunk: boolean; shipType?: string; gameOver: boolean; winner?: string }>(
        `/api/battle/match/${matchId}/attack`,
        { method: "POST", body: JSON.stringify(cell) }
      ),
    errorTitle: "Can't fire there",
    errorMessage: (e: Error) => e.message,
    onSuccess: (result) => {
      setLastResult({ hit: result.hit, sunk: result.sunk, shipType: result.shipType });
      onRefresh();
      if (result.hit) {
        if (result.sunk) {
          toast({ title: `💥 SUNK! ${result.shipType ?? "Ship"} destroyed!`, description: "Flush it down the drain." });
        } else {
          toast({ title: "💥 Direct hit!", description: "You drew blood (or something worse)." });
        }
      } else {
        toast({ title: "💨 Miss", description: "Clean porcelain. Try again." });
      }
      if (result.gameOver) {
        onRefresh();
      }
    },
  });

  const powerupMutation = useMutationWithToast({
    mutationFn: (type: string) =>
      apiRequest<{ ok: boolean; revealedCell?: GridCell }>(
        `/api/battle/match/${matchId}/powerup`,
        { method: "POST", body: JSON.stringify({ type }) }
      ),
    errorTitle: "Power-up failed",
    errorMessage: (e: Error) => e.message,
    onSuccess: (result, type) => {
      onRefresh();
      if (type === "sonar_ping" && result.revealedCell) {
        toast({
          title: "📡 Sonar Ping!",
          description: `Detected activity at ${result.revealedCell.col},${result.revealedCell.row}`,
        });
      } else {
        toast({ title: "👻 Power-up used!", description: "Let's see what it does..." });
      }
    },
  });

  const sonarPing = myPowerups?.find((p) => p.type === "sonar_ping");
  const ghostWipe = myPowerups?.find((p) => p.type === "ghost_wipe");
  const { available } = tokenBalance ?? { available: 0 };

  // Opponent sunk ships — shown as placed ships with sunk=true
  const opponentSunkAsShips: GridShip[] = (data.opponentSunkShips ?? []).map((s) => ({
    type: s.type,
    cells: s.cells,
    sunk: true,
  }));

  const myShipsAsGrid: GridShip[] = myShips.map((s) => ({
    type: s.type,
    cells: s.cells,
    sunk: s.sunk,
  }));

  const shipConfigs = SHIPS_CONFIG[matchType];
  const sunkTypes = new Set((data.opponentSunkShips ?? []).map((s) => s.type));

  return (
    <div className="space-y-4">
      {/* Token counter */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-2.5">
        <span className="text-sm font-bold text-foreground">
          🎯 {available} attack{available !== 1 ? "s" : ""} available
        </span>
        <span className="text-xs text-muted-foreground">
          {tokenBalance.earned} earned · {tokenBalance.spent} spent
        </span>
      </div>

      {/* Turn info */}
      <div
        className={`rounded-xl px-4 py-2.5 text-center text-sm font-bold ${
          available > 0
            ? "bg-green-500/15 text-green-400 border border-green-500/30"
            : "bg-muted text-muted-foreground border border-border"
        }`}
      >
        {available > 0 ? "🔫 Fire at the Enemy Grid!" : "💩 Log a deuce to earn attack tokens"}
      </div>

      {/* Power-up buttons */}
      {(sonarPing || ghostWipe) && (
        <div className="flex gap-2">
          {sonarPing && (
            <button
              disabled={sonarPing.used || powerupMutation.isPending}
              onClick={() => powerupMutation.mutate("sonar_ping")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                sonarPing.used
                  ? "bg-muted/30 text-muted-foreground border-border opacity-50 cursor-default"
                  : "bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25
                    active:scale-95"
              }`}
            >
              📡 Sonar Ping {sonarPing.used ? "(used)" : ""}
            </button>
          )}
          {ghostWipe && (
            <button
              disabled={ghostWipe.used || powerupMutation.isPending}
              onClick={() => powerupMutation.mutate("ghost_wipe")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                ghostWipe.used
                  ? "bg-muted/30 text-muted-foreground border-border opacity-50 cursor-default"
                  : "bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25
                    active:scale-95"
              }`}
            >
              👻 Ghost Wipe {ghostWipe.used ? "(used)" : ""}
            </button>
          )}
        </div>
      )}

      {/* Grid tabs */}
      <div className="flex rounded-xl overflow-hidden border border-border">
        <button
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "enemy"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => setActiveTab("enemy")}
        >
          🎯 Enemy Grid
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
            activeTab === "mine"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
          onClick={() => setActiveTab("mine")}
        >
          🛡️ Your Grid
        </button>
      </div>

      {/* Grid */}
      {activeTab === "enemy" ? (
        <div>
          <BattleGrid
            mode="attack"
            cols={grid.cols}
            rows={grid.rows}
            ships={opponentSunkAsShips}
            attacks={myAttacks}
            onCellClick={(col, row) => {
              if (available <= 0) {
                toast({
                  title: "No attacks!",
                  description: "Log a deuce to earn attack tokens.",
                  variant: "destructive",
                });
                return;
              }
              attackMutation.mutate({ col, row });
            }}
          />
          <p className="text-center text-xs text-muted-foreground mt-2">
            Tap a cell to fire · Revealed: {myAttacks.length} cells
          </p>
        </div>
      ) : (
        <div>
          <BattleGrid
            mode="defense"
            cols={grid.cols}
            rows={grid.rows}
            ships={myShipsAsGrid}
            attacks={opponentAttacks}
          />
          <p className="text-center text-xs text-muted-foreground mt-2">
            Incoming hits: {opponentAttacks.filter((a) => a.hit).length}
          </p>
        </div>
      )}

      {/* Opponent ships sunk tracker */}
      <div className="bg-card border border-border rounded-xl p-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Enemy Fleet Status</p>
        <div className="flex gap-3 flex-wrap">
          {shipConfigs.map((ship) => {
            const sunk = sunkTypes.has(ship.type);
            return (
              <div key={ship.type} className={`flex items-center gap-1.5 ${sunk ? "opacity-40 line-through" : ""}`}>
                <span className="text-lg leading-none">{ship.emoji}</span>
                <span className="text-xs font-bold text-foreground">{ship.label}</span>
                {sunk && <span className="text-[10px] text-red-400 font-bold">SUNK</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Game Over Phase ──────────────────────────────────────────────────────────

function GameOverPhase({
  data,
  userId,
}: {
  data: MatchData;
  userId: string;
}) {
  const [, setLocation] = useLocation();
  const { match, myAttacks, opponentAttacks } = data;
  const won = match.winnerId === userId;

  const myHits = myAttacks.filter((a) => a.hit).length;
  const myMisses = myAttacks.filter((a) => !a.hit).length;
  const myAccuracy = myAttacks.length > 0 ? Math.round((myHits / myAttacks.length) * 100) : 0;

  const theirHits = opponentAttacks.filter((a) => a.hit).length;
  const theirMisses = opponentAttacks.filter((a) => !a.hit).length;
  const theirAccuracy = opponentAttacks.length > 0 ? Math.round((theirHits / opponentAttacks.length) * 100) : 0;

  const sunkCount = (data.opponentSunkShips ?? []).filter((s) => s.sunk).length;

  return (
    <div className="space-y-5">
      {/* Victory/defeat splash */}
      <div
        className={`rounded-2xl p-8 text-center border ${
          won
            ? "bg-primary/10 border-primary/30"
            : "bg-red-500/10 border-red-500/30"
        }`}
      >
        <p className="text-6xl mb-3">{won ? "🏆" : "💀"}</p>
        <h2 className="text-3xl font-extrabold text-foreground">
          {won ? "YOU WON!" : "DEFEATED"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {won
            ? "You've conquered the porcelain battlefield."
            : "Your fleet has been flushed away."}
        </p>
        {match.status === "forfeited" && (
          <Badge variant="outline" className="mt-3 text-xs border-border">
            {won ? "Opponent forfeited" : "You forfeited"}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Battle Stats</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">You</p>
            <StatRow label="💥 Hits" value={myHits} />
            <StatRow label="💨 Misses" value={myMisses} />
            <StatRow label="🎯 Accuracy" value={`${myAccuracy}%`} />
            <StatRow label="🚢 Sunk" value={sunkCount} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Opponent</p>
            <StatRow label="💥 Hits" value={theirHits} />
            <StatRow label="💨 Misses" value={theirMisses} />
            <StatRow label="🎯 Accuracy" value={`${theirAccuracy}%`} />
            <StatRow label="🚢 Sunk" value={(data.myShips ?? []).filter((s) => s.sunk).length} />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl py-5"
        onClick={() => setLocation("/battle")}
      >
        Back to Lobby ⚔️
      </Button>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

// ─── Waiting Phase ─────────────────────────────────────────────────────────

function WaitingPhase({ matchId, onRefresh }: { matchId: string; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-8 text-center">
        <p className="text-5xl mb-3 animate-pulse">⏳</p>
        <h3 className="text-lg font-extrabold text-foreground">Waiting for opponent...</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Your ships are deployed. Now we wait for your enemy to make their move.
        </p>
        <Button variant="outline" className="mt-5 text-xs font-bold" onClick={onRefresh}>
          Check status
        </Button>
      </div>
    </div>
  );
}

// ─── Pending Acceptance ──────────────────────────────────────────────────────

function PendingPhase({ isChallenger, onRefresh }: { isChallenger: boolean; onRefresh: () => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-5xl mb-3">{isChallenger ? "⚔️" : "🔔"}</p>
        <h3 className="text-lg font-extrabold text-foreground">
          {isChallenger ? "Challenge sent!" : "You've been challenged!"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {isChallenger
            ? "Waiting for your opponent to accept the challenge."
            : "Accept the challenge to start placing your ships."}
        </p>
        <Button className="mt-5 bg-primary hover:bg-primary/90 font-bold" onClick={onRefresh}>
          {isChallenger ? "Check status" : "Accept & Deploy Ships →"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Match Page ──────────────────────────────────────────────────────────

export default function BattleMatch() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<MatchData>({
    queryKey: ["/api/battle/match", matchId],
    queryFn: async () => {
      try {
        return await apiRequest<MatchData>(`/api/battle/match/${matchId}`);
      } catch (err) {
        console.error("[battle-match] match fetch failed", err);
        throw err;
      }
    },
    enabled: !!matchId,
    refetchInterval: 10000, // Poll every 10s for updates
  });

  function refresh() {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/battle/matches"] });
  }

  if (isLoading) {
    return <PageSpinner />;
  }

  if (error || !data) {
    return (
      <div className="pt-6 pb-24 text-center">
        <p className="text-5xl mb-4">💀</p>
        <p className="font-bold text-foreground mb-2">Match not found</p>
        <p className="text-sm text-muted-foreground mb-6">This battle may have been voided.</p>
        <Button variant="outline" onClick={() => setLocation("/battle")}>Back to Lobby</Button>
      </div>
    );
  }

  const { match } = data;
  const isChallenger = match.challengerId === user?.id;
  const matchType = match.matchType;

  // Determine phase
  const isCompleted = ["completed", "forfeited", "voided"].includes(match.status);
  const hasPlacedShips = data.myShips && data.myShips.length > 0;
  const isActive = match.status === "active";
  const isPending = match.status === "pending";
  const isPlacementPhase = (match.status === "pending" || match.status === "placement") && !hasPlacedShips;
  const isWaiting = hasPlacedShips && (match.status === "pending" || match.status === "placement");

  const opponentId = isChallenger ? match.opponentId : match.challengerId;

  return (
    <div className="pt-6 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setLocation("/battle")}
          className="text-muted-foreground hover:text-foreground text-lg leading-none"
          aria-label="Back to lobby"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-foreground">⚔️ Battle Shits</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-[10px] font-bold border-border px-1.5 py-0">
              {matchType === "standard" ? "⚓ Standard" : "⚡ Quick"}
            </Badge>
            <span className="text-xs text-muted-foreground">Match #{matchId?.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Phase content */}
      {isCompleted ? (
        <GameOverPhase data={data} userId={user?.id ?? ""} />
      ) : isActive ? (
        <BattlePhase matchId={matchId!} matchType={matchType} data={data} onRefresh={refresh} />
      ) : isPlacementPhase ? (
        <PlacementPhase matchId={matchId!} matchType={matchType} onPlaced={refresh} />
      ) : isWaiting ? (
        <WaitingPhase matchId={matchId!} onRefresh={refresh} />
      ) : isPending ? (
        <PendingPhase isChallenger={isChallenger} onRefresh={refresh} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unknown match state: {match.status}</p>
        </div>
      )}
    </div>
  );
}
