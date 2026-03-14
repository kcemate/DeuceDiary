/**
 * WebSocket connection monitor.
 * Tracks live connection count, total connects/disconnects, and auth rejections.
 * Exposed at GET /api/internal/ws-stats (requires X-Internal-Key).
 */

interface WsStats {
  activeConnections: number;
  totalConnects: number;
  totalDisconnects: number;
  totalAuthRejections: number;
  peakConcurrent: number;
}

const stats: WsStats = {
  activeConnections: 0,
  totalConnects: 0,
  totalDisconnects: 0,
  totalAuthRejections: 0,
  peakConcurrent: 0,
};

export function recordWsConnect(userId: string): void {
  stats.activeConnections++;
  stats.totalConnects++;
  if (stats.activeConnections > stats.peakConcurrent) {
    stats.peakConcurrent = stats.activeConnections;
  }
  process.stdout.write(
    JSON.stringify({ ts: new Date().toISOString(), event: "ws_connect", userId, active: stats.activeConnections }) + "\n",
  );
}

export function recordWsDisconnect(userId: string): void {
  stats.activeConnections = Math.max(0, stats.activeConnections - 1);
  stats.totalDisconnects++;
  process.stdout.write(
    JSON.stringify({ ts: new Date().toISOString(), event: "ws_disconnect", userId, active: stats.activeConnections }) + "\n",
  );
}

export function recordWsAuthRejection(): void {
  stats.totalAuthRejections++;
}

export function getWsStats(): WsStats & { timestamp: string } {
  return { ...stats, timestamp: new Date().toISOString() };
}
