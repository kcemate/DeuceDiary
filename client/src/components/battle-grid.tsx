import { cn } from "@/lib/utils";

export interface GridCell {
  col: number;
  row: number;
}

export interface GridShip {
  type: string;
  cells: GridCell[];
  sunk?: boolean;
}

export interface GridAttack {
  col: number;
  row: number;
  hit: boolean;
}

interface BattleGridProps {
  mode: "placement" | "attack" | "defense";
  cols: number;
  rows: number;
  ships?: GridShip[];
  attacks?: Attack[];
  onCellClick?: (col: number, row: number) => void;
  previewCells?: GridCell[];
  previewValid?: boolean;
  dayLabels?: string[];
}

type Attack = GridAttack;

const TIME_SLOT_LABELS = [
  { label: "AM", emoji: "☀️" },
  { label: "PM", emoji: "🌤️" },
  { label: "Night", emoji: "🌙" },
];

const SHIP_COLORS: Record<string, string> = {
  floater: "bg-blue-500",
  log: "bg-amber-600",
  battleshit: "bg-red-600",
};

function cellKey(col: number, row: number) {
  return `${col}-${row}`;
}

export function BattleGrid({
  mode,
  cols,
  rows,
  ships = [],
  attacks = [],
  onCellClick,
  previewCells = [],
  previewValid = true,
  dayLabels,
}: BattleGridProps) {
  // Build lookup maps for fast rendering
  const shipCellMap = new Map<string, GridShip>();
  for (const ship of ships) {
    for (const cell of ship.cells) {
      shipCellMap.set(cellKey(cell.col, cell.row), ship);
    }
  }

  const attackMap = new Map<string, boolean>();
  for (const atk of attacks) {
    attackMap.set(cellKey(atk.col, atk.row), atk.hit);
  }

  const previewSet = new Set(previewCells.map((c) => cellKey(c.col, c.row)));

  const defaultDayLabels =
    cols === 7
      ? ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
      : Array.from({ length: cols }, (_, i) => `D${i + 1}`);
  const labels = dayLabels ?? defaultDayLabels;

  function getCellState(col: number, row: number) {
    const key = cellKey(col, row);
    const ship = shipCellMap.get(key);
    const attacked = attackMap.has(key);
    const hit = attackMap.get(key);
    const isPreview = previewSet.has(key);

    if (isPreview) return "preview";
    if (mode === "attack") {
      if (hit === true) return "hit";
      if (hit === false) return "miss";
      return "fog";
    }
    if (mode === "defense") {
      if (ship) {
        if (hit === true) return "ship-hit";
        return "ship";
      }
      if (hit === false) return "miss";
      return "empty";
    }
    // placement
    if (ship) return "placed";
    return "empty";
  }

  function getCellClass(state: string, ship?: GridShip) {
    const base =
      "relative flex items-center justify-center text-base select-none transition-all duration-150";
    switch (state) {
      case "fog":
        return cn(base,
          "bg-blue-950/60 border border-blue-900/40 cursor-pointer active:scale-95",
          "active:bg-blue-900/80 hover:bg-blue-900/50");
      case "hit":
        return cn(base, "bg-red-900/80 border border-red-700 cursor-default animate-hit-flash");
      case "miss":
        return cn(base, "bg-slate-700/60 border border-slate-600/40 cursor-default");
      case "empty":
        return cn(
          base,
          mode === "placement"
            ? "bg-blue-950/50 border border-blue-900/40 cursor-pointer hover:bg-blue-900/50 active:scale-95"
            : "bg-blue-950/40 border border-blue-900/30"
        );
      case "ship": {
        const color = ship ? SHIP_COLORS[ship.type] ?? "bg-stone-600" : "bg-stone-600";
        return cn(base, color, "border border-white/20 cursor-default opacity-90");
      }
      case "ship-hit": {
        const color = ship ? SHIP_COLORS[ship.type] ?? "bg-stone-600" : "bg-stone-600";
        return cn(base, color, "border border-red-400 brightness-75 cursor-default");
      }
      case "placed": {
        const color = ship ? SHIP_COLORS[ship.type] ?? "bg-stone-600" : "bg-stone-600";
        return cn(base, color, "border border-white/20 opacity-90 cursor-default");
      }
      case "preview":
        return cn(
          base,
          previewValid
            ? "bg-emerald-700/70 border border-emerald-400/70"
            : "bg-red-800/70 border border-red-500/70",
          "cursor-pointer"
        );
      default:
        return cn(base, "bg-blue-950/40 border border-blue-900/30");
    }
  }

  function getCellContent(state: string, ship?: GridShip) {
    switch (state) {
      case "hit":
        return <span className="text-lg leading-none animate-bounce-once">💥</span>;
      case "miss":
        return <span className="text-sm leading-none opacity-70">💨</span>;
      case "ship-hit":
        return <span className="text-sm leading-none">💥</span>;
      case "ship":
      case "placed":
        return null; // colored block — emoji shown in inventory only
      case "fog":
        return null;
      default:
        return null;
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Column headers */}
        <div
          className="grid mb-0.5"
          style={{ gridTemplateColumns: `32px repeat(${cols}, minmax(0, 1fr))` }}
        >
          <div /> {/* corner */}
          {labels.map((label) => (
            <div
              key={label}
              className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wide py-0.5"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        <div className="space-y-0.5">
          {Array.from({ length: rows }, (_, row) => (
            <div
              key={row}
              className="grid items-stretch"
              style={{ gridTemplateColumns: `32px repeat(${cols}, minmax(0, 1fr))` }}
            >
              {/* Row header */}
              <div className="flex flex-col items-center justify-center pr-1">
                <span className="text-xs leading-none">{TIME_SLOT_LABELS[row]?.emoji}</span>
                <span className="text-[8px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wide">
                  {TIME_SLOT_LABELS[row]?.label}
                </span>
              </div>

              {/* Cells */}
              {Array.from({ length: cols }, (_, col) => {
                const key = cellKey(col, row);
                const ship = shipCellMap.get(key);
                const state = getCellState(col, row);
                return (
                  <div
                    key={col}
                    className={cn(getCellClass(state, ship), "min-h-[42px]")}
                    onClick={() => onCellClick?.(col, row)}
                    role={onCellClick ? "button" : undefined}
                    aria-label={`${labels[col]} ${TIME_SLOT_LABELS[row]?.label}`}
                  >
                    {getCellContent(state, ship)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
