import { Router } from "express";
import { storage } from "../storage";
import { getTitle } from "./helpers";

export function createPublicRouter(): Router {
  const router = Router();

  // --- Share Card Data (public) ---
  router.get('/api/share/streak/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await storage.getShareCardData(userId);
      res.json(data);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      console.error('Error fetching share card data:', error);
      res.status(500).json({ message: 'Failed to fetch share card data' });
    }
  });

  // --- OG Image / Share Card Preview (public) ---
  router.get('/api/og/streak/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const data = await storage.getShareCardData(userId);

      const displayName = data.username || 'Anonymous';
      const memberSince = data.memberSince
        ? new Date(data.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : '';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayName} on Deuce Diary</title>
  <meta property="og:title" content="${displayName} is on a ${data.currentStreak}-day streak \uD83D\uDD25" />
  <meta property="og:description" content="${data.totalLogs} logs \u00B7 ${data.squadCount} squad${data.squadCount !== 1 ? 's' : ''} \u00B7 Longest streak: ${data.longestStreak} days" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${displayName} is on a ${data.currentStreak}-day streak \uD83D\uDD25" />
  <meta name="twitter:description" content="${data.totalLogs} logs \u00B7 ${data.squadCount} squad${data.squadCount !== 1 ? 's' : ''} on Deuce Diary" />
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
      padding: 48px 40px;
      max-width: 400px;
      width: 100%;
      text-align: center;
    }
    .flame { font-size: 48px; line-height: 1; }
    .streak {
      font-size: 72px;
      font-weight: 900;
      color: hsl(45, 88%, 48%);
      line-height: 1;
      margin: 8px 0 4px;
      font-variant-numeric: tabular-nums;
    }
    .streak-label {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: hsl(25, 12%, 42%);
      margin-bottom: 24px;
    }
    .username {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .subtitle {
      font-size: 14px;
      color: hsl(25, 12%, 42%);
      margin-bottom: 24px;
    }
    .stats {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-bottom: 20px;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 900;
      font-variant-numeric: tabular-nums;
    }
    .stat-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: hsl(25, 12%, 42%);
    }
    .brand {
      font-size: 12px;
      color: hsl(25, 12%, 42%);
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="flame">\uD83D\uDD25</div>
    <div class="streak">${data.currentStreak}</div>
    <div class="streak-label">Day Streak</div>
    <div class="username">${displayName}</div>
    <div class="subtitle">on Deuce Diary</div>
    <div class="stats">
      <div>
        <div class="stat-value">${data.totalLogs}</div>
        <div class="stat-label">Logs</div>
      </div>
      <div>
        <div class="stat-value">${data.longestStreak}</div>
        <div class="stat-label">Best Streak</div>
      </div>
      <div>
        <div class="stat-value">${data.squadCount}</div>
        <div class="stat-label">Squads</div>
      </div>
    </div>
    ${memberSince ? `<div class="brand">Member since ${memberSince}</div>` : ''}
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: "User not found" });
      }
      console.error('Error rendering OG share card:', error);
      res.status(500).json({ message: 'Failed to render share card' });
    }
  });

  // --- Group Weekly Throne Report Data (public, shareable) ---
  router.get('/api/share/group-report/:groupId', async (req, res) => {
    try {
      const { groupId } = req.params;
      const report = await storage.getGroupWeeklyReport(groupId);
      res.json(report);
    } catch (error: any) {
      if (error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error fetching shareable group report:", error);
      res.status(500).json({ message: "Failed to fetch group report" });
    }
  });

  // --- Group Weekly Throne Report OG Card (public, shareable HTML) ---
  router.get('/api/og/group-report/:groupId', async (req, res) => {
    try {
      const { groupId } = req.params;
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
    } catch (error: any) {
      if (error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error rendering group report OG card:", error);
      res.status(500).json({ message: "Failed to render group report card" });
    }
  });

  // --- Legacy Wall (public) ---
  router.get('/api/users/:username/legacy', async (req, res) => {
    try {
      const { username } = req.params;
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
