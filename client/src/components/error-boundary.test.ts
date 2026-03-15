import { describe, it, expect } from "vitest";
import { ErrorBoundary } from "./error-boundary";

describe("ErrorBoundary", () => {
  it("exports ErrorBoundary as a function", () => {
    expect(typeof ErrorBoundary).toBe("function");
  });
});
