# RaidGuild Forge

Website for RaidGuild Forge.

## Local Development

```bash
pnpm install
pnpm dev
```

For the subscribe flow, copy `.env.example` to `.env` and set `DATABASE_URL`.
The same variable can point to local Postgres in development or Neon in
production. Run the migration with:

```bash
pnpm db:migrate
```

Vercel runs `pnpm db:migrate && pnpm build` during production deployment.
The migration runner skips Vercel preview builds and uses a Postgres advisory
lock so concurrent production builds do not apply migrations at the same time.
The migration runner records applied filenames and checksums in
`schema_migrations`, so each migration file runs once per database.

To reset the local subscribe tables and rerun the migration:

```bash
pnpm db:reset
```

The reset script only runs against `localhost`, `127.0.0.1`, or `::1` database
hosts unless `FORCE_DB_RESET=true` is set.

SendGrid confirmation emails use `SENDGRID_API_KEY`,
`SENDGRID_FROM_EMAIL`, and `SENDGRID_FROM_NAME`. Confirmation links use
`SITE_URL`, then fall back to the Vercel deployment URL or request origin. Set
`SITE_URL=https://forge.raidguild.org` in production so emails, metadata, robots,
and sitemap URLs all use the canonical site.
