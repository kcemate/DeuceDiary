import { describe, it, expect } from "vitest";
import logger from "../lib/logger";

describe("logger", () => {
  it("is a pino-compatible logger object", () => {
    expect(typeof logger).toBe("object");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.debug).toBe("function");
  });

  it("info does not throw", () => {
    expect(() => logger.info("test message")).not.toThrow();
  });

  it("error does not throw", () => {
    expect(() => logger.error({ err: new Error("test") }, "test error")).not.toThrow();
  });

  it("warn does not throw", () => {
    expect(() => logger.warn("test warning")).not.toThrow();
  });
});
