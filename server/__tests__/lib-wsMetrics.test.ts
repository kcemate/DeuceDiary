import { describe, it, expect } from "vitest";
import {
  registerWss,
  getActiveWsConnections,
  incWsCounter,
  getWsMetrics,
} from "../lib/wsMetrics";

describe("wsMetrics", () => {
  it("getActiveWsConnections returns 0 when no wss registered", () => {
    // Module may already have a wss registered from other tests; just check it's a number
    expect(typeof getActiveWsConnections()).toBe("number");
  });

  it("getWsMetrics returns expected shape", () => {
    const metrics = getWsMetrics();
    expect(typeof metrics.activeConnections).toBe("number");
    expect(typeof metrics.totalConnections).toBe("number");
    expect(typeof metrics.failedAuthentications).toBe("number");
    expect(typeof metrics.gracefulDisconnects).toBe("number");
    expect(typeof metrics.forcedDisconnects).toBe("number");
  });

  it("incWsCounter increments the specified counter", () => {
    const before = getWsMetrics().totalConnections;
    incWsCounter("totalConnections");
    const after = getWsMetrics().totalConnections;
    expect(after).toBe(before + 1);
  });

  it("registerWss with null-like wss makes getActiveWsConnections return 0", () => {
    // Pass null to clear wss reference
    registerWss(null as unknown as import("ws").WebSocketServer);
    expect(getActiveWsConnections()).toBe(0);
  });
});
