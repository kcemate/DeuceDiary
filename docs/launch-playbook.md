# Deuce Diary Launch Playbook

**Last updated:** 2026-02-27
**Owner:** Giovanni (CEO)
**Launch target:** Web-first, iOS to follow

---

## 0. Current State of Play

**What's live:** Full-featured web app at https://deuce-diary-web-production.up.railway.app
- Deuce logging, group streaks, squads, leaderboards, reactions, analytics, weekly throne reports, daily challenges, referral system, real-time feed, 4 themes, premium subscription via RevenueCat

**What's NOT ready yet:**
- iOS app (Expo plan written, build not started)
- Clerk auth (keys not added — currently Replit Auth, username-only)
- Apple Developer account (blocked on Kyle)
- Final pricing config in RevenueCat ($2.99/mo, $19.99/yr, $49.99 lifetime — pending approval)

**Implication:** We launch web-first as a PWA / mobile web experience. iOS TestFlight follows 2-4 weeks later. This is actually an advantage — we validate product-market fit on web before burning $99/yr on Apple Dev + review cycles.

---

## 1. Pre-Launch Checklist

### Critical Path (MUST complete before launch)

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | **Switch auth from Replit to Clerk** | Kyle | BLOCKED | Clerk keys not added. Need: Clerk project created, API keys in Railway env vars, session middleware swapped. Without this, we ship username-only auth with no email/password — unacceptable for real users. |
| 2 | **Configure RevenueCat products** | Kyle | NOT STARTED | Create 3 products: monthly ($2.99), annual ($19.99), lifetime ($49.99). Add webhook URL to RevenueCat dashboard. Test purchase flow end-to-end. |
| 3 | **Set up custom domain** | Giovanni | NOT STARTED | `app.deucediary.com` or `deucediary.app`. Railway supports custom domains. Need DNS records. A real domain is non-negotiable for launch credibility. |
| 4 | **Add Apple "Add to Home Screen" prompt** | Dev | NOT STARTED | Since we're web-first, we need a PWA install banner. Manifest.json + service worker for offline. This IS our "app install" for v1. |
| 5 | **Privacy Policy + Terms at real URLs** | Giovanni | PARTIAL | Pages exist in-app but need to be accessible at standalone URLs for App Store and ProductHunt. |
| 6 | **Seed social proof** | Giovanni + team | NOT STARTED | The landing page claims "10K+ deuces logged" and "2.5K+ streakers." We need to either (a) remove fake numbers or (b) replace with honest copy like "Join the movement" until we earn real numbers. Launching with fake social proof will get roasted on Reddit. |
| 7 | **Test premium upgrade flow end-to-end** | Dev | NOT STARTED | Create test user → attempt upgrade → verify RevenueCat webhook fires → confirm premium features unlock → test expiration. |
| 8 | **Load test Railway deployment** | Dev | NOT STARTED | Simulate 500 concurrent users. Current pool config: max 20 connections, idle 30s. If we hit front page of Reddit, we need to know our ceiling. |
| 9 | **Set up Sentry for production errors** | Dev | PARTIAL | Sentry integration exists in code but DSN may not be configured in Railway env. Verify. |
| 10 | **Create App Store screenshots / marketing assets** | Giovanni | NOT STARTED | Even for web launch, we need: OG image for social sharing, screenshots for ProductHunt, promo graphics for Reddit/Twitter. |

### Nice-to-Have (do if time allows)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 11 | Add email capture to landing page for waitlist | Dev | NOT STARTED |
| 12 | Create a "Share my streak" social card generator | Dev | NOT STARTED |
| 13 | Set up basic analytics (PostHog or Mixpanel free tier) | Dev | NOT STARTED |
| 14 | Write 3-5 seed reviews / testimonials from beta testers | Giovanni | NOT STARTED |
| 15 | Record a 30-second demo video (screen recording of logging a deuce + streak) | Giovanni | NOT STARTED |

---

## 2. Launch Day Timeline

**Launch day = L-Day. Target: a Tuesday or Wednesday (best engagement days for Reddit + ProductHunt).**

### L-7 (One Week Before)
- [ ] All Critical Path items complete
- [ ] Soft launch to 20 friends/family — collect feedback, fix bugs
- [ ] Prepare all launch copy (below) in a Google Doc, get team review
- [ ] Schedule ProductHunt launch (requires a hunter or self-submit)
- [ ] Pre-write all Reddit posts, tweets, TikTok script
- [ ] Brief any friends/supporters: "Upvote on ProductHunt at exactly 12:01 AM PT"

### L-1 (Day Before)
- [ ] Final deploy to Railway, run health checks
- [ ] Verify custom domain SSL is green
- [ ] Test every premium feature one more time
- [ ] Pre-load ProductHunt submission (schedule for 12:01 AM PT)
- [ ] Giovanni + Kyle both logged in and monitoring

### L-Day Hour-by-Hour (all times PT)

| Time | Action | Owner |
|------|--------|-------|
| **12:01 AM** | ProductHunt goes live automatically | Giovanni |
| **12:05 AM** | Text/DM 10 supporters: "We're live on PH — would mean the world if you upvoted" | Giovanni |
| **6:00 AM** | Post to Twitter/X (main account + personal) | Giovanni |
| **7:00 AM** | Monitor ProductHunt ranking, reply to every comment within 15 min | Giovanni |
| **8:00 AM** | Post to r/InternetIsBeautiful (best for "look at this cool thing" energy) | Giovanni |
| **9:00 AM** | Post to r/SideProject | Giovanni |
| **10:00 AM** | Check Railway metrics: CPU, memory, DB connections, error rate | Kyle |
| **11:00 AM** | Post to r/QuantifiedSelf and r/LifeProTips (if appropriate angle) | Giovanni |
| **12:00 PM** | Midday check-in: How many signups? Any crashes? ProductHunt rank? | Both |
| **1:00 PM** | Post first TikTok (screen recording of app + voiceover) | Giovanni |
| **2:00 PM** | Engage in all Reddit comment threads — be the founder who replies to everything | Giovanni |
| **3:00 PM** | Second Twitter post with a different angle (streak screenshot, leaderboard, etc.) | Giovanni |
| **5:00 PM** | Post to r/digitalnomad with the "accountability" angle | Giovanni |
| **6:00 PM** | Evening ProductHunt push — reply to new comments, thank voters | Giovanni |
| **8:00 PM** | Post-launch retrospective: what worked, what didn't, any fires | Both |
| **10:00 PM** | Final monitoring check, set up alerts for overnight | Kyle |

---

## 3. Distribution Channels — Ready-to-Post Copy

### 3A. ProductHunt

**Tagline:** "The Strava of poop tracking — streaks, squads, and leaderboards for your daily deuce."

**Description:**
> Deuce Diary turns your daily bathroom visits into a social game. Log your deuces with one tap, build streaks with your squad (everyone has to log daily or the streak breaks), climb leaderboards, and get weekly "Throne Reports" analyzing your habits.
>
> We built this because every health tracker takes itself too seriously. Your gut health matters — but tracking it should be fun, not clinical.
>
> **Free:** Log deuces, create your profile
> **Premium ($2.99/mo):** Squads, streaks, leaderboards, reactions, analytics, daily challenges, custom themes
>
> Web app live now. iOS coming soon.

**First Comment (as maker):**
> Hey PH! I'm Giovanni, and yes — I built a social poop tracker. Here's why:
>
> 1. Gut health is the #2 indicator of overall health (pun intended) but nobody tracks it consistently
> 2. The only competitor (Poop Map, 62K reviews) is entertainment-only — no streaks, no accountability, no health insights
> 3. Streaks work. If your squad's 47-day streak is on the line, you WILL remember to log
>
> Would love your feedback. Roast us, we can take it.

---

### 3B. Reddit Posts

**r/InternetIsBeautiful**

*Title:* I built a social poop tracker with streaks, squads, and leaderboards

*Body:*
> I built Deuce Diary — a web app that turns your daily bathroom habits into a social game.
>
> The core mechanic: you join a squad with friends, and everyone has to log daily to keep the streak alive. If one person misses a day, the streak resets for everyone. It's like Wordle streaks meets fitness accountability, but for your gut.
>
> Features: one-tap logging, group streaks, leaderboards, emoji reactions, weekly "Throne Reports" with your stats, daily challenges, and 4 themes (including a "Midnight" dark mode for those 2 AM sessions).
>
> Link: [deucediary.app]
>
> Fair warning: this will absolutely ruin your group chat in the best way possible.

---

**r/SideProject**

*Title:* Just launched Deuce Diary — a social poop tracker with streaks and squads. 3 months of building, here's what I learned.

*Body:*
> Stack: React + Express + PostgreSQL on Railway. Auth via Clerk. Payments via RevenueCat.
>
> The idea started as a joke in a group chat. Then I realized: (1) gut health tracking has zero good social apps, (2) the streak mechanic from Snapchat/Duolingo is insanely sticky, and (3) Poop Map has 62K App Store reviews proving people WILL track their poops if you make it fun.
>
> What I built:
> - One-tap deuce logging with optional location + thoughts
> - Squad streaks (everyone logs daily or streak resets)
> - Leaderboards within squads
> - Weekly "Throne Reports" (your peak day, most active squad, longest streak)
> - Referral system, daily challenges, emoji reactions
> - Premium tier at $2.99/mo
>
> Biggest lesson: the streak mechanic is the entire product. Everything else is a feature. The streak is the retention engine.
>
> Try it: [deucediary.app]

---

**r/digitalnomad**

*Title:* Built an app to keep my friend group accountable across 6 time zones — it tracks our poops

*Body:*
> I know the title sounds insane. Let me explain.
>
> My friends and I are scattered across the world. We wanted a daily check-in that was low-effort but high-accountability. Somebody joked "what if we just tracked our poops" and... we built it.
>
> Deuce Diary has group streaks — every member has to log at least once a day or the streak resets for everyone. We're on day 34 right now and the Slack messages when someone hasn't logged by 10 PM their time are absolutely unhinged.
>
> It's weirdly the best "are you alive" check-in tool for distributed friend groups. Also has leaderboards if you're competitive about literally everything like we are.
>
> [deucediary.app]

---

**r/LifeProTips** (if they allow app mentions — check rules first)

*Title:* LPT: Track your bowel habits for a week. Changes in frequency are one of the earliest warning signs for dozens of health conditions.

*Body:*
> Gastroenterologists consistently say that bowel habit changes are among the first symptoms patients report for conditions ranging from IBS to food intolerances to more serious issues. But almost nobody tracks consistently because it feels weird and clinical.
>
> I built a free tool that makes it easy: [deucediary.app]. One tap to log, and if you want accountability, you can join a group where everyone has to log daily to keep a streak alive.
>
> Even if you don't use my app — just track it in Notes for a week. You'll learn something about your body.

---

### 3C. Twitter/X

**Launch tweet:**
> Introducing Deuce Diary — the Strava of poop tracking. 💩
>
> → Squad streaks (everyone logs daily or it resets)
> → Leaderboards
> → Weekly "Throne Reports"
> → Daily challenges
>
> Your gut health matters. Tracking it should be fun.
>
> Try it free: [deucediary.app]

**Thread follow-up (tweet 2):**
> Why build this?
>
> Poop Map has 62K App Store reviews. People WILL track their poops.
>
> But no app combines health tracking + social accountability + streak gamification.
>
> The streak is the product. If your squad's 47-day streak is on the line, you WILL remember to log.

**Thread follow-up (tweet 3):**
> Built with:
> - React + Express + PostgreSQL
> - Railway for hosting
> - RevenueCat for subscriptions
> - Clerk for auth
>
> Web app live now. iOS coming soon.
>
> $2.99/mo for premium (squads, streaks, leaderboards, analytics).
> Free tier lets you log and track.

---

### 3D. TikTok

**Video 1 — "I built an app that ruined my group chat"**

*Script (15-30 seconds):*
> "So I built an app where you and your friends track your poops together. [show app] You join a squad, and everyone has to log every day or the group streak resets. [show streak counter] My friends and I are on day 34 and the panic texts when someone hasn't logged by 10 PM are insane. [show mock texts] It's called Deuce Diary and it's free. Link in bio."

**Video 2 — "Your gut health in 10 seconds a day"**

*Script:*
> "Doctors say bowel changes are the #1 early warning sign for gut issues but nobody tracks it. So I made an app that takes 10 seconds. One tap, done. But then I added streaks. And squads. And leaderboards. And now my friends and I are competing over who poops the most and honestly? Our gut health has never been more monitored. Deuce Diary, link in bio."

---

### 3E. App Store (for iOS launch, prep copy now)

**App Name:** Deuce Diary — Poop Tracker

**Subtitle:** Streaks, Squads & Gut Health

**Keywords:** poop tracker, bowel health, gut health, poop log, bathroom tracker, streak, social health, group challenge, leaderboard, toilet diary

**Description:**
> Track your daily deuces, build streaks with friends, and climb the leaderboard. Deuce Diary makes gut health tracking fun, social, and actually sticky.
>
> ONE-TAP LOGGING
> Log your deuce in under 5 seconds. Add location, thoughts, or keep it quick.
>
> SQUAD STREAKS
> Join a squad and log daily to keep the streak alive. If anyone misses a day, it resets for everyone. Pure accountability.
>
> LEADERBOARDS
> See who's #1 in your squad. Compete with friends. Yes, it's exactly as ridiculous as it sounds.
>
> WEEKLY THRONE REPORTS
> Get your stats every week: peak day, most active squad, longest streak, and more.
>
> DAILY CHALLENGES
> New challenge every day: log before 8 AM, log at work, hit a 3-day streak, and more.
>
> PREMIUM ($2.99/mo, $19.99/yr, or $49.99 lifetime)
> Unlock squads, streaks, leaderboards, reactions, analytics, custom themes, and streak insurance.

---

## 4. First 7 Days Post-Launch

### Day 1 (Launch Day)
- **Monitor:** Signups per hour, error rate in Sentry, Railway CPU/memory, ProductHunt rank
- **Respond:** Every ProductHunt comment within 15 min. Every Reddit comment within 30 min. Every tweet within 1 hour.
- **Fix:** Any P0 bugs immediately. If signups are flowing, nothing else matters — keep the servers up.

### Day 2
- **Analyze:** Where did signups come from? (Add UTM params to all links: `?utm_source=producthunt`, `?utm_source=reddit_iib`, etc.)
- **Double down:** If one Reddit post popped off, post to 1-2 more related subreddits
- **Respond:** Continue replying to every comment everywhere
- **Ship:** Any quick wins from Day 1 feedback (UI confusion, missing features people expected)

### Day 3
- **Retention check:** Of Day 1 signups, how many logged a second deuce? How many created/joined a squad?
- **Push referrals:** Post in-app prompt: "Invite a friend, keep the streak alive" — surface the referral code prominently
- **Content:** Post a "Day 3 launch update" tweet thread with real numbers (signups, deuces logged, longest streak)

### Day 4
- **Conversion check:** How many free users hit a premium gate? What % converted? Which gate converts best?
- **Iterate:** If nobody's converting, consider extending the free tier temporarily or adding a 7-day free trial
- **Community:** Start a Discord or group chat for early adopters — they're your feedback army

### Day 5
- **Streak retention:** First cohort is 5 days in. What % of Day 1 squads still have an active streak? This is the #1 metric.
- **Outreach:** DM 5-10 tech/health bloggers with a personalized pitch + link
- **Content:** Second TikTok video (reaction to launch, real user stats)

### Day 6
- **Review mining:** Ask the most active users (by deuce count) to leave a review when iOS launches, or write a testimonial now
- **Feature priority:** Rank feature requests from the week by frequency. Pick the top 1-2 for next week's sprint.
- **Growth experiment:** Test one new distribution channel (Hacker News "Show HN", Instagram Reels, a podcast pitch)

### Day 7
- **Weekly retro:** Write a launch retrospective with real numbers
  - Total signups
  - DAU (daily active users)
  - Deuces logged
  - Squads created
  - Streaks active (3+ days)
  - Premium conversions
  - Revenue
  - Top referral channel
  - NPS or qualitative sentiment
- **Plan Week 2:** Based on what worked, double down. Kill what didn't.

---

## 5. Growth Levers

### 5A. Streak Mechanics (Primary Retention Engine)
**Why it works:** Social pressure + loss aversion. If your squad is on Day 30 and you miss, YOU broke it. This is Snapchat Streaks for adults.

**Optimize:**
- Send push/email at 8 PM if user hasn't logged today and squad has 3+ day streak (cron already built)
- Show "streak at risk" badge prominently in UI
- Celebrate milestones: 7, 30, 50, 100 days — shareable cards
- Streak insurance (premium) as safety net — already built

### 5B. Referral System (Built-in Virality)
**Current state:** Each user gets an 8-char referral code. Referee enters code to link accounts.

**Optimize:**
- Reward: Give both referrer and referee 7 days of free premium
- Surface referral code on the "Invite to Squad" flow (natural moment)
- Add "Share your referral code" button that copies a pre-written message:
  > "Join me on Deuce Diary — track your poops with friends, keep the streak alive. Use my code [CODE] for a free week of premium: deucediary.app"
- Leaderboard for top referrers (social proof + competition)
- Target: 20% of new users come from referrals by Month 2

### 5C. Squad Invites (Network Effect)
**Why it works:** Every new squad of 4 people = 4 users who MUST open the app daily or lose the streak.

**Optimize:**
- Shareable invite links already built (7-day expiry)
- Add "Create a squad" as step 2 of onboarding (right after signup)
- Show invite preview page to non-users (already built) — this is a landing page for every squad
- Target: Average squad size of 4+ members

### 5D. Content / Shareability
**"Throne Reports" as shareable content:**
- Weekly report already built (peak day, longest streak, funniest entry, etc.)
- Add "Share my Throne Report" → generates an image card for Instagram/Twitter
- This is organic content creation every single week from every active user

**Daily Challenges as engagement hooks:**
- 5 rotating challenges already built
- Post daily challenge on social media: "Today's challenge: Log before 8 AM. Can you do it?"

### 5E. SEO / Content Marketing (Medium-term)
- Blog posts: "Why tracking your bowel habits matters" (health angle)
- Blog posts: "How Deuce Diary's streak mechanic drives retention" (indie hacker angle)
- Target keywords: "poop tracker app", "bowel habit tracker", "gut health tracker", "poop diary"

---

## 6. KPIs to Track

### North Star Metric
**Daily Active Deuces (DAD):** Total deuces logged per day across all users. This captures both user count and engagement depth.

### Primary KPIs (check daily)

| Metric | Target (Week 1) | Target (Month 1) | How to Measure |
|--------|-----------------|-------------------|----------------|
| **New signups** | 500 total | 2,000 total | `SELECT COUNT(*) FROM users WHERE created_at > launch_date` |
| **DAU** | 100 | 500 | `SELECT COUNT(DISTINCT user_id) FROM deuces WHERE date = today` |
| **Deuces per DAU** | 1.2 | 1.5 | Total deuces / DAU |
| **Streak retention (7-day)** | 40% of squads | 50% of squads | Squads with 7+ day streak / total squads created in first 3 days |
| **Premium conversion** | 5% | 8% | Premium users / total users |
| **Referral rate** | 10% | 20% | Users with a referrer / total users |
| **Revenue** | $150 | $1,000 | RevenueCat dashboard |

### Secondary KPIs (check weekly)

| Metric | What It Tells You |
|--------|-------------------|
| **Squads created per day** | Is the social loop working? |
| **Avg squad size** | Are people inviting friends? |
| **Streak insurance usage** | Are people invested enough to protect streaks? |
| **Challenge completion rate** | Are daily challenges driving engagement? |
| **Reaction count per deuce** | Is the social layer sticky? |
| **Weekly Throne Report open rate** | Are people checking their stats? |
| **Churn rate (premium)** | Are people staying past Month 1? |
| **Error rate (Sentry)** | Is the app stable? |

### Admin Stats Endpoint
Already built at `GET /api/admin/stats` — returns: total users, premium users, DAU, logs today, logs all-time, active groups, avg streak. Hit this daily.

---

## 7. Contingency Plans

### 7A. Railway Goes Down
**Symptoms:** 5xx errors, health check fails, users report "can't load"

**Immediate (0-15 min):**
1. Check Railway status page: https://status.railway.app
2. Check Railway dashboard for deployment status
3. If deploy is crashed: redeploy last known good commit (`git log` → find last stable SHA → `railway up`)
4. Post on Twitter: "We're aware of issues and working on a fix. Your streaks are safe — we'll extend them."

**If Railway is fully down (15-60 min):**
1. Render.yaml already exists in the repo — deploy to Render as hot standby
2. Update DNS to point to Render instance
3. This requires DB access — Railway PostgreSQL should still be reachable even if compute is down

**Prevention:**
- Set up Railway deployment alerts (email + Slack)
- Set up UptimeRobot or similar for `GET /api/health` every 5 min
- Keep Render.yaml updated as a tested backup

### 7B. App Store Rejects iOS Build
**Common rejection reasons and responses:**

| Reason | Fix |
|--------|-----|
| "App is a web wrapper" | We're building native with Expo/React Native — not a web view. If still rejected, add native-only features (haptics, widgets). |
| "Inappropriate content" | Poop is bodily function tracking, same category as period trackers. Reference Apple's own Health app which tracks bowel movements. Emphasize health utility in App Review notes. |
| "Insufficient features for price" | Ensure free tier has genuine value (logging + profile). Document all premium features in review notes. |
| "Missing privacy nutrition labels" | Pre-fill all privacy labels before submission. We collect: name, usage data, health data (bowel tracking). |

**Backup:** If iOS review takes too long, launch TestFlight immediately (less scrutiny) and get 10K beta testers while full review is pending.

### 7C. Virality Hits (Good Problem)
**Triggers:** Reddit post hits front page, TikTok goes viral, ProductHunt #1

**If signups spike 10x expected:**

**Infrastructure (Kyle owns):**
1. Railway auto-scaling: increase instance count in Railway dashboard
2. Database: Current pool max is 20 connections — increase to 50, or switch to PgBouncer
3. Monitor with `GET /api/admin/stats` — if DAU spikes, watch DB connection count
4. If Railway maxes out: spin up second Railway service behind a load balancer, or migrate to Railway Pro

**Product (Giovanni owns):**
1. Onboarding must be flawless — zero friction from signup to first deuce
2. "Create a squad" CTA must be prominent — convert solo users to squad users immediately
3. Have a "we're trending!" banner ready to capitalize on momentum
4. Respond to EVERY comment on the viral post — this is a 24-hour job

**Community:**
1. Spin up a Discord immediately if we don't have one
2. Pin a "Welcome new users" post with quick-start guide
3. Recruit power users as community moderators

**Cost:**
- Railway compute: ~$5/mo at current scale, could spike to $50-100/mo at 10K DAU
- Database: PostgreSQL on Railway included, but may need upgrade at scale
- Budget $500 for first viral spike infrastructure costs

### 7D. Nobody Signs Up
**If Day 1 signups < 50:**

1. **Don't panic.** Most launches are quiet. The product is good — distribution needs iteration.
2. **Analyze:** Which channels got clicks but no signups? (UTM params.) Where's the drop-off?
3. **Pivot distribution:** Go personal. DM 50 friends individually. Text your group chats. The app is literally built for friend groups — sell it 1:1.
4. **Lower the bar:** If premium gates are scaring people, temporarily make squads and streaks free for 30 days. Get users hooked on the streak, THEN gate it.
5. **Find your niche:** Maybe the mass market isn't Day 1. Find one community (CrossFit group, college dorm, remote team) and get 20 of them using it religiously. Then let them spread it.

### 7E. Premium Conversion Is Too Low (< 2%)
1. **Add a 7-day free trial** — let people feel the streak before asking them to pay
2. **Reduce price:** Test $0.99/mo to find the impulse-buy threshold
3. **Move the gate:** If squads being premium is the barrier, make squads free and gate analytics/reactions/themes instead. The squad is the retention engine — don't gate retention.
4. **Referral incentive:** "Refer 3 friends, get premium free for a month"

### 7F. Security Incident / Data Leak
1. Take the app offline immediately
2. Assess what was exposed (user data is: usernames, profile pics, deuce logs, group memberships)
3. No passwords stored (Clerk handles auth)
4. Post transparent disclosure within 24 hours
5. Rotate all API keys and secrets in Railway env vars
6. If user PII was exposed: email all affected users (will need email collection via Clerk)

---

## 8. Launch Budget

| Item | Cost | Notes |
|------|------|-------|
| Railway hosting | $5-20/mo | Current usage minimal, scales with traffic |
| Custom domain | $12/yr | Via Namecheap or Cloudflare |
| Apple Developer Account | $99/yr | Needed for iOS, not for web launch |
| ProductHunt Ship page | Free | |
| Reddit posts | Free | |
| TikTok content | Free | Screen recordings |
| Sentry | Free tier | 5K errors/mo |
| RevenueCat | Free < $2.5K MRR | |
| Contingency (viral spike) | $500 reserved | Infrastructure scaling |
| **Total for web launch** | **~$50** | Excluding iOS costs |

---

## 9. Success Criteria

### Web Launch = Success If (within 30 days):
- [ ] 1,000+ signups
- [ ] 200+ DAU
- [ ] 50+ active squads with 3+ day streaks
- [ ] 5%+ premium conversion rate
- [ ] $500+ MRR
- [ ] Zero P0 outages lasting > 30 min

### iOS Launch = Success If (within 30 days of App Store approval):
- [ ] 5,000+ installs
- [ ] 4.0+ star rating
- [ ] 500+ DAU
- [ ] Referral rate > 15%

---

## 10. Post-Launch Roadmap (Weeks 2-8)

| Week | Focus | Deliverable |
|------|-------|-------------|
| 2 | Fix top 3 user complaints from Week 1 | Patch release |
| 3 | iOS TestFlight build | EAS Build → TestFlight link |
| 4 | iOS App Store submission | Full submission with screenshots, copy, privacy labels |
| 5 | Share-a-Streak social cards | Image generator for streaks + throne reports |
| 6 | Email onboarding sequence (via Clerk) | 3-email drip: welcome → create squad → go premium |
| 7 | V2 features based on user feedback | TBD by data |
| 8 | Growth experiment: influencer seeding | Send to 10 health/comedy creators |

---

## Appendix: Quick Reference

**Production URL:** https://deuce-diary-web-production.up.railway.app
**Admin stats:** `GET /api/admin/stats` (requires X-Admin-Key header)
**Health check:** `GET /api/health`
**Streak cron:** Runs at 12:00 and 20:00 UTC
**DB migrations:** Auto-run on deploy via `dist/migrate.js`
**Render backup:** `render.yaml` in repo root
**RevenueCat webhook:** `POST /api/webhooks/revenuecat`
