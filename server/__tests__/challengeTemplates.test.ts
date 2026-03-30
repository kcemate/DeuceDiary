import { describe, it, expect } from "vitest";
import { CHALLENGE_TEMPLATES, getTemplateByKey } from "../challengeTemplates";

describe("CHALLENGE_TEMPLATES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(CHALLENGE_TEMPLATES)).toBe(true);
    expect(CHALLENGE_TEMPLATES.length).toBeGreaterThan(0);
  });

  it("each template has key, title, and description", () => {
    for (const t of CHALLENGE_TEMPLATES) {
      expect(typeof t.key).toBe("string");
      expect(t.key.length).toBeGreaterThan(0);
      expect(typeof t.title).toBe("string");
      expect(typeof t.description).toBe("string");
    }
  });

  it("all keys are unique", () => {
    const keys = CHALLENGE_TEMPLATES.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("getTemplateByKey", () => {
  it("returns the template for a valid key", () => {
    const first = CHALLENGE_TEMPLATES[0];
    const result = getTemplateByKey(first.key);
    expect(result).toBeDefined();
    expect(result?.key).toBe(first.key);
  });

  it("returns undefined for an unknown key", () => {
    expect(getTemplateByKey("nonexistent_key_xyz")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getTemplateByKey("")).toBeUndefined();
  });
});
