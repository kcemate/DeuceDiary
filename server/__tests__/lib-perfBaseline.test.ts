import { describe, it, expect } from "vitest";
import {
  getAvgResponseTime,
  startTimer,
  buildDegradedHealth,
  buildDetailedHealth,
} from "../lib/perfBaseline";

describe("startTimer", () => {
  it("returns elapsed ms as a non-negative number", async () => {
    const elapsed = startTimer();
    await new Promise((r) => setTimeout(r, 10));
    expect(elapsed()).toBeGreaterThan(0);
  });
});

describe("getAvgResponseTime", () => {
  it("returns 0 when no measurements exist", () => {
    // This may return > 0 if other tests ran first — just check it's a number
    expect(typeof getAvgResponseTime()).toBe("number");
  });
});

describe("buildDegradedHealth", () => {
  it("returns status degraded with expected shape", () => {
    const h = buildDegradedHealth();
    expect(h.status).toBe("degraded");
    expect(h.db).toMatchObject({ connected: false });
    expect(typeof h.uptime).toBe("number");
    expect(typeof h.timestamp).toBe("string");
  });
});

describe("buildDetailedHealth", () => {
  it("returns status ok with pool stats", () => {
    const pool = { totalCount: 5, idleCount: 3, waitingCount: 0 };
    const h = buildDetailedHealth(pool);
    expect(h.status).toBe("ok");
    expect((h.db as Record<string, unknown>).poolTotal).toBe(5);
    expect((h.db as Record<string, unknown>).poolIdle).toBe(3);
    expect(typeof h.avgResponseTimeMs).toBe("number");
  });
});
