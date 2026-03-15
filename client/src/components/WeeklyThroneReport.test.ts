import { describe, it, expect } from "vitest";
import { formatWeekRange, formatDayName, truncate, getWeeklyHeadline } from "./WeeklyThroneReport";

describe("WeeklyThroneReport utils", () => {
  it("formatWeekRange returns a date range string", () => {
    expect(formatWeekRange("2024-01-01")).toBe("Jan 1 – Jan 7");
  });
  it("formatDayName returns short weekday", () => {
    expect(formatDayName("2024-01-01")).toBe("Mon");
  });
  it("truncate shortens long strings", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
    expect(truncate("hi", 5)).toBe("hi");
  });
  it("getWeeklyHeadline returns quiet week for zero deuces", () => {
    const report = { totalDeuces: 0, peakDay: { date: "", count: 0 }, mostActiveSquad: { name: "", count: 0 }, longestStreak: 0, funniestEntry: null, totalReactionsReceived: 0, weekOf: "", dailyCounts: [] };
    expect(getWeeklyHeadline(report)).toBe("A quiet week on the throne 🤫");
  });
});
