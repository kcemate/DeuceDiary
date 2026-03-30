import { describe, it, expect, vi } from "vitest";
import { instrumentPool } from "../lib/slowQueryLogger";

describe("instrumentPool", () => {
  it("wraps pool.query and still returns the result", async () => {
    const mockPool = {
      query: vi.fn().mockResolvedValue({ rows: [{ val: 1 }] }),
    };

    instrumentPool(mockPool);
    const result = await mockPool.query("SELECT 1") as { rows: { val: number }[] };
    expect(result.rows[0].val).toBe(1);
  });

  it("re-throws errors from the original query", async () => {
    const mockPool = {
      query: vi.fn().mockRejectedValue(new Error("db error")),
    };

    instrumentPool(mockPool);
    await expect(mockPool.query("SELECT 1")).rejects.toThrow("db error");
  });

  it("instruments the pool in-place (mutates pool.query)", () => {
    const original = vi.fn().mockResolvedValue({});
    const mockPool = { query: original };

    instrumentPool(mockPool);
    expect(mockPool.query).not.toBe(original);
  });
});
