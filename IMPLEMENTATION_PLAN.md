# RaidGuild Forge Implementation Plan

## Current Sequence

### PR A: Marketplace Kit Listing Foundation

Status: complete

- Add the first hardcoded marketplace item: Voice-Controlled Cooking Companion Kit.
- Add the selected kit image to `public/assets/marketplace/`.
- Show the first kit as a real listing on `/marketplace`.
- Add a dedicated kit detail page at `/marketplace/voice-controlled-cooking-companion-kit`.
- Include kit contents, behavior, attribution, license terms, and extra resources.
- Add the RaidGuild Discord link to the site footer.
- Add anonymous analytics for marketplace kit listing clicks, kit page views, and resource clicks.
- Leave wallet connection, x402 purchase/download, and admin notifications for later PRs.

Definition of done:

- Marketplace page shows the first listing card.
- Kit detail page renders with selected image and agreed copy.
- Extra Resources includes the backend/reference GitHub repo and a build log placeholder.
- Footer includes the RaidGuild Discord link.
- Lint and typecheck pass.
- Responsive layout is verified on desktop, tablet, and mobile.

### PR B: Wallet + x402 Purchase Flow

Status: in progress

- Add `wagmi`, `viem`, `@x402/fetch`, `@x402/evm`, and `@x402/core`.
- Add marketplace-level wallet connection/status.
- Fetch x402 metadata from the Pinata endpoint.
- Show tucked-away payment details on the kit page.
- Implement `Buy Kit Files` purchase/download behavior.
- Track anonymous purchase click, success, and error events.
- Never send wallet addresses to analytics; purchase events must remain anonymous.

Note: marketplace items include game metadata for future filtering, but game
filter UI should wait until there are enough game-linked listings to make it
useful.

### PR C: Admin Notifications

Status: planned

- Add `ADMIN_NOTIFY_EMAIL`.
- Store subscriber data in Neon for production and local Postgres through `DATABASE_URL` for development.
- Send an owner notification via SendGrid when someone subscribes for updates.
- Send a best-effort owner notification via SendGrid after successful kit download.
- Update README environment variable documentation for `ADMIN_NOTIFY_EMAIL`, `DATABASE_URL`, and SendGrid configuration.

## Final Cleanup

- Delete this file at the end of the final implementation PR in this sequence.
