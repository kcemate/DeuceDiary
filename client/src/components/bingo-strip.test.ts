import { describe, it, expect } from "vitest";
import { BingoStrip } from "./bingo-strip";

describe("BingoStrip", () => {
  it("exports BingoStrip as a function", () => {
    expect(typeof BingoStrip).toBe("function");
  });
});
