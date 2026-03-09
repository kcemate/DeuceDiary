import { Router } from "express";
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
} from "./helpers";

export function createGroupsRouter(): Router {
  const router = Router();

  // Group preview for invite landing page (public, no auth)
  router.get('/api/groups/preview/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const invite = await storage.getInviteById(inviteCode);
      if (!invite || invite.expiresAt < new Date()) {
        return res.status(404).json({ message: "Invite not found or expired" });
      }
      const group = await storage.getGroupById(invite.groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      const memberCount = await storage.getGroupMemberCount(invite.groupId);
      const deuceCount = await storage.getGroupDeuceCount(invite.groupId);
      res.json({ name: group.name, memberCount, deuceCount });
    } catch (error) {
      console.error("Error fetching group preview:", error);
      res.status(500).json({ message: "Failed to fetch group preview" });
    }
  });

  // Group routes (free — squad limit for free users)
  router.post('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Free users limited to 3 squads
      if (!isPremiumUser(req.user)) {
        const userGroups = await storage.getUserGroups(userId);
        if (userGroups.length >= 3) {
          return res.status(403).json({ message: 'Upgrade to Premium for unlimited squads', upgrade: true, feature: 'unlimited_squads' });
        }
      }

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
    } catch (error) {
      console.error("Error creating group:", error);
      res.status(500).json({ message: "Failed to create group" });
    }
  });

  router.get('/api/groups', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const groups = await storage.getUserGroups(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  router.get('/api/groups/:groupId', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
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
    } catch (error) {
      console.error("Error fetching group details:", error);
      res.status(500).json({ message: "Failed to fetch group details" });
    }
  });

  // Invite routes (free)
  router.post('/api/groups/:groupId/invite', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const groupId = req.groupId;

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
    } catch (error) {
      console.error("Error creating invite:", error);
      res.status(500).json({ message: "Failed to create invite" });
    }
  });

  router.post('/api/join/:inviteId', isAuthenticated, async (req: any, res) => {
    try {
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
      if (!isPremiumUser(req.user)) {
        const userGroups = await storage.getUserGroups(userId);
        if (userGroups.length >= 3) {
          return res.status(403).json({ message: 'Upgrade to Premium for unlimited squads', upgrade: true, feature: 'unlimited_squads' });
        }
      }

      await storage.addGroupMember({
        groupId: invite.groupId,
        userId,
        role: "member",
      });

      await storage.deleteInvite(inviteId);

      track("group_joined", userId);
      Events.groupJoined(userId, invite.groupId);

      const group = await storage.getGroupById(invite.groupId);
      res.json({ group });
    } catch (error) {
      console.error("Error joining group:", error);
      res.status(500).json({ message: "Failed to join group" });
    }
  });

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
  router.get('/join/:inviteId', async (req: any, res) => {
    res.redirect(`/invite/${req.params.inviteId}`);
  });

  // Streak routes (free — part of groups)
  router.get('/api/groups/:groupId/streak', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const today = getTodayUTC();
      const yesterday = getYesterdayUTC();
      const streak = await storage.getGroupStreak(groupId);
      const logsToday = await storage.getMembersLogStatusToday(groupId, today);

      // If streak is stale (lastStreakDate is not today and not yesterday), reset it for the response
      let currentStreak = streak.currentStreak;
      if (streak.lastStreakDate && streak.lastStreakDate !== today && streak.lastStreakDate !== yesterday) {
        currentStreak = 0;
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
    } catch (error) {
      console.error("Error fetching streak:", error);
      res.status(500).json({ message: "Failed to fetch streak" });
    }
  });

  router.post('/api/groups/:groupId/streak/check', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const result = await checkAndNotifyStreakRisk(groupId);
      res.json(result);
    } catch (error) {
      console.error("Error checking streak risk:", error);
      res.status(500).json({ message: "Failed to check streak risk" });
    }
  });

  // Group Leaderboard — member rankings by deuce count (free)
  router.get('/api/groups/:groupId/leaderboard', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
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
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Weekly Throne Report — group-level shareable summary card
  router.get('/api/groups/:groupId/weekly-report', isAuthenticated, requireGroupMember(), async (req: any, res) => {
    try {
      const groupId = req.groupId;
      const report = await storage.getGroupWeeklyReport(groupId);
      res.json(report);
    } catch (error: any) {
      if (error.message === "Group not found") {
        return res.status(404).json({ message: "Group not found" });
      }
      console.error("Error fetching group weekly report:", error);
      res.status(500).json({ message: "Failed to fetch group weekly report" });
    }
  });

  // Squad Spy Mode — typical log hour per member (premium)
  router.get('/api/groups/:groupId/spy', isAuthenticated, requireGroupMember(), requiresPremiumFor('squad_spy'), async (req: any, res) => {
    try {
      const groupId = req.groupId;

      const typicalHours = await storage.getGroupMemberTypicalHours(groupId);
      res.json(typicalHours);
    } catch (error) {
      console.error("Error fetching spy data:", error);
      res.status(500).json({ message: "Failed to fetch spy data" });
    }
  });

  // Export Weekly Throne Report as PDF (premium)
  router.get('/api/groups/:groupId/weekly-report/pdf', isAuthenticated, requireGroupMember(), requiresPremiumFor('report_export'), async (req: any, res) => {
    try {
      const groupId = req.groupId;
      const report = await storage.getGroupWeeklyReport(groupId);

      // Lazy import pdfkit to avoid startup cost
      const PDFDocument = (await import('pdfkit')).default;
      const doc = new PDFDocument({ margin: 50, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="throne-report-${report.weekOf}.pdf"`);
      doc.pipe(res);

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Weekly Throne Report', { align: 'center' });
      doc.fontSize(12).font('Helvetica').fillColor('#666')
        .text(`${report.groupName}  |  Week of ${report.weekOf} to ${report.weekEnding}`, { align: 'center' });
      doc.moveDown(1.5);

      // Group stats
      doc.fontSize(14).font('Helvetica-Bold').fillColor('#000').text('Squad Stats');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica')
        .text(`Total Deuces This Week: ${report.groupStats.totalDeucesThisWeek}`)
        .text(`Current Streak: ${report.groupStats.currentStreak} days`)
        .text(`Longest Streak: ${report.groupStats.longestStreak} days`);
      doc.moveDown(1);

      // MVP
      if (report.mvp) {
        doc.fontSize(14).font('Helvetica-Bold').text('MVP of the Week');
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica')
          .text(`${report.mvp.username ?? 'Anonymous'} -- ${report.mvp.deuceCount} deuces`);
        doc.moveDown(1);
      }

      // Member breakdown
      doc.fontSize(14).font('Helvetica-Bold').text('Member Breakdown');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
      doc.moveDown(0.5);
      for (const m of report.members) {
        const statusLabel = m.streakStatus === 'active' ? '[Active]' : m.streakStatus === 'at_risk' ? '[At Risk]' : '[Inactive]';
        doc.fontSize(12).font('Helvetica')
          .text(`${statusLabel} ${m.username ?? 'Unknown'}: ${m.deucesThisWeek} deuces`);
      }
      doc.moveDown(1);

      // Funny stats
      doc.fontSize(14).font('Helvetica-Bold').text('Fun Facts');
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
      doc.moveDown(0.5);

      if (report.funnyStats.longestGap) {
        doc.fontSize(12).font('Helvetica')
          .text(`Longest gap: ${report.funnyStats.longestGap.username ?? 'Unknown'} -- ${report.funnyStats.longestGap.gapDays} days since last log`);
      }
      if (report.funnyStats.mostReactionsReceived) {
        doc.fontSize(12).font('Helvetica')
          .text(`Most reactions: ${report.funnyStats.mostReactionsReceived.username ?? 'Unknown'} -- ${report.funnyStats.mostReactionsReceived.reactionCount} reactions`);
      }
      if (report.funnyStats.funniestEntry) {
        doc.fontSize(12).font('Helvetica')
          .text(`Funniest entry: "${report.funnyStats.funniestEntry.thought}" by ${report.funnyStats.funniestEntry.username ?? 'Unknown'} (${report.funnyStats.funniestEntry.reactions} reactions)`);
      }

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#999').text('Generated by Deuce Diary -- track your throne time with your squad', { align: 'center' });

      doc.end();
    } catch (error: any) {
      console.error("Error generating PDF report:", error);
      if (error.message === 'Group not found') return res.status(404).json({ message: 'Group not found' });
      res.status(500).json({ message: "Failed to generate PDF report" });
    }
  });

  // Rich invite preview (public -- no auth, enhanced for OG)
  router.get('/api/groups/invite-preview/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const preview = await storage.getGroupInvitePreview(inviteCode);
      if (!preview) {
        return res.status(404).json({ message: "Invite not found or expired" });
      }
      res.json(preview);
    } catch (error) {
      console.error("Error fetching invite preview:", error);
      res.status(500).json({ message: "Failed to fetch invite preview" });
    }
  });

  // OG HTML page for invite links -- crawlers get rich meta tags (public)
  router.get('/api/og/invite/:inviteCode', async (req, res) => {
    try {
      const { inviteCode } = req.params;
      const preview = await storage.getGroupInvitePreview(inviteCode);

      if (!preview) {
        return res.status(404).send('<html><body><h1>Invite not found or expired</h1></body></html>');
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
    } catch (error) {
      console.error("Error rendering invite OG page:", error);
      res.status(500).send('<html><body><h1>Something went wrong</h1></body></html>');
    }
  });

  return router;
}

/** Minimal HTML escaping for OG tags */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
