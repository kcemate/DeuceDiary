import { describe, it, expect } from "vitest";
import { BattleGrid } from "./battle-grid";

describe("BattleGrid", () => {
  it("exports BattleGrid as a function", () => {
    expect(typeof BattleGrid).toBe("function");
  });
});
