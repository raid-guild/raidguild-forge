# RaidGuild Forge

RaidGuild Forge closed in November 2026. This repo now deploys a redirect-only
site to forge.raidguild.org; the full site is in the git history.

- `/subscribe/unsubscribe` → `https://titanracers.com/updates/unsubscribe`,
  keeping the `token` query. Forge's newsletter list moved to the Titan Racers
  updates list with each subscriber's unsubscribe token, so links in old Forge
  emails still work.
- Other `/subscribe/*` paths → `https://titanracers.com`.
- Everything else → `https://raidguild.org`.

The redirects are in `next.config.ts`. The deploy needs no environment
variables.

## Local check

The lockfile is pnpm 9's, so run pnpm 9 (newer pnpm stops on ignored build
scripts):

```bash
corepack pnpm@9.15.9 install
corepack pnpm@9.15.9 build
corepack pnpm@9.15.9 start
curl -sI "http://localhost:3000/subscribe/unsubscribe?token=abc"
```
