/**
 * Thin token store used by queryClient to attach Bearer tokens.
 * In Clerk mode, ClerkTokenSync sets the getter; in dev mode it stays null
 * and requests rely on session cookies instead.
 */

let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: (() => Promise<string | null>) | null) {
  _getToken = fn;
}

export async function getAuthToken(): Promise<string | null> {
  if (!_getToken) return null;
  return _getToken();
}
