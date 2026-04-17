# Battle Shits: Grid Size Increase for Mobile UX

## Task
Increase grid cell size in Battle Shits to meet 44px minimum touch target for mobile usability.

## Problem
- Current grid cells are ~32px on 375px screen width
- Below 44px minimum touch target size
- Causes mis-taps and frustration on mobile devices

## Solution
Modify BattleGrid component to:
1. Increase base cell size from 32px to at least 44px
2. Adjust all related styling and layout to accommodate larger cells
3. Ensure grid remains functional and scrollable
4. Maintain visual proportions and usability

## Files to Modify
- `client/src/components/battle-grid.tsx` (primary)
- `client/src/pages/battle-match.tsx` (may need adjustments for container sizing)

## Specific Changes Needed

### In BattleGrid.tsx:
1. **Change grid container styling**:
   - Update `style={{ gridTemplateColumns: \`32px repeat(${cols}, minmax(0, 1fr)) \`}}` to use 44px or larger
   - Update column header styling similarly

2. **Update cell container sizing**:
   - Change `min-h-[42px]` to `min-h-[44px]` or larger
   - Ensure aspect ratio remains square-ish for touch targets

3. **Adjust label and typography sizing**:
   - Update TIME_SLOT_LABELS styling if needed
   - Adjust column header text sizing for larger grid
   - Update any fixed pixel values that assume 32px grid

4. **Update touch interaction areas**:
   - Ensure onClick handlers cover full cell area
   - Check any hit-testing or pointer event logic

### In BattleMatch.tsx (if needed):
1. **Check container dimensions**:
   - Ensure parent containers can accommodate larger grid
   - Verify scrolling behavior still works
   - Check any fixed height/width constraints

## Implementation Notes
- Preserve all existing functionality and visual design
- Keep dark theme, 🚽 hero, green primary color
- Do not change game logic or ship definitions
- Focus purely on touch target size improvement
- Test on iOS simulator dimensions (375px width)
- Output COMPLETE files — never truncate or abbreviate

## Success Criteria
- Grid cells ≥44px on 375px screen (meets accessibility guidelines)
- No mis-taps during normal gameplay
- Grid remains fully functional (placement, attack, defense modes)
- Visual design preserved and proportional
- No regression in existing functionality