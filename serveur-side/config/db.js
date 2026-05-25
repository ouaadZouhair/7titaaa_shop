import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

/**
 * Supabase gives you a Postgres connection string. Use the **connection
 * pooler** URI (Project → Settings → Database → "Connection pooling",
 * Transaction mode, port 6543) for serverless / Vercel — it survives the
 * many short-lived connections a serverless function creates.
 *
 *   DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
 */
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "DATABASE_URL is not set — set it to your Supabase Postgres connection string."
  );
}

export const pool = new Pool({
  connectionString,
  // Supabase requires SSL. rejectUnauthorized:false avoids bundling the CA cert.
  ssl: connectionString ? { rejectUnauthorized: false } : false,
  // Keep the pool tiny on serverless: each warm instance holds its own pool.
  max: process.env.VERCEL ? 1 : 10,
});

/**
 * The models were written with MySQL-style `?` placeholders. Postgres uses
 * positional `$1, $2, …`, so we rewrite them in order. (Safe here: none of
 * our SQL contains a literal `?` inside a string or a jsonb `?` operator.)
 */
export const toPg = (sql) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

/** Run a query with `?` placeholders. Returns the pg result ({ rows, rowCount }). */
export const query = (text, params = []) => pool.query(toPg(text), params);

/** Grab a dedicated client for a transaction. Caller must release() it. */
export const getClient = () => pool.connect();
