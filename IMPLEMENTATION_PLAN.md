# RaidGuild Forge Website Implementation Plan

This project will be built in a series of focused PRs. Before starting each PR, we will do a short debrief to confirm scope, copy/content, analytics events, data model changes if relevant, and the definition of done.

This file is temporary project scaffolding. Delete it at the end of the final implementation PR.

## PR 1: Project Foundation + Brand System

Set up the app scaffold and RaidGuild brand foundation.

Planned scope:

- Next.js/Vercel-ready app setup
- Tailwind and shared styling foundation
- RaidGuild brand colors, typography, spacing, and fonts
- Base layout, navigation, and footer
- Shared UI primitives
- Minimal analytics package wiring
- Placeholder routes for Home, Learn, Games, and Marketplace

Debrief topics:

- Tech stack confirmation
- Exact routes
- Brand asset approach
- Light/dark or light-only for v1

## PR 2: Homepage Narrative

Build the homepage narrative and section structure.

Planned sections:

- Hero
- Three-part focus
- How Forge works / 3 Personas
- Featured projects
- Marketplace preview
- Learn preview
- RaidGuild DAO association
- Final stay-updated CTA

Working hero:

```text
Forge Autonomous Worlds With Real Machines
Where makerspace and gaming meet.

RaidGuild Forge builds games and tools where players design useful machines, test them through physics, and earn from their work when others build on it.
```

Debrief topics:

- Final homepage copy
- Project cards and statuses
- Visual direction for the hero
- Homepage analytics events

## PR 3: Subscribe Flow

Build the stay-updated modal and double opt-in email flow.

Planned scope:

- Email input
- Interest checkboxes for Learn, Games, and Marketplace
- Neon schema and migrations
- Vercel serverless signup endpoint
- SendGrid confirmation email
- Double opt-in confirmation route
- Anonymous analytics events with no email addresses sent to analytics

Debrief topics:

- Consent copy
- Confirmation email copy
- Database fields
- SendGrid environment variables
- Success and error states

## PR 4: Games Page

Build the Games catalogue.

Initial projects:

- Titan Racers
- DAO: The Game
- Auto Tower Defense

Planned scope:

- Status labels such as In concept, Playable demo / complete, and Alpha released / not currently active
- Project catalogue cards without detail pages for v1
- Links to project/demo sites where available
- Analytics for filters and external project links

Debrief topics:

- Exact status language
- Whether each game gets a detail page in v1
- DAO: The Game positioning
- Not currently active project tone

## PR 5: Learn Page

Build Learn as the home for articles, build logs, and experiments.

Planned scope:

- Article index backed by published Paragraph posts
- Hourly revalidation for newly published posts
- Category/tag system
- External Paragraph links
- Analytics for article and topic interest

Debrief topics:

- Paragraph API indexing
- Published-only article list
- Categories
- How much old web3 language to surface

## PR 6: Marketplace Page

Build the Marketplace preview page.

Planned scope:

- Explanation of Components, Machines, and Physical Kits, with licenses as the purchase/access model
- Marketplace interest CTA with Marketplace preselected
- Sample marketplace objects if useful
- Analytics for marketplace intent

Debrief topics:

- How real vs speculative the marketplace should feel
- Language around royalties, rewards, and licensing
- What marketplace objects exist in v1
- x402 purchase flow, wallet connection, and filtering by game

## PR 7: Analytics, SEO, QA Polish

Prepare the site for launch.

Planned scope:

- Metadata and Open Graph images
- Sitemap and robots file
- Vercel Analytics event audit
- Accessibility pass
- Responsive polish
- Performance pass
- Privacy-friendly analytics notes
- Basic README and deployment docs

Debrief topics:

- Launch checklist
- Final event taxonomy
- Whether to add a Privacy page
- Production environment checklist
