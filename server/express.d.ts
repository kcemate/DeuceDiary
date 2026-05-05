/**
 * Global Express + express-session type augmentation.
 *
 * Adds custom properties set by auth and group middleware so that all route
 * handlers can use typed `req` parameters instead of `req: any`.
 *
 * Properties:
 *  - req.user        — set by isAuthenticated (always present on authenticated routes)
 *  - req.clerkAuth   — set by isAuthenticated in Clerk mode (JWT claims)
 *  - req.groupId     — set by requireGroupMember middleware
 *  - req.session.userId / referralCode — dev-mode session fields
 */

import type { User } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user — set by isAuthenticated middleware */
      user: User;
      /** Decoded Clerk JWT claims — set by isAuthenticated in Clerk mode */
      clerkAuth?: {
        sub: string;
        email?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        image_url?: string | null;
        plan?: string;
        o?: { per?: string };
        fea?: string[];
      } & Record<string, unknown>;
      /** Group ID — set by requireGroupMember middleware */
      groupId: string;
    }
  }
}

declare module "express-session" {
  interface SessionData {
    /** Dev-mode authenticated user ID */
    userId?: string;
    /** Referral code captured from /join?ref= landing page */
    referralCode?: string;
  }
}

export {};
