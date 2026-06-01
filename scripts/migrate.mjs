#!/usr/bin/env node
import { createHash } from "node:crypto";
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

if (process.env.VERCEL === "1" && process.env.VERCEL_ENV !== "production") {
  console.log("Skipping migrations outside Vercel production deployments.");
  process.exit(0);
}

function isLocalDatabaseUrl(url) {
  const { hostname } = new URL(url);
  const normalizedHostname = hostname.replace(/^\[|\]$/g, "");
  return (
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname === "::1"
  );
}

const pool = isLocalDatabaseUrl(connectionString)
  ? new PgPool({ connectionString })
  : new NeonPool({ connectionString });
let lockAcquired = false;

try {
  await pool.query("select pg_advisory_lock(hashtext('raidguild_forge_migrations'))");
  lockAcquired = true;

  await pool.query(`
    create table if not exists schema_migrations (
      filename text primary key,
      checksum text not null,
      applied_at timestamptz not null default now()
    )
  `);

  const migrationFiles = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sql = await readFile(join(migrationsDir, file), "utf8");
    const checksum = createHash("sha256").update(sql).digest("hex");
    const applied = await pool.query(
      "select checksum from schema_migrations where filename = $1",
      [file],
    );

    if (applied.rows[0]?.checksum === checksum) {
      console.log(`Skipped ${file}`);
      continue;
    }

    if (applied.rows[0]) {
      throw new Error(`Migration checksum changed after apply: ${file}`);
    }

    await pool.query(sql);
    await pool.query(
      "insert into schema_migrations (filename, checksum) values ($1, $2)",
      [file, checksum],
    );
    console.log(`Applied ${file}`);
  }
} finally {
  if (lockAcquired) {
    await pool.query("select pg_advisory_unlock(hashtext('raidguild_forge_migrations'))");
  }
  await pool.end();
}
