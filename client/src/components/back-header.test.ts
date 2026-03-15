import { describe, it, expect } from "vitest";
import { BackHeader } from "./back-header";

describe("BackHeader", () => {
  it("exports BackHeader as a function", () => {
    expect(typeof BackHeader).toBe("function");
  });
});
