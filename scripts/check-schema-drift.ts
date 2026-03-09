/**
 * check-schema-drift.ts — Detects column/type drift between shared/schema.ts and the live DB.
 *
 * Usage:
 *   npx tsx scripts/check-schema-drift.ts          # report only (exit 1 if drift)
 *   npx tsx scripts/check-schema-drift.ts --fix     # report + auto-fix missing columns
 *
 * Requires DATABASE_URL env var.
 */

import pg from "pg";
import { getTableConfig } from "drizzle-orm/pg-core";
import * as schema from "../shared/schema.ts";

const { Pool } = pg;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FIX_MODE = process.argv.includes("--fix");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// ---------------------------------------------------------------------------
// Drizzle type → Postgres type mapping
// ---------------------------------------------------------------------------

/** Map drizzle-orm column dataType to the expected information_schema data_type / udt_name */
function normalizeDrizzleType(col: {
  dataType: string;
  columnType: string;
  length?: number;
}): { data_type: string; udt_name: string } {
  const dt = col.dataType;
  const ct = col.columnType;

  if (ct === "PgText") {
    return { data_type: "text", udt_name: "text" };
  }
  if (ct === "PgVarchar" || dt === "string") {
    return { data_type: "character varying", udt_name: "varchar" };
  }
  if (dt === "number" && ct === "PgInteger") {
    return { data_type: "integer", udt_name: "int4" };
  }
  if (dt === "number" && ct === "PgSerial") {
    return { data_type: "integer", udt_name: "int4" };
  }
  if (dt === "date" || ct === "PgTimestamp") {
    return { data_type: "timestamp without time zone", udt_name: "timestamp" };
  }
  if (dt === "boolean" || ct === "PgBoolean") {
    return { data_type: "boolean", udt_name: "bool" };
  }
  if (dt === "json" || ct === "PgJsonb") {
    return { data_type: "jsonb", udt_name: "jsonb" };
  }
  // fallback
  return { data_type: dt, udt_name: dt };
}

/** Build the ALTER TABLE ... ADD COLUMN SQL for a missing column */
function buildAddColumnSQL(
  tableName: string,
  col: ReturnType<typeof getTableConfig>["columns"][number],
): string {
  const parts: string[] = [`ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS`];
  const name = col.name; // already the DB column name

  let pgType: string;
  const ct = col.columnType;
  if (ct === "PgVarchar") {
    const len = (col as any).length;
    pgType = len ? `varchar(${len})` : "varchar";
  } else if (ct === "PgText") {
    pgType = "text";
  } else if (ct === "PgInteger") {
    pgType = "integer";
  } else if (ct === "PgSerial") {
    pgType = "serial";
  } else if (ct === "PgTimestamp") {
    pgType = "timestamp";
  } else if (ct === "PgBoolean") {
    pgType = "boolean";
  } else if (ct === "PgJsonb") {
    pgType = "jsonb";
  } else {
    pgType = "text"; // safe fallback
  }

  parts.push(`"${name}" ${pgType}`);

  if (col.notNull && col.default !== undefined) {
    // Emit DEFAULT before NOT NULL
    const def = extractDefault(col);
    if (def !== null) parts.push(`DEFAULT ${def}`);
    parts.push("NOT NULL");
  } else if (col.notNull) {
    // NOT NULL with no default — can only add if table is empty, still emit it
    parts.push("NOT NULL");
  } else if (col.default !== undefined) {
    const def = extractDefault(col);
    if (def !== null) parts.push(`DEFAULT ${def}`);
  }

  return parts.join(" ");
}

function extractDefault(col: any): string | null {
  const d = col.default;
  if (d === undefined || d === null) return null;
  // drizzle stores defaults as SQL objects or raw values
  if (typeof d === "object" && d !== null && "queryChunks" in d) {
    // Drizzle SQL object — try to get the raw string
    try {
      const chunks = d.queryChunks || d.chunks || [];
      const raw = chunks.map((c: any) => (typeof c === "string" ? c : c?.value ?? "")).join("");
      return raw || null;
    } catch {
      return null;
    }
  }
  if (typeof d === "string") return `'${d}'`;
  if (typeof d === "number") return String(d);
  if (typeof d === "boolean") return d ? "true" : "false";
  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface DbColumn {
  table_name: string;
  column_name: string;
  data_type: string;
  udt_name: string;
  is_nullable: string;
}

async function main() {
  console.log("🔍 Schema drift check — comparing shared/schema.ts ↔ live database\n");

  // 1. Extract expected schema from drizzle table definitions
  const expectedTables: Map<
    string,
    ReturnType<typeof getTableConfig>
  > = new Map();

  for (const val of Object.values(schema)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      try {
        const cfg = getTableConfig(val as any);
        expectedTables.set(cfg.name, cfg);
      } catch {
        // not a table — skip
      }
    }
  }

  console.log(`   Tables in schema.ts: ${[...expectedTables.keys()].join(", ")}\n`);

  // 2. Fetch live DB columns
  const { rows: dbColumns } = await pool.query<DbColumn>(
    `SELECT table_name, column_name, data_type, udt_name, is_nullable
     FROM information_schema.columns
     WHERE table_schema = 'public'
     ORDER BY table_name, ordinal_position`,
  );

  const liveSchema = new Map<string, Map<string, DbColumn>>();
  for (const row of dbColumns) {
    if (!liveSchema.has(row.table_name)) liveSchema.set(row.table_name, new Map());
    liveSchema.get(row.table_name)!.set(row.column_name, row);
  }

  // 3. Fetch live indexes
  const { rows: dbIndexes } = await pool.query<{ tablename: string; indexname: string }>(
    `SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public'`,
  );

  const liveIndexes = new Set<string>();
  for (const row of dbIndexes) {
    liveIndexes.add(row.indexname);
  }

  // 4. Compare
  let driftCount = 0;
  const fixes: string[] = [];

  for (const [tableName, cfg] of expectedTables) {
    const liveCols = liveSchema.get(tableName);

    if (!liveCols) {
      console.log(`❌ TABLE MISSING: "${tableName}" exists in schema.ts but NOT in database`);
      driftCount++;
      continue;
    }

    for (const col of cfg.columns) {
      const liveCol = liveCols.get(col.name);

      if (!liveCol) {
        console.log(`❌ MISSING COLUMN: "${tableName}"."${col.name}"`);
        driftCount++;
        const sql = buildAddColumnSQL(tableName, col);
        fixes.push(sql);
        continue;
      }

      // Type comparison
      const expected = normalizeDrizzleType(col as any);
      if (
        liveCol.udt_name !== expected.udt_name &&
        liveCol.data_type !== expected.data_type
      ) {
        console.log(
          `⚠️  TYPE MISMATCH: "${tableName}"."${col.name}" — ` +
            `expected ${expected.data_type} (${expected.udt_name}), ` +
            `got ${liveCol.data_type} (${liveCol.udt_name})`,
        );
        driftCount++;
      }

      // Nullability check
      const expectNotNull = col.notNull;
      const liveNotNull = liveCol.is_nullable === "NO";
      if (expectNotNull && !liveNotNull) {
        console.log(
          `⚠️  NULLABLE MISMATCH: "${tableName}"."${col.name}" — ` +
            `expected NOT NULL, but column is nullable in DB`,
        );
        driftCount++;
      }
    }

    // Check expected indexes
    for (const idx of cfg.indexes) {
      const idxConfig = idx.config as any;
      const idxName = idxConfig?.name;
      if (idxName && !liveIndexes.has(idxName)) {
        console.log(`❌ MISSING INDEX: "${idxName}" on "${tableName}"`);
        driftCount++;
      }
    }
  }

  // 5. Report
  console.log("");

  if (driftCount === 0) {
    console.log("✅ No schema drift detected — database matches schema.ts");
    await pool.end();
    process.exit(0);
  }

  console.log(`\n🚨 ${driftCount} drift issue(s) detected`);

  if (FIX_MODE && fixes.length > 0) {
    console.log(`\n🔧 Applying ${fixes.length} fix(es)...\n`);
    for (const sql of fixes) {
      try {
        console.log(`   → ${sql}`);
        await pool.query(sql);
        console.log(`   ✅ OK`);
      } catch (err: any) {
        console.error(`   ❌ Failed: ${err.message}`);
      }
    }
    console.log("\n💡 Re-run without --fix to verify remaining issues.");
  } else if (fixes.length > 0) {
    console.log(`\n💡 Run with --fix to auto-add ${fixes.length} missing column(s):`);
    for (const sql of fixes) {
      console.log(`   ${sql}`);
    }
  }

  await pool.end();
  process.exit(1);
}

main().catch((err) => {
  console.error("💥 Schema drift check crashed:", err.message);
  process.exit(1);
});
