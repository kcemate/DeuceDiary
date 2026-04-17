# Battle Shits: Critical Mobile UX Fixes (First Pass)

## Task
Implement the most critical mobile UX fixes from the autoreason critique:
1. Increase grid cell size to meet 44px minimum touch target
2. Add on-screen rotate button (replace "Press R to rotate") 
3. Add attack confirmation (prevent accidental taps)
4. Add pinch-to-zoom on attack grid for precision targeting

## Files to Modify
- `client/src/components/battle-grid.tsx` (core grid logic and rendering)
- `client/src/pages/battle-match.tsx` (game state and UI)

## Specific Requirements

### 1. Grid Cell Size Increase
- Current cells are ~32px on 375px screen (too small for reliable touch)
- Target: Minimum 44px per cell with comfortable spacing
- Modify the grid container and cell styling in BattleGrid component
- Adjust TIME_SLOT_LABELS and label styling to accommodate larger cells
- Ensure grid remains scrollable and doesn't break layout

### 2. On-Screen Rotate Button
- Replace "Press R to rotate" placeholder with actual touch button
- Add rotate button during ship placement phase
- Button should rotate selected ship 90° clockwise
- Visual feedback on button press
- Position button conveniently (bottom-right or similar)

### 3. Attack Confirmation
- Prevent immediate firing on tap during attack phase
- Add confirmation step (e.g., tap to select, tap again to confirm fire)
- Visual indication of selected/targeted cell before firing
- Option to cancel/mis-tap without penalty
- Clear visual feedback for confirmation state

### 4. Pinch-to-Zoom on Attack Grid
- Enable touch zoom/pan on attack grid during attack phase
- Allow players to zoom in for precise targeting
- Add pan capability to move around zoomed grid
- Reset zoom/pan when exiting attack phase or starting new turn
- Smooth zoom animation and bounds checking

## Implementation Notes
- Keep all existing ship definitions, taunts, and phase copy
- Preserve dark theme, 🚽 hero, green primary color, and Clerk auth
- Do NOT add features that don't exist in the app
- Every change must be motivated by mobile UX improvement
- Output COMPLETE files — never truncate or abbreviate
- Test thoroughly on iOS simulator dimensions (375px width)

## Success Criteria
- Grid cells are easily tappable on mobile (no mis-taps)
- Rotate function accessible via touch
- Attack confirmation prevents accidental shots
- Pinch-to-zoom enables precision targeting
- No regression in existing functionality
- Game remains fun and on-theme