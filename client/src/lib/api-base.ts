/**
 * API base URL for native vs web.
 *
 * On web (browser): relative URLs ("/api/...") work — same origin.
 * On native (Capacitor): we need absolute URLs pointing to the production backend.
 */

const PROD_API_BASE = "https://deucediary.com";

// Capacitor sets window.Capacitor when running natively
const isNative = typeof window !== "undefined" && !!(window as any).Capacitor?.isNativePlatform?.();

export const API_BASE = isNative ? PROD_API_BASE : "";

/**
 * Resolves a relative API path to a full URL in native mode.
 * e.g. "/api/auth/user" → "https://deucediary.com/api/auth/user"
 */
export function apiUrl(path: string): string {
  if (path.startsWith("http")) return path; // already absolute
  return `${API_BASE}${path}`;
}