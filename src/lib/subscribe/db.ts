import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

type QueryResult<T> = {
  rows: T[];
};

type Queryable = {
  query<T>(text: string, values?: unknown[]): Promise<QueryResult<T>>;
};

let pool: Queryable | undefined;

function isLocalDatabaseUrl(connectionString: string) {
  try {
    const { hostname } = new URL(connectionString);
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  } catch {
    return false;
  }
}

function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required for subscribe flow database access.");
  }

  pool = isLocalDatabaseUrl(connectionString)
    ? new PgPool({ connectionString })
    : new NeonPool({ connectionString });

  return pool;
}

export async function query<T>(text: string, values: unknown[] = []) {
  return getPool().query<T>(text, values);
}
