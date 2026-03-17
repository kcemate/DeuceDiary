import type { Request } from "express";

/**
 * Express Request after both `isAuthenticated` and `requireGroupMember` middleware have run.
 * Narrows `groupId` from `string | undefined` (global augmentation) to `string`.
 */
export type GroupRequest = Request & { groupId: string };
