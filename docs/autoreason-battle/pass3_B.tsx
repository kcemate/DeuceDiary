The problem identified is: **No code exists** — the entire battle-match.tsx file is missing. My change: create the complete file from scratch, addressing all six priorities from the original task.

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
  { id: 't5', text: 'You\'re in deep now!', emoji: '🕳️' },
  { id: 't6', text: 'Bowels of steel!', emoji: '🛡️' },
  { id: 't7', text: 'Clogged your pipes!', emoji: '🔧' },
  { id: 't8', text: 'Dial 9-1-POO!', emoji: '📞' },
];

const ROW_LABELS = Array.from({ length: GRID_SIZE }, (_, i) => String(i + 1));
const COL_LABELS = Array.from({ length: GRID_SIZE }, (_, i) => String.fromCharCode(65 + i));

// XP thresholds per level (cumulative)
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 850, 1300, 1900, 2650, 3600, 4800,
  6300, 8100, 10250, 12800, 15800, 19300, 23400, 28100, 33500, 39700,
];

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

function randomOpponentAttack(grid: CellState[][], ships: PlacedShip[]): { row: number; col: number } {
  // Prefer cells not yet attacked
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
  animation?: AttackAnimation | null;
  isOpponent?: boolean;
  disabled?: boolean;
}) {
  const getBg = (): string => {
    if (animation) {
      switch (animation.type) {
        case 'hit': return '#ef4444';
        case 'miss': return '#60a5fa';
        case 'sunk': return '#7c3aed';
        default: return '';
      }
    }
    if (isHover && isValid === false) return '#fca5a5';
    if (isHover && isValid === true) return '#86efac';
    switch (state) {
      case 'ship': return isPlayer ? '#8b5cf6' : '#e0e7ff';
      case 'hit': return '#ef4444';
      case 'miss': return '#60a5fa';
      case 'sunk': return '#7c3aed';
      default: return '#e0e7ff';
    }
  };

  const getEmoji = (): string => {
    if (animation) {
      switch (animation.type) {
        case 'hit': return '💥';
        case 'miss': return '💦';
        case 'sunk': return '💀';
        default: return '';
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
      disabled={disabled}
      aria-label={
        isOpponent
          ? `Attack cell ${state === 'hit' ? 'hit' : state === 'miss' ? 'miss' : state === 'sunk' ? 'sunk' : 'unknown'}`
          : `Your cell ${state}`
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
        transform: animation ? 'scale(1.2)' : 'scale(1)',
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
          Level {level}
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
            backgroundColor: '#8b5cf6',
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
                : isPlaced
                ? '2px solid #d1d5db'
                : '2px solid #e5e7eb',
              backgroundColor: isPlaced
                ? '#f3f4f6'
                : isSelected
                ? '#ede9fe'
                : '#ffffff',
              cursor: isPlaced || disabled ? 'default' : 'pointer',
              opacity: isPlaced ? 0.5 : 1,
              transition: 'all 0.15s ease',
              minWidth: '70px',
            }}
          >
            <span style={{ fontSize: '24px' }} aria-hidden="true">{ship.emoji}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#374151', marginTop: '2px' }}>
              {ship.name}
            </span>
            <span style={{ fontSize: '10px', color: '#6b7280' }}>
              {ship.size} cells
            </span>
            {isPlaced && (
              <span style={{