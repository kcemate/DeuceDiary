import { Router, Request, Response } from "express";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";
import { asyncRoute as helperAsyncRoute } from "./helpers";
import { STANDARD_GRID, QUICK_GRID, SHIPS } from "@shared/schema";

const asyncRoute = (failMsg: string, handler: (req: AuthReq, res: Response) => Promise<void>) =>
  helperAsyncRoute<AuthReq>(failMsg, failMsg, handler);

type AuthReq = Request & { user: { id: string } };

// --- Validation schemas ---
const matchTypeSchema = z.enum(["standard", "quick"]).default("standard");

const challengeSchema = z.object({
  groupId: z.string().min(1),
  opponentId: z.string().min(1),
  matchType: matchTypeSchema,
});

const placeShipsSchema = z.object({
  ships: z.array(
    z.object({
      type: z.string().min(1),
      cells: z.array(z.object({ col: z.number().int().min(0), row: z.number().int().min(0) })).min(1),
    }),
  ).min(1),
});

const attackSchema = z.object({
  col: z.number().int().min(0),
  row: z.number().int().min(0),
});

const powerupSchema = z.object({
  type: z.enum(["sonar_ping", "ghost_wipe"]),
});

const matchmakeSchema = z.object({
  groupId: z.string().min(1),
  matchType: matchTypeSchema,
});

// --- Ship placement validation ---
function validateShipPlacement(
  ships: { type: string; cells: { col: number; row: number }[] }[],
  matchType: "standard" | "quick",
): string | null {
  const grid = matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
  const shipDefs = SHIPS[matchType];
  const requiredTypes = shipDefs.map((s) => s.type);

  // Check all required ships present
  const providedTypes = ships.map((s) => s.type);
  for (const req of requiredTypes) {
    if (!providedTypes.includes(req)) {
      return `Missing ship type: ${req}`;
    }
  }
  if (providedTypes.length !== requiredTypes.length) {
    return "Incorrect number of ships";
  }

  const occupiedCells = new Set<string>();

  for (const ship of ships) {
    const def = shipDefs.find((s) => s.type === ship.type);
    if (!def) return `Unknown ship type: ${ship.type}`;

    // Check correct size
    if (ship.cells.length !== def.size) {
      return `Ship ${ship.type} must have exactly ${def.size} cells`;
    }

    // Check within bounds
    for (const cell of ship.cells) {
      if (cell.col < 0 || cell.col >= grid.cols || cell.row < 0 || cell.row >= grid.rows) {
        return `Ship ${ship.type} has cell out of bounds: (${cell.col}, ${cell.row})`;
      }
    }

    // Check adjacency: all cells same row or same col, contiguous, no gaps
    const cols = ship.cells.map((c) => c.col);
    const rows = ship.cells.map((c) => c.row);
    const uniqueCols = new Set(cols);
    const uniqueRows = new Set(rows);

    if (uniqueRows.size !== 1 && uniqueCols.size !== 1) {
      return `Ship ${ship.type} must be placed in a single row or column (no diagonal)`;
    }
    const values = uniqueRows.size === 1 ? [...cols].sort((a, b) => a - b) : [...rows].sort((a, b) => a - b);
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i - 1] + 1) {
        return `Ship ${ship.type} cells must be contiguous (no gaps)`;
      }
    }

    // Check overlap
    for (const cell of ship.cells) {
      const key = `${cell.col},${cell.row}`;
      if (occupiedCells.has(key)) {
        return `Ships overlap at cell (${cell.col}, ${cell.row})`;
      }
      occupiedCells.add(key);
    }
  }

  return null; // valid
}

// --- Match week helpers ---
function getWeekBounds(matchType: "standard" | "quick"): { weekStart: Date; weekEnd: Date } {
  const now = new Date();
  if (matchType === "quick") {
    const weekStart = new Date(now);
    weekStart.setUTCHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 3);
    return { weekStart, weekEnd };
  }
  // Standard: Monday 00:00 to Sunday 23:59 UTC
  const dayOfWeek = now.getUTCDay(); // 0=Sun
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setUTCDate(weekStart.getUTCDate() - daysToMonday);
  weekStart.setUTCHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
  weekEnd.setUTCHours(23, 59, 59, 999);
  return { weekStart, weekEnd };
}

/** Load a match and verify the user is a participant. Returns the match or sends 404/403 and returns null. */
async function requireMatchParticipant(matchId: string, userId: string, res: Response) {
  const match = await storage.getBattleMatch(matchId);
  if (!match) {
    res.status(404).json({ message: "Match not found" });
    return null;
  }
  if (match.challengerId !== userId && match.opponentId !== userId) {
    res.status(403).json({ message: "Not a participant" });
    return null;
  }
  return match;
}

export function createBattleRouter(): Router {
  const router = Router();

  // POST /api/battle/challenge — create a 1v1 match
  router.post("/api/battle/challenge", isAuthenticated, asyncRoute("Failed to create match", async (req, res) => {
    const userId = req.user.id;
    const parsed = challengeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }
    const { groupId, opponentId, matchType } = parsed.data;

    if (opponentId === userId) {
      return res.status(400).json({ message: "Cannot challenge yourself" });
    }

    // Verify both players are in the group
    const [challengerInGroup, opponentInGroup] = await Promise.all([
      storage.isUserInGroup(userId, groupId),
      storage.isUserInGroup(opponentId, groupId),
    ]);
    if (!challengerInGroup) return res.status(403).json({ message: "Not a member of this group" });
    if (!opponentInGroup) return res.status(404).json({ message: "Opponent is not in this group" });

    // Check active match limits: max 1 standard + 1 quick per user
    const challengerMatches = await storage.getUserActiveMatches(userId);
    const opponentMatches = await storage.getUserActiveMatches(opponentId);
    const challengerTypeCount = challengerMatches.filter((m) => m.matchType === matchType).length;
    const opponentTypeCount = opponentMatches.filter((m) => m.matchType === matchType).length;
    if (challengerTypeCount >= 1) {
      return res.status(409).json({ message: `You already have an active ${matchType} match` });
    }
    if (opponentTypeCount >= 1) {
      return res.status(409).json({ message: `Opponent already has an active ${matchType} match` });
    }

    const { weekStart, weekEnd } = getWeekBounds(matchType);
    const placementDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const match = await storage.createBattleMatch({
      id: uuidv4(),
      groupId,
      challengerId: userId,
      opponentId,
      matchType,
      status: "pending",
      weekStart,
      weekEnd,
      placementDeadline,
    });

    res.status(201).json(match);
  }));

  // GET /api/battle/matches — user's active/recent matches
  router.get("/api/battle/matches", isAuthenticated, asyncRoute("Failed to fetch matches", async (req, res) => {
    const userId = req.user.id;
    const matches = await storage.getUserActiveMatches(userId);
    res.json(matches);
  }));

  // GET /api/battle/match/:matchId — full match state
  router.get("/api/battle/match/:matchId", isAuthenticated, asyncRoute("Failed to fetch match", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;

    const opponentId = match.challengerId === userId ? match.opponentId : match.challengerId;

    // Fetch ships, attacks, tokens, powerups
    const [myShips, opponentShips, allAttacks, myTokenBalance, myPowerups, opponentPowerups] = await Promise.all([
      storage.getShips(matchId, userId),
      storage.getShips(matchId, opponentId),
      storage.getAttacks(matchId),
      storage.getTokenBalance(matchId, userId),
      storage.getPowerups(matchId, userId),
      storage.getPowerups(matchId, opponentId),
    ]);

    const myAttacks = allAttacks.filter((a) => a.attackerId === userId);
    const opponentAttacks = allAttacks.filter((a) => a.attackerId === opponentId);

    // Hide opponent's unsunk ships (only reveal sunk ships)
    const safeOpponentShips = opponentShips
      .filter((s) => s.isSunk)
      .map((s) => ({ ...s, cells: s.cells }));

    res.json({
      match,
      myShips,
      opponentSunkShips: safeOpponentShips,
      myAttacks,
      opponentAttacks,
      tokenBalance: myTokenBalance,
      myPowerups,
      opponentPowerupsUsed: opponentPowerups.filter((p) => p.usedAt !== null).map((p) => p.powerupType),
    });
  }));

  // POST /api/battle/match/:matchId/place — ship placement
  router.post("/api/battle/match/:matchId/place", isAuthenticated,
    asyncRoute("Failed to place ships", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;
    if (!["pending", "placement"].includes(match.status)) {
      return res.status(409).json({ message: "Ship placement phase is over" });
    }
    if (new Date() > match.placementDeadline) {
      return res.status(409).json({ message: "Placement deadline has passed" });
    }

    // Check if already placed
    const existing = await storage.getShips(matchId, userId);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Ships already placed" });
    }

    const parsed = placeShipsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }

    const validationError = validateShipPlacement(
      parsed.data.ships,
      match.matchType as "standard" | "quick",
    );
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await storage.placeShips(
      matchId,
      userId,
      parsed.data.ships.map((s) => ({ shipType: s.type, cells: s.cells })),
    );

    // Check if both players have placed → transition to active
    const opponentId = match.challengerId === userId ? match.opponentId : match.challengerId;
    const opponentShips = await storage.getShips(matchId, opponentId);

    if (opponentShips.length > 0) {
      await storage.updateBattleMatchStatus(matchId, "active");
    } else if (match.status === "pending") {
      await storage.updateBattleMatchStatus(matchId, "placement");
    }

    res.json({ ok: true });
  }));

  // POST /api/battle/match/:matchId/attack — fire at a cell
  router.post("/api/battle/match/:matchId/attack", isAuthenticated,
    asyncRoute("Failed to process attack", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;
    if (match.status !== "active") {
      return res.status(409).json({ message: "Match is not active" });
    }

    const parsed = attackSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }
    const { col, row } = parsed.data;

    // Validate cell within grid
    const grid = match.matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
    if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) {
      return res.status(400).json({ message: "Cell out of bounds" });
    }

    // Check token balance
    const balance = await storage.getTokenBalance(matchId, userId);
    if (balance.earned <= balance.spent) {
      return res.status(409).json({ message: "No attack tokens available" });
    }

    // Check cell not already attacked
    const myAttacks = await storage.getAttacksByUser(matchId, userId);
    if (myAttacks.some((a) => a.col === col && a.row === row)) {
      return res.status(409).json({ message: "Cell already attacked" });
    }

    const opponentId = match.challengerId === userId ? match.opponentId : match.challengerId;
    const opponentShips = await storage.getShips(matchId, opponentId);

    // Check hit
    let isHit = false;
    let hitShip = null;
    for (const ship of opponentShips) {
      if (ship.isSunk) continue;
      const hitCell = (ship.cells as { col: number; row: number }[]).find(
        (c) => c.col === col && c.row === row,
      );
      if (hitCell) {
        isHit = true;
        hitShip = ship;
        break;
      }
    }

    const attack = await storage.createAttack(matchId, userId, col, row, isHit);

    let sunk = false;
    let gameOver = false;
    let winner = null;

    if (isHit && hitShip) {
      // Check if ship is sunk (all cells hit)
      const updatedAttacks = [...myAttacks, attack];
      const allCellsHit = (hitShip.cells as { col: number; row: number }[]).every((c) =>
        updatedAttacks.some((a) => a.col === c.col && a.row === c.row),
      );

      if (allCellsHit) {
        sunk = true;
        await storage.markShipSunk(hitShip.id);

        // Check if all ships sunk
        const freshOpponentShips = await storage.getShips(matchId, opponentId);
        const allSunk = freshOpponentShips.every((s) => s.isSunk);
        if (allSunk) {
          gameOver = true;
          winner = userId;
          await storage.updateBattleMatchStatus(matchId, "completed", userId);
          await storage.awardBadge(userId, "battle_winner", matchId);
          // Check admiral badge (3+ wins)
          const stats = await storage.getBattleStats(userId);
          if (stats.wins >= 3) {
            await storage.awardBadge(userId, "admiral", matchId);
          }
        }
      }
    }

    res.json({
      hit: isHit,
      sunk,
      shipType: hitShip?.shipType ?? null,
      gameOver,
      winner,
    });
  }));

  // GET /api/battle/match/:matchId/tokens — token balance
  router.get("/api/battle/match/:matchId/tokens", isAuthenticated,
    asyncRoute("Failed to fetch token balance", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;

    const balance = await storage.getTokenBalance(matchId, userId);
    res.json({ ...balance, available: balance.earned - balance.spent });
  }));

  // POST /api/battle/match/:matchId/powerup — use a power-up
  router.post("/api/battle/match/:matchId/powerup", isAuthenticated,
    asyncRoute("Failed to use power-up", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;
    if (match.status !== "active") {
      return res.status(409).json({ message: "Match is not active" });
    }

    const parsed = powerupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }
    const { type } = parsed.data;

    const powerups = await storage.getPowerups(matchId, userId);
    const powerup = powerups.find((p) => p.powerupType === type);
    if (!powerup) {
      return res.status(404).json({ message: "Power-up not available" });
    }
    if (powerup.usedAt) {
      return res.status(409).json({ message: "Power-up already used" });
    }

    let revealedCell: { col: number; row: number } | undefined;

    if (type === "sonar_ping") {
      // Reveal a random unrevealed opponent cell
      const opponentId = match.challengerId === userId ? match.opponentId : match.challengerId;
      const opponentShips = await storage.getShips(matchId, opponentId);
      const myAttacks = await storage.getAttacksByUser(matchId, userId);
      const attackedCells = new Set(myAttacks.map((a) => `${a.col},${a.row}`));

      const grid = match.matchType === "standard" ? STANDARD_GRID : QUICK_GRID;
      const allCells: { col: number; row: number }[] = [];
      for (let c = 0; c < grid.cols; c++) {
        for (let r = 0; r < grid.rows; r++) {
          if (!attackedCells.has(`${c},${r}`)) {
            allCells.push({ col: c, row: r });
          }
        }
      }

      // Pick a cell that's actually a ship cell if possible
      const shipCells = opponentShips
        .flatMap((s) => (s.cells as { col: number; row: number }[]))
        .filter((c) => !attackedCells.has(`${c.col},${c.row}`));

      const candidates = shipCells.length > 0 ? shipCells : allCells;
      if (candidates.length > 0) {
        revealedCell = candidates[Math.floor(Math.random() * candidates.length)];
      }
    }

    await storage.usePowerup(matchId, userId, type, revealedCell);
    res.json({ ok: true, revealedCell: revealedCell ?? null });
  }));

  // POST /api/battle/matchmake — random opponent from shared squads
  router.post("/api/battle/matchmake", isAuthenticated, asyncRoute("Failed to matchmake", async (req, res) => {
    const userId = req.user.id;
    const parsed = matchmakeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    }
    const { groupId, matchType } = parsed.data;

    const isInGroup = await storage.isUserInGroup(userId, groupId);
    if (!isInGroup) return res.status(403).json({ message: "Not a member of this group" });

    const members = await storage.getGroupMembers(groupId);
    const eligibleMembers = members.filter((m) => m.userId !== userId);

    if (eligibleMembers.length === 0) {
      return res.status(404).json({ message: "No eligible opponents in this group" });
    }

    // Filter out users with 2 active matches
    const eligible = [];
    for (const member of eligibleMembers) {
      const opponentMatches = await storage.getUserActiveMatches(member.userId);
      const typeCount = opponentMatches.filter((m) => m.matchType === matchType).length;
      if (typeCount < 1) eligible.push(member);
    }

    if (eligible.length === 0) {
      return res.status(409).json({ message: "All group members are currently in a match" });
    }

    // Check challenger limit
    const challengerMatches = await storage.getUserActiveMatches(userId);
    const challengerTypeCount = challengerMatches.filter((m) => m.matchType === matchType).length;
    if (challengerTypeCount >= 1) {
      return res.status(409).json({ message: `You already have an active ${matchType} match` });
    }

    const opponent = eligible[Math.floor(Math.random() * eligible.length)];
    const { weekStart, weekEnd } = getWeekBounds(matchType);
    const placementDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const match = await storage.createBattleMatch({
      id: uuidv4(),
      groupId,
      challengerId: userId,
      opponentId: opponent.userId,
      matchType,
      status: "pending",
      weekStart,
      weekEnd,
      placementDeadline,
    });

    res.status(201).json(match);
  }));

  // GET /api/battle/leaderboard/:groupId — season wins leaderboard
  router.get("/api/battle/leaderboard/:groupId", isAuthenticated,
    asyncRoute("Failed to fetch leaderboard", async (req, res) => {
    const userId = req.user.id;
    const { groupId } = req.params;

    const isInGroup = await storage.isUserInGroup(userId, groupId);
    if (!isInGroup) return res.status(403).json({ message: "Not a member of this group" });

    // Season start = first day of current month
    const now = new Date();
    const seasonStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

    const leaderboard = await storage.getBattleLeaderboard(groupId, seasonStart);
    res.json(leaderboard);
  }));

  // GET /api/battle/stats/:userId — personal battle stats
  router.get("/api/battle/stats/:userId", isAuthenticated, asyncRoute("Failed to fetch stats", async (req, res) => {
    const { userId } = req.params;
    const stats = await storage.getBattleStats(userId);
    const badges = await storage.getUserBattleBadges(userId);
    res.json({ ...stats, badges });
  }));

  // POST /api/battle/match/:matchId/forfeit — forfeit a match
  router.post("/api/battle/match/:matchId/forfeit", isAuthenticated,
    asyncRoute("Failed to forfeit match", async (req, res) => {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await requireMatchParticipant(matchId, userId, res);
    if (!match) return;
    if (["completed", "forfeited", "voided"].includes(match.status)) {
      return res.status(409).json({ message: "Match already ended" });
    }

    const winnerId = match.challengerId === userId ? match.opponentId : match.challengerId;
    await storage.updateBattleMatchStatus(matchId, "forfeited", winnerId);
    await storage.awardBadge(userId, "abandon_ship", matchId);

    res.json({ ok: true, winnerId });
  }));

  return router;
}
