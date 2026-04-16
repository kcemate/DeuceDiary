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

interface ToastMessage {
  id: number;
  text: string;
  emoji: string;
  timestamp: number;
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
// SOUND UTILITY
// ============================================================

const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioCtx();
    return audioCtx;
  } catch {
    return null;
  }
}

function playSound(type: 'hit' | 'miss' | 'sunk' | 'place' | 'taunt' | 'victory' | 'defeat') {
  const ctx = getAudioCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;

  switch (type) {
    case 'hit':
      osc.type = 'square';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'miss':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'sunk':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.4);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      break;
    case 'place':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    case 'taunt':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(800, now + 0.05);
      osc.frequency.setValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    case 'victory':
      osc.type = 'square';
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.15);
      osc.frequency.setValueAtTime(784, now + 0.3);
      osc.frequency.setValueAtTime(1047, now + 0.45);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
    case 'defeat':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
      break;
  }
}

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
  // Smart AI: prioritize cells adjacent to hits
  const hits: [number, number][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 'hit') hits.push([r, c]);
    }
  }

  // Try adjacent cells to existing hits first
  const adjacentToHits: [number, number][] = [];
  const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [hr, hc] of hits) {
    for (const [dr, dc] of directions) {
      const nr = hr + dr;
      const nc = hc + dc;
      if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
        if (grid[nr][nc] === 'empty' || grid[nr][nc] === 'ship') {
          adjacentToHits.push([nr, nc]);
        }
      }
    }
  }

  if (adjacentToHits.length > 0 && Math.random() < 0.7) {
    const [row, col] = adjacentToHits[Math.floor(Math.random() * adjacentToHits.length)];
    return { row, col };
  }

  // Fallback: random available cell
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

function getShipNameById(id: ShipId): string {
  return SHIP_DEFINITIONS.find((s) => s.id === id)?.name ?? id;
}

function getShipEmojiById(id: ShipId): string {
  return SHIP_DEFINITIONS.find((s) => s.id === id)?.emoji ?? '💩';
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
  shipEmoji,
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
  shipEmoji?: string;
}) {
  const [splash, setSplash] = useState(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    if (animation) {
      setSplash(true);
      animRef.current = window.setTimeout(() => setSplash(false), 600