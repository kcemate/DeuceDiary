import type { WebSocketServer } from "ws";

/** Lifetime counters for WebSocket connections. */
interface WsCounters {
  totalConnections: number;
  failedAuthentications: number;
  gracefulDisconnects: number;
  forcedDisconnects: number; // missed-pong terminations
}

let _wss: WebSocketServer | null = null;
const counters: WsCounters = {
  totalConnections: 0,
  failedAuthentications: 0,
  gracefulDisconnects: 0,
  forcedDisconnects: 0,
};

/** Register the WebSocketServer so metrics can read wss.clients.size. */
export function registerWss(wss: WebSocketServer): void {
  _wss = wss;
}

/** Number of currently-open WebSocket connections. */
export function getActiveWsConnections(): number {
  return _wss ? _wss.clients.size : 0;
}

/** Increment a named counter. */
export function incWsCounter(key: keyof WsCounters): void {
  counters[key]++;
}

/** Snapshot of all WebSocket metrics. */
export function getWsMetrics() {
  return {
    activeConnections: getActiveWsConnections(),
    ...counters,
  };
}

/** Gracefully close the WebSocket server (used during shutdown). */
export function closeWss(): Promise<void> {
  return new Promise((resolve) => {
    if (!_wss) return resolve();
    _wss.close(() => resolve());
  });
}
