```tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ============================================================
// TYPES
// ============================================================

type CellState = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';
type GamePhase = 'placement' | 'waiting' | 'attacking' | 'defending' | 'result';
type Orientation = 'horizontal' | 'vertical';
type ShipId = 'floater' | 'log' | 'cornlog' | 'battleshit' | 'turdis';

interface ShipDefinition {
  id: ShipId;
  name: string;
  emoji: string;
  size: number;
  description: string;
}

interface PlacedShip {
  id: ShipId;
  row: number;
  col: number;
  orientation: Orientation;
  cells: [number, number][];
  hits: number;
  sunk: boolean;
}

interface PlayerState {
  grid: CellState[][];
  ships: PlacedShip[];
  shipsPlaced: ShipId[];
  allPlaced: boolean;
}

interface Taunt {
  id: string;
  text: string;
  emoji: string;
}

interface AttackAnimation {
  row: number;
  col: number;
  type: 'hit' | 'miss' | 'sunk';
  timestamp: number;
}

interface RewardBreakdown {
  baseXP: number;
  accuracyBonus: number;
  sunkBonus: number;
  victoryBonus: number;
  totalXP: number;
  coins: number;
}

interface AttackResult {
  row: number;
  col: number;
  result: 'hit' | 'miss' | 'sunk';
  shipName?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const GRID_SIZE = 10;

const SHIP_DEFINITIONS: ShipDefinition[] = [
  { id: 'floater', name: 'Floater', emoji: '💩', size: 2, description: 'Small but sneaky' },
  { id: 'log', name: 'Log', emoji: '🪵', size: 3, description: 'A solid deposit' },
  { id: 'cornlog', name: 'Corn Log', emoji: '🌽', size: 3, description: 'Roughage included' },
  { id: 'battleshit', name: 'Battleshit', emoji: '🚽', size: 4, description: 'The main event' },
  { id: 'turdis', name: 'USS Turdis', emoji: '🏛️', size: 5, description: 'The pride of the fleet' },
];

const TAUNTS: Taunt[] = [
  { id: 't1', text: 'Hope you brought a plunger!', emoji: '🪠' },
  { id: 't2', text: 'That stinks!', emoji: '🤢' },
  { id: 't3', text: 'Flushed ya!', emoji: '🚽' },
  { id: 't4', text: 'Full stream ahead!', emoji: '💦' },
  { id: 't5', text: "You're in deep now!", emoji: '🕳️' },
  { id: 't6', text: 'Bowels of steel!', emoji: '🛡️' },
  { id: 't7', text: 'Clogged your pipes!', emoji: '🔧' },
  { id: 't8', text: 'Dial 9-1-POO!', emoji: '📞' },
  { id: 't9', text: 'Uranus is next!', emoji: '🪐' },
  { id: 't10', text: 'Sphinc-tacular!', emoji: '✨' },
];

const ROW_LABELS = Array.from({ length: GRID_SIZE }, (_, i) => String(i + 1));
const COL_LABELS = Array.from({ length: GRID_SIZE }, (_, i) => String.fromCharCode(65 + i));

const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 850, 1300, 1900, 2650, 3600, 4800,
  6300, 8100, 10250, 12800, 15800, 19300, 23400, 28100, 33500, 39700,
];

const PHASE_COPY: Record<GamePhase, { title: string; subtitle: string }> = {
  placement: { title: 'Deploy Your Fleet', subtitle: 'Tap a ship, then tap the grid to place. Press R to rotate.' },
  waiting: { title: 'Waiting for Opponent', subtitle: 'Hold your breath…' },
  attacking: { title: 'Fire at Will!', subtitle: 'Tap the enemy grid to attack.' },
  defending: { title: 'Brace Yourself!', subtitle: 'Incoming…' },
  result: { title: 'Battle Over!', subtitle: '' },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function createEmptyGrid(): CellState[][] {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => 'empty' as CellState)
  );
}

function getShipCells(
  row: number,
  col: number,
  size: number,
  orientation: Orientation
): [number, number][] {
  const cells: [number, number][] = [];
  for (let i = 0; i < size; i++) {
    if (orientation === 'horizontal') {
      cells.push([row, col + i]);
    } else {
      cells.push([row + i, col]);
    }
  }
  return cells;
}

function isValidPlacement(
  grid: CellState[][],
  row: number,
  col: number,
  size: number,
  orientation: Orientation
): boolean {
  const cells = getShipCells(row, col, size, orientation);
  return cells.every(([r, c]) => {
    if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
    return grid[r][c] === 'empty';
  });
}

function getLevelFromXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

function getXPForNextLevel(currentXP: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXP(currentXP);
  if (level >= LEVEL_THRESHOLDS.length) {
    return { current: currentXP, needed: currentXP, progress: 1 };
  }
  const currentThreshold = LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level];
  const progress = (currentXP - currentThreshold) / (nextThreshold - currentThreshold);
  return { current: currentXP, needed: nextThreshold, progress: Math.min(progress, 1) };
}

function randomOpponentAttack(grid: CellState[][]): { row: number; col: number } {
  const available: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 'empty' || grid[r][c] === 'ship') {
        available.push([r, c]);
      }
    }
  }
  if (available.length === 0) return { row: 0, col: 0 };
  const [row, col] = available[Math.floor(Math.random() * available.length)];
  return { row, col };
}

function resolveAttack(
  grid: CellState[][],
  ships: PlacedShip[],
  row: number,
  col: number
): { newGrid: CellState[][]; newShips: PlacedShip[]; result: 'hit' | 'miss' | 'sunk'; shipName?: string } {
  const newGrid = grid.map((r) => [...r]);
  const newShips = ships.map((s) => ({ ...s, cells: [...s.cells] } as PlacedShip));

  const shipIndex = newShips.findIndex((s) =>
    s.cells.some(([r, c]) => r === row && c === col)
  );

  if (shipIndex >= 0) {
    const ship = newShips[shipIndex];
    ship.hits += 1;
    if (ship.hits >= ship.cells.length) {
      ship.sunk = true;
      ship.cells.forEach(([r, c]) => {
        newGrid[r][c] = 'sunk';
      });
      return { newGrid, newShips, result: 'sunk', shipName: ship.id };
    } else {
      newGrid[row][col] = 'hit';
      return { newGrid, newShips, result: 'hit' };
    }
  } else {
    newGrid[row][col] = 'miss';
    return { newGrid, newShips, result: 'miss' };
  }
}

function allShipsSunk(ships: PlacedShip[]): boolean {
  return ships.length > 0 && ships.every((s) => s.sunk);
}

function computeRewards(
  won: boolean,
  playerShips: PlacedShip[],
  opponentShips: PlacedShip[],
  totalAttacks: number,
  totalHits: number
): RewardBreakdown {
  const baseXP = 50;
  const accuracyBonus = totalAttacks > 0 ? Math.round((totalHits / totalAttacks) * 50) : 0;
  const sunkBonus = opponentShips.filter((s) => s.sunk).length * 25;
  const shipsSurvived = playerShips.filter((s) => !s.sunk).length;
  const victoryBonus = won ? 100 + shipsSurvived * 20 : 15;
  const totalXP = baseXP + accuracyBonus + sunkBonus + victoryBonus;
  const coins = won ? 30 + shipsSurvived * 5 : 5;
  return { baseXP, accuracyBonus, sunkBonus, victoryBonus, totalXP, coins };
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function GridCell({
  state,
  isPlayer,
  isHover,
  isValid,
  onClick,
  onHover,
  onLeave,
  animation,
  isOpponent,
  disabled,
}: {
  state: CellState;
  isPlayer: boolean;
  isHover?: boolean;
  isValid?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onLeave?: () => void;
  animation?: AttackAnimation | null;
  isOpponent?: boolean;
  disabled?: boolean;
}) {
  const [splash, setSplash] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (animation) {
      setSplash(true);
      animRef.current = window.setTimeout(() => setSplash(false), 600);
      return () => {
        if (animRef.current) clearTimeout(animRef.current);
      };
    }
  }, [animation]);

  const getBg = (): string => {
    if (splash && animation) {
      switch (animation.type) {
        case 'hit': return '#ef4444';
        case 'miss': return '#60a5fa';
        case 'sunk': return '#7c3aed';
      }
    }
    if (isHover && isValid === false) return '#fca5a5';
    if (isHover && isValid === true) return '#86efac';
    switch (state) {
      case 'ship': return isPlayer ? '#c4b5fd' : '#e0e7ff';
      case 'hit': return '#fca5a5';
      case 'miss': return '#93c5fd';
      case 'sunk': return '#a78bfa';
      default: return '#e0e7ff';
    }
  };

  const getEmoji = (): string => {
    if (splash && animation) {
      switch (animation.type) {
        case 'hit': return '💥';
        case 'miss': return '💦';
        case 'sunk': return '💀';
      }
    }
    switch (state) {
      case 'hit': return '💥';
      case 'miss': return '💦';
      case 'sunk': return '💀';
      default: return '';
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={disabled ? undefined : onHover}
      onMouseLeave={disabled ? undefined : onLeave}
      disabled={disabled}
      aria-label={
        isOpponent
          ? `Enemy cell ${state === 'hit' ? 'hit' : state === 'miss' ? 'miss' : state === 'sunk' ? 'sunk' : 'unknown'}`
          : `Your cell ${state === 'ship' ? 'ship' : state === 'hit' ? 'hit' : state === 'miss' ? 'miss' : state === 'sunk' ? 'sunk' : 'empty'}`
      }
      style={{
        width: '100%',
        aspectRatio: '1',
        backgroundColor: getBg(),
        border: '1px solid #c7d2fe',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'clamp(10px, 2.5vw, 18px)',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background-color 0.15s ease, transform 0.15s ease',
        transform: splash ? 'scale(1.25)' : 'scale(1)',
        padding: 0,
        lineHeight: 1,
        outline: 'none',
      }}
    >
      {getEmoji()}
    </button>
  );
}

function XPBar({ xp, level }: { xp: number; level: number }) {
  const { progress, needed, current } = getXPForNextLevel(xp);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#4c1d95' }}>
          ⭐ Level {level}
        </span>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>
          {current} / {needed} XP
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={needed}
        aria-label={`Level ${level} progress: ${current} of ${needed} XP`}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8b5cf6, #6d28d9)',
            borderRadius: '999px',
            transition: 'width 0.5s ease',
          }}
        />
      </div>
    </div>
  );
}

function ShipSelector({
  ships,
  selectedShip,
  onSelect,
  placedShips,
  disabled,
}: {
  ships: ShipDefinition[];
  selectedShip: ShipId | null;
  onSelect: (id: ShipId) => void;
  placedShips: ShipId[];
  disabled?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
      role="radiogroup"
      aria-label="Select a ship to place"
    >
      {ships.map((ship) => {
        const isPlaced = placedShips.includes(ship.id);
        const isSelected = selectedShip === ship.id;
        return (
          <button
            key={ship.id}
            onClick={() => !isPlaced && !disabled && onSelect(ship.id)}
            disabled={isPlaced || disabled}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${ship.name} (${ship.size} cells)${isPlaced ? ' - placed' : ''}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 12px',
              borderRadius: '12px',
              border: isSelected
                ? '2px solid #7c3aed'