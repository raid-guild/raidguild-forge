#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
  set +a
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required. Add it to .env or export it before running." >&2
  exit 1
fi

DB_HOST="$(node -e "const url = new URL(process.env.DATABASE_URL); console.log(url.hostname.replace(/^\\[|\\]$/g, ''))")"

if [[ "$DB_HOST" != "localhost" && "$DB_HOST" != "127.0.0.1" && "$DB_HOST" != "::1" && "${FORCE_DB_RESET:-}" != "true" ]]; then
  echo "Refusing to reset non-local database host: $DB_HOST" >&2
  echo "Set FORCE_DB_RESET=true only if you intentionally want to reset this database." >&2
  exit 1
fi

psql "$DATABASE_URL" <<'SQL'
drop table if exists email_confirmations cascade;
drop table if exists subscriber_preferences cascade;
drop table if exists subscribers cascade;
drop table if exists schema_migrations cascade;
SQL

node "$ROOT_DIR/scripts/migrate.mjs"

echo "Local subscribe database reset complete."
