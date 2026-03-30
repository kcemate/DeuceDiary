import { describe, it, expect, vi } from "vitest";

vi.mock("../db", () => ({
  db: { transaction: vi.fn(), select: vi.fn(), insert: vi.fn(), update: vi.fn() },
  pool: { query: vi.fn(), totalCount: 0, idleCount: 0, waitingCount: 0 },
}));
vi.mock("../storage", () => ({ storage: {} }));

import {
  getTodayUTC,
  getYesterdayUTC,
  getTodayInZone,
  getYesterdayInZone,
  hashCode,
  isPremiumUser,
  getTitle,
  escapeHtml,
  stripControlChars,
  buildDisplayName,
  validateLoggedAt,
} from "../routes/helpers";

describe("getTodayUTC", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(getTodayUTC()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getYesterdayUTC", () => {
  it("returns a date one day before today", () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = getYesterdayUTC();
    expect(yesterday).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(yesterday) < new Date(today)).toBe(true);
  });
});

describe("getTodayInZone", () => {
  it("returns a YYYY-MM-DD string for a valid timezone", () => {
    expect(getTodayInZone("America/New_York")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("falls back to UTC for invalid timezone", () => {
    expect(getTodayInZone("Invalid/Zone")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getYesterdayInZone", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(getYesterdayInZone("America/New_York")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("hashCode", () => {
  it("returns a number", () => {
    expect(typeof hashCode("test")).toBe("number");
  });

  it("returns the same hash for the same input", () => {
    expect(hashCode("hello")).toBe(hashCode("hello"));
  });

  it("returns different hashes for different inputs", () => {
    expect(hashCode("hello")).not.toBe(hashCode("world"));
  });
});

describe("isPremiumUser", () => {
  it("returns false for null user", () => {
    expect(isPremiumUser(null)).toBe(false);
  });

  it("returns false when subscription is not premium", () => {
    expect(isPremiumUser({ subscription: "free", subscriptionExpiresAt: null })).toBe(false);
  });

  it("returns false when premium is expired", () => {
    const past = new Date(Date.now() - 1000).toISOString();
    expect(isPremiumUser({ subscription: "premium", subscriptionExpiresAt: past })).toBe(false);
  });

  it("returns true for active premium", () => {
    const future = new Date(Date.now() + 86400_000).toISOString();
    expect(isPremiumUser({ subscription: "premium", subscriptionExpiresAt: future })).toBe(true);
  });
});

describe("getTitle", () => {
  it("returns Rookie for < 10 logs", () => {
    expect(getTitle(0)).toBe("Rookie");
    expect(getTitle(9)).toBe("Rookie");
  });

  it("returns Regular for 10+ logs", () => {
    expect(getTitle(10)).toBe("Regular");
  });

  it("returns Legend for 500+ logs", () => {
    expect(getTitle(500)).toBe("Legend");
  });
});

describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml('<script>&"\'</script>')).toBe(
      "&lt;script&gt;&amp;&quot;&#39;&lt;/script&gt;",
    );
  });

  it("leaves plain text unchanged", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("stripControlChars", () => {
  it("removes null bytes", () => {
    expect(stripControlChars("he\x00llo")).toBe("hello");
  });

  it("preserves tabs and newlines", () => {
    expect(stripControlChars("a\tb\nc")).toBe("a\tb\nc");
  });
});

describe("buildDisplayName", () => {
  it("returns username when available", () => {
    expect(buildDisplayName({ username: "john", firstName: "John", lastName: "Doe" })).toBe("john");
  });

  it("returns full name when no username", () => {
    expect(buildDisplayName({ username: null, firstName: "John", lastName: "Doe" })).toBe("John Doe");
  });

  it("returns first name only when no last name", () => {
    expect(buildDisplayName({ username: null, firstName: "John", lastName: null })).toBe("John");
  });

  it("returns 'Someone' for null user", () => {
    expect(buildDisplayName(null)).toBe("Someone");
  });

  it("returns 'Someone' when all fields are null", () => {
    expect(buildDisplayName({ username: null, firstName: null, lastName: null })).toBe("Someone");
  });
});

describe("validateLoggedAt", () => {
  it("returns current date when dateStr is undefined", () => {
    const result = validateLoggedAt(undefined);
    expect("date" in result).toBe(true);
    if ("date" in result) {
      expect(result.date).toBeInstanceOf(Date);
    }
  });

  it("returns current date when dateStr is null", () => {
    const result = validateLoggedAt(null);
    expect("date" in result).toBe(true);
  });

  it("returns parsed date for a valid past ISO string", () => {
    const iso = new Date(Date.now() - 3600_000).toISOString();
    const result = validateLoggedAt(iso);
    expect("date" in result).toBe(true);
    if ("date" in result) {
      expect(result.date).toBeInstanceOf(Date);
    }
  });

  it("returns error for an invalid date string", () => {
    const result = validateLoggedAt("not-a-date");
    expect("error" in result).toBe(true);
    if ("error" in result) expect(result.error).toContain("Invalid");
  });

  it("returns error for a future date", () => {
    const future = new Date(Date.now() + 600_000).toISOString();
    const result = validateLoggedAt(future);
    expect("error" in result).toBe(true);
    if ("error" in result) expect(result.error).toContain("future");
  });
});
