import { describe, it, expect } from "vitest";
import { AchievementBadge } from "./Badge";

describe("AchievementBadge", () => {
  it("exports AchievementBadge as a function", () => {
    expect(typeof AchievementBadge).toBe("function");
  });
});
