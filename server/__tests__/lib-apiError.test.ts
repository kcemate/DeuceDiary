import { describe, it, expect, vi } from "vitest";
import { apiError, Errors } from "../lib/apiError";

function mockRes() {
  const res: Record<string, unknown> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as unknown as import("express").Response;
}

describe("apiError", () => {
  it("sends the correct status and JSON shape", () => {
    const res = mockRes();
    apiError(res, 400, "BAD_INPUT", "Something went wrong");
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400);
    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(body.code).toBe("BAD_INPUT");
    expect(body.error).toBe("Something went wrong");
    expect(body.status).toBe(400);
  });
});

describe("Errors", () => {
  it("unauthorized sends 401", () => {
    const res = mockRes();
    Errors.unauthorized(res);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(401);
  });

  it("forbidden sends 403", () => {
    const res = mockRes();
    Errors.forbidden(res);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(403);
  });

  it("notFound sends 404", () => {
    const res = mockRes();
    Errors.notFound(res, "User");
    const body = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(404);
    expect(body.error).toContain("User");
  });

  it("badRequest sends 400", () => {
    const res = mockRes();
    Errors.badRequest(res, "bad input");
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(400);
  });

  it("conflict sends 409", () => {
    const res = mockRes();
    Errors.conflict(res, "duplicate");
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(409);
  });

  it("tooManyRequests sends 429", () => {
    const res = mockRes();
    Errors.tooManyRequests(res, "slow down");
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(429);
  });

  it("internal sends 500", () => {
    const res = mockRes();
    Errors.internal(res);
    expect((res.status as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBe(500);
  });
});
