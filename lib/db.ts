import "server-only";
import { Pool } from "pg";

declare global {
  // Reuse the pool during development hot reloads.
  var powerwavePostgresPool: Pool | undefined;
}

function getPool(): Pool {
  if (globalThis.powerwavePostgresPool) {
    return globalThis.powerwavePostgresPool;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize the PostgreSQL connection pool.");
  }

  globalThis.powerwavePostgresPool = new Pool({
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  return globalThis.powerwavePostgresPool;
}

export const pool = new Proxy({} as Pool, {
  get(_target, property) {
    const value = getPool()[property as keyof Pool];
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
});
