# Deuce Diary — Launch Strategy
*Researched by Grok 4, Feb 20 2026*

## What Locket / Gas App / BeReal Actually Did

**Locket Widget (Jan 2022):** 100K day-1 downloads, 1M week-1 — zero paid ads. Pre-seeded 50 TikTok micro-influencers (10K-50K followers) who posted "send pics to my widget" content. #LocketApp hit 500M views. THE mechanic: widget created FOMO loops that made non-users feel left out the moment they saw it on a friend's phone.

**Gas App (Aug 2022):** 500K day-1, 2M week-1. Student ambassadors seeded 100+ high schools. Anonymous compliment polls spread via Snapchat. Hit #1 App Store Social. THE mechanic: anonymity + identity validation = mandatory within any school social graph.

**BeReal (2022 spike):** Campus ambassadors at UCLA/NYU. Timed notifications created daily habit. TikTok UGC hit 1B views. THE mechanic: the notification ("Time to BeReal") created a synchronized social moment everyone had to participate in or feel excluded.

**Common thread:** All three launched inside a specific, tight social graph first (school, friend group, campus). Not broadcast. Local network effects, not global.

## The Single Move to Steal
**BeReal's synchronized moment notification.** For Deuce Diary: a random daily notification to ALL members of a group at the same time — "🚽 Time to drop a deuce. Everyone's watching." Even if they're not actually going, the notification creates a shared moment that generates reactions, jokes, and engagement. Forces the social loop.

## Launch Plan

### Pre-Launch (2 weeks before)
- Build waitlist landing page (deucediary.com) with email capture — target 2K signups
- Create 10 TikTok seed videos: "What if your friends knew your bathroom habits? 😂" — no app required to understand the premise
- Recruit 20-30 micro-influencers in humor niche (10K-50K followers) for beta access + shoutout
- Form 10 private beta squads via Discord/Reddit — seed the social graph before launch
- Prep App Store page with polished screenshots (see app-store-listing.md)

### Launch Day (hour by hour)
- **00:00** — App goes live. Email blast to waitlist with invite links.
- **06:00** — Influencer first posts go live. Monitor App Store ranking.
- **09:00** — Activate invite loops: in-app notification "Invite 3 friends for a 🥇 badge"
- **12:00** — Peak hour push: "Log your first deuce now!" to all new downloads
- **15:00** — TikTok challenge: "Share your squad's deuce reaction emoji" #DeuceDiary
- **18:00** — Retention notifications. Analyze day-1 metrics. Target: 5K downloads day 1.

### Week 1 Retention
- Daily push at random time: "🚽 Time to drop a deuce. Your squad is watching."
- Streak activation: any group that hits Day 3 gets a push "3-day streak! Don't blow it."
- Weekly Throne Report card auto-generates Sunday — prompt users to screenshot and share

### Top 3 Communities to Seed
1. **r/poop + r/TrueOffMyChest** (~2M combined) — organic posts about the concept, no ads
2. **TikTok: #BathroomHumor + #GroupChat** — target @BarstoolSports, @CollegeHumor adjacent accounts
3. **Discord humor servers** — find servers with 1K-10K members, offer invite codes to mods

## Paywall Design (Porcelain Premium)

**Timing:** Trigger after 3rd logged deuce OR first friend-group invite.

**Layout:** Full-screen modal
- Hero: Gold toilet badge emoji 🚽✨
- Headline: "Unlock Porcelain Premium"
- Feature comparison: Free vs Premium (gate: unlimited squads, streak insurance, gold badge, themes, extended stats)
- Price: **$3.99/mo** (default) | **$29.99/yr — Save 37%** (highlighted with badge)
- CTA: "Start 7-Day Free Trial" (green, full-width pill)
- Sub-text: "Cancel anytime. No judgment."

**Why this converts:** Free trial removes friction. Annual anchored below monthly equivalent to drive commitment. Badge visible to all squad members = social proof of status = FOMO for non-premium users.

## Hosting: Zero-Friction Alternative to Railway CLI

**Recommended: Render** — Deploy from public GitHub URL OR via API without browser login.

Steps (no interactive auth needed):
1. Push code to GitHub (one-time, need PAT)
2. Go to render.com → New Web Service → paste GitHub repo URL
3. Add env vars via Render dashboard
4. Render auto-detects Node.js, provisions Postgres add-on, deploys

**Alternative without GitHub:** Render supports ZIP file deploys via their API:
```bash
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -d '{"name": "deuce-diary", ...}'
```

**Railway alternative (no browser):** Set `RAILWAY_TOKEN` env var → `railway login --token $TOKEN`. Token generated once in Railway dashboard, then all CLI ops work headlessly.

Bottom line: Render is the easiest zero-friction path if we get a GitHub PAT. Railway token-based auth is the fix if we stay with Railway.
