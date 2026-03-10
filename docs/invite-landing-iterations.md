# Invite Landing Page — Iteration Log

## Starting State (Baseline)
- Basic hero: toilet emoji + "Your squad is holding a seat for you."
- Group preview card: name, member count, streak badge, streak stats, member pills (text), recent activity
- Demo mode: hidden behind toggle link
- Action area: username input + single "Take a Seat" CTA button
- 404 state: minimal
- No social proof, no urgency, no personalization

---

## Iteration 1 — Hero Personalization + Squad Name in Headline
**Hypothesis**: Showing the squad's actual name in the hero creates immediate relevance and personalization, increasing conversion.

**Changes:**
- Squad name appears in hero headline (`[Squad Name] wants you in.`)
- Added app tagline: "The Strava of poop tracking"
- Loading skeleton for hero while data fetches
- Improved subheadline copy with FOMO framing
- 404 state redesigned with better messaging and suggestions

**Result:** Hero now feels personalized — users know immediately *who* invited them, not just that they were invited.

---

## Iteration 2 — Member Avatars (Colorful Letter Avatars)
**Hypothesis**: Visual avatars feel more human and social than text pills, increasing trust and sense of community.

**Changes:**
- Member "The Crew" section uses 36px colored letter avatars
- Avatar color seeded by username (consistent across renders)
- Overlapping avatar stack for groups ≥4 members ("+N more" overflow)
- Each avatar shows first letter of username in bold
- Removed flat text pills

**Result:** Member list now looks like a real social app, not a data table.

---

## Iteration 3 — FOMO Social Proof Stats Bar
**Hypothesis**: Quantified social proof ("47 deuces logged this week") creates urgency and credibility.

**Changes:**
- Added colored stat tiles above group card: Total Deuces, Current Streak, Group Members
- Stats animate in with staggered fade-in on load
- Best streak displays longest streak if different from current
- Stat bar uses warm gold/green accent colors

**Result:** Key stats are now scannable at a glance, reinforcing group activity before reading card.

---

## Iteration 4 — Animated Activity Feed (Auto-Reveal)
**Hypothesis**: Seeing activity entries appear one-by-one creates engagement and curiosity.

**Changes:**
- Recent activity entries stagger-animate in (150ms delay each)
- Each entry has a unique emoji based on entry order
- Activity section labeled "Live Feed" for recency signal
- Empty activity state shows encouraging "Be the first to log!" message

**Result:** Feed feels alive and dynamic, not static data display.

---

## Iteration 5 — Demo Auto-Show + Richer Preview
**Hypothesis**: Showing the demo feed by default (not hidden) lets prospects see the product before committing.

**Changes:**
- DemoFeedCard shown by default above the CTA (no need to click "See demo")
- Demo section titled "What your feed looks like" with subtle label
- Demo toggle becomes a dismiss button
- Demo re-labeled as "Preview" for clarity

**Result:** New visitors immediately see product value without extra click.

---

## Iteration 6 — CTA Split: Sign Up vs Sign In
**Hypothesis**: Distinguishing new users from returning users reduces friction and confusion.

**Changes:**
- Two-path CTA: "I'm New Here" (username input) vs "I Already Have an Account" (toggle)
- Sign-in path: username input with different placeholder
- Tabbed/toggle UX between new user and returning user
- Trust microcopy updated per path
- Loading state more descriptive ("Creating your account…" vs "Joining…")

**Result:** Clearer path for returning users who might get confused by username-only flow.

---

## Iteration 7 — Mobile Polish: Sticky CTA + Animations + Error Redesign
**Hypothesis**: A sticky CTA at the bottom keeps the primary action always visible as users scroll.

**Changes:**
- Sticky bottom bar on mobile with primary CTA button
- Page content has bottom padding to avoid CTA overlap
- Error messages replaced with inline toast-style alerts
- Smooth entrance animation on group preview card (slide up + fade)
- Improved 404 page with suggested actions

**Result:** CTA is always reachable; page feels polished and app-like on mobile.
