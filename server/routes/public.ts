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
