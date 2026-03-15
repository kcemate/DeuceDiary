import { describe, it, expect } from "vitest";
import { BingoNudge } from "./bingo-nudge";

describe("BingoNudge", () => {
  it("exports BingoNudge as a function", () => {
    expect(typeof BingoNudge).toBe("function");
  });
});
