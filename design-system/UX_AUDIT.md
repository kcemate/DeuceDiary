# Deuce Diary — Full UX Audit

**Auditor:** Casey, QA Engineer
**Date:** 2026-02-19
**Scope:** Landing, Home, Groups, Group Detail, Profile, Log Deuce Modal, Bottom Navigation
**Severity Scale:** P0 (ship-blocker) / P1 (high impact) / P2 (medium) / P3 (polish)

---

## 1. FRICTION POINTS

### Landing Page (`landing.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| L1 | **No password, no explanation** | P1 | The login form is a single username field. A new user has no idea if this is creating an account or logging in. There's no "Sign up" vs "Log in" distinction, no password field, no OAuth buttons. Users will hesitate — "Am I making an account? Will someone steal my name?" |
| L2 | **Value prop is buried below the fold on short phones** | P1 | The three feature cards push the login form down. On a 5.4" iPhone SE screen, the user must scroll to find the input. The CTA should be visible immediately. |
| L3 | **No social proof or screenshot** | P2 | No indication that anyone else uses this app. No user count, no preview of the feed. Users are being asked to "Enter the Throne Room" with zero evidence of what's inside. |
| L4 | **Username placeholder is vague** | P2 | "What do your dudes call you?" is fun but doesn't communicate requirements. Is there a character limit? Can I use spaces? Emojis? The input has zero validation feedback until submit. |
| L5 | **Error handling is toast-only** | P3 | Network errors appear but disappear. No persistent inline validation. If "username taken" appears and the user blinks, they missed it. |

### Home Page (`home.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| H1 | **"Log a Deuce" opens a modal with a required group field, but new users have no groups** | P0 | This is the #1 drop-off point. A new user taps the primary CTA, gets a modal, tries to submit, and gets an error toast: "Please select at least one group." The modal shows "No groups available. Join a group first!" in tiny gray text. The user has to dismiss the modal, navigate to Groups, create a group, then come back and try again. **Critical funnel break.** |
| H2 | **"Total Deuces" stat is 0 with no context** | P2 | A big bold "0" with a cryptic SVG icon. There's no sparkline, no "first deuce unlocks your streak" messaging, no gamification hook. It's just a depressing zero. |
| H3 | **"Peak Throne Days" is meaningless for new users** | P2 | Shows an empty state with "The throne is quiet" — which is fine copy — but no explanation of what "Peak Throne Days" even means. A new user doesn't know this will show their highest-activity day. |
| H4 | **Groups list on Home duplicates the Groups tab** | P3 | The Home page shows "Your Groups" as a list of cards, and the Groups tab shows the same data in a slightly different card layout. Users see the same info twice with different presentations. Confusing. |
| H5 | **No feed / timeline of recent activity** | P1 | Home is a dashboard, not a feed. There's no social content visible. The user sees stats + group links. For a social app, this is backwards — the feed should be front and center. |

### Groups Page (`groups.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| G1 | **"Create Group" button is small and in the header** | P2 | The primary action is a standard-sized button in the top-right corner. On the empty state, there's a second "Create Group" button inside the card, which is better — but when groups exist, the only CTA is the small header button. |
| G2 | **No way to join an existing group from this screen** | P1 | There's a "Create Group" button but no "Join Group" or group discovery. Joining requires a direct invite link (processed via URL param). A user who heard about Deuce Diary from a friend has no idea how to find their friend's group. |
| G3 | **Group cards are not tappable — only the "View Details" button is** | P1 | The entire card looks clickable (it has visual affordance from the card styling), but only the small "View Details" button navigates. This violates Fitts's Law — the tap target should be the entire card. Compare this to Home, where group cards ARE fully clickable links. Inconsistency. |
| G4 | **Avatar stack uses external API (dicebear)** | P3 | Member avatars load from `api.dicebear.com`, adding external dependency and potential latency. If the CDN is slow, avatars pop in late. |
| G5 | **"Radio silence from the throne room" for no activity** | P3 | Cute copy but doesn't tell the user what to do about it. Should suggest "Be the first to log a deuce!" |

### Group Detail Page (`group-detail.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| D1 | **"Leave Group" is a red destructive button in the header — same visual weight as navigation** | P1 | The "Leave Group" button is RIGHT NEXT to the group name in the header. It's red, it's prominent, and it has no confirmation dialog. One accidental tap and you've left the group. Destructive actions need a confirmation step. |
| D2 | **No "Log a Deuce" CTA on this screen** | P1 | You're looking at a group's feed. You want to post. But the "Log a Deuce" button is only on the Home screen. You have to navigate away, open the modal, select this group from a checkbox list, then submit. That's 4+ taps for the most common action in context. |
| D3 | **Members section takes priority over the feed** | P2 | The member list appears ABOVE the entries feed. On a phone, you scroll past 3-10 member rows before seeing any content. The feed should be primary; members should be collapsible or in a separate tab. |
| D4 | **Entry avatars are 24x24px (w-6 h-6)** | P2 | Avatars in the feed entries are tiny — 24px. They're hard to identify and feel cramped. Should be at least 32px. |
| D5 | **No pagination or infinite scroll for entries** | P2 | If a group has 100+ entries, they all render at once. No lazy loading, no "load more" button. |
| D6 | **"Add a Dude" invite button gives no feedback about how invites work** | P3 | Opens an InviteModal, but from the button text alone, a user might expect to search for users, not generate a link. |

### Profile Page (`profile.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| P1 | **"Streak" stat is just total deuce count, not an actual streak** | P1 | `const streak = user?.deuceCount || 0` — The streak card shows total deuces with a fire emoji, but it's NOT a consecutive-day streak. This is misleading. If I've logged 47 deuces over 6 months, it says "47" with a flame, implying I have a 47-day streak. |
| P2 | **Edit username button is 24x24px (h-6 w-6 p-0)** | P2 | The pencil icon button to edit username is microscopic. At 24x24, it's well below the 44x44pt minimum touch target. Users will struggle to tap it. |
| P3 | **"Throne Alerts" toggle does nothing** | P2 | `pushNotifications` is local state initialized to `true`. Toggling it doesn't persist anywhere — no API call, no localStorage. It's a non-functional toggle that gives the illusion of a feature. |
| P4 | **"Recent Activity" section shows group membership, not actual activity** | P2 | The section is titled "Recent Activity" but shows static "Member of [group]" entries. There's no timestamp, no "logged a deuce 2h ago" — just a green dot and a membership label. This is misleading. |
| P5 | **Logout says "Leave the Throne Room" — destructive action with no confirmation** | P3 | Navigates directly to `/api/logout`. No "Are you sure?" dialog. |
| P6 | **"Throne Philosopher" is hardcoded** | P3 | Every user is "Throne Philosopher" regardless of their activity level. This should be a dynamic rank/title based on deuce count. |

### Log Deuce Modal (`log-deuce-modal.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| M1 | **4 required fields for a single log entry** | P1 | Date, Time, Location, Thoughts, AND at least one Group checkbox. That's 5 interactions minimum. For an app about quick, fun logging, this is way too much friction. BeReal captures a photo in 2 taps. |
| M2 | **Date/time inputs use native HTML pickers** | P2 | `<input type="date">` and `<input type="time">` — these are functional but ugly on mobile. They don't match the app's design language and feel like a desktop afterthought. |
| M3 | **Location dropdown requires pre-selection or creation** | P2 | There's no "auto-detect location" option. Users have to manually pick from a dropdown or create a new one. Adding a custom location is a 3-step sub-flow within the modal. |
| M4 | **Group selection is checkboxes at the bottom** | P2 | The group selection is the LAST field in the form, but it's the most critical (without it, submission fails). By the time the user has filled in everything else and hits submit, they discover they forgot to check a group. Should be first or auto-selected. |
| M5 | **Character counter shows "0/1000" — implies a lot is expected** | P3 | 1000 chars is generous, but showing "0/1000" upfront suggests users need to write a lot. Most "thoughts" will be 10-50 chars. Consider hiding the counter until 800+ chars. |
| M6 | **No "quick log" option** | P1 | Every deuce requires thoughts. Sometimes you just want to tap and log. There should be a one-tap quick log that only requires a group (or defaults to all groups). |

### Bottom Navigation (`bottom-navigation.tsx`)

| # | Friction Point | Severity | Detail |
|---|---------------|----------|--------|
| N1 | **Only 3 tabs — no quick-log shortcut** | P1 | Home, Groups, Profile. The primary action of the entire app (logging a deuce) requires navigating to Home first, then tapping the button. Most social/logging apps put the primary action in the center of the nav bar (Instagram's + button, Strava's record button). |
| N2 | **No notification badges** | P2 | No indication of unread activity in groups. If someone logs a deuce in your group, you won't know unless you navigate to that group. |
| N3 | **Touch targets are borderline** | P2 | Nav items are `py-3 px-3` with `w-6 h-6` icons and `text-xs` labels. The total tap area is roughly 40x48px — close to the 44x44 minimum but tight. The horizontal padding is only 12px. |

---

## 2. EMPTY STATE ANALYSIS

| Screen | Empty State Copy | Explains Feature? | Clear Next Action? | Brand Voice? | Rating |
|--------|-----------------|-------------------|-------------------|--------------|--------|
| **Home — Peak Throne Days** | "The throne is quiet. Log your first deuce to get the party started" | Partially (doesn't explain what Peak Throne Days IS) | Yes (but no CTA button — just text) | Yes, playful | **C+** |
| **Home — Groups List** | "No squads yet — start a poop posse! Gather your dudes. Your throne wisdom deserves an audience." + "Create Group" button | Yes | Yes (has button) | Yes, strong voice | **B+** |
| **Groups — No Groups** | "No squads yet. Create a group and invite your dudes" + "Create Group" button | Minimal (doesn't explain what groups DO) | Yes (has button) | Moderate | **B-** |
| **Group Detail — No Entries** | "No entries yet. Be the first to share your throne thoughts!" | Yes | Partially (no CTA button to log a deuce) | Yes | **C+** |
| **Profile — Recent Activity** | "Your legacy begins here." | No (what legacy? what goes here?) | No (no button, no explanation) | Vague | **D** |
| **Log Modal — No Groups** | "No groups available. Join a group first!" | No (doesn't explain what joining means or how to do it) | No (no button to create/join) | Flat, unhelpful | **F** |

**Overall Empty State Grade: C**

The biggest failures are the Log Modal empty state (dead end with no escape hatch) and the Profile activity section (completely opaque). Empty states should always answer three questions: (1) What is this? (2) Why should I care? (3) What do I do next?

---

## 3. INFORMATION HIERARCHY

### Landing Page
- **Good:** App name and tagline are prominent. Login form is the clear terminal action.
- **Broken:** The three feature cards have EQUAL visual weight. None stands out. They also compete with the login form for attention. The features should be secondary to the CTA.

### Home Page
- **Good:** "Log a Deuce" button is full-width and visually dominant. Correct — it's the primary action.
- **Broken:** The "Total Deuces" stat card has MORE visual weight than the groups list (gradient background, larger text). But the groups list is what drives engagement. Stats are vanity; the feed/groups should be primary.
- **Broken:** "Peak Throne Days" is a full card for a single data point. It takes up significant screen real estate for information that's useful maybe once a week.

### Groups Page
- **Good:** Group cards surface key metrics (members, entries, activity).
- **Broken:** The "Active"/"Quiet" badge has high visual prominence (colored badge) but low information value. Activity time ("3h ago") is more useful but is in muted, small text.

### Group Detail Page
- **Broken:** Header crams Back button + group name + Leave Group into one row. On narrow screens, the group name will truncate.
- **Broken:** Members section (secondary info) appears above entries (primary content). A user visits a group to see the feed, not the member list.
- **Good:** Entry cards have a clear hierarchy: user > thoughts > location > reactions.

### Profile Page
- **Good:** Profile picture and name are prominent at top. Standard pattern.
- **Broken:** The 2x2 stat grid gives EQUAL weight to 4 items, but "Total Deuces" and "Streak" (which are the same number!) are the most important. The "Best Day" stat is niche. The "Groups" count is navigation-worthy, not stat-worthy.

---

## 4. MOBILE USABILITY

### Touch Target Violations (< 44x44pt)

| Element | Actual Size | Location | Severity |
|---------|------------|----------|----------|
| Edit username pencil icon | 24x24px (`h-6 w-6 p-0`) | Profile page | P1 |
| Bottom nav items | ~40x48px | All screens | P2 |
| Entry avatar in feed | 24x24px (`w-6 h-6`) | Group Detail | P2 |
| "View Details" button on group card | `size="sm"` (~32px height) | Groups page | P2 |
| Checkbox items in Log Modal | Standard checkbox (~20x20) | Log Deuce Modal | P2 |
| Badge ("Active"/"Quiet") | ~24px height | Groups, Home | P3 (not interactive, so OK) |

### Thumb Zone Analysis (6-inch phone, one-handed use)

```
┌──────────────────┐
│   STRETCH ZONE   │  ← Group name, Back button, Leave Group button
│                  │     (Header actions are in the hardest-to-reach zone)
│                  │
│  NATURAL ZONE    │  ← Feed content, group cards, stats
│                  │     (Good — scrollable content is here)
│                  │
│                  │
│   EASY ZONE      │  ← Bottom navigation
│                  │     (Good — nav is in the easy zone)
│──────────────────│
│ [Home][Grps][Me] │  ← But no primary action button here!
└──────────────────┘
```

**Key Finding:** The "Log a Deuce" button on Home is at the TOP of the page — it scrolls away as you browse groups. On every other screen, there is NO log button at all. The primary action of the app is either in the stretch zone or entirely absent.

**Recommendation:** Add a floating action button (FAB) or center the "Log" action in the bottom nav bar for thumb-zone accessibility on all screens.

### Scroll Depth Issues

| Screen | Critical Action | Position | Problem |
|--------|----------------|----------|---------|
| Home | "Log a Deuce" | Top of page | Scrolls out of view when browsing groups |
| Group Detail | Feed entries | Below member list | Must scroll past all members to reach feed |
| Landing | Login form | Below 3 feature cards | On small phones, may require scrolling |
| Log Modal | Group checkboxes + Submit | Bottom of modal | On small screens, must scroll to reach the required group selection |

---

## 5. ONBOARDING FLOW

### Full New User Journey Map

```
[1. DISCOVER]        [2. LANDING]           [3. LOGIN]
Hears about app  →  Opens app  →  Sees landing page
                                   │
                                   ├─ Reads 3 feature cards (optional)
                                   ├─ Types username
                                   └─ Taps "Enter the Throne Room"
                                        │
                                   [4. HOME - FIRST VIEW]
                                        │
                          ┌─────────────────────────────┐
                          │  "Log a Deuce" (big button)  │
                          │  Total Deuces: 0             │
                          │  Peak Throne Days: empty     │
                          │  Your Groups: empty state     │
                          │  → "Create Group" link        │
                          └─────────────────────────────┘
                                        │
                            User taps "Log a Deuce"
                                        │
                          ┌─────────────────────────────┐
                          │  LOG MODAL opens              │
                          │  Groups section: "No groups   │
                          │  available. Join a group      │
                          │  first!"                      │  ← DROP-OFF POINT #1
                          │  [Submit disabled effectively]│
                          └─────────────────────────────┘
                                        │
                            User dismisses modal, confused
                            Navigates to Groups tab
                                        │
                          ┌─────────────────────────────┐
                          │  GROUPS - EMPTY STATE         │
                          │  "No squads yet."             │
                          │  [Create Group]               │
                          └─────────────────────────────┘
                                        │
                            Taps "Create Group"
                                        │
                          ┌─────────────────────────────┐
                          │  CREATE GROUP MODAL           │
                          │  Name: ___________            │
                          │  Description: ___________     │  ← DROP-OFF POINT #2
                          │  [Create]                     │  (Why create a group alone?
                          └─────────────────────────────┘   No one to share with yet)
                                        │
                            Creates group, sees group detail
                            Group has 0 entries
                                        │
                            Goes back to Home
                            Taps "Log a Deuce" again
                                        │
                          ┌─────────────────────────────┐
                          │  LOG MODAL                    │
                          │  Fills: Date, Time, Location, │
                          │  Thoughts, checks group       │  ← DROP-OFF POINT #3
                          │  [Log Deuce]                  │  (5 fields for a quick log?!)
                          └─────────────────────────────┘
                                        │
                          FIRST DEUCE LOGGED (finally)
                          Total steps from landing: 10+
                          Total taps from landing: 15+
```

### Drop-off Points

| # | Point | Severity | Why Users Leave |
|---|-------|----------|----------------|
| 1 | **Log Modal with no groups** | P0 | User attempted the primary action and was blocked with no clear path forward. The modal says "Join a group first!" but there's no button to do so. Classic dead end. |
| 2 | **Creating an empty group alone** | P1 | Creating a group with yourself as the only member feels pointless. There's no prompt to invite friends during creation. The social loop is broken. |
| 3 | **5-field log form** | P1 | After all that effort to get here, the user faces a form with 5 required interactions. This should be 1-2 taps maximum for the first log. |
| 4 | **No celebration after first deuce** | P2 | After logging the first deuce, the user gets a standard toast message. No confetti, no achievement badge, no "Welcome to the club!" moment. The dopamine hit is missing. |
| 5 | **No prompt to invite friends** | P1 | After creating a group, there's no nudge to share the invite link. The user has to discover the "Add a Dude" button themselves. |

### Time to Value: **~3 minutes, 15+ taps**
**Industry benchmark: < 60 seconds, < 5 taps**

---

## 6. COMPETITIVE UX GAPS

### vs. BeReal

| BeReal Pattern | Deuce Diary Equivalent | Gap |
|---------------|----------------------|-----|
| **2-tap capture** — notification → open → snap | 15+ taps from landing to first log | Massive friction gap. Need a 1-tap quick log. |
| **Time-limited window** creates urgency | No urgency mechanics | Add "live on the throne" real-time notification when a friend is currently logging |
| **Full-screen content** — the photo IS the feed | Stats-heavy dashboard, feed is buried in group detail | Home should be a social feed, not a stats dashboard |
| **Reactions on the content** — quick emoji responses | Reactions exist but are buried | Good — reactions are implemented. Make them more prominent. |
| **Discovery feed** — see everyone's posts | No discovery; must be in a group to see anything | Add a "recent from your groups" merged feed on Home |

### vs. Strava

| Strava Pattern | Deuce Diary Equivalent | Gap |
|---------------|----------------------|-----|
| **Central record button** — big orange button in nav bar | "Log a Deuce" is a page-level button on Home only | Put the log button in the center of the bottom nav bar |
| **Activity feed is the home screen** | Home is a stats dashboard | The feed should be Home |
| **Kudos (1-tap reaction)** | Multi-step reactions | Need a single-tap "kudos" equivalent |
| **Segments & leaderboards** | No leaderboards | Add group leaderboard (most deuces this week) |
| **Year in review / wrapped** | No historical view | Add weekly/monthly recap ("You logged 12 deuces this week, up 3 from last week") |
| **Streak tracking** | Fake streak (just total count) | Implement actual consecutive-day streak tracking |
| **GPS auto-detection** | Manual location dropdown | Add GPS-based location auto-detect |

### vs. Duolingo

| Duolingo Pattern | Deuce Diary Equivalent | Gap |
|-----------------|----------------------|-----|
| **Streak with fire animation** | Static number with emoji | Animate the streak counter. Add streak-freeze mechanics. |
| **XP and levels** | "Throne Philosopher" (hardcoded) | Dynamic ranks based on deuce count (Novice → Regular → King of the Throne → etc.) |
| **Daily reminder notifications** | Non-functional toggle | Implement actual push notifications ("Haven't logged today — your streak is at risk!") |
| **Leaderboard (weekly)** | None | Group weekly leaderboard |
| **Achievement badges** | None | Add milestone badges (First Deuce, 7-Day Streak, 100 Club, etc.) |
| **Friend quest / social challenges** | None | "Group challenge: Everyone logs today!" |
| **Smooth onboarding flow** — guided, no dead ends | Multiple dead ends, 15+ taps | Guided first-run experience with auto-group creation |
| **Celebration animations** — confetti, sounds | Plain toast messages | Add confetti/animation on milestones |

### Summary of Missing Patterns

1. **No central action button in nav** (Strava, Instagram)
2. **No social feed on home** (BeReal, Strava, Instagram)
3. **No streak mechanics** (Duolingo, Snapchat)
4. **No gamification/levels** (Duolingo)
5. **No leaderboards** (Strava, Duolingo)
6. **No achievement system** (every major app)
7. **No guided onboarding** (Duolingo)
8. **No celebration moments** (Duolingo, Strava)
9. **No quick-capture flow** (BeReal)
10. **No notification badges** (every major app)

---

## 7. PRIORITY FIXES

### Ranked Top 10 — Highest to Lowest Impact

---

**#1. Add a FAB or center "Log" button in the bottom nav bar** (P0)
- **Screen:** Bottom Navigation (all screens)
- **Problem:** The primary action (logging a deuce) is only accessible from the Home page, and it scrolls out of view. On Groups, Group Detail, and Profile screens, there is NO way to log without navigating away.
- **Fix:** Add a prominent center button in the bottom nav (like Instagram/Strava's "+" button). It should be elevated, branded, and always accessible. Change the nav from 3 items to: `[Home] [Groups] [+LOG] [Activity] [Profile]` or keep 3 tabs with a floating center button.
- **Impact:** Reduces every log action to 1 tap from any screen. Eliminates the biggest engagement barrier.

---

**#2. Fix the "no groups" dead end in the Log Deuce modal** (P0)
- **Screen:** Log Deuce Modal
- **Problem:** New users tap "Log a Deuce," see "No groups available. Join a group first!" with no button or link. Complete dead end.
- **Fix:** Two options:
  - (A) Auto-create a personal "My Deuces" group on signup so users always have a group.
  - (B) Add a "Create your first group" button inline in the modal that opens the Create Group flow, then returns to the log modal.
- **Impact:** Eliminates the #1 new-user drop-off point.

---

**#3. Implement quick-log (1-tap deuce)** (P1)
- **Screen:** Log Deuce flow
- **Problem:** Logging a deuce requires filling 5 fields (date, time, location, thoughts, group). This is excessive for a "fun quick logging app."
- **Fix:** Default everything: current date/time (auto), last-used location (auto), thoughts (optional), all groups (auto-selected). One tap on the FAB should log with defaults. Show a "Customize" expand option for users who want to add details.
- **Impact:** Reduces core action from 15 taps to 1 tap. Dramatically increases daily engagement.

---

**#4. Make Home a social feed, not a stats dashboard** (P1)
- **Screen:** Home page
- **Problem:** Home shows personal stats and group links. There is no social content. To see what friends posted, you must navigate to Groups → specific group → scroll past members.
- **Fix:** Replace the Home screen with a merged chronological feed of recent entries from all the user's groups. Keep the "Log" button prominent. Move stats to Profile. Show entries with user avatar, thoughts, location, time, and reactions — like a social timeline.
- **Impact:** Users see engaging content immediately. Social loops drive retention.

---

**#5. Add guided first-run experience** (P1)
- **Screen:** Post-login (new users)
- **Problem:** New users land on a blank Home with zeros everywhere. They must discover the flow themselves: create group → log deuce → invite friends.
- **Fix:** On first login, show a 3-step guided flow:
  1. "Create your first group" (auto-create with fun name suggestion)
  2. "Log your first deuce" (simplified 1-tap form)
  3. "Invite your dudes" (share invite link)
  Add a progress indicator. Celebrate completion with animation.
- **Impact:** Reduces time-to-value from 3+ minutes to under 60 seconds. Dramatically reduces new-user churn.

---

**#6. Fix the fake streak — implement real consecutive-day tracking** (P1)
- **Screen:** Profile page
- **Problem:** The "Streak" stat shows total deuce count, not consecutive days. It's misleading and a missed gamification opportunity.
- **Fix:** Track actual consecutive days with at least one deuce logged. Show the streak with animation (fire grows with longer streaks). Add streak-freeze for 1 missed day. Send push notification at end of day: "Your 12-day streak is at risk!"
- **Impact:** Streaks are the single most effective retention mechanic in consumer apps (Duolingo, Snapchat). This is free retention.

---

**#7. Add confirmation dialog for destructive actions** (P1)
- **Screen:** Group Detail (Leave Group), Profile (Logout)
- **Problem:** "Leave Group" is a red button with no confirmation. One tap and you're out. "Leave the Throne Room" (logout) also has no confirmation.
- **Fix:** Add a confirmation dialog: "Are you sure you want to leave [Group Name]? You'll need a new invite to rejoin." Same for logout.
- **Impact:** Prevents accidental data loss and improves user trust.

---

**#8. Move feed above members in Group Detail** (P2)
- **Screen:** Group Detail page
- **Problem:** The member list takes up the top half of the screen. Users must scroll past every member to see the content feed. On a group with 10 members, that's 400+ px of scrolling before content.
- **Fix:** Reorder to: Header → Feed → Members (collapsible). Or add a tab bar: "Feed | Members | Leaderboard". Put a "Log a Deuce" button contextually at the top of the feed section.
- **Impact:** Users see engaging content immediately. Reduces scroll-to-content by 50-80%.

---

**#9. Make group cards fully tappable on the Groups page** (P2)
- **Screen:** Groups page
- **Problem:** Group cards on the Groups page only navigate via a small "View Details" button. On the Home page, entire group cards are clickable links. This inconsistency confuses users and reduces the effective tap target.
- **Fix:** Wrap each group card in a `<Link>` like the Home page does. Remove the "View Details" button or make it a secondary action.
- **Impact:** 4x larger tap target. Consistent behavior across screens. Fewer mis-taps.

---

**#10. Increase touch target sizes across the app** (P2)
- **Screen:** Multiple
- **Problem:** Several interactive elements are below the 44x44pt minimum:
  - Edit username pencil: 24x24px
  - Bottom nav items: ~40x48px
  - Feed entry avatars: 24x24px (if tappable)
  - Group checkboxes in Log Modal: ~20x20px
- **Fix:**
  - Edit pencil: increase to `h-10 w-10 p-2`
  - Bottom nav: increase horizontal padding to `px-5`
  - Checkboxes: wrap in larger tappable label rows with min-height 44px
- **Impact:** Improves accessibility and reduces frustration for all users, especially on phones.

---

## Appendix: Quick Wins (< 1 hour each)

| Fix | Screen | Effort |
|-----|--------|--------|
| Add confirmation to "Leave Group" | Group Detail | 15 min |
| Make group cards fully tappable on Groups page | Groups | 10 min |
| Increase edit-username button size | Profile | 5 min |
| Hide character counter until 800+ chars | Log Modal | 10 min |
| Auto-select all groups in Log Modal by default | Log Modal | 10 min |
| Add "Create Group" button to Log Modal empty state | Log Modal | 15 min |
| Fix streak to show actual count vs. total deuces | Profile | 30 min (needs backend) |
| Add "Log a Deuce" button in Group Detail feed | Group Detail | 15 min |
| Remove redundant groups list from Home | Home | 10 min |

---

*This audit feeds directly into tonight's redesign. Every finding is actionable. Let's ship something better.*
