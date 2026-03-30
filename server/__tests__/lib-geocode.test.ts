import { describe, it, expect, vi } from "vitest";
import { triggerPassportStamp } from "../lib/geocode";

describe("triggerPassportStamp", () => {
  it("does nothing when latitude is null", () => {
    // Should not throw or call onGeo
    const onGeo = vi.fn();
    triggerPassportStamp(null, 10, onGeo);
    expect(onGeo).not.toHaveBeenCalled();
  });

  it("does nothing when longitude is null", () => {
    const onGeo = vi.fn();
    triggerPassportStamp(40, null, onGeo);
    expect(onGeo).not.toHaveBeenCalled();
  });

  it("does nothing when both are undefined", () => {
    const onGeo = vi.fn();
    triggerPassportStamp(undefined, undefined, onGeo);
    expect(onGeo).not.toHaveBeenCalled();
  });

  it("fires without throwing when lat/lng are provided (fire-and-forget)", () => {
    // triggerPassportStamp is fire-and-forget — it starts the geocode but doesn't block.
    // Just verify it doesn't throw synchronously.
    const onGeo = vi.fn().mockResolvedValue(undefined);
    expect(() => triggerPassportStamp(37.7749, -122.4194, onGeo)).not.toThrow();
  });
});
