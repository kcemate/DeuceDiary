# Groups (Squads) Autoresearch Iterations

## Iteration 1: In-Group Leaderboard UI
**What:** Built `GroupLeaderboard` component with weekly/monthly/all-time tabs, medal rankings, MVP badge, reaction counts, personal streaks, and current-user highlighting.
**Why:** The leaderboard API existed (`/api/groups/:groupId/leaderboard`) with rich data (per-member stats, MVP designation) but had zero frontend. Competition is the #1 driver of group engagement.
**Result:** Users can now see who's on top, switch time ranges, and feel the competitive pressure. The "(you)" label and highlight row make it personal.
**Files:** `client/src/components/group-leaderboard.tsx` (new), `client/src/pages/group-detail.tsx` (import + placement)

## Iteration 2: Weekly Throne Report Card
**What:** Built `GroupWeeklyReport` component — a collapsible card showing squad's weekly stats (total deuces, streak, MVP), member activity with status badges (active/at risk/inactive), fun facts (longest gap, most reactions, funniest entry), and a share button.
**Why:** The weekly report API existed but had no group-level UI. Weekly recaps drive re-engagement and give users a reason to come back even on slow weeks. The share button enables organic growth.
**Result:** Compact summary that starts collapsed (keeping the page scannable) but expands to reveal rich squad insights. Share generates a formatted text message for external sharing.
**Files:** `client/src/components/group-weekly-report.tsx` (new), `client/src/pages/group-detail.tsx` (import + placement)

## Iteration 3: Enriched Groups List with Streak Badges
**What:** Updated groups list to show streak badges (🔥 Xd) on active-streak squads, longest streak hint, and made entire card tappable (removed separate "Open" button). Slightly more compact layout.
**Why:** The groups list was missing streak info — users couldn't tell which squads were hot at a glance. The separate "Open" button wasted space and required precise tapping on mobile. The `Group` schema already had `currentStreak`/`longestStreak` fields being returned by the API but not used by the frontend.
**Result:** Streak badges create visual urgency ("don't break the streak!"). Tappable cards improve thumb-friendliness. Longest streak hint adds subtle bragging rights.
**Files:** `client/src/pages/groups.tsx`

## Iteration 4: Date-Grouped Activity Feed
**What:** Grouped feed entries under date headers (Today / Yesterday / weekday + date) with entry counts. Removed redundant date from each entry row (now only shows relative time like "3h ago").
**Why:** The flat list of entries with individual dates was hard to scan. Date grouping creates natural sections and makes "how active was this squad today?" instantly answerable.
**Result:** Much cleaner visual hierarchy. The entry count per date section gives a quick activity density signal. Relative time is easier to parse than full dates.
**Files:** `client/src/pages/group-detail.tsx`

## Iteration 5: Member Contribution Bars
**What:** Sorted member list by total deuce count (top contributors first) with visual progress bars showing relative contribution. Replaced generic secondary info with deuce count.
**Why:** The member list showed names and roles but no sense of who's pulling their weight. Sorting + bars create instant accountability — bottom of the list is the "wall of shame."
**Result:** Visual contribution bars make it immediately clear who's active and who's slacking. The sorting puts top contributors in the hero position.
**Files:** `client/src/pages/group-detail.tsx`

## Iteration 6: New Member Onboarding Prompts
**What:** Added two contextual cards: (1) Welcome card for new members who haven't logged yet in this group, nudging them to make their first deuce. (2) "Fresh squad" prompt for completely empty groups encouraging the first log.
**Why:** New members dropping into a group had no guidance — just seeing other people's data with no clear call to action. Empty groups felt dead with no encouragement to start.
**Result:** Both cards auto-dismiss once the condition is met (user logs / someone logs). Creates a clear first-action pathway without being intrusive.
**Files:** `client/src/pages/group-detail.tsx`

## Iteration 7: Group Description + Quick Stats in Header
**What:** Enhanced group detail header to display the description (when set) and a quick stats line (member count, deuce count, active streak) below the title.
**Why:** The description field existed in the schema but was never shown. Users opening a group had to scroll through cards to piece together basic context. The stats line gives immediate orientation.
**Result:** Above-the-fold context without scrolling. Description adds group identity/personality. Stats line mirrors what you'd see on a profile page.
**Files:** `client/src/pages/group-detail.tsx`
