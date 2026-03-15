import { describe, it, expect } from "vitest";
import { getStreakTagline } from "./ShareCardModal";

describe("getStreakTagline", () => {
  it("returns start message for streak 0", () => {
    expect(getStreakTagline(0)).toBe("Ready to start the streak");
  });
  it("returns day one message for streak 1", () => {
    expect(getStreakTagline(1)).toBe("Day one. The throne awaits.");
  });
  it("returns legend message for long streaks", () => {
    expect(getStreakTagline(365)).toBe("Absolute throne legend 👑");
  });
});
