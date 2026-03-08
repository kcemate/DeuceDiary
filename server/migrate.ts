/**
 * server/migrate.ts
 * Re-exports runMigrations so server/index.ts can call it inline,
 * eliminating the need for a separate dist/migrate.js entry point.
 */
export { runMigrations } from "../scripts/db-migrate";
