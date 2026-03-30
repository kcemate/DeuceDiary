import { describe, it, expect, vi } from "vitest";

vi.mock("../db", () => ({
  db: { transaction: vi.fn(), select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool: {},
}));
vi.mock("../storage", () => ({ storage: {} }));

import {
  sanitizeUserForResponse,
  parseOrFail,
  asyncRoute,
} from "../routes/helpers";
import { z } from "zod";

describe("sanitizeUserForResponse", () => {
  it("keeps only allowed fields", () => {
    const user = {
      id: "u1",
      username: "john",
      firstName: "John",
      lastName: "Doe",
      profileImageUrl: "https://example.com/pic.jpg",
      deuceCount: 42,
      secretField: "should not appear",
      subscription: "premium",
    };
    const safe = sanitizeUserForResponse(user);
    expect(safe.id).toBe("u1");
    expect(safe.username).toBe("john");
    expect(safe.deuceCount).toBe(42);
    expect((safe as Record<string, unknown>).secretField).toBeUndefined();
    expect((safe as Record<string, unknown>).subscription).toBeUndefined();
  });

  it("uses null defaults for missing optional fields", () => {
    const safe = sanitizeUserForResponse({ id: "u1" });
    expect(safe.username).toBeNull();
    expect(safe.profileImageUrl).toBeNull();
    expect(safe.deuceCount).toBe(0);
  });
});

describe("parseOrFail", () => {
  const schema = z.object({ name: z.string().min(1) });

  function mockRes() {
    const res: Record<string, unknown> = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res as unknown as import("express").Response;
  }

  it("returns parsed data on success", () => {
    const res = mockRes();
    const result = parseOrFail(schema, { name: "Alice" }, res, "Bad input");
    expect(result).toEqual({ name: "Alice" });
  });

  it("sends 400 and returns null on failure", () => {
    const res = mockRes();
    const result = parseOrFail(schema, { name: "" }, res, "Name required");
    expect(result).toBeNull();
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400);
  });
});

describe("asyncRoute", () => {
  it("calls the handler and lets it respond normally", async () => {
    const handler = vi.fn().mockResolvedValue(undefined);
    const mw = asyncRoute("doing thing", "Failed to do thing", handler);

    const req = {} as import("express").Request;
    const res = { status: vi.fn(), json: vi.fn() } as unknown as import("express").Response;
    const next = vi.fn();

    await mw(req, res, next);
    expect(handler).toHaveBeenCalledWith(req, res);
  });

  it("sends 500 when the handler throws", async () => {
    const handler = vi.fn().mockRejectedValue(new Error("boom"));
    const mw = asyncRoute("doing thing", "Failed to do thing", handler);

    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { status } as unknown as import("express").Response;

    await mw({} as import("express").Request, res, vi.fn());
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ message: "Failed to do thing" });
  });
});
