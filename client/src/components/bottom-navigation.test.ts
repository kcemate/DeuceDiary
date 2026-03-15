import { describe, it, expect } from "vitest";
import { BottomNavigation } from "./bottom-navigation";

describe("BottomNavigation", () => {
  it("exports BottomNavigation as a function", () => {
    expect(typeof BottomNavigation).toBe("function");
  });
});
