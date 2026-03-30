import { describe, it, expect, vi } from "vitest";

// Mock DB before importing premiumAuth
vi.mock("../db", () => ({
  db: {},
  pool: {},
}));
vi.mock("../storage", () => ({ storage: {} }));

import { requiresPremiumFor } from "../premiumAuth";

describe("requiresPremiumFor", () => {
  it("returns a middleware function", () => {
    const middleware = requiresPremiumFor("some_feature");
    expect(typeof middleware).toBe("function");
  });

  it("calls next() for a premium user", () => {
    const middleware = requiresPremiumFor("bingo");
    const futureDate = new Date(Date.now() + 86400_000).toISOString();
    const req = {
      user: { subscription: "premium", subscriptionExpiresAt: futureDate },
    } as unknown as import("express").Request;
    const res = {} as import("express").Response;
    const next = vi.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("sends 403 for a non-premium user", () => {
    const middleware = requiresPremiumFor("bingo");
    const req = {
      user: { subscription: "free", subscriptionExpiresAt: null },
    } as unknown as import("express").Request;
    const json = vi.fn();
    const status = vi.fn().mockReturnValue({ json });
    const res = { status } as unknown as import("express").Response;
    const next = vi.fn();

    middleware(req, res, next);
    expect(status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
