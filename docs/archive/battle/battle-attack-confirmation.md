# Battle Shits: Add Attack Confirmation

## Task
Add confirmation step before firing during attack phase to prevent accidental taps from causing misfires.

## Problem
- Currently, tapping any cell in attack phase immediately fires
- On mobile, it's easy to mis-tap adjacent cells
- No way to cancel or correct a mis-tap before firing
- Creates frustration and unfair losses

## Solution
Implement a two-tap confirmation system:
1. First tap: Select/target cell (visual feedback, no shot fired)
2. Second tap on same cell: Confirm and fire shot
- Tap elsewhere: Cancel selection, select new target
- Visual indication of selected vs confirmed state
- Clear feedback that shot is pending confirmation

## Files to Modify
- `client/src/components/battle-grid.tsx` (primary - add selection/confirmation state)
- `client/src/pages/battle-match.tsx` (handle confirmation logic for firing)

## Specific Implementation

### In BattleGrid.tsx:
1. **Add selection state tracking**:
   - Add `selectedCell: {col: number, row: number} | null` prop
   - Add `isConfirming: boolean` prop to distinguish selection vs confirmation
   - Update `getCellState()` and `getCellClass()` to show selection/confirmation states

2. **Visual feedback for selection/confirmation**:
   - Selected cell: distinct styling (e.g., border glow, pulse animation)
   - Confirming cell: different styling (e.g., pulse, scale animation)
   - Consider different colors/states for hover vs selected vs confirming

3. **Update click handling**:
   - onCellClick should now handle selection state
   - May need additional callbacks for confirmation

### In BattleMatch.tsx:
1. **Add attack confirmation state**:
   - Track `confirmingCell: {col: number, row: number} | null`
   - Track `pendingAttack: {col: number, row: number} | null` 
   - Modify attack logic to require confirmation before firing

2. **Update attack flow**:
   - On cell tap: if no pending attack → set as pending (first tap)
   - On cell tap: if pending attack and same cell → confirm and fire (second tap)
   - On cell tap: if pending attack and different cell → change pending target
   - Add visual feedback for pending/confirming states

## Success Criteria
- First tap selects cell (visual feedback, no shot)
- Second tap on same cell confirms and fires
- Tapping elsewhere changes target (no penalty for mis-tap)
- Clear visual distinction between idle, selected, and confirming states
- No regression in existing functionality
- Preserves dark theme and game feel