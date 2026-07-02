import { createPool } from '@vercel/postgres';

// Shared Postgres pool. Accepts either POSTGRES_URL (Vercel's default var) or
// DATABASE_URL, so it works regardless of how the connection string is named
// in the environment.
let _pool: ReturnType<typeof createPool> | null = null;

export function db() {
  if (!_pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    _pool = createPool({ connectionString });
  }
  return _pool;
}
