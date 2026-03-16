import { Router, type Response } from "express";
import { storage } from "../storage";
import { insertGroupSchema } from "@shared/schema";
import { isAuthenticated } from "../replitAuth";
import { requireGroupMember } from "../groupAuth";
import { requiresPremiumFor } from "../premiumAuth";
import { track, Events } from "../lib/analytics";
import { v4 as uuidv4 } from "uuid";
import {
  createGroupSchema,
  isPremiumUser,
  getTodayUTC,
  getYesterdayUTC,
  checkAndNotifyStreakRisk,
  escapeHtml,
} from "./helpers";

async function fetchWeeklyReport(groupId: string, res: Response) {
  try {
    return await storage.getGroupWeeklyReport(groupId);
  } catch (err) {
    if (err instanceof Error && err.message === "Group not found") { res.status(404).json({ message: "Group not found" }); return null; }
    throw err;
  }
}

async function checkSquadLimit(req: any, res: any): Promise<boolean> {
  if (!isPremiumUser(req.user)) {
    const userGroups = await storage.getUserGroups(req.user.id);
    if (userGroups.length >= 3) {
      res.status(403).json({ message: 'Upgrade to Premium for unlimited squads', upgrade: true, feature: 'unlimited_squads' });
      return true;
    }
  }
  return false;
}

function asyncRoute(
  errMsg: string,
  handler: (req: any, res: any) => Promise<void>,
): (req: any, res: any) => Promise<void> {
  return async (req: any, res: any) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error(errMsg, error);
      res.status(500).json({ message: errMsg });
    }
  };
}

export function createGroupsRouter(): Router {
  const router = Router();

  // Group routes (free — squad limit for free users)
  router.post('/api/groups', isAuthenticated, asyncRoute("Failed to create group", async (req: any, res) => {
    const userId = req.user.id;

    // Free users limited to 3 squads
    if (await checkSquadLimit(req, res)) return;

    const parsed = createGroupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid group data: name is required (max 100 chars)" });
    }
    const insertParsed = insertGroupSchema.safeParse({
      ...parsed.data,
      createdBy: userId,
    });
    if (!insertParsed.success) {
      return res.status(400).json({ message: "Invalid group data" });
    }
    const groupData = insertParsed.data;

    const group = await storage.createGroup({
      ...groupData,
      id: uuidv4(),
    });

    track("group_created", userId);

    res.json(group);
  }));

  router.get('/api/groups', isAuthenticated, asyncRoute("Failed to fetch groups", async (req: any, res) => {
    const userId = req.user.id;
    const groups = await storage.getUserGroups(userId);
    res.json(groups);
  }));

  router.get('/api/groups/:groupId', isAuthenticated, requireGroupMember(), asyncRoute("Failed to fetch group details", async (req: any, res) => {
    const groupId = req.groupId;

    const group = await storage.getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = Math.max(parseInt(req.query.offset as string) || 0, 0);

    const members = await storage.getGroupMembers(groupId);
    const entries = await storage.getGroupEntries(groupId, limit, offset);

    res.json({ group, members, entries });
  }));

  // Invite routes (free)
  router.post('/api/groups/:groupId/invite', isAuthenticated, requireGroupMember(), asyncRoute("Failed to create invite", async (req: any, res) => {
    const userId = req.user.id;
    const groupId = req.groupId;

    // Purge expired invites for this group before creating a new one to prevent accumulation
    await storage.deleteExpiredGroupInvites(groupId);

    const inviteId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await storage.createInvite({
      id: inviteId,
      groupId,
      createdBy: userId,
      expiresAt,
    });

    track("invite_sent", userId);

    const inviteLink = `${req.protocol}://${req.get('host')}/join/${inviteId}`;
    res.json({ inviteLink, id: inviteId });
  }));

  router.post('/api/join/:inviteId', isAuthenticated, asyncRoute("Failed to join group", async (req: any, res) => {
    const userId = req.user.id;
    const { inviteId } = req.params;

    const invite = await storage.getInviteById(inviteId);
    if (!invite || invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    const isAlreadyMember = await storage.isUserInGroup(userId, invite.groupId);
    if (isAlreadyMember) {
      const group = await storage.getGroupById(invite.groupId);
      return res.json({ group, message: "Already a member of this group" });
    }

    // Free users limited to 3 squads
    if (await checkSquadLimit(req, res)) return;

    await storage.addGroupMember({
      groupId: invite.groupId,
      userId,
      role: "member",
    });

    // Don't delete the invite — it should be reusable by multiple people

    track("group_joined", userId);
    Events.groupJoined(userId, invite.groupId);

    const group = await storage.getGroupById(invite.groupId);
    res.json({ group });
  }));

  // Referral landing: /join?ref=CODE -> store code in session, redirect to /
  router.get('/join', (req: any, res) => {
    const ref = req.query.ref;
    // Only store alphanumeric codes of reasonable length (matches routes.ts validation)
    if (ref && typeof ref === 'string' && /^[A-Z0-9]{4,20}$/i.test(ref) && req.session) {
      req.session.referralCode = ref.toUpperCase();
    }
    res.redirect('/');
  });

  // Legacy /join/:inviteId redirect -> new client-side /invite/:code page
  router.get('/join/:inviteId', (req: any, res) => {
    res.redirect(`/invite/${req.params.inviteId}`);
  });

  // Streak routes (free — part of groups)
  router.get('/api/groups/:groupId/streak', isAuthenticated, requireGroupMember(), asyncRoute("Failed to fetch streak", async (req: any, res) => {
    const groupId = req.groupId;

    const today = getTodayUTC();
    const yesterday = getYesterdayUTC();
    const streak = await storage.getGroupStreak(groupId);
    const logsToday = await storage.getMembersLogStatusToday(groupId, today);

    // If streak is stale (lastStreakDate is not today and not yesterday), reset it in the
    // DB so subsequent reads are consistent — not just the response for this request.
    let currentStreak = streak.currentStreak;
    if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
      currentStreak = 0;
      // Fire-and-forget persistence: non-critical, safe to proceed even if it fails
      storage.resetGroupStreak(groupId).catch(err =>
        console.error(`[STREAK] Failed to persist stale streak reset for group ${groupId}:`, err)
      );
    }

    res.json({
      currentStreak,
      longestStreak: streak.longestStreak,
      memberCount: logsToday.length,
      logsToday: logsToday.map(m => ({
        userId: m.userId,
        username: m.username || m.firstName || (m.email ? m.email.split('@')[0] : 'Unknown'),
        hasLogged: m.hasLogged,
        profileImageUrl: m.profileImageUrl,
      })),
    });
  }));

  router.post('/api/groups/:groupId/streak/check', isAuthenticated, requireGroupMember(), asyncRoute("Failed to check streak risk", async (req: any, res) => {
    const groupId = req.groupId;
    const result = await checkAndNotifyStreakRisk(groupId);
    res.json(result);
  }));

  // Group Leaderboard — member rankings by deuce count (free)
  router.get('/api/groups/:groupId/leaderboard', isAuthenticated, requireGroupMember(), asyncRoute("Failed to fetch leaderboard", async (req: any, res) => {
    const groupId = req.groupId;

    const members = await storage.getGroupMembers(groupId);
    const ranked = members
      .map(m => ({
        userId: m.userId,
        username: m.user?.username ?? null,
        profileImageUrl: m.user?.profileImageUrl ?? null,
        deuceCount: m.user?.deuceCount ?? 0,
      }))
      .sort((a, b) => b.deuceCount - a.deuceCount);

    res.json(ranked);
  }));

  // Weekly Throne Report — group-level shareable summary card
  router.get('/api/groups/:groupId/weekly-report', isAuthenticated, requireGroupMember(), asyncRoute("Failed to fetch group weekly report", async (req: any, res) => {
    const groupId = req.groupId;
    const report = await fetchWeeklyReport(groupId, res);
    if (!report) return;
    res.json(report);
  }));

  // Squad Spy Mode — typical log hour per member (premium)
  router.get('/api/groups/:groupId/spy', isAuthenticated, requireGroupMember(), requiresPremiumFor('squad_spy'), asyncRoute("Failed to fetch spy data", async (req: any, res) => {
    const groupId = req.groupId;
    const typicalHours = await storage.getGroupMemberTypicalHours(groupId);
    res.json(typicalHours);
  }));

  // Export Weekly Throne Report as PDF (premium)
  router.get('/api/groups/:groupId/weekly-report/pdf', isAuthenticated, requireGroupMember(), requiresPremiumFor('report_export'), asyncRoute("Failed to generate PDF report", async (req: any, res) => {
      const groupId = req.groupId;
      const report = await fetchWeeklyReport(groupId, res);
      if (!report) return;

      // Lazy import pdfkit to avoid startup cost
      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="throne-report-${report.weekOf}.pdf"`);
      doc.pipe(res);

      const pdfSection = (title: string) => {
        doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text(title);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.5);
      };
      const bodyFont = () => doc.fontSize(12).font('Helvetica').fillColor('#000');

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Weekly Throne Report', { align: 'center' });
      bodyFont().fillColor('#666')
        .text(`${report.groupName}  |  Week of ${report.weekOf} to ${report.weekEnding}`, { align: 'center' });
      doc.moveDown(1.5);

      // Group stats
      pdfSection('Squad Stats');
      bodyFont()
        .text(`Total Deuces This Week: ${report.groupStats.totalDeucesThisWeek}`)
        .text(`Current Streak: ${report.groupStats.currentStreak} days`)
        .text(`Longest Streak: ${report.groupStats.longestStreak} days`);
      doc.moveDown(1);

      // MVP
      if (report.mvp) {
        pdfSection('MVP of the Week');
        bodyFont()
          .text(`${report.mvp.username ?? 'Anonymous'} -- ${report.mvp.deuceCount} deuces`);
        doc.moveDown(1);
      }

      // Member breakdown
      pdfSection('Member Breakdown');
      for (const m of report.members) {
        const statusLabel = m.streakStatus === 'active' ? '[Active]' : m.streakStatus === 'at_risk' ? '[At Risk]' : '[Inactive]';
        bodyFont()
          .text(`${statusLabel} ${m.username ?? 'Unknown'}: ${m.deucesThisWeek} deuces`);
      }
      doc.moveDown(1);

      // Funny stats
      pdfSection('Fun Facts');
      [
        report.funnyStats.longestGap && `Longest gap: ${report.funnyStats.longestGap.username ?? 'Unknown'} -- ${report.funnyStats.longestGap.gapDays} days since last log`,
        report.funnyStats.mostReactionsReceived && `Most reactions: ${report.funnyStats.mostReactionsReceived.username ?? 'Unknown'} -- ${report.funnyStats.mostReactionsReceived.reactionCount} reactions`,
        report.funnyStats.funniestEntry && `Funniest entry: "${report.funnyStats.funniestEntry.thought}" by ${report.funnyStats.funniestEntry.username ?? 'Unknown'} (${report.funnyStats.funniestEntry.reactions} reactions)`,
      ].filter(Boolean).forEach(fact => bodyFont().text(fact as string));

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999').text('Generated by Deuce Diary -- track your throne time with your squad', { align: 'center' });

      doc.end();
  }));

  // Rich invite preview (public -- no auth, enhanced for OG)
  router.get('/api/groups/invite-preview/:inviteCode', asyncRoute("Failed to fetch invite preview", async (req, res) => {
    const { inviteCode } = req.params;
    const preview = await storage.getGroupInvitePreview(inviteCode);
    if (!preview) {
      return res.status(404).json({ message: "Invite not found or expired" });
    }
    res.json(preview);
  }));

  // OG HTML page for invite links -- crawlers get rich meta tags (public)
  const INVITE_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const INVITE_NOT_FOUND_HTML = '<html><body><h1>Invite not found or expired</h1></body></html>';
  router.get('/api/og/invite/:inviteCode', asyncRoute("Failed to render invite OG page", async (req, res) => {
    const { inviteCode } = req.params;
    // Validate UUID format before using in HTML href to prevent injection
    if (!INVITE_UUID_RE.test(inviteCode)) {
      return res.status(404).send(INVITE_NOT_FOUND_HTML);
    }
    const preview = await storage.getGroupInvitePreview(inviteCode);

      if (!preview) {
        return res.status(404).send(INVITE_NOT_FOUND_HTML);
      }

      const title = `Join ${preview.name} on Deuce Diary`;
      const topMembers = preview.memberNames.slice(0, 5);
      const memberList = topMembers.join(', ') + (preview.memberNames.length > 5 ? ` and ${preview.memberNames.length - 5} more` : '');
      const descParts: string[] = [
        `${preview.memberCount} member${preview.memberCount !== 1 ? 's' : ''}`,
      ];
      if (preview.currentStreak > 0) descParts.push(`${preview.currentStreak}-day streak`);
      descParts.push(`${preview.deuceCount} total deuces`);
      if (memberList) descParts.push(`Members: ${memberList}`);
      const description = descParts.join(' · ');

      const appUrl = 'https://deuce-diary-web-production.up.railway.app';
      const ogImageUrl = `${appUrl}/og-banner.png`;

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:url" content="${appUrl}/invite/${inviteCode}" />
  <meta property="og:site_name" content="Deuce Diary" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: hsl(38, 40%, 96%);
      color: hsl(25, 30%, 8%);
      display: flex; align-items: center; justify-content: center; min-height: 100vh;
    }
    .card {
      background: hsl(38, 30%, 94%);
      border: 1px solid hsl(38, 18%, 83%);
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 420px; width: 100%; text-align: center;
    }
    .icon { font-size: 48px; line-height: 1; margin-bottom: 12px; }
    .group-name { font-size: 26px; font-weight: 900; margin-bottom: 8px; }
    .description { font-size: 14px; color: hsl(25, 12%, 42%); margin-bottom: 24px; }
    .stats { display: flex; justify-content: center; gap: 32px; margin-bottom: 24px; }
    .stat-value { font-size: 24px; font-weight: 900; }
    .stat-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: hsl(25, 12%, 42%); }
    .members { font-size: 13px; color: hsl(25, 12%, 42%); margin-bottom: 24px; }
    .cta {
      display: inline-block; background: hsl(45, 88%, 48%); color: #000;
      font-size: 16px; font-weight: 700; padding: 14px 32px; border-radius: 14px; text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">&#x1F6BD;</div>
    <div class="group-name">${escapeHtml(preview.name)}</div>
    ${preview.description ? `<div class="description">${escapeHtml(preview.description)}</div>` : ''}
    <div class="stats">
      <div>
        <div class="stat-value">${preview.memberCount}</div>
        <div class="stat-label">Members</div>
      </div>
      ${preview.currentStreak > 0 ? `
      <div>
        <div class="stat-value">${preview.currentStreak}</div>
        <div class="stat-label">Streak</div>
      </div>` : ''}
      <div>
        <div class="stat-value">${preview.deuceCount}</div>
        <div class="stat-label">Deuces</div>
      </div>
    </div>
    ${memberList ? `<div class="members">Squad: ${escapeHtml(memberList)}</div>` : ''}
    <a class="cta" href="/invite/${inviteCode}">Join the Squad</a>
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
  }));

  return router;
}
