import express, { type Express, type Request, type Response } from "express";
import logger from "./lib/logger";
import { createServer, type Server, type IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";

/** WebSocket connection that has been authenticated and annotated with per-connection state. */
interface AuthenticatedWebSocket extends WebSocket {
  userId: string;
  missedPongs: number;
  subscribedGroups: Set<string>;
}

/** HTTP IncomingMessage augmented with session data injected by session middleware. */
type SessionRequest = IncomingMessage & { session?: { userId?: string } };
import { storage } from "./storage";
import { setupAuth, clerkEnabled, clerk, getSession } from "./replitAuth";
import { registerClerkWebhook } from "./routes/webhooks";
import { registerRevenueCatWebhook } from "./routes/webhooks/revenuecat";
import { createAdminRouter } from "./routes/admin";
import { createAuthRouter } from "./routes/auth";
import { createGroupsRouter } from "./routes/groups";
import { createDeucesRouter } from "./routes/deuces";
import { createNotificationsRouter } from "./routes/notifications";
import { createPublicRouter } from "./routes/public";
import { createPremiumRouter } from "./routes/premium";
import { createBingoRouter } from "./routes/bingo";
import { createPassportRouter } from "./routes/passport";
import { createKingRouter } from "./routes/king";
import { createBattleRouter } from "./routes/battle";
import { v4 as uuidv4 } from "uuid";
import { promises as fs } from "fs";
import path from "path";
import { registerWss, incWsCounter, getWsMetrics } from "./lib/wsMetrics";
import { sendPushToGroup } from "./push";

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'dist', 'public', 'uploads');
  try {
    await fs.mkdir(uploadsDir, { recursive: true });
  } catch {
    logger.info('Uploads directory already exists or created successfully');
  }

  // --- Webhooks (must be before session middleware — need raw body) ---
  registerClerkWebhook(app);
  registerRevenueCatWebhook(app);

  // --- Session / auth middleware ---
  await setupAuth(app);

  // --- Static file serving ---
  app.use('/uploads', express.static(path.join(process.cwd(), 'dist', 'public', 'uploads')));

  // --- Mount sub-routers ---
  app.use(createAdminRouter());
  app.use(createAuthRouter(uploadsDir));
  app.use(createGroupsRouter(uploadsDir));
  app.use(createNotificationsRouter());
  app.use(createPublicRouter());
  app.use(createPremiumRouter());
  app.use(createBingoRouter());
  app.use(createPassportRouter());
  app.use(createKingRouter());
  app.use(createBattleRouter());

  // --- HTTP + WebSocket server ---
  const httpServer = createServer(app);

  const wss = new WebSocketServer({ noServer: true });
  registerWss(wss);
  const groupConnections = new Map<string, Set<AuthenticatedWebSocket>>();

  // Authenticate WebSocket upgrade requests
  const sessionMiddleware = getSession();
  httpServer.on('upgrade', async (req, socket, head) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    if (url.pathname !== '/ws') {
      socket.destroy();
      return;
    }

    try {
      let userId: string | null = null;

      if (clerkEnabled) {
        const token = url.searchParams.get('token');
        if (!token) {
          incWsCounter('failedAuthentications');
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
        try {
          const payload = await clerk!.verifyToken(token);
          const user = await storage.getUser(payload.sub);
          if (!user) {
            incWsCounter('failedAuthentications');
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
          userId = user.id;
        } catch (wsAuthErr) {
          logger.warn({ err: wsAuthErr }, "[WebSocket] Auth token verification failed");
          incWsCounter('failedAuthentications');
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
      } else {
        const res = { end() {}, setHeader() {}, getHeader() {} } as unknown as Response;
        const sessionReq = req as SessionRequest;
        await new Promise<void>((resolve) => {
          sessionMiddleware(sessionReq as unknown as Request, res, () => resolve());
        });
        userId = sessionReq.session?.userId || null;
        if (!userId) {
          incWsCounter('failedAuthentications');
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
        const user = await storage.getUser(userId);
        if (!user) {
          incWsCounter('failedAuthentications');
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        (ws as AuthenticatedWebSocket).userId = userId!;
        wss.emit('connection', ws, req);
      });
    } catch (error) {
      logger.error('WebSocket auth error:', error);
      socket.destroy();
    }
  });

  // Heartbeat: ping every 30s, kill connections that miss 2 pongs
  const PING_INTERVAL_MS = 30_000;
  const MAX_MISSED_PONGS = 2;

  const pingInterval = setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = ws as AuthenticatedWebSocket;
      if (client.missedPongs >= MAX_MISSED_PONGS) {
        incWsCounter('forcedDisconnects');
        logger.info(
          `WebSocket terminating dead connection (user ${client.userId}, missed ${client.missedPongs} pongs)`,
        );
        ws.terminate();
        return;
      }
      client.missedPongs = (client.missedPongs ?? 0) + 1;
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    });
  }, PING_INTERVAL_MS);

  // Dead connection sweep: every 60s remove terminated sockets from groupConnections
  const sweepInterval = setInterval(() => {
    for (const [groupId, conns] of Array.from(groupConnections)) {
      for (const ws of Array.from(conns)) {
        if (ws.readyState !== WebSocket.OPEN) conns.delete(ws);
      }
      if (conns.size === 0) groupConnections.delete(groupId);
    }
  }, 60_000);

  wss.on('close', () => {
    clearInterval(pingInterval);
    clearInterval(sweepInterval);
  });

  wss.on('connection', (ws: WebSocket) => {
    const authWs = ws as AuthenticatedWebSocket;
    const userId = authWs.userId;
    incWsCounter('totalConnections');
    logger.info(`WebSocket connection authenticated for user ${userId}`);

    authWs.missedPongs = 0;
    ws.on('pong', () => { authWs.missedPongs = 0; });

    authWs.subscribedGroups = new Set<string>();

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === 'join_group') {
          const groupId = data.groupId;
          if (!groupId || typeof groupId !== 'string') {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid groupId' }));
            return;
          }
          const isMember = await storage.isUserInGroup(userId, groupId);
          if (!isMember) {
            ws.send(JSON.stringify({ type: 'error', message: 'Not a member of this group' }));
            return;
          }
          if (!groupConnections.has(groupId)) groupConnections.set(groupId, new Set());
          groupConnections.get(groupId)?.add(authWs);
          authWs.subscribedGroups.add(groupId);
          ws.send(JSON.stringify({ type: 'join_group_ok', groupId }));
        } else if (data.type === 'leave_group') {
          const groupId = data.groupId;
          if (!groupId || typeof groupId !== 'string') {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid groupId' }));
            return;
          }
          const conns = groupConnections.get(groupId);
          if (conns) {
            conns.delete(authWs);
            if (conns.size === 0) groupConnections.delete(groupId);
          }
          authWs.subscribedGroups.delete(groupId);
        }
      } catch (error) {
        logger.error('Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      incWsCounter('gracefulDisconnects');
      for (const groupId of authWs.subscribedGroups) {
        const conns = groupConnections.get(groupId);
        if (conns) {
          conns.delete(authWs);
          if (conns.size === 0) groupConnections.delete(groupId);
        }
      }
    });
  });

  function broadcastToGroup(groupId: string, message: Record<string, unknown>) {
    const connections = groupConnections.get(groupId);
    const onlineUserIds = new Set<string>();
    if (connections) {
      const stamped = { msgId: uuidv4(), ...message };
      const payload = JSON.stringify(stamped);
      connections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
          onlineUserIds.add(ws.userId);
        }
      });
    }

    // Send push notification to offline group members
    if (message.type === 'deuce_logged' && message.userId) {
      (async () => {
        try {
          const members = await storage.getGroupMembers(groupId);
          const offlineUserIds = members
            .filter(m => m.userId !== message.userId && !onlineUserIds.has(m.userId))
            .map(m => m.userId);
          if (offlineUserIds.length > 0) {
            await sendPushToGroup(offlineUserIds, {
              title: 'Deuce Diary',
              body: (message.message as string) || 'Someone logged a deuce!',
              icon: '/icon-192.png',
              url: '/',
              tag: `deuce-${groupId}`,
            });
          }
        } catch (err) {
          logger.error({ err }, 'Failed to send push notifications for group broadcast');
        }
      })();
    }
  }

  // Mount deuces router after broadcastToGroup is defined
  app.use(createDeucesRouter(broadcastToGroup));

  // Cleanup expired invites periodically
  setInterval(async () => {
    try {
      await storage.cleanupExpiredInvites();
    } catch (error) {
      logger.error('Error cleaning up expired invites:', error);
    }
  }, 60 * 60 * 1000);

  return httpServer;
}
