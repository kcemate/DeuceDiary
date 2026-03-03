# Deuce Diary — Launch Playbook

**Last updated:** 2026-03-03
**Owner:** Giovanni (CEO)
**Engineer:** Jordan (Backend)
**Launch target:** Web-first, iOS to follow

---

## 0. Current State of Play

**What's live:** Full-featured web app at https://deuce-diary-web-production.up.railway.app
- Deuce logging, group streaks, squads, leaderboards, reactions, analytics, weekly throne reports, daily challenges, referral system, real-time WebSocket feed, 4 themes, premium subscription via RevenueCat, push notifications (Expo), Clerk auth, Sentry error tracking, rate limiting, Zod validation, Helmet security headers

**What's blocked on Kyle:**
- [ ] Clerk API keys added to Railway env vars (CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET)
- [ ] RevenueCat product configuration ($2.99/mo, $19.99/yr, $49.99 lifetime)
- [ ] Apple Developer account enrollment ($99/yr)

**What's ready to ship:**
- [ ] Auth system (Clerk integration built, needs keys)
- [ ] Premium gating (middleware built, needs RevenueCat products)
- [ ] Push notifications (Expo integration built, needs device tokens from iOS app)
- [ ] Error tracking (Sentry integration built, needs DSN in env)
- [ ] All API endpoints tested (13 test suites passing)

---

## 1. Pre-Launch Checklist

### Critical Path (MUST complete before launch)

| # | Task | Owner | Status | Notes |
|---|------|-------|--------|-------|
| 1 | **Clerk auth keys in Railway** | Kyle | BLOCKED | Without this, production runs username-only dev auth. Need CLERK_SECRET_KEY + CLERK_WEBHOOK_SECRET in Railway env vars. |
| 2 | **RevenueCat product setup** | Kyle | NOT STARTED | Create 3 products: monthly ($2.99), annual ($19.99), lifetime ($49.99). Set webhook URL to `https://<domain>/api/webhooks/revenuecat`. Test end-to-end. |
| 3 | **Custom domain** | Giovanni | NOT STARTED | `app.deucediary.com` or `deucediary.app`. Railway supports custom domains. DNS A/CNAME records needed. Non-negotiable for launch credibility. |
| 4 | **PWA install prompt** | Dev | NOT STARTED | Web-first launch needs "Add to Home Screen" banner. manifest.json + service worker for offline shell. |
| 5 | **Privacy Policy + Terms at public URLs** | Giovanni | PARTIAL | In-app pages exist but need standalone URLs for App Store / ProductHunt compliance. |
| 6 | **Remove fake social proof** | Giovanni | NOT STARTED | Landing page claims "10K+ deuces" and "2.5K+ streakers." Replace with honest copy ("Join the movement") or earn real numbers first. Reddit will roast fake stats. |
| 7 | **Sentry DSN in production** | Dev | PARTIAL | Code integration exists. Verify SENTRY_DSN is set in Railway env. |
| 8 | **Load test Railway deployment** | Dev | NOT STARTED | Simulate 500 concurrent users. DB pool max=20, idle=30s. Need to know ceiling before Reddit spike. |
| 9 | **End-to-end premium flow test** | Dev | NOT STARTED | Signup → upgrade → RevenueCat webhook → premium features unlock → expiration. |
| 10 | **Marketing assets** | Giovanni | NOT STARTED | OG image, ProductHunt screenshots, Reddit/Twitter promo graphics. |

### Nice-to-Have (if time allows)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 11 | Email capture / waitlist on landing page | Dev | NOT STARTED |
| 12 | "Share my streak" social card generator | Dev | NOT STARTED |
| 13 | PostHog or Mixpanel free tier analytics | Dev | NOT STARTED |
| 14 | 3-5 seed testimonials from beta testers | Giovanni | NOT STARTED |
| 15 | 30-second demo video (screen recording) | Giovanni | NOT STARTED |

---

## 2. Launch Day Timeline

**Target: Tuesday or Wednesday (best engagement days for Reddit + ProductHunt)**

### L-7 (One Week Before)
- [ ] All Critical Path items complete
- [ ] Soft launch to 20 friends/family — collect feedback, fix bugs
- [ ] Prepare all launch copy in a shared doc, get team review
- [ ] Schedule ProductHunt submission (requires hunter or self-submit)
- [ ] Pre-write all Reddit posts, tweets, TikTok script
- [ ] Brief supporters: "Upvote on ProductHunt at exactly 12:01 AM PT"

### L-1 (Day Before)
- [ ] Final deploy to Railway, run health checks (`GET /api/health`)
- [ ] Verify custom domain SSL is green
- [ ] Test every premium feature one more time
- [ ] Pre-load ProductHunt submission (schedule 12:01 AM PT)
- [ ] Giovanni + Kyle both logged in and monitoring
- [ ] Verify Sentry is receiving test errors
- [ ] Confirm `GET /api/admin/stats` returns valid data

### L-Day Hour-by-Hour (all times PT)

| Time | Action | Owner |
|------|--------|-------|
| **12:01 AM** | ProductHunt goes live | Giovanni |
| **12:05 AM** | DM 10 supporters: "We're live on PH — upvote would mean the world" | Giovanni |
| **6:00 AM** | Post to Twitter/X (main + personal accounts) | Giovanni |
| **7:00 AM** | Monitor PH ranking, reply to every comment within 15 min | Giovanni |
| **7:30 AM** | Check `/api/health` + `/api/internal/health/detailed` + Sentry dashboard | Jordan |
| **8:00 AM** | Post to r/InternetIsBeautiful | Giovanni |
| **9:00 AM** | Post to r/SideProject | Giovanni |
| **10:00 AM** | Check Railway metrics: CPU, memory, DB connections, error rate | Jordan |
| **11:00 AM** | Post to r/QuantifiedSelf and r/LifeProTips | Giovanni |
| **12:00 PM** | Midday check-in: signups, crashes, PH rank | Both |
| **1:00 PM** | Post first TikTok (screen recording + voiceover) | Giovanni |
| **2:00 PM** | Engage in all Reddit threads — founder replies to everything | Giovanni |
| **3:00 PM** | Second Twitter post (different angle: streak screenshot, leaderboard) | Giovanni |
| **4:00 PM** | Check error logs: `GET /api/internal/errors` for any patterns | Jordan |
| **5:00 PM** | Post to r/digitalnomad with accountability angle | Giovanni |
| **6:00 PM** | Evening PH push — reply to new comments, thank voters | Giovanni |
| **8:00 PM** | Post-launch retro: what worked, what didn't, any fires | Both |
| **10:00 PM** | Final monitoring check, set up alerts for overnight | Jordan |

---

## 3. Marketing Channels & Messaging

### 3A. ProductHunt

**Tagline:** "The Strava of poop tracking — streaks, squads, and leaderboards for your daily deuce."

**Description:**
> Deuce Diary turns your daily bathroom visits into a social game. Log your deuces with one tap, build streaks with your squad (everyone has to log daily or the streak breaks), climb leaderboards, and get weekly "Throne Reports" analyzing your habits.
>
> We built this because every health tracker takes itself too seriously. Your gut health matters — but tracking it should be fun, not clinical.
>
> **Free:** Log deuces, join up to 3 squads, reactions, leaderboards, streaks
> **Premium ($2.99/mo):** Unlimited squads, analytics, custom themes, streak insurance, daily challenges, squad spy mode, throne broadcasts
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

### 3B. Reddit Posts

**r/InternetIsBeautiful**
- *Title:* I built a social poop tracker with streaks, squads, and leaderboards
- *Angle:* "Look at this cool thing" — focus on the absurdity and fun mechanics
- *UTM:* `?utm_source=reddit_iib`

**r/SideProject**
- *Title:* Just launched Deuce Diary — a social poop tracker. 3 months of building, here's what I learned.
- *Angle:* Tech stack, indie hacker journey, streak as retention engine
- *UTM:* `?utm_source=reddit_sideproject`

**r/digitalnomad**
- *Title:* Built an app to keep my friend group accountable across 6 time zones — it tracks our poops
- *Angle:* Distributed friend group daily check-in
- *UTM:* `?utm_source=reddit_nomad`

**r/QuantifiedSelf**
- *Title:* Tracking bowel habits socially — Deuce Diary with streaks and weekly reports
- *Angle:* Health data tracking, weekly throne reports, pattern analytics
- *UTM:* `?utm_source=reddit_qs`

### 3C. Twitter/X

**Launch tweet thread:**
1. "Introducing Deuce Diary — the Strava of poop tracking. Squad streaks, leaderboards, weekly Throne Reports, daily challenges. Your gut health matters. Tracking it should be fun. Try it free: [link]"
2. "Why build this? Poop Map has 62K App Store reviews. People WILL track their poops. But no app combines health tracking + social accountability + streak gamification."
3. "Built with React + Express + PostgreSQL on Railway. RevenueCat for subs. Clerk for auth. $2.99/mo premium. Web live now, iOS coming soon."

### 3D. Hacker News (Show HN)

**Title:** Show HN: Deuce Diary — Social poop tracking with group streaks
**Post:** Focus on the technical build (Express/React/Postgres), the streak retention mechanic, and the market gap (Poop Map = entertainment-only, no accountability layer).

### 3E. TikTok

**Video 1 — "I built an app that ruined my group chat"** (15-30s screen recording)
**Video 2 — "Your gut health in 10 seconds a day"** (health angle)

---

## 4. Post-Launch Monitoring

### What to Watch (First 72 Hours)

| Signal | Tool | Action Threshold |
|--------|------|-----------------|
| **Error rate** | Sentry + `GET /api/internal/errors` | > 5 errors/hour → investigate immediately |
| **Response time** | Server logs (requests > 500ms logged) | Avg > 1s → check DB queries, pool exhaustion |
| **DB connections** | `GET /api/internal/health/detailed` | > 15 of 20 pool connections → scale pool or add PgBouncer |
| **Memory usage** | `GET /api/internal/health/detailed` | > 80% of container RAM → restart or scale |
| **Signup rate** | `GET /api/admin/stats` | < 10/hour after viral post → check funnel |
| **5xx rate** | Railway dashboard + Morgan logs | Any 5xx → check Sentry for stack trace |
| **WebSocket connections** | Server logs | Rapid disconnect/reconnect loops → check client |
| **Rate limit hits** | Response 429 count | Spike → legitimate traffic or abuse? |

### How to Respond

**P0 — App is down:**
1. Check `GET /api/health` — if DB disconnected, check Railway PostgreSQL
2. Check Railway dashboard for deployment crash
3. Redeploy last known good commit
4. Post on Twitter: "We're aware and fixing. Your streaks are safe."

**P1 — Feature broken but app up:**
1. Check Sentry for error details + stack trace
2. Check `GET /api/internal/errors` for recent patterns
3. Hotfix and deploy within 2 hours
4. Reply to user reports acknowledging the issue

**P2 — Performance degraded:**
1. Check `GET /api/internal/health/detailed` for DB pool stats + memory
2. Identify slow endpoints from response time logs
3. Scale Railway instance or optimize queries
4. Monitor for 30 minutes after fix

### Escalation Path
- **Jordan** monitors: server health, error rate, DB performance, API response times
- **Giovanni** monitors: user signups, ProductHunt rank, Reddit engagement, premium conversions
- **Kyle** escalation: Railway infrastructure, Clerk auth issues, RevenueCat webhook problems

---

## 5. Success Metrics

### North Star Metric
**Daily Active Deuces (DAD):** Total deuces logged per day. Captures both user count and engagement depth.

### Week 1 Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **New signups** | 500 total | `GET /api/admin/stats` → totalUsers |
| **DAU** | 100 | `GET /api/admin/stats` → activeUsersToday |
| **Deuces per DAU** | 1.2 | totalDeucesToday / DAU |
| **Squads created** | 50+ | Admin stats |
| **Streak retention (7-day)** | 40% of squads | Squads with 7+ day streak / total squads |
| **Premium conversion** | 5% | Premium users / total users |
| **Referral rate** | 10% | Users with referrer / total users |
| **Revenue** | $150 | RevenueCat dashboard |
| **Error rate** | < 0.1% | Sentry + error logs |
| **P0 outages** | 0 lasting > 30 min | Monitoring |

### Month 1 Targets

| Metric | Target |
|--------|--------|
| **Total signups** | 2,000 |
| **DAU** | 500 |
| **Active squads (3+ day streak)** | 200 |
| **Premium conversion** | 8% |
| **Referral rate** | 20% |
| **Revenue (MRR)** | $1,000 |
| **App Store rating** (iOS) | 4.0+ |
| **Churn rate (premium)** | < 15% |

### Secondary KPIs (Check Weekly)

| Metric | What It Tells You |
|--------|-------------------|
| Squads created per day | Is the social loop working? |
| Avg squad size | Are people inviting friends? |
| Streak insurance usage | Are people invested enough to protect streaks? |
| Challenge completion rate | Are daily challenges driving engagement? |
| Reaction count per deuce | Is the social layer sticky? |
| Weekly Throne Report opens | Are people checking their stats? |

---

## 6. Contingency Plans

### Railway Goes Down
1. Check Railway status page: https://status.railway.app
2. Check deployment status in Railway dashboard
3. If crashed: redeploy last known good commit
4. If fully down (15+ min): Deploy to Render via existing `render.yaml`
5. Post status update on Twitter

### Virality Hits (Good Problem)
**Infrastructure (Jordan):**
1. Railway: increase instance count in dashboard
2. DB pool: increase from 20 → 50, or add PgBouncer
3. Monitor `GET /api/internal/health/detailed` for connection saturation
4. Budget $500 for spike infrastructure costs

**Product (Giovanni):**
1. Ensure onboarding is zero-friction signup → first deuce → create squad
2. "We're trending!" banner to capitalize on momentum
3. Respond to EVERY comment on viral post (24-hour job)

### Nobody Signs Up (< 50 Day 1)
1. Don't panic — most launches are quiet
2. Analyze UTM params: which channels got clicks but no signups?
3. Go personal: DM 50 friends individually, text group chats
4. Temporarily make squads/streaks free for 30 days to get hook

### Premium Conversion Too Low (< 2%)
1. Add 7-day free trial
2. Test $0.99/mo impulse-buy price
3. Move gate: make squads free, gate analytics/themes instead
4. Referral incentive: "Refer 3 friends, get premium free for a month"

### Security Incident
1. Take app offline immediately
2. Assess exposure (usernames, profile pics, deuce logs, group memberships — no passwords, Clerk handles auth)
3. Rotate all API keys in Railway env vars
4. Transparent disclosure within 24 hours
5. Email affected users via Clerk

---

## 7. Launch Budget

| Item | Cost | Notes |
|------|------|-------|
| Railway hosting | $5-20/mo | Scales with traffic |
| Custom domain | $12/yr | Namecheap or Cloudflare |
| Apple Developer | $99/yr | For iOS, not web launch |
| ProductHunt | Free | |
| Reddit/Twitter/TikTok | Free | Organic posts |
| Sentry | Free tier | 5K errors/mo |
| RevenueCat | Free < $2.5K MRR | |
| Viral spike contingency | $500 reserved | Infrastructure scaling |
| **Total for web launch** | **~$50** | Excluding iOS costs |

---

## 8. Post-Launch Roadmap (Weeks 2-8)

| Week | Focus | Deliverable |
|------|-------|-------------|
| 2 | Fix top 3 user complaints from Week 1 | Patch release |
| 3 | iOS TestFlight build | EAS Build → TestFlight link |
| 4 | iOS App Store submission | Screenshots, copy, privacy labels |
| 5 | Share-a-Streak social cards | Image generator for streaks + throne reports |
| 6 | Email onboarding (Clerk) | 3-email drip: welcome → create squad → go premium |
| 7 | V2 features from user feedback | TBD by data |
| 8 | Influencer seeding | Send to 10 health/comedy creators |

---

## Quick Reference

| Resource | Location |
|----------|----------|
| Production URL | https://deuce-diary-web-production.up.railway.app |
| Health check | `GET /api/health` |
| Detailed health | `GET /api/internal/health/detailed` (X-Internal-Key) |
| Error logs | `GET /api/internal/errors` (X-Internal-Key) |
| Admin stats | `GET /api/admin/stats` (X-Admin-Key) |
| Streak cron | Runs at 12:00 and 20:00 UTC |
| Invite cleanup | Runs hourly |
| Insurance reset | 1st of month, midnight UTC |
| Render backup | `render.yaml` in repo root |
| RevenueCat webhook | `POST /api/webhooks/revenuecat` |
| Clerk webhook | `POST /api/webhooks/clerk` |
