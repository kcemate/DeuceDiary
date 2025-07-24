import type { User } from "@shared/schema";

export const getUserDisplayName = (user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): string => {
  // Prefer username if available
  if (user.username) {
    return user.username;
  }
  
  // Fall back to first name + last name
  if (user.firstName) {
    return `${user.firstName} ${user.lastName || ""}`.trim();
  }
  
  // Final fallback
  return "Unknown User";
};

export const getInitials = (user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}): string => {
  // If we have a username, use first 2 characters
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  
  // Otherwise use first letters of first/last name
  if (user.firstName) {
    return `${user.firstName[0]}${user.lastName?.[0] || ""}`.toUpperCase();
  }
  
  return "U";
};

export const getUserSecondaryInfo = (user: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  deuceCount?: number;
}): string => {
  const deuceCount = user.deuceCount || 0;
  return `${deuceCount} deuces`;
};