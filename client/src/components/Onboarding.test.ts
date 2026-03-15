import { describe, it, expect } from "vitest";
import { USERNAME_REGEX } from "./Onboarding";

describe("USERNAME_REGEX", () => {
  it("accepts valid usernames", () => {
    expect(USERNAME_REGEX.test("john_doe123")).toBe(true);
    expect(USERNAME_REGEX.test("abc")).toBe(true);
  });
  it("rejects too short usernames", () => {
    expect(USERNAME_REGEX.test("ab")).toBe(false);
  });
  it("rejects usernames with special characters", () => {
    expect(USERNAME_REGEX.test("user@name")).toBe(false);
  });
});
