# Deuce Diary — iOS App Store Launch Playbook

**Last updated:** 2026-03-08
**Owner:** Alex (Planning & Docs)
**Launch target:** iOS App Store (TestFlight → full release)
**Status:** Pre-launch / iOS build in progress

---

## Current State of Play

**What's live:** Full-featured web app at https://deuce-dairy-web-production.up.railway.app
Features: Deuce logging, group streaks, squads, leaderboards, reactions, analytics, weekly Throne Reports, daily challenges, referral system, real-time feed, ghost mode, Bristol score, photo logging, 4 themes, Porcelain Premium via RevenueCat, Clerk auth, Sentry error tracking

**What's needed for iOS:**
- [ ] Expo/React Native iOS build via EAS Build
- [ ] Apple Developer account enrollment ($99/yr — Kyle)
- [ ] TestFlight distribution set up
- [ ] RevenueCat iOS IAP products configured (monthly $2.99, annual $19.99, lifetime $49.99)
- [ ] App Store screenshots + preview video
- [ ] App Store Connect listing complete

**The competitive window:** Poop Map has 62K App Store reviews but zero social mechanics — no streaks, no squads, no accountability layer. We are the first social gut health tracker. This gap closes the moment a well-funded competitor notices us. Ship fast.

---

## SECTION 1: PRE-LAUNCH — 7 Days Before

### Day L-7: Beta Testing via TestFlight

**Goal:** Get 50+ real users on TestFlight, identify P0/P1 bugs before App Store submission.

#### TestFlight Setup Checklist

| # | Task | Owner | Notes |
|---|------|-------|-------|
| 1 | EAS Build → .ipa file via `eas build --platform ios` | Dev | Requires Apple Developer account enrolled |
| 2 | Upload build to App Store Connect | Dev | TestFlight section → select build |
| 3 | Add internal testers (team: Giovanni, Kyle, Jordan) | Giovanni | Up to 100 internal testers, no review required |
| 4 | Add external testers — invite 50 beta users | Giovanni | Requires brief Apple TestFlight review (24-48h) |
| 5 | Set beta build expiry → 90 days | Dev | Default is 90 days from upload |
| 6 | Configure beta feedback email in TestFlight | Giovanni | Use hello@deucediary.app |
| 7 | Write TestFlight "What to Test" notes (below) | Giovanni | Shown to testers in TestFlight app |

**TestFlight "What to Test" Notes (copy/paste this):**
```
Thanks for beta testing Deuce Diary! 💩

CRITICAL FLOWS TO TEST:
1. Sign up with Clerk → complete onboarding → log your first deuce
2. Create a squad → share invite link → have someone join
3. Log daily for 3 days → verify streak counter advances for all members
4. Upgrade to Porcelain Premium → verify all premium features unlock
5. Use streak insurance (premium) → verify streak preserved

KNOWN ISSUES:
- [update before sending]

REPORT BUGS: Shake device → "Report a Problem" in TestFlight OR email bugs@deucediary.app

WHAT WE'RE MEASURING:
- Onboarding completion rate (drop-off points)
- First deuce logged within 10 minutes of signup
- Squad creation rate within 24h of signup
- Any crashes (check your crash logs in TestFlight)
```

#### Who to Invite as Beta Testers

**Priority 1 — Friend groups (best for streak testing):**
- Text 5 existing friend groups you know well: "Hey, I need a favor — try this app for a week with your group"
- Target groups of 3-5 people who talk daily (existing WhatsApp/Slack groups)
- One group coordinator per squad who will remind others to log

**Priority 2 — IndieHacker/maker communities:**
- Post in r/SideProject: "I'm building a social poop tracker for iOS and need 20 TestFlight testers. Honest feedback only, no handholding."
- Post in Indie Hackers forum with TestFlight link
- Tweet: "Building @DeuceDiaryApp and need iOS beta testers. Interested? Drop your email or DM me. TestFlight spots available."

**Priority 3 — Health communities:**
- Post in r/QuantifiedSelf: "Looking for beta testers for a social gut health tracker — TestFlight only for now"
- Post in r/HabitTracking

**Beta tester goal by Day L-4:** 50 active testers, at least 10 squads formed, at least 5 squads with 3+ day streaks.

#### Beta Bug Triage During L-7 to L-1

| Severity | Definition | SLA |
|----------|-----------|-----|
| **P0 — Blocker** | App crashes, can't log a deuce, auth broken, IAP fails | Fix before App Store submission |
| **P1 — Major** | Streak not updating correctly, squad invite broken, wrong data shown | Fix before App Store submission |
| **P2 — Minor** | UI glitch, wrong copy, minor layout issue | Fix in first patch post-launch |
| **P3 — Enhancement** | Nice-to-have, feature request | Backlog |

---

### Day L-6: App Store Listing Optimization

#### App Name (30 chars max)
```
Deuce Diary: Poop Tracker
```
*Rationale: Includes primary keyword "Poop Tracker" for ASO. "Deuce Diary" is the brand. Tested: this construction beats "Deuce Diary — Poop Tracker" due to colon search indexing.*

#### Subtitle (30 chars max)
```
Squad Streaks & Gut Health
```

#### Keywords (100 chars max — no spaces between keywords, comma-separated)
```
poop tracker,gut health,bowel log,streak,squad,bathroom diary,poop log,habit tracker,bristol stool
```
*Note: Do NOT include "Deuce Diary" in keywords — the app name is already indexed. Never repeat words across name/subtitle/keywords.*

#### Primary Category
Health & Fitness

#### Secondary Category
Social Networking

#### Age Rating
4+ (Infrequent/Mild Mature/Suggestive Themes — bathroom humor theming only)

#### App Store Description (4,000 chars max)

```
Track your daily deuces, build streaks with your squad, and finally take your gut health seriously — without taking yourself too seriously.

SQUAD STREAKS — THE CORE MECHANIC
Join a squad with friends. Everyone logs at least one deuce per day. If anyone misses a day, the streak resets for EVERYONE. It's Snapchat Streaks for your gut, and it is unhinged in the best way.

Your squad's 34-day streak is on the line. You will not forget to log.

LOG IN 5 SECONDS
One tap. Done. Optionally add your thoughts (max 500 characters), Bristol score for health tracking, or keep it quick. Logging a deuce has never been this fast or this consequential.

LEADERBOARDS
See who's #1 in your squad by total deuce count. Weekly rankings. Monthly rankings. Yes, it's exactly as ridiculous as it sounds. Yes, your friends will lose their minds.

WEEKLY THRONE REPORTS
Every Sunday, get your stats: your peak day, your squad's collective count, your longest streak, and more. The Throne Report has become the Monday morning tradition in every squad that uses Deuce Diary.

BRISTOL SCORE TRACKING
Log your Bristol stool score with each entry for genuine health tracking. See your consistency trends over time. Your gastroenterologist will either be impressed or confused. Probably both.

DAILY CHALLENGES
New challenge every day: log before 8 AM, hit a 3-day streak, log at work (you know you do). Complete challenges for bonus stats and bragging rights.

GHOST MODE
Log without notifying your squad. Sometimes you need privacy even from your accountability group. Ghost logs still count for the streak.

EMOJI REACTIONS
React to your squad members' logs. There's a 💩. There are others. Reactions are how you communicate that you're proud of your squad's collective output.

STREAK INSURANCE
Miss a day? Streak Insurance (once per month) saves the group streak. The most valuable premium feature in a 47-day streak scenario.

PORCELAIN PREMIUM — $2.99/mo · $19.99/yr · $49.99 lifetime
Premium unlocks: unlimited squads, custom themes (Midnight, Cream, Forest), streak insurance, detailed analytics, weekly Throne Reports, emoji reactions, daily challenges, ghost mode, milestone broadcasts, and squad spy mode.

Free tier: log deuces, join one squad, basic streak tracking.

---

Poop Map has 62,000 App Store reviews. People will absolutely track their bathroom habits. Nobody has built what we built: the social accountability layer. The streak. The squad. The consequence of missing.

We did.

Your gut health matters. Tracking it should be fun.

Privacy note: We do not use GPS. We do not sell your data. Deuce logs are visible only to your squad members. Auth via Clerk. Payments via RevenueCat (Apple handles all payment processing). Full privacy policy at deucediary.app/privacy.
```

#### "What's New" Text (Version 1.0 launch)
```
Welcome to Deuce Diary! 🚽

Version 1.0 — the one that started it all.

Log your deuces. Join a squad. Keep the streak alive or face the group chat consequences.

New: Bristol score tracking for real gut health data
New: Ghost mode for private logs that still count
New: Photo logging with AI analysis (Porcelain Premium)
New: Streak Insurance — because 47-day streaks deserve protection

Your squad is waiting.
```

---

### Day L-6: Screenshots (6 required for iPhone)

**Screenshot dimensions:** 1290 × 2796 px (iPhone 15 Pro Max)
**Format:** PNG, no alpha channel
**Tool recommendation:** Figma or Sketch with device frames

| # | Screen | Headline text overlay | Supporting text |
|---|--------|----------------------|-----------------|
| 1 | Squad streak view (Day 34 streak, 4 members all logged) | **Your squad streak: 34 days** | Everyone logs daily or it resets. No exceptions. |
| 2 | One-tap logging screen | **Log a deuce in 5 seconds** | Add Bristol score, thoughts, or keep it quick |
| 3 | Squad leaderboard | **Compete with your squad** | Who's the most consistent? Find out. |
| 4 | Weekly Throne Report (showing stats) | **Your weekly Throne Report** | Peak day, longest streak, squad MVP |
| 5 | Daily challenge screen | **New challenge every day** | Log before 8 AM. Log at work. Stay on the throne. |
| 6 | Premium/Porcelain Premium upgrade | **Porcelain Premium** | Streak insurance, unlimited squads, custom themes |

**Screenshot do's and don'ts:**
- DO use a real-looking streak of 20+ days (not "1 day")
- DO show a squad of 3-4 people with names that look real (Alex, Jordan, Sam, Riley)
- DO show reactions and leaderboard to convey social nature
- DON'T use placeholder "Lorem ipsum" names
- DON'T show empty states

---

### Day L-5: Press Kit Preparation

**Press kit lives at:** deucediary.app/press (or a Notion page linked from the site)

**Contents:**

#### Press Release (draft — personalize date before sending)

```
FOR IMMEDIATE RELEASE
[Date]

DEUCE DIARY LAUNCHES ON THE APP STORE: THE FIRST SOCIAL GUT HEALTH TRACKER WITH GROUP STREAKS

San Francisco, CA — Deuce Diary, a social bathroom tracking app, launches today on the iOS App Store.
The app turns daily bathroom visits into a social accountability game through group streaks —
where all squad members must log daily or the streak resets for everyone.

"Poop Map has 62,000 App Store reviews," said Giovanni [LASTNAME], founder of Deuce Diary.
"People will track their bathroom habits if you make it fun. But no app has combined health
tracking with the kind of social accountability that makes Snapchat Streaks or Duolingo so sticky.
That's the gap we filled."

Deuce Diary features one-tap logging (under 5 seconds), squad streaks, leaderboards, weekly
"Throne Reports" with personal analytics, Bristol stool score tracking, daily challenges, and
ghost mode for private logs. The Porcelain Premium subscription ($2.99/month or $19.99/year)
unlocks unlimited squads, streak insurance, custom themes, and detailed analytics.

The app is rated 4+ and emphasizes privacy: no GPS tracking, no data selling, logs visible
only to squad members.

Deuce Diary is available free on the App Store. Download at: [App Store link]

MEDIA CONTACT:
Giovanni [LASTNAME]
press@deucediary.app
```

#### Press Kit Assets (prepare these files)

| Asset | File | Size |
|-------|------|------|
| App icon (1024×1024) | icon-1024.png | PNG |
| App icon (512×512) | icon-512.png | PNG |
| Logo horizontal (white bg) | logo-horizontal-light.png | PNG |
| Logo horizontal (dark bg) | logo-horizontal-dark.png | PNG |
| Founder headshot | giovanni-headshot.jpg | JPG, min 1000px wide |
| Screenshot set (all 6) | screenshots/ | PNG folder |
| App preview video | preview-30s.mp4 | MP4, 30s max |
| Brand colors | brand-colors.txt | HEX codes |

#### Brand Colors (for press kit)
```
Primary:    #[your primary color]
Secondary:  #[your secondary color]
Background: #[background]
Text:       #[text color]
Gold (Porcelain Premium): #C9A84C
```

#### One-liner for media
> "Deuce Diary is the first social gut health tracker — think Strava for your bathroom. Groups of friends track daily bathroom visits together, and if anyone misses a day, the group streak resets for everyone."

#### Journalist pitch email template

**Subject:** Exclusive: We built the social poop tracker the internet asked for (62K Poop Map reviews proved the demand)

```
Hi [NAME],

I'll be brief: I built a social poop tracker. And before you close this email — here's why it's a real story.

Poop Map, a simple bathroom location app, has 62,000 App Store reviews. People are already tracking
their bathroom habits. Nobody has built the social layer.

Deuce Diary launches on the App Store [DATE]. It's a group accountability app for gut health —
squad members must log daily or the group streak resets for everyone. The mechanic is identical
to what makes Duolingo streaks and Snapchat streaks so sticky.

We've had [X] users on TestFlight with [X] active streaks. Our current record squad streak is [X] days.

I think there's a story here about:
1. The gut health tracking gap (gastroenterologists want this data, nothing good exists)
2. Why social mechanics are the future of health apps
3. The Poop Map market proof + what we built on top of it

Happy to offer exclusive access, a demo call, or connect you with beta testers who have been using
this with their friend groups.

Full press kit: [link]
App Store: [link]

— Giovanni
Founder, Deuce Diary
press@deucediary.app
```

**Target publications for Day L-7 outreach:**
- TechCrunch (Startups desk)
- The Verge (Apps section)
- 9to5Mac (iOS app launches)
- AppAdvice
- Mashable (viral/fun apps)
- Product Hunt (blog/editorial team)
- The Hustle / Morning Brew (quirky founder stories)

---

### Day L-4: Social Media Accounts Setup

**Required accounts (create all before launch):**

| Platform | Handle | Purpose |
|----------|--------|---------|
| Twitter/X | @DeuceDiaryApp | Primary tech/startup audience |
| TikTok | @DeuceDiary | Video content, viral potential |
| Instagram | @DeuceDiary | Visual content, streak shares |
| Reddit | u/DeuceDiaryFounder | Founder posting in communities |
| ProductHunt | Deuce Diary (product page) | Launch day post |

**Bio text (use across platforms):**
```
The Strava of poop tracking 💩 Squad streaks. Leaderboards. Weekly Throne Reports.
Gut health, but make it competitive. App Store now → [link]
```

**Profile picture:** App icon (toilet/throne themed, on brand color background)

**Link in bio:** deucediary.app (with App Store redirect)

**Day L-4 content to pre-schedule:**
- Twitter: 3 "building in public" pre-launch tweets (schedule 3 days before launch)
- TikTok: 1 "we're launching in 3 days" teaser (show app footage)
- Instagram: 1 countdown story

---

### Day L-3: Landing Page Final Review

**Checklist:**

| Item | Check |
|------|-------|
| App Store button links to correct listing | [ ] |
| No fake social proof ("10K+ deuces" removed until earned) | [ ] |
| Privacy Policy and Terms of Service at working URLs | [ ] |
| OG image set (1200×630) for link previews | [ ] |
| Twitter card meta tags working (test via Twitter Card Validator) | [ ] |
| Mobile-first layout tested on iPhone 12, 14, 15 | [ ] |
| Page loads under 3 seconds on 4G (test via WebPageTest) | [ ] |
| Email capture form working (Mailchimp or Resend) | [ ] |
| UTM parameters on all outbound links | [ ] |
| App Store badge (Apple-approved asset, not custom button) | [ ] |

**UTM parameter map (use these consistently):**

| Source | UTM |
|--------|-----|
| Product Hunt | `?utm_source=producthunt` |
| Reddit r/InternetIsBeautiful | `?utm_source=reddit_iib` |
| Reddit r/SideProject | `?utm_source=reddit_sp` |
| Reddit r/QuantifiedSelf | `?utm_source=reddit_qs` |
| Reddit r/CasualConversation | `?utm_source=reddit_cc` |
| Reddit r/funny | `?utm_source=reddit_funny` |
| Twitter organic | `?utm_source=twitter_organic` |
| TikTok bio link | `?utm_source=tiktok_bio` |
| Influencer [name] | `?utm_source=influencer_[name]` |
| Press coverage | `?utm_source=press_[outlet]` |

---

### Day L-1: Final Checks

```
LAUNCH EVE CHECKLIST — COMPLETE BY 10 PM THE NIGHT BEFORE

Infrastructure:
[ ] Production build deployed and health check green (GET /api/health)
[ ] GET /api/internal/health/detailed returns no errors
[ ] Sentry receiving errors (send a test error)
[ ] RevenueCat → App Store IAP products configured and tested
[ ] Stripe/RevenueCat sandbox purchase successful end-to-end
[ ] Rate limits confirmed (100 req/min global, 10 deuces/user/day)
[ ] Railway DB connections < 10 of 20 pool max

App Store:
[ ] App Store Connect listing status: "Ready for Sale" or "Pending Apple Review"
[ ] All 6 screenshots uploaded to App Store Connect
[ ] Preview video uploaded (optional but recommended)
[ ] Privacy nutrition labels filled out
[ ] App privacy URL pointing to live page

Social:
[ ] ProductHunt submission scheduled for 12:01 AM PT
[ ] All Reddit posts written and saved (not posted)
[ ] Twitter thread written and saved (not posted)
[ ] TikTok video filmed and edited (not posted)
[ ] 10 supporters briefed on ProductHunt upvote timing
[ ] Press pitches sent (3+ days ago, so follow-ups may arrive launch morning)

Giovanni:
[ ] Slept
[ ] Phone charged
[ ] Notifications on for Sentry, Railway, RevenueCat
[ ] Screen recording setup for live monitoring stream (optional)
```

---

## SECTION 2: LAUNCH DAY

**Target day:** Tuesday or Wednesday (highest Reddit + ProductHunt engagement)
**All times: Pacific Time (PT)**

### Hour-by-Hour Timeline

| Time | Action | Owner | Details |
|------|--------|-------|---------|
| **12:01 AM** | ProductHunt submission goes live | Giovanni | Pre-scheduled. Do NOT post manually — PH rank depends on getting upvotes within the first hour |
| **12:05 AM** | Text/DM 10 supporters | Giovanni | Message: "We're live on Product Hunt — would mean everything if you upvoted right now. Link: [PH link]" |
| **12:10 AM** | Post maker comment on ProductHunt | Giovanni | Use the founder story template (see 2B below) |
| **12:30 AM** | Check PH ranking — top 10? | Giovanni | If not in top 10 after 30 min, text 10 more people |
| **6:00 AM** | Post Twitter/X launch thread | Giovanni | Full 5-tweet thread (see 2C below) |
| **6:30 AM** | Reply to any overnight PH comments | Giovanni | Thank every single person. Within 15 min of comment. |
| **7:00 AM** | Monitor app health + Sentry | Jordan | `GET /api/internal/health/detailed`. Check error rate. |
| **7:30 AM** | Check `/api/admin/stats` for signup numbers | Giovanni | First data point. Screenshot and share in team Slack. |
| **8:00 AM** | Post to r/InternetIsBeautiful | Giovanni | Full post (see 2D below). Do NOT mention it's your app in the title. |
| **8:15 AM** | Share Reddit post in Slack → team upvote | Giovanni | First 5 minutes of upvotes are critical for Reddit ranking |
| **9:00 AM** | Post to r/SideProject | Giovanni | Different angle — builder story |
| **9:30 AM** | Post TikTok Video 1 | Giovanni | "The app that ruined my group chat" |
| **10:00 AM** | Engineering health check | Jordan | CPU, memory, DB connections, Railway metrics |
| **10:30 AM** | Midmorning PH check — reply to all new comments | Giovanni | Aim to reply within 15 minutes of every comment all day |
| **11:00 AM** | Post to r/QuantifiedSelf | Giovanni | Health angle: gut health tracking with social accountability |
| **11:30 AM** | Post to r/HabitTracking | Giovanni | Streak mechanic angle |
| **12:00 PM** | Midday check-in | Both | Signups, PH rank, Reddit posts performance, any bugs |
| **12:30 PM** | Post to r/CasualConversation | Giovanni | Personal story angle: "my friend group has been tracking our poops for 34 days" |
| **1:00 PM** | Post TikTok Video 2 | Giovanni | "Gut health but make it competitive" |
| **2:00 PM** | Post to r/poop (yes it exists, 186K members) | Giovanni | Genuine community, authentic post about the app |
| **2:30 PM** | Post to r/GutHealth | Giovanni | Health angle, no sales pitch, just "built this for our group" |
| **3:00 PM** | Second Twitter post | Giovanni | Real stat: "X deuces logged in X hours" or PH ranking update |
| **4:00 PM** | Send influencer DMs (Batch 1) | Giovanni | 10 fitness/wellness creators under 50K followers |
| **5:00 PM** | Post to r/digitalnomad | Giovanni | Distributed friend group accountability angle |
| **6:00 PM** | Evening ProductHunt push | Giovanni | Reply to all comments, thank voters, post a comment update with real numbers |
| **7:00 PM** | Check sign-up conversion | Giovanni | How many landed on site → signed up? Where's the drop-off? |
| **8:00 PM** | Post-launch retrospective in Slack | Both | What's working, what's not, any fires |
| **9:00 PM** | Reply to all outstanding comments across all platforms | Giovanni | Clear the inbox |
| **10:00 PM** | Final overnight monitoring check | Jordan | Set Railway + Sentry alerts. Set PagerDuty/UptimeRobot for /api/health |

---

### 2A. Launch Day Social Media Posting Schedule

**Platform-by-platform posting order:**
1. **12:01 AM** — ProductHunt (scheduled)
2. **6:00 AM** — Twitter/X thread
3. **8:00 AM** — r/InternetIsBeautiful
4. **9:00 AM** — r/SideProject
5. **9:30 AM** — TikTok #1
6. **11:00 AM** — r/QuantifiedSelf
7. **11:30 AM** — r/HabitTracking
8. **12:30 PM** — r/CasualConversation
9. **1:00 PM** — TikTok #2
10. **2:00 PM** — r/poop
11. **2:30 PM** — r/GutHealth
12. **3:00 PM** — Twitter update with real numbers
13. **5:00 PM** — r/digitalnomad
14. **Evening** — Instagram story with PH ranking

**Do NOT cross-post the same text.** Each platform gets a unique angle. Reddit will detect and ban brigaded posts.

---

### 2B. ProductHunt Post

**Tagline (60 chars):**
```
The Strava of poop tracking — streaks, squads, leaderboards
```

**Description (260 chars):**
```
Turn your daily deuces into a social game. Squad streaks where everyone must log daily or it resets.
Leaderboards. Weekly Throne Reports. Bristol score tracking. Gut health that's actually fun.
Free to start, Porcelain Premium $2.99/mo.
```

**First Comment — Maker Story (post this within 5 minutes of going live):**

```
Hey PH! I'm Giovanni, and yes — I built a social poop tracker for the App Store.

Here's why this isn't insane:

1. Poop Map has 62,000 App Store reviews. People WILL track their bathroom habits. The
   demand exists.

2. No app combines social accountability + streaks + gut health. The category gap is enormous.

3. Streaks work. Duolingo built a $5B company on them. Snapchat's streaks are why teenagers
   cry when they break them. If your squad's 34-day streak is on the line, you WILL log.

What I built:
→ One-tap deuce logging (5 seconds flat)
→ Squad streaks — everyone logs daily or it resets for everyone
→ Leaderboards within squads
→ Weekly "Throne Reports" with personal analytics
→ Bristol stool score tracking for actual gut health data
→ Ghost mode for those who want privacy
→ Daily challenges, emoji reactions, streak insurance

Porcelain Premium: $2.99/mo, $19.99/yr, $49.99 lifetime.

My beta users have formed [X] squads. Current record streak: [X] days. The group chats are unhinged.

Roast us — we can take it. 💩
```

---

### 2C. Twitter/X Launch Thread (5 tweets, post as thread)

**Tweet 1 (Hook):**
```
Introducing Deuce Diary — the Strava of poop tracking.

→ Squad streaks (everyone logs daily or it resets)
→ Leaderboards
→ Weekly Throne Reports
→ Bristol score tracking

Your gut health matters. Tracking it should be fun.

We just launched on the App Store 🧵
```

**Tweet 2 (The Problem):**
```
Every health tracker takes itself too seriously.

You'll track your steps. Your sleep. Your macros. Your heart rate.

But the thing your gastroenterologist ACTUALLY wants you to track? Bowel habits.

Nobody does it. There's no good social tool for it.

Until now.
```

**Tweet 3 (The Mechanic):**
```
The secret: squad streaks.

You and your friends join a squad. Everyone logs daily. If ONE person misses — the streak resets for EVERYONE.

It's Snapchat Streaks for your gut.

My beta group is on day [X]. The panic texts at 11 PM are unhinged.
```

**Tweet 4 (Proof):**
```
Poop Map: 62,000 App Store reviews.
Zero social features. No streaks. No squads. No accountability.

People WILL track their bathroom habits if you make it worth tracking.

We added the thing nobody else has: consequence.

Your squad is counting on you.
```

**Tweet 5 (CTA):**
```
Deuce Diary is free on the App Store.

Download → form a squad → try to survive 7 days together.

App Store: [link]
ProductHunt: [link]

Built with React Native + Expo, Express, PostgreSQL.
$2.99/mo Porcelain Premium unlocks everything.

💩
```

---

### 2D. Reddit Posts (full copy, by subreddit)

#### r/InternetIsBeautiful

**Title:** I built a social poop tracker with group streaks, leaderboards, and weekly stat reports — and it's now on the App Store

**Body:**
```
I built Deuce Diary — an iOS app that turns daily bathroom habits into a social accountability game.

The core mechanic: you join a squad with friends. Everyone has to log at least once a day to keep
the group streak alive. If one person misses a day, the streak resets for everyone. It's Snapchat
Streaks for your gut.

What's in the app:
- One-tap logging (under 5 seconds)
- Squad streaks with group accountability
- Leaderboards within your squad (yes, people compete)
- Bristol stool score tracking for actual health data
- Weekly "Throne Reports" — your personal stats every Sunday
- Ghost mode for private logs that still count toward the streak
- Daily challenges
- Emoji reactions (including the obvious one)

Available free on the App Store: [link]

Fair warning: this will absolutely ruin your group chat in the best possible way.

Happy to answer questions about the build (React Native + Expo + Express + PostgreSQL) or my life choices.
```

---

#### r/SideProject

**Title:** Launched Deuce Diary on the App Store — a social poop tracker. 4 months of building. Here's what I learned.

**Body:**
```
Stack: React Native (Expo) + Express + PostgreSQL on Railway. Clerk for auth. RevenueCat for IAP.

The idea: my friends and I wanted a daily check-in app that was low-effort but high-accountability.
Someone joked "what if we just tracked our poops." I built it.

The insight that changed everything: the streak mechanic IS the product. Everything else (leaderboards,
reactions, reports) supports it. But the streak — where everyone must log or it resets for everyone —
is the retention engine. We have beta users who have maintained [X]-day streaks. People are obsessed.

What I built:
- Social group streaks (collective accountability)
- Bristol score logging for health data
- Weekly Throne Reports (automated, data-driven)
- Ghost mode (private logs that count)
- Porcelain Premium ($2.99/mo) — streak insurance, unlimited squads, themes, analytics
- Full Clerk auth + RevenueCat IAP + Sentry + Railway deployment

Key decision I'd make again: launching web-first before iOS. Got 3 months of real user data, fixed
core UX issues, validated the streak mechanic, THEN built iOS. Don't skip this.

What I'd do differently: sooner beta. I waited too long to get real squads formed and testing streaks.
The streak is only fun when multiple people are in it.

App: [link]
ProductHunt: [link]

Happy to answer technical questions or talk about the product decisions.
```

---

#### r/QuantifiedSelf

**Title:** Built a social gut health tracker — group streaks for bowel habit logging, weekly reports, Bristol scale

**Body:**
```
I've been lurking in r/QuantifiedSelf for a while and wanted to share something I built that this
community might actually appreciate.

Deuce Diary: a social bowel habit tracker with group accountability mechanics.

The health case: gastroenterologists consistently say that bowel habit changes are among the first
symptoms of dozens of conditions (IBS, food intolerances, IBD, and more serious issues). Consistent
tracking matters. Nobody does it because it's tedious and feels weird.

What I added: social accountability. You join a squad, and everyone must log daily or the group
streak resets. We also added Bristol stool scale scoring per entry so you're capturing qualitative
data, not just frequency.

The data you get:
- Frequency over time (daily, weekly trends)
- Bristol score trends (consistency)
- Time-of-day patterns
- Correlation with squad behavior
- Weekly "Throne Report" with your stats

I built this because no gut health app has a real social mechanic. And social pressure + loss
aversion (the streak) drives more consistent tracking behavior than any push notification or reminder.

App Store: [link]

Would love feedback from people who take self-tracking seriously.
```

---

#### r/CasualConversation

**Title:** My friend group has been tracking our poops together for 47 days and it's become the weirdest, most wholesome group chat tradition

**Body:**
```
This started as a joke. My friend said "what if we had a Snapchat streak but for bathroom visits."
I am a developer. I built it.

It's called Deuce Diary. You join a squad with friends, everyone logs at least one deuce per day,
and if anyone misses a day the group streak resets for everyone.

Things that have happened since we started:

- My friend Jake got a panicked "BRO LOG YOUR DEUCE" text at 11:48 PM because he almost broke
  our 23-day streak
- We now have a leaderboard and there is genuine, competitive energy about it
- One person's partner asked to join and now she's #1 on the leaderboard and none of us talk
  about it
- We get "Throne Reports" every Sunday with our collective stats and it's become a Monday morning
  tradition to screenshot and discuss
- One friend noticed his pattern changed during a stressful work week and actually mentioned it
  to his doctor (doc was confused but ultimately pleased)

I launched the app on the App Store today: [link]

Has anyone else accidentally created a weird group tradition that became genuinely valuable?
```

---

#### r/digitalnomad

**Title:** Built an app to keep my distributed friend group doing daily check-ins across 5 time zones. It tracks our poops.

**Body:**
```
I know the title is insane. Let me explain.

My friends are scattered across SF, NYC, London, Berlin, and Singapore. We wanted a daily
check-in ritual that was dead simple and impossible to fake. Someone joked "what if we tracked
our bathroom visits" and I — being a developer — actually built it.

Deuce Diary: everyone in your group logs at least one deuce per day. If anyone misses their
timezone window, the group streak resets for everyone. The panic messages in the group chat when
someone hits 11 PM their time without logging are worth the entire development process.

Beyond the jokes, it's been genuinely useful for three things:
1. Daily proof of life across time zones (if you logged, you're conscious and functional)
2. Health awareness — a couple friends noticed patterns they'd never thought about
3. Accountability energy that spills over into other areas (strange but true)

We're on day [X]. The app is on the App Store if you have a distributed squad who would find
this either useful or deeply cursed: [link]

Anyone else have weird async check-in rituals with a distributed friend group?
```

---

#### r/poop (186K members — genuine community)

**Title:** I built an app specifically for this community: social poop tracking with streaks

**Body:**
```
This subreddit exists, so I know there's an audience for what I'm about to say.

I built Deuce Diary — an app where you and your friends track your daily bathroom visits together,
maintain group streaks, and compete on leaderboards. The app is on the App Store as of today.

We also added Bristol stool score logging for those who want the actual health data.

Weekly Throne Reports. Daily challenges. Ghost mode for the shy. Emoji reactions (yes, that one).

If any community was going to understand why this exists: it's this one.

[App Store link]

💩
```

---

### 2E. Influencer Outreach — Launch Day DMs

**Send 10 DMs within the first 4 hours of launch. Prioritize creators who:**
- Post about fitness, gut health, wellness routines, or "weird apps I tried"
- 5K–100K followers (micro-influencers have better engagement rates)
- Have posted any gut health or digestive content in the last 6 months

**Template A — Fitness/Wellness Creators:**
```
Subject: Your audience might love/hate this app I just launched

Hey [NAME] — love your content on [gut health/routines/fitness]. Quick pitch:

I just launched Deuce Diary on the App Store — it's the first social gut health tracker with
group streaks. You and friends track daily bathroom habits. If anyone misses a day, the group
streak resets for everyone. Think Duolingo streaks meets gut health accountability.

My beta users have [X] active squads and a record [X]-day streak. The group chats are unhinged.

Would love to give you free Porcelain Premium access (lifetime) if you want to try it with your
community. No posting obligation — just genuinely think your audience would have fun with this
or learn something about their gut.

App Store: [link]

— Giovanni, Deuce Diary founder
```

**Template B — Comedy/Lifestyle Creators:**
```
Subject: I think your audience needs to see this immediately

Hey [NAME] — [specific reference to their content].

I launched an app today where your friend group tracks their poops together with streaks and
leaderboards. If one person doesn't log, the streak resets for everyone. My friends' group
chat has been absolutely unhinged since we started.

It's called Deuce Diary, it's on the App Store, and I genuinely think you could make a great
video with it. Get 3 friends on it for a week and record the group chat. That's the video.

Happy to give you lifetime premium. No strings.

— Giovanni
```

**Template C — Health/Science Creators:**
```
Subject: Social accountability for gut health tracking — built this, would love your take

Hey [NAME], big fan of your [health content/science communication].

Gastroenterologists want patients to track bowel habits. Nobody does it because it's boring
and solo. I built Deuce Diary to add social accountability — squad streaks where everyone must
log daily or the streak resets.

The health data layer includes Bristol stool scoring and weekly trend reports. The social layer
is what makes people actually stick to it.

Launched on the App Store today. Would love your take as someone who communicates health seriously.
If it's useful or interesting: [App Store link]

— Giovanni, Deuce Diary
```

**Follow-up (5 days after no reply):**
```
Hey [NAME] — just bumping this in case it got buried. The app is free to try if you're curious:
[App Store link]. No pressure at all. Keep making great content.
```

---

### 2F. Community Seeding Strategy

**Bathroom humor + habit tracking communities to seed authentically:**

| Subreddit | Members | Angle |
|-----------|---------|-------|
| r/poop | 186K | Direct — this is your core community |
| r/InternetIsBeautiful | 17M | "Cool app" discovery format |
| r/CasualConversation | 12M | Personal story format |
| r/SideProject | 200K | Founder/builder story |
| r/QuantifiedSelf | 165K | Self-tracking data angle |
| r/HabitTracking | 100K | Streak mechanics angle |
| r/digitalnomad | 1.5M | Distributed accountability angle |
| r/GutHealth | 50K+ | Health benefits angle |
| r/IBS | 120K | IBS tracking angle (sensitive — lead with health utility, not jokes) |
| r/Fitness | 10M | "Tracking your gut is the missing piece" angle |
| r/funny | 50M | Only if a genuinely funny moment happens organically |
| r/showerthoughts | 4M | "The first social gut health app just launched and it's called Deuce Diary" type post |

**Rules:**
1. Never post the same text in multiple subreddits
2. Read each subreddit's rules before posting — some ban self-promotion
3. Engage in comments for 2 hours minimum after posting
4. Never brigade (don't post your Reddit link in Slack and ask for mass upvotes)
5. Disclose you're the founder/builder in the post body — Reddit rewards authenticity

---

### 2G. Press Release (Distribution)

**Day of launch, send to:**
- press@techcrunch.com
- tips@theverge.com
- tips@9to5mac.com
- hello@appadvice.com
- Mashable tips form
- The Hustle / Morning Brew tips form

**Subject line options (A/B test across outlets):**
- "Launch: Deuce Diary — the App Store's first social poop tracker with group streaks"
- "Social accountability meets gut health: Deuce Diary launches on iOS"
- "Why Poop Map's 62K reviews proved there's a real market — and what we built on top of it"

---

## SECTION 3: POST-LAUNCH — WEEKS 1-4

### Week 1: Metrics to Track Daily

**North Star Metric: Daily Active Deuces (DAD)**
Total deuces logged per day across all users. Captures both user count and engagement depth.

**Daily dashboard (hit `GET /api/admin/stats` with X-Admin-Key header):**

| Metric | Week 1 Target | Month 1 Target | Source |
|--------|--------------|----------------|--------|
| New App Store installs | 200/day Day 1, 50+/day after | 2,000 total | App Store Connect → Analytics |
| DAU | 100 (Week 1 avg) | 500 | `/api/admin/stats` → activeUsersToday |
| Deuces logged per DAU | 1.2 | 1.5 | totalDeucesToday / DAU |
| Squads created | 30+ | 200+ | Admin stats |
| Squad streak retention (7-day) | 40% of squads | 50% | Squads with 7+ day streak / total squads |
| Porcelain Premium conversion | 5% | 8% | RevenueCat dashboard |
| Referral rate | 10% | 20% | Users with referrer / total users |
| MRR | $150 Week 1 | $1,000 Month 1 | RevenueCat |
| App Store rating | n/a (too soon) | 4.0+ stars | App Store Connect |
| Crash rate | < 0.1% | < 0.05% | Xcode Organizer / Sentry |

**Weekly secondary KPIs:**

| Metric | What It Tells You |
|--------|-------------------|
| Avg squad size | Are people inviting friends? (Target: 4+ members) |
| Streak insurance usage | Are users invested enough to pay for protection? |
| Challenge completion rate | Are daily challenges driving extra engagement? |
| Reaction count per deuce | Is the social layer sticky? |
| Throne Report open rate | Do users care about their stats? |
| Day-7 retention | % of Day-1 installs still logging on Day 7 (target: 30%) |
| Day-30 retention | % of Day-1 installs still logging on Day 30 (target: 15%) |

---

### App Store Review Response Strategy

**Goal:** Respond to every review within 24 hours. Apple shows responses publicly.

**Positive review response templates:**

For 5-star reviews:
```
Thank you so much — this made our day! 💩 Keep that streak alive. — Giovanni, Deuce Diary founder
```

For 4-star reviews with suggestions:
```
Thanks for the honest feedback! [SPECIFIC FEATURE REQUEST] is on our roadmap.
DM us @DeuceDiaryApp on Twitter if you want to beta test it when it ships.
— Giovanni
```

**Negative review response templates:**

For "app crashes" reviews:
```
Really sorry about this — that should not be happening. Can you email bugs@deucediary.app
with your iOS version and device? We'll fix it and send you free Porcelain Premium as an apology.
— Giovanni
```

For "too expensive" reviews:
```
Fair feedback. Free tier lets you log, join one squad, and track streaks — no paywall for the
core experience. The $2.99/mo premium unlocks unlimited squads, streak insurance, and analytics.
If you try it and disagree, email us at hello@deucediary.app — we'll work something out.
— Giovanni
```

For "inappropriate/childish" reviews:
```
We hear you — this app isn't for everyone. But gut health tracking matters: gastroenterologists
consistently cite bowel habit changes as early warning signs for a range of conditions. We made
it social and fun because that's what gets people to actually track consistently.
Thanks for the feedback. — Giovanni
```

For "the streak mechanic is too brutal" reviews:
```
That's actually intentional — the whole point is that the social pressure makes you log.
But Porcelain Premium includes Streak Insurance (once/month) for exactly this situation.
Sorry the streak reset hurt. 🪑 — Giovanni
```

**Review request strategy:**
- Trigger in-app review prompt after: 3+ day streak achieved, Throne Report viewed, after 7th deuce logged
- Use Apple's native `SKStoreReviewController.requestReview()` — do NOT link to App Store manually
- Goal: 50+ reviews in first 30 days

---

### Bug Triage Process

**Week 1 triage cadence:** Daily standup, 15 minutes, all severity bugs reviewed.

| Severity | Definition | Response | Owner |
|----------|-----------|----------|-------|
| **P0** | App crash on launch, auth fails, can't log, IAP broken | Fix + hotfix deploy within 4 hours | Jordan |
| **P1** | Streak not updating, squad invite broken, data wrong | Fix within 24 hours | Jordan |
| **P2** | UI glitch, copy error, minor layout issue | Fix in next weekly release | Dev |
| **P3** | Enhancement request, nice-to-have | Backlog | PM |

**Bug sources to monitor:**
1. Sentry (automatic crash reports + server errors)
2. App Store Connect → Crashes section
3. Xcode Organizer → Crashes tab
4. TestFlight feedback emails
5. App Store reviews mentioning bugs
6. Twitter/Reddit mentions (`@DeuceDiaryApp`, "Deuce Diary" keyword monitoring)
7. `GET /api/internal/errors` endpoint (X-Internal-Key header)

**Bug report template (for users who DM/email):**
```
What were you doing when it happened?
What device and iOS version?
Screenshot or screen recording?
Does it happen every time or occasionally?
```

---

### Content Calendar — Weeks 1-4

**Volume:** 1 Reddit post/week, 3 tweets/week, 2 TikToks/week, 1 Instagram post/week

#### Week 1 Post-Launch Content

| Day | Platform | Content |
|-----|----------|---------|
| L+1 | Twitter | "Day 1 update: X installs, X deuces logged, X squads formed. Thank you 🚽" |
| L+2 | Reddit r/SideProject | "48-hour launch update: what worked, what didn't" (honest numbers) |
| L+3 | TikTok | User testimonial compilation OR "reading our first App Store reviews" reaction video |
| L+4 | Twitter | Streak milestone: "One squad is already on a 7-day streak. Who's on longer?" |
| L+5 | TikTok | "What happens to your group chat when you install Deuce Diary" |
| L+6 | Instagram | Screenshot of longest squad streak (with permission) |
| L+7 | Twitter thread | Weekly retrospective with real numbers: installs, deuces, MRR |

#### Week 2 Content

| Content | Platform | Angle |
|---------|----------|-------|
| "The science behind why streaks work (and why we built one for your bathroom)" | Twitter thread | Educational + product |
| Throne Report screenshot of power user (anonymized, with permission) | Instagram + Twitter | UGC / social proof |
| "7 things we learned from our first 1,000 Deuce Diary users" | Reddit r/Entrepreneur | Growth + product lessons |
| TikTok: "When the squad almost broke the 14-day streak" dramatization | TikTok | Entertainment |
| Feature spotlight: Bristol score tracking | Twitter | Health/education |

#### Week 3-4 Content

| Content | Platform | Angle |
|---------|----------|-------|
| First user milestone badge holders | Instagram | Gamification showcase |
| "Month 1 in numbers" | Twitter thread | Transparency / Indie hacker |
| Guest post pitch: "Why I built a social poop tracker" | Indie Hackers | SEO + community |
| TikTok: "Reading the wildest App Store reviews" | TikTok | Engagement / authenticity |
| Highlight a power user squad (with permission) | Twitter + Instagram | Community |
| "Deuce culture" meme post | r/poop, Twitter | Brand personality |

**Meme templates to create (Week 1):**
1. "When your friend breaks the 30-day streak / squad reaction" meme format
2. "Nobody: / Deuce Diary users:" format
3. "Day 1 vs Day 30 of Deuce Diary" comparison
4. Throne Report screenshot meme (share with hashtag #ThroneReport)

---

### Paid Acquisition Plan (Activate if Organic Exceeds Thresholds)

**Trigger conditions for paid spend:**
- Organic installs > 100/day AND maintaining for 3+ days → activate App Store Search Ads
- MRR > $500 → budget 20% of MRR to paid acquisition
- LTV:CAC ratio verified > 3:1 before scaling

**Channel 1: Apple Search Ads (start here)**
- Budget: $5/day cap to start
- Keywords to bid on: "poop tracker", "gut health app", "bowel tracker", "habit streak app"
- Creative: Use App Store screenshots (automatically pulled by ASA)
- Target: US, UK, Australia (English markets with highest LTV)
- Success metric: CPI < $1.50

**Channel 2: TikTok Ads (if organic TikTok shows traction)**
- Only activate if organic TikTok posts get >10K views
- Creative: Use the best-performing organic TikTok video as paid ad (spark ads)
- Budget: $20/day to start
- Target: 18-34, interests in fitness, wellness, social apps

**Channel 3: Reddit Ads (if organic Reddit posts perform well)**
- Boost best-performing organic Reddit posts
- Target by subreddit: r/QuantifiedSelf, r/HabitTracking, r/GutHealth, r/Fitness
- Budget: $10/day
- Format: Text post format performs better than display on Reddit

**What to measure:**
- CPI (Cost Per Install) — target < $2.00
- ROAS (Return on Ad Spend) — target > 3x
- D7 retention of paid users vs organic — if paid users churn 50% faster, stop paid

---

## SECTION 4: VIRAL MECHANICS

### 4A. Streak Sharing Templates

**The streak is the most shareable moment. Every milestone should be instantly sharable.**

**Trigger:** Streak milestones at 3, 7, 14, 21, 30, 50, 100 days
**Implementation:** After logging when streak crosses a milestone, show a full-screen celebration with share button

**Share card specs:**
- Size: 1080×1080 (Instagram square) and 1080×1920 (Story)
- Background: Uses squad's active theme (Midnight, Classic, Cream, Forest)
- Content: Squad name, streak count, member count, Deuce Diary branding
- Font: Bold, readable at small thumbnail size

**Share card copy (auto-populated by the app):**

For 7-day milestone:
```
[SQUAD NAME] just hit a 7-day streak 🚽

All [X] members logging daily. Zero excuses.

Track your squad @ DeuceDiaryApp
#DeuceDiary #StreakChallenge
```

For 30-day milestone:
```
30 days. [SQUAD NAME] hasn't broken.

[X] members. [X] total deuces. Zero casualties.

The social poop tracker that actually works.
#DeuceDiary #30DayStreak
```

For record streaks (50+):
```
[X] days. Still going.

[SQUAD NAME] might be the most dedicated bathroom squad alive.

@DeuceDiaryApp
```

**Where to share:** Pre-populated share sheet with Instagram, Twitter, iMessage as primary options

**Social proof text to include on share sheet:**
> "Join my squad on Deuce Diary — gut health tracking with streaks and leaderboards: [deeplink]"

**Deeplink format:** `deucediary://invite/squad/[invite-code]` (iOS) → `deucediary.app/invite/[code]` (web fallback)

---

### 4B. Group Invite Optimization

**The invite page is the #1 acquisition surface. Every squad member invites 1-2 people.**

**Current invite flow:** Squad creator → share link → non-member sees invite page

**Optimize the invite landing page:**

The invite page should show:
```
[SQUAD NAME] wants you to join their streak

Current streak: 14 days 🔥
Squad members: Alex, Jordan, Sam (and 1 more)
Deuces logged this week: 47

Your squad is waiting. If you don't join,
their streak ends when they hit 5 members max.

[Download on App Store] [Join on Web]
```

**Invite link messaging (copy for squad members to send):**

Default iMessage template:
```
I'm using this app called Deuce Diary where we track bathroom habits together
and maintain a group streak. Our squad is on day [X] and I need you in it.
Download link: [deeplink]
Join code: [code]

Yes this is real. Yes I'm serious.
```

**Optimize for conversion:**
1. Show streak counter prominently on invite page — urgency drives installs
2. Show member avatars/names — social proof from people they know
3. One-tap "Join on Web" option before App Store download (reduces friction)
4. "Your squad loses their streak protection if you don't join in 7 days" — FOMO mechanic

**Target metric:** 25% of invite page visitors install the app

---

### 4C. Referral Program Activation

**Current state:** 8-character referral codes in the app

**Activate the referral flywheel (Week 1):**

**Reward structure:**
- Referrer: 7 days free Porcelain Premium
- Referee: 7 days free Porcelain Premium on signup
- Both get "Founding Member" badge (permanent, first 100 referrers)

**Referral code sharing templates (in-app copy):**

Primary CTA (show on profile and after squad creation):
```
Give friends 7 days free. Get 7 days free.

Your code: [CODE]

[Copy code + link] [Share to iMessage] [Share to Instagram Story]
```

Pre-written message for sharing:
```
Using this app called Deuce Diary — gut health tracker with
squad streaks. Kind of insane but kind of works?

Use code [CODE] and we both get a free week of premium:
deucediary.app/?ref=[CODE]
```

**Referral leaderboard (Weeks 2-4):**
Create a "Top Referrers" leaderboard visible to all users — top 3 referrers each month get 1 month free premium. Post monthly results on Twitter with real usernames (with permission).

**Target referral rate:** 10% of installs from referral by Week 2, 20% by Month 1

---

### 4D. UGC Encouragement Strategy

**Goal:** Get users posting about Deuce Diary organically. The best marketing is a friend telling a friend.

**The Throne Report as UGC Engine:**
Every Sunday, users receive a Throne Report. The report should have a prominent "Share" button that generates a beautiful share card. Target: 10% of Throne Report recipients share it.

**Throne Report share card:**
```
[WEEKLY THRONE REPORT]

Week of [DATE]

Your stats:
🚽 Total deuces: X
🔥 Current streak: X days
📊 Your peak day: [DAY]
🏆 Your squad rank: #X of X

Tracked with Deuce Diary
#ThroneReport #DeuceDiary
```

**The "Streak Rescue" share:**
When a squad's streak is at risk (one or more members haven't logged by 8 PM), trigger a "streak rescue" notification with a one-tap share button:

Notification: "⚠️ [SQUAD NAME] streak at risk — [NAME] hasn't logged today"
Share content: "[NAME], the squad streak is on the line. Day [X]. Log your deuce: [deeplink]"

This creates authentic urgency content that people actually send to each other.

**UGC contest (Week 3-4):**
```
DEUCE DIARY SCREENSHOT CONTEST

Best squad streak screenshot wins 6 months of Porcelain Premium for your whole squad.

Post your streak screenshot with #DeuceDiary on Twitter or Instagram.
We'll pick the winner by [DATE].

Current record streak in the contest: [X] days
```

**#DeuceDiary hashtag monitoring:**
Use TweetDeck or similar to monitor #DeuceDiary in real time. Like, retweet (with comment), and reply to every post. This signals to users that the brand is watching and appreciates them — drives more posts.

**Content creators to approach for UGC:**
Target creators who post about:
- Morning routines / daily habits
- Gut health and nutrition
- Group accountability challenges ("75 Hard" crowd)
- "Weird apps" or "apps you should know about"
- Friendship/group chat content (25-35 demo)

Offer them: 3 months free Porcelain Premium for their whole squad + co-branded Throne Report card

---

## Contingency Plans

### Scenario A: App Store Rejects Build

**Common rejection reasons specific to Deuce Diary:**

| Reason | Fix |
|--------|-----|
| "Inappropriate content" | Reference Apple's own Health app which tracks bowel movements. State age rating: 4+. Emphasize health utility in App Review notes. Bathroom habit tracking = legitimate health category. |
| "App is a web wrapper" | We're built with Expo/React Native (native). Ensure native-specific features (haptics, push notifications, widgets) are prominent. |
| "Insufficient features for free tier" | Document free tier clearly: log deuces, join one squad, view basic streak — this is full functionality. |
| "Missing privacy labels" | Pre-fill all privacy labels: Health & Fitness category, usage data collected (deuce logs), user content (thoughts field). No data sold. |
| "In-app purchase issues" | Test IAP sandbox thoroughly before submission. Ensure free tier is genuinely functional without paywall. |

**If rejected:**
1. Read the specific rejection reason carefully
2. File an appeal via App Store Connect if the reasoning is wrong
3. Fix the specific issue and resubmit within 24 hours
4. Use TestFlight as the primary distribution channel while waiting for approval

### Scenario B: Goes Viral (Good Problem)

**Infrastructure triggers:**
- Signups spike 5x+ expected → scale Railway instance immediately
- DB connections > 15 of 20 → increase pool to 50 or enable PgBouncer
- Any single endpoint > 2s avg response time → check DB query plan

**Product response:**
1. Ensure onboarding is zero-friction: signup → first deuce → squad creation in under 3 minutes
2. "We're trending!" in-app banner to capitalize on momentum
3. Giovanni to respond to EVERY comment on viral post for 24 hours straight

### Scenario C: Nobody Downloads (< 100 Week 1)

1. Don't panic. Most App Store launches are quiet.
2. Analyze: Which channels got clicks but no downloads? UTM breakdown.
3. Go personal: DM 50 friends. Text group chats. "I need 20 minutes of your time to try this."
4. Temporarily unlock streaks for free (make Porcelain Premium the upsell for advanced features, not the gateway to the core mechanic)
5. Find one community to go deep on: one CrossFit gym, one office, one friend group of 50 people. Get them hooked. Let them spread it.

---

## Quick Reference Card

| Resource | Details |
|----------|---------|
| Production URL | https://deuce-dairy-web-production.up.railway.app |
| App Store URL | [Add after submission] |
| Health check | `GET /api/health` |
| Detailed health | `GET /api/internal/health/detailed` (X-Internal-Key) |
| Error logs | `GET /api/internal/errors` (X-Internal-Key) |
| Admin stats | `GET /api/admin/stats` (X-Admin-Key) |
| Streak cron | 12:00 and 20:00 UTC |
| Invite cleanup | Hourly |
| Insurance reset | 1st of month, midnight UTC |
| RevenueCat webhook | `POST /api/webhooks/revenuecat` |
| Clerk webhook | `POST /api/webhooks/clerk` |
| Beta email | bugs@deucediary.app |
| Press email | press@deucediary.app |
| Support email | hello@deucediary.app |
| ProductHunt | [link when scheduled] |
| Twitter | @DeuceDiaryApp |
| TikTok | @DeuceDiary |
| Instagram | @DeuceDiary |
| Primary hashtag | #DeuceDiary |
| Secondary hashtags | #ThroneReport #StreakChallenge #GutHealth |

---

*This playbook supersedes the previous web-first launch playbook (see LAUNCH_PLAYBOOK.md for web-first version). This document covers iOS App Store launch specifically.*
