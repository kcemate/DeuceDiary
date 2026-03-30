import { describe, it, expect, vi } from "vitest";

vi.mock("../storage", () => ({
  storage: {
    isUserInGroup: vi.fn(),
  },
}));
vi.mock("../lib/logger", () => ({
  default: { error: vi.fn(), info: vi.fn() },
}));

import { requireGroupMember } from "../groupAuth";
import { storage } from "../storage";

function makeRes() {
  const res: Record<string, unknown> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as unknown as import("express").Response;
}

describe("requireGroupMember", () => {
  const VALID_GROUP_ID = "550e8400-e29b-41d4-a716-446655440000";

  it("returns 400 when groupId is missing", async () => {
    const mw = requireGroupMember();
    const req = { params: {}, user: { id: "u1" } } as unknown as import("express").Request;
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when groupId is not a valid UUID", async () => {
    const mw = requireGroupMember();
    const req = {
      params: { groupId: "not-a-uuid" },
      user: { id: "u1" },
    } as unknown as import("express").Request;
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400);
  });

  it("returns 401 when user is not authenticated", async () => {
    const mw = requireGroupMember();
    const req = {
      params: { groupId: VALID_GROUP_ID },
      user: undefined,
    } as unknown as import("express").Request;
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(401);
  });

  it("returns 403 when user is not in the group", async () => {
    vi.mocked(storage.isUserInGroup).mockResolvedValue(false);
    const mw = requireGroupMember();
    const req = {
      params: { groupId: VALID_GROUP_ID },
      user: { id: "u1" },
    } as unknown as import("express").Request;
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next() and sets req.groupId when user is a member", async () => {
    vi.mocked(storage.isUserInGroup).mockResolvedValue(true);
    const mw = requireGroupMember();
    const req = {
      params: { groupId: VALID_GROUP_ID },
      user: { id: "u1" },
    } as unknown as import("express").Request & { groupId?: string };
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.groupId).toBe(VALID_GROUP_ID);
  });

  it("uses a custom paramName when specified", async () => {
    vi.mocked(storage.isUserInGroup).mockResolvedValue(true);
    const mw = requireGroupMember("id");
    const req = {
      params: { id: VALID_GROUP_ID },
      user: { id: "u1" },
    } as unknown as import("express").Request & { groupId?: string };
    const res = makeRes();
    const next = vi.fn();

    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
