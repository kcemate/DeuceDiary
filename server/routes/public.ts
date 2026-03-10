import { Router } from "express";
import { storage } from "../storage";
import { getTitle, escapeHtml, userIdParamSchema, groupIdParamSchema, usernameParamSchema } from "./helpers";

function getStreakTagline(streak: number): string {
  if (streak === 0) return "Ready to start the streak";
  if (streak === 1) return "Day one. The throne awaits.";
  if (streak < 3) return "Just getting warmed up";
  if (streak < 7) return "The habit is forming";
  if (streak < 14) return "Week one locked in";
  if (streak < 30) return "Officially unstoppable";
  if (streak < 60) return "Iron constitution. Steel resolve.";
  if (streak < 90) return "A force of bathroom nature";
  if (streak < 180) return "Three months of total dominance";
  if (streak < 365) return "Half a year on the throne";
  return "Absolute throne legend";
}

function getThroneRankTitle(deuceCount: number): string {
  if (deuceCount >= 1000) return "\u26A1 Deuce Deity";
  if (deuceCount >= 500) return "\uD83D\uDC51 Throne Master";
  if (deuceCount >= 250) return "\uD83C\uDFC6 Throne Legend";
  if (deuceCount >= 150) return "\uD83C\uDFC5 Porcelain Pro";
  if (deuceCount >= 100) return "\u2694\uFE0F Centurion";
  if (deuceCount >= 75) return "\uD83D\uDCDC Throne Philosopher";
  if (deuceCount >= 50) return "\uD83E\uDD4B Brown Belt";
  if (deuceCount >= 30) return "\uD83E\uDD14 Throne Thinker";
  if (deuceCount >= 15) return "\uD83D\uDCCB Regular";
  if (deuceCount >= 5) return "\uD83D\uDD30 Seat Warmer";
  return "\uD83E\uDE91 Throne Rookie";
}

function getStreakTierLabel(streak: number): string {
  if (streak >= 365) return "\uD83D\uDC8E Diamond Streak";
  if (streak >= 90) return "\uD83E\uDD47 Gold Streak";
  if (streak >= 30) return "\uD83E\uDD48 Silver Streak";
  if (streak >= 7) return "\uD83E\uDD49 Bronze Streak";
  return "\uD83D\uDD25 Starter Streak";
}

export function createPublicRouter(): Router {
  const router = Router();

  // --- Share Card Data (public) ---
  router.get('/api/share/streak/:userId', async (req, res) => {
    const params = userIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ message: 'Invalid user ID' });
    try {
      const { userId } = params.data;
      const data = await storage.getShareCardData(userId);
      res.json(data);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      console.error('Error fetching share card data:', error);
      res.status(500).json({ message: 'Failed to fetch share card data' });
    }
  });

  // --- OG Image / Share Card Preview (public) ---
  router.get('/api/og/streak/:userId', async (req, res) => {
    const params = userIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ message: 'Invalid user ID' });
    try {
      const { userId } = params.data;
      const data = await storage.getShareCardData(userId);

      const displayName = escapeHtml(data.username || 'Anonymous');
      const memberSince = data.memberSince
        ? new Date(data.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';
      const tagline = getStreakTagline(data.currentStreak);
      const rankTitle = getThroneRankTitle(data.totalLogs);
      const tierLabel = getStreakTierLabel(data.currentStreak);

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} on Deuce Diary</title>
  <meta property="og:title" content="${displayName} is on a ${data.currentStreak}-day streak \uD83D\uDD25" />
  <meta property="og:description" content="${escapeHtml(tagline)} \u00B7 ${data.totalLogs} logs \u00B7 ${data.squadCount} squad${data.squadCount !== 1 ? 's' : ''}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${displayName} is on a ${data.currentStreak}-day streak \uD83D\uDD25" />
  <meta name="twitter:description" content="${escapeHtml(tagline)} \u00B7 ${data.totalLogs} logs on Deuce Diary" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: hsl(38, 40%, 96%);
      color: hsl(25, 30%, 8%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: linear-gradient(160deg, hsl(38, 38%, 96%) 0%, hsl(38, 28%, 91%) 100%);
      border: 1.5px solid hsl(45, 55%, 72%);
      border-radius: 24px;
      overflow: hidden;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 2px 16px hsl(45 60% 60% / 0.12);
    }
    .accent-bar {
      height: 6px;
      background: linear-gradient(90deg, hsl(45,88%,48%) 0%, hsl(38,90%,58%) 100%);
    }
    .card-inner { padding: 40px 36px; }
    .tier-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: hsl(45, 88%, 48%);
      color: hsl(25, 30%, 8%);
      border-radius: 999px;
      padding: 4px 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 16px;
    }
    .flame { font-size: 48px; line-height: 1; }
    .streak {
      font-size: 80px;
      font-weight: 900;
      color: hsl(45, 88%, 48%);
      line-height: 1;
      margin: 8px 0 4px;
      font-variant-numeric: tabular-nums;
    }
    .streak-label {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: hsl(25, 12%, 42%);
      margin-bottom: 8px;
    }
    .tagline {
      font-size: 13px;
      font-style: italic;
      color: hsl(25, 30%, 38%);
      margin-bottom: 18px;
    }
    .username {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 2px;
    }
    .rank-title {
      font-size: 13px;
      font-weight: 600;
      color: hsl(25, 12%, 42%);
      margin-bottom: 18px;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 0;
      background: hsl(38, 25%, 88%);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .stat {
      flex: 1;
      padding: 10px 8px;
      text-align: center;
      position: relative;
    }
    .stat + .stat::before {
      content: '';
      position: absolute;
      left: 0; top: 20%; bottom: 20%;
      width: 1px;
      background: hsl(38, 18%, 80%);
    }
    .stat-emoji { font-size: 14px; line-height: 1; margin-bottom: 2px; }
    .stat-value {
      font-size: 18px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
    }
    .stat-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: hsl(25, 12%, 42%);
      margin-top: 1px;
    }
    .divider { border: none; border-top: 1px solid hsl(38, 18%, 84%); margin: 0 0 12px; }
    .brand-name { font-size: 13px; font-weight: 700; color: hsl(25, 30%, 28%); }
    .brand-tagline { font-size: 10px; color: hsl(25, 12%, 52%); margin-top: 2px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="accent-bar"></div>
    <div class="card-inner">
      <div><span class="tier-badge">${tierLabel}</span></div>
      <div class="flame">\uD83D\uDD25</div>
      <div class="streak">${data.currentStreak}</div>
      <div class="streak-label">Day Streak</div>
      <div class="tagline">${escapeHtml(tagline)}</div>
      <div class="username">${displayName}</div>
      <div class="rank-title">${escapeHtml(rankTitle)}</div>
      <div class="stats">
        <div class="stat">
          <div class="stat-emoji">\uD83D\uDCA9</div>
          <div class="stat-value">${data.totalLogs}</div>
          <div class="stat-label">Logs</div>
        </div>
        <div class="stat">
          <div class="stat-emoji">\uD83C\uDFC6</div>
          <div class="stat-value">${data.longestStreak}</div>
          <div class="stat-label">Best Streak</div>
        </div>
        <div class="stat">
          <div class="stat-emoji">\uD83D\uDC65</div>
          <div class="stat-value">${data.squadCount}</div>
          <div class="stat-label">Squads</div>
        </div>
      </div>
      <hr class="divider" />
      <div class="brand-name">\uD83D\uDEBD Deuce Diary</div>
      <div class="brand-tagline">Drop a log. Leave a mark.${memberSince ? ` \u00B7 Member since ${memberSince}` : ''}</div>
    </div>
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      console.error('Error rendering OG share card:', error);
      res.status(500).json({ message: 'Failed to render share card' });
    }
  });

  // --- Group Weekly Throne Report Data (public, shareable) ---
  router.get('/api/share/group-report/:groupId', async (req, res) => {
    const params = groupIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ message: 'Invalid group ID' });
    try {
      const { groupId } = params.data;
      const report = await storage.getGroupWeeklyReport(groupId);
      res.json(report);
    } catch (error) {
      if (error instanceof Error && error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error fetching shareable group report:", error);
      res.status(500).json({ message: "Failed to fetch group report" });
    }
  });

  // --- Group Weekly Throne Report OG Card (public, shareable HTML) ---
  router.get('/api/og/group-report/:groupId', async (req, res) => {
    const params = groupIdParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ message: 'Invalid group ID' });
    try {
      const { groupId } = params.data;
      const report = await storage.getGroupWeeklyReport(groupId);

      const weekRange = formatWeekRange(report.weekOf, report.weekEnding);
      const mvpName = report.mvp?.username || 'Nobody';
      const mvpCount = report.mvp?.deuceCount ?? 0;
      const funniestThought = report.funnyStats.funniestEntry
        ? escapeHtml(report.funnyStats.funniestEntry.thought).slice(0, 60)
        : null;

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(report.groupName)} - Weekly Throne Report</title>
  <meta property="og:title" content="${escapeHtml(report.groupName)} - Weekly Throne Report" />
  <meta property="og:description" content="${report.groupStats.totalDeucesThisWeek} deuces \u00B7 ${report.groupStats.currentStreak}-day streak \u00B7 MVP: ${escapeHtml(mvpName)} (${mvpCount})" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(report.groupName)} - Weekly Throne Report" />
  <meta name="twitter:description" content="${report.groupStats.totalDeucesThisWeek} deuces this week \u00B7 ${report.members.length} members" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: hsl(38, 40%, 96%);
      color: hsl(25, 30%, 8%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: hsl(38, 30%, 94%);
      border: 1px solid hsl(38, 18%, 83%);
      border-radius: 24px;
      padding: 32px 28px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .emoji { font-size: 40px; line-height: 1; }
    .title { font-size: 20px; font-weight: 900; margin: 8px 0 2px; }
    .subtitle { font-size: 13px; color: hsl(25, 12%, 42%); margin-bottom: 20px; }
    .stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 20px; }
    .stat-value { font-size: 24px; font-weight: 900; font-variant-numeric: tabular-nums; }
    .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: hsl(25, 12%, 42%); }
    .mvp { background: hsl(45, 80%, 92%); border-radius: 12px; padding: 12px; margin-bottom: 16px; }
    .mvp-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: hsl(25, 12%, 42%); }
    .mvp-name { font-size: 16px; font-weight: 800; margin-top: 4px; }
    .thought { font-style: italic; font-size: 13px; color: hsl(25, 12%, 42%); margin-bottom: 16px; }
    .brand { font-size: 11px; color: hsl(25, 12%, 42%); margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="emoji">\uD83D\uDEBD</div>
    <div class="title">${escapeHtml(report.groupName)}</div>
    <div class="subtitle">Weekly Throne Report \u00B7 ${escapeHtml(weekRange)}</div>
    <div class="stats">
      <div>
        <div class="stat-value">${report.groupStats.totalDeucesThisWeek}</div>
        <div class="stat-label">Deuces</div>
      </div>
      <div>
        <div class="stat-value">${report.groupStats.currentStreak}</div>
        <div class="stat-label">Day Streak</div>
      </div>
      <div>
        <div class="stat-value">${report.members.length}</div>
        <div class="stat-label">Members</div>
      </div>
    </div>
    <div class="mvp">
      <div class="mvp-label">\uD83C\uDFC6 MVP of the Week</div>
      <div class="mvp-name">${escapeHtml(mvpName)} \u00B7 ${mvpCount} deuces</div>
    </div>
    ${funniestThought ? `<div class="thought">"${funniestThought}"</div>` : ''}
    <div class="brand">Deuce Diary \u00B7 Drop a thought. Leave a mark.</div>
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error) {
      if (error instanceof Error && error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error rendering group report OG card:", error);
      res.status(500).json({ message: "Failed to render group report card" });
    }
  });

  // --- Legacy Wall (public) ---
  router.get('/api/users/:username/legacy', async (req, res) => {
    const params = usernameParamSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ message: 'Invalid username' });
    try {
      const { username } = params.data;
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const totalLogs = user.deuceCount ?? 0;
      const longestStreak = await storage.getUserLongestStreak(user.id);
      const bestDay = await storage.getUserBestDay(user.id);

      res.json({
        totalLogs,
        longestStreak,
        bestDay: bestDay ?? null,
        memberSince: user.createdAt,
        title: getTitle(totalLogs),
      });
    } catch (error) {
      console.error('Error fetching legacy wall:', error);
      res.status(500).json({ message: 'Failed to fetch legacy wall' });
    }
  });

  return router;
}

/** Format a week range like "Mar 3 – Mar 9, 2025" from YYYY-MM-DD strings */
function formatWeekRange(weekOf: string, weekEnding: string): string {
  try {
    const start = new Date(weekOf + 'T00:00:00Z');
    const end = new Date(weekEnding + 'T00:00:00Z');
    const fmtOpts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', timeZone: 'UTC' };
    const year = end.getUTCFullYear();
    return `${start.toLocaleDateString('en-US', fmtOpts)} – ${end.toLocaleDateString('en-US', { ...fmtOpts, year: 'numeric' })}`;
  } catch {
    return `${weekOf} – ${weekEnding}`;
  }
}
