# Battle Shits: Implement All Autoreason Critique Recommendations

## Task
Implement all 35 recommendations from the autoreason critique (pass 4 critique.txt) to fix mobile UX, engagement, progression, AI quality, and feedback issues in Battle Shits.

## Files to Modify
- `client/src/pages/battle-match.tsx` (main game screen)
- `client/src/components/battle-grid.tsx` (grid rendering and interaction)
- `client/src/components/battle-challenge-modal.tsx` (issue challenge flow)
- `client/src/pages/battle-lobby.tsx` (battle lobby/setup)

## Core Requirements from Critique (pass4_critique.txt)

### Mobile UX Fixes (Priority - these match Kyle's screenshot)
1. **Increase grid cell size** to meet 44px minimum touch target
   - Current: ~32px on 375px screen (too small)
   - Target: ≥44px per cell with comfortable spacing
2. **Add on-screen rotate button** (replace "Press R to rotate")
3. **Add attack confirmation** (prevent accidental taps from firing immediately)
4. **Add pinch-to-zoom** on attack grid for precision targeting
5. **Fix two-step placement flow** - add drag-to-place alternative

### Engagement & Feedback
6. **Add sound effects** for hit, miss, sunk, place, taunt, victory
7. **Add haptic feedback** on mobile for different attack outcomes
8. **Add victory celebration** and shareable result screen
9. **Reveal sunk ship identity** (show ship name when sunk)
10. **Add running accuracy/hit counter** during play
11. **Add screen shake/particle effects** on hits and sinks
12. **Add near-miss indicator** (adjacent cell feedback)
13. **Add dramatic sound on ship sink** (not just background flash)
14. **Add victory fanfare and loss commiseration**
15. **Add screen shake on hits, particle burst on sinks**

### Progression Systems
16. **Make XP/levels unlock tangible rewards** (titles, cosmetics, etc.)
17. **Add coin shop/spend system** (give coins purpose)
18. **Add win/loss record and match history tracking**
19. **Add daily challenges/missions/session goals**
20. **Show reward multipliers during gameplay** (accuracy bonus visible)
21. **Add streak tracking** (win streaks, hit streaks)
22. **Add session goals** (e.g., "Sink 3 ships today")

### Social & Viral Hooks
23. **Enable taunt sending/display** (UI to select taunt, show received taunts)
24. **Add shareable result** (screenshot-worthy victory screen)
25. **Add opponent identity** (name, avatar, skill rating visible)
26. **Add leaderboard/ranking visibility**
27. **Add rematch prompt** visible on result screen

### AI Quality & Game Balance
28. **Improve opponent AI** - target adjacent cells after hit (hunting behavior)
29. **Add difficulty ramp** or visible AI intelligence indicator
30. **Add comeback mechanic** (power-ups, special abilities when behind)
31. **Balance loss rewards** - reduce penalty so losses don't feel like waste
32. **Add tutorial/onboarding** for new players (placement phase help)
33. **Add mid-match progression/twist** (special weapons, radar sweep)
34. **Remove fake waiting screen** - be honest about local AI opponent
35. **Add toilet humor to UI** (match ship names like Battleshit/Turdis in visuals)

## Implementation Notes
- Keep all existing ship definitions, taunts, and phase copy
- Preserve dark theme, 🚽 hero, green primary color, and Clerk auth
- Do NOT add features that don't exist in the app (no fake multiplayer)
- Every change must be motivated by the critique points above
- Output COMPLETE files — never truncate or abbreviate
- Test thoroughly on iOS simulator dimensions (375px width)

## Success Criteria
- All 35 critique points addressed
- Game remains fun and on-theme
- Mobile usability greatly improved (larger targets, confirmation, zoom)
- Engagement increased (sound, haptics, progression, sharing)
- Battles feel fair and rewarding even when losing
- No regression in existing functionality