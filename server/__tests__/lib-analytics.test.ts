import { describe, it, expect, vi } from "vitest";
import { track, trackEvent, Events } from "../lib/analytics";

// analytics silently swallows errors when db is not available — just verify
// it doesn't throw and returns a promise.

describe("track", () => {
  it("returns a promise and does not throw", async () => {
    await expect(track("test_event", "user_123", { foo: "bar" })).resolves.toBeUndefined();
  });

  it("works without userId or props", async () => {
    await expect(track("anon_event")).resolves.toBeUndefined();
  });
});

describe("trackEvent", () => {
  it("accepts userId-first signature", async () => {
    await expect(trackEvent("user_456", "some_event", { x: 1 })).resolves.toBeUndefined();
  });
});

describe("Events", () => {
  it("Events.userSignup does not throw", async () => {
    await expect(Events.userSignup("u1")).resolves.toBeUndefined();
  });

  it("Events.deuceLogged does not throw", async () => {
    await expect(Events.deuceLogged("u1", { groupCount: 1 })).resolves.toBeUndefined();
  });

  it("Events.groupJoined does not throw", async () => {
    await expect(Events.groupJoined("u1", "g1")).resolves.toBeUndefined();
  });

  it("Events.streakMilestone does not throw", async () => {
    await expect(Events.streakMilestone("u1", "g1", 7)).resolves.toBeUndefined();
  });

  it("Events.premiumUpgrade does not throw", async () => {
    await expect(Events.premiumUpgrade("u1", "settings")).resolves.toBeUndefined();
  });
});
