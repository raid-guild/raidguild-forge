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

Vercel runs `pnpm db:migrate && pnpm build` during deployment.

To reset the local subscribe tables and rerun the migration:

```bash
pnpm db:reset
```

The reset script only runs against `localhost`, `127.0.0.1`, or `::1` database
hosts unless `FORCE_DB_RESET=true` is set.

SendGrid confirmation emails use `SENDGRID_API_KEY`,
`SENDGRID_FROM_EMAIL`, and `SENDGRID_FROM_NAME`.

## Project Plan

See `IMPLEMENTATION_PLAN.md` for the PR-by-PR implementation plan.
