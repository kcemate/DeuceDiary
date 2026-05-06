import pg from 'pg';

const pool = new pg.Pool({ 
  connectionString: 'postgresql://postgres:y75vJMCYVHn1zvbLYUhnPd8U1cjbmsQFTmp56kiF@monorail.proxy.rlwy.net:5432/railway',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const res = await pool.query("SELECT id, user_id, endpoint, created_at FROM push_subscriptions");
  console.log('Total push subs:', res.rows.length);
  for (const r of res.rows) {
    console.log(`- userId: ${r.user_id}, endpoint: ${r.endpoint?.substring(0, 60)}..., created: ${r.created_at}`);
  }
  await pool.end();
}
main();
