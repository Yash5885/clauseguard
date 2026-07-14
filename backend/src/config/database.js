import pg from "pg";

const { Pool } = pg;

let pool;

export function getDatabasePool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export async function checkDatabaseConnection() {
  const result = await getDatabasePool().query(
    "SELECT current_database() AS database, EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'vector') AS vector_enabled",
  );

  return result.rows[0];
}

export async function closeDatabaseConnection() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
