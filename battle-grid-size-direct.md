# Battle Shits: Direct Grid Size Increase Instructions

## EXACT CHANGES NEEDED IN battle-grid.tsx:

### Change 1: Line ~176
FROM: `style={{ gridTemplateColumns: \`32px repeat(${cols}, minmax(0, 1fr)) \`}}`
TO: `style={{ gridTemplateColumns: \`48px repeat(${cols}, minmax(0, 1fr)) \`}}`

### Change 2: Line ~195  
FROM: `style={{ gridTemplateColumns: \`32px repeat(${cols}, minmax(0, 1fr)) \`}}`
TO: `style={{ gridTemplateColumns: \`48px repeat(${cols}, minmax(0, 1fr)) \`}}`

### Change 3: Line ~214
FROM: `min-h-[42px]`
TO: `min-h-[48px]`

### Change 4: Update all other 32px references to 48px for consistency:
- Any `32px` in grid-related styling should become `48px`
- Column header and label styling may need adjustment
- Ensure touch targets are at least 44px (we're using 48px for margin)

## Files:
- PRIMARY: `client/src/components/battle-grid.tsx`
- SECONDARY: `client/src/pages/battle-match.tsx` (check if container needs adjustment)

## Success Criteria:
- Grid cells ≥48px on 375px screen
- All instances of 32px in grid layout updated to 48px
- Game remains fully functional
- No visual breaking changes