const { Client } = require('pg');

async function run() {
  const c = new Client({
    connectionString: 'postgresql://postgres:y75vJMCYVHn1zvbLYUhnPd8U1cjbmsQFTmp56kiF@postgres-production-cbc6.up.railway.app:5432/railway',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 20000,
  });

  try {
    console.log('Connecting to Railway Postgres...');
    await c.connect();
    console.log('Connected!');

    const tables = await c.query("SELECT tablename FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'battle%'");
    console.log('Battle tables:', tables.rows.map(r => r.tablename));

    for (const t of tables.rows.map(r => r.tablename)) {
      const cnt = await c.query('SELECT COUNT(*) FROM ' + t);
      console.log(`  ${t}: ${cnt.rows[0].count} rows`);
    }

    // Delete all battle data — order matters for FK constraints (or rely on CASCADE)
    console.log('\nDeleting all battle data...');
    await c.query('DELETE FROM battle_powerups');
    await c.query('DELETE FROM battle_tokens');
    await c.query('DELETE FROM battle_attacks');
    await c.query('DELETE FROM battle_ships');
    const matchResult = await c.query('DELETE FROM battle_matches');
    console.log(`Deleted ${matchResult.rowCount} battle matches (cascading deletes handled)`);

    for (const t of tables.rows.map(r => r.tablename)) {
      const cnt = await c.query('SELECT COUNT(*) FROM ' + t);
      console.log(`  ${t}: ${cnt.rows[0].count} rows remaining`);
    }

    console.log('\nDone! All battle data cleared.');
    await c.end();
  } catch(e) {
    console.error('Error:', e.message);
    await c.end().catch(()=>{});
    process.exit(1);
  }
}

run();