import { vi, describe, it, expect, beforeAll } from "vitest";

vi.mock("@/contexts/ThemeContext", () => ({ ThemeProvider: ({ children }: any) => children }));

describe("App", () => {
  it("exports App as a function", async () => {
    const { default: App } = await import("./App");
    expect(typeof App).toBe("function");
  });
});
