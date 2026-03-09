# Settings Page Autoresearch — Iteration Log

## Starting State
The settings page was a **theme-only picker** — 4 theme circles and nothing else. Most "settings" lived scattered on the profile page (notifications toggle, theme link, referral link, logout). No data controls, no privacy transparency, no account management.

---

## Iteration 1: Full Settings Hub
**Commit:** `d8fd2a06` — settings: transform into full settings hub with organized sections

**What:** Replaced theme-only page with organized settings hub featuring:
- **Account** section: premium status, referral links
- **Preferences** section: notifications toggle, inline theme picker
- **About** section: privacy policy, terms, version info
- Logout button with icon
- Reusable `SettingsSection` and `SettingsRow` components
- Footer branding

**Why:** A settings page with only themes feels incomplete and untrustworthy. Users expect account controls, preferences, and legal links in settings.

**Result:** Settings now feels like a proper app settings page. Foundation for all subsequent iterations.

---

## Iteration 2: Account Deletion (Danger Zone)
**Commit:** `9e8057e2` — settings: add account deletion with confirmation dialog

**What:**
- Added `DELETE /api/user/account` endpoint using existing `softDeleteUser`
- Red-bordered Danger Zone section
- Two-step confirmation: must type "DELETE" to enable button
- Loading state during deletion, redirects to home on success
- GDPR-compliant: removes memberships, anonymizes data, soft-deletes

**Why:** Users need control over their data. Account deletion is table stakes for trust, especially for a health-adjacent app. The existing `softDeleteUser` was already robust — just needed an API endpoint.

**Result:** Clean, safe deletion flow. The type-to-confirm pattern prevents accidents.

---

## Iteration 3: Data Export
**Commit:** `dfc4ef59` — settings: add data export for GDPR data portability

**What:**
- Added `GET /api/user/export` endpoint returning account, groups, badges as JSON
- "Your Data" section with export button
- Client-side download as `deuce-diary-export.json`
- Loading state with toast feedback

**Why:** GDPR right to data portability. Users should be able to take their data with them. Builds trust.

**Result:** One-click data export. Clean JSON format with all user data.

---

## Iteration 4: Profile Page Consolidation
**Commit:** `8668964d` — profile: consolidate settings into dedicated settings page

**What:**
- Replaced profile's inline settings section (notifications, theme, referral, logout) with a single "Settings" link card
- Cleaned up unused imports (Switch, Label, Bell, Palette, Gift, useToast)
- All settings now live at `/settings`

**Why:** Settings were duplicated between profile and settings pages. Single source of truth reduces confusion.

**Result:** Profile page is leaner. Settings is the one place for all controls. Removed ~60 lines of duplicate UI.

---

## Iteration 5: Timezone Preference
**Commit:** `d2903dad` — settings: add timezone preference selector

**What:**
- Added `PUT /api/user/timezone` endpoint with IANA timezone validation
- Timezone dropdown in Preferences using `Intl.supportedValuesOf("timeZone")`
- Auto-detects user's current timezone as default
- Persists to database for streak calculations

**Why:** Timezone affects streak calculations — users in different timezones need correct day boundaries. This was stored in the schema but had no way to change it.

**Result:** Users can now set their timezone, fixing potential streak miscalculations.

---

## Iteration 6: Data Transparency
**Commit:** `8de30a54` — settings: add data transparency section with trust signals

**What:**
- "What we store" breakdown showing 4 data categories with icons
- Profile info, deuce logs, progress data, preferences
- Encryption and no-sale trust signal with lock icon

**Why:** For a poop tracking app, users need to trust that their data is handled responsibly. Transparency builds that trust.

**Result:** Users can see exactly what data we collect, directly in settings. No need to read a legal document.

---

## Iteration 7: Polish Pass
**Commit:** `73cd6fb5` — settings: polish pass — update home link, soften logout button

**What:**
- Updated home page quick link from "Themes" to "Settings" with gear emoji
- Changed logout button from destructive red to subtle outline variant
- Maintains visual hierarchy: Danger Zone = red, logout = neutral

**Why:** Logout isn't destructive (user can log back in). The red button was drawing attention to the wrong action.

**Result:** Cleaner visual hierarchy. Danger Zone is clearly the "scary" section.

---

## Final Settings Page Structure

```
Settings
├── Account
│   ├── Go Premium / Throne Room
│   └── Refer Friends
├── Preferences
│   ├── Throne Alerts (toggle)
│   ├── Theme (4 color circles)
│   └── Timezone (dropdown)
├── About
│   ├── Privacy Policy
│   ├── Terms of Service
│   └── Version
├── Your Data
│   ├── What we store (transparency)
│   └── Export Your Data (JSON download)
├── Danger Zone
│   └── Delete Account (type DELETE to confirm)
├── Log Out (outline button)
└── Footer: "Made with 💩 by Deuce Diary"
```

## Summary
**7 iterations** transforming a theme-only picker into a complete, trustworthy settings hub. Added account deletion, data export, timezone preference, privacy transparency, and consolidated all settings from the profile page.
