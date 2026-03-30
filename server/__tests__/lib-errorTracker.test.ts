import { describe, it, expect } from "vitest";
import { getRecentErrors } from "../lib/errorTracker";

describe("getRecentErrors", () => {
  it("returns an array", () => {
    const errors = getRecentErrors(10);
    expect(Array.isArray(errors)).toBe(true);
  });

  it("respects the limit parameter", () => {
    const errors = getRecentErrors(5);
    expect(errors.length).toBeLessThanOrEqual(5);
  });

  it("returns at most 200 errors", () => {
    const errors = getRecentErrors(999);
    expect(errors.length).toBeLessThanOrEqual(200);
  });
});
