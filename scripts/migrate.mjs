#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

const rootDir = resolve(import.meta.dirname, "..");
const migrationsDir = join(rootDir, "migrations");
const envPath = join(rootDir, ".env");

if (existsSync(envPath)) {
  const envFile = await readFile(envPath, "utf8");

  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);

    if (!match || process.env[match[1]]) {
      continue;
    }

    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run migrations.");
}

function isLocalDatabaseUrl(url) {
  const { hostname } = new URL(url);
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

const pool = isLocalDatabaseUrl(connectionString)
  ? new PgPool({ connectionString })
  : new NeonPool({ connectionString });

try {
  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sql = await readFile(join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
} finally {
  await pool.end();
}
