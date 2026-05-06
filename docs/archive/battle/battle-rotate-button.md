# Battle Shits: Add On-Screen Rotate Button

## Task
Replace "Press R to rotate" placeholder with an actual touch-enabled rotate button for mobile users.

## Problem
- Current placement phase shows "Press R to rotate" which is useless on mobile
- Mobile users have no way to rotate ships before placement
- This creates placement frustration and limits strategy

## Solution
Add a rotate button during ship placement phase that:
- Appears when a ship is selected for placement
- Rotates the selected ship 90° clockwise when tapped
- Provides visual feedback on tap
- Is positioned conveniently (bottom-right or similar)
- Only visible during placement mode

## Files to Modify
- `client/src/components/battle-grid.tsx` (primary - add button UI and logic)
- `client/src/pages/battle-match.tsx` (may need to pass selected ship state)

## Specific Implementation

### In BattleGrid.tsx:
1. **Add rotate button state/UI**:
   - Add condition to show button only in "placement" mode when ship is selected
   - Position button absolutely or in fixed location (e.g., bottom-right of grid)
   - Style as touch-friendly button (≥44px)

2. **Add rotation logic**:
   - Track currently selected ship type for placement
   - Add rotateShip() function that rotates ship 90° clockwise
   - Update preview logic to use rotated ship

3. **Visual feedback**:
   - Add active/tap state styling
   - Consider adding rotation animation or indicator

### In BattleMatch.tsx (if needed):
1. **Pass selected ship state**:
   - May need to track which ship is currently selected for placement
   - Pass this state down to BattleGrid component

## Success Criteria
- Rotate button visible during ship placement
- Button tappable and rotates selected ship
- Visual feedback on button press
- Works for all ship types
- No regression in existing functionality
- Preserves dark theme and game feel