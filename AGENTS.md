# RaidGuild Forge Website Agent Guide

This repo contains the RaidGuild Forge website.

## Working Agreement

- Build the site through focused PR-sized increments.
- Before starting each PR, run a short debrief with the user.
- In each debrief, confirm scope, copy/content, analytics events, data model changes if relevant, and definition of done.
- Do not jump into implementation for a PR until the debrief is complete.
- Keep edits scoped to the current PR.
- Track implementation sequencing in `IMPLEMENTATION_PLAN.md`.
- Delete `IMPLEMENTATION_PLAN.md` at the end of the final implementation PR.

## Project Narrative

RaidGuild Forge is shifting from a primarily web3-games framing toward a broader maker/game lab narrative.

Core positioning:

```text
Forge Autonomous Worlds With Real Machines
Where makerspace and gaming meet.
```

Working homepage body copy:

```text
RaidGuild Forge builds games and tools where players design useful machines, test them through physics, and earn from their work when others build on it.
```

Public copy should emphasize:

- makerspace building
- games and playful tools
- actual physics and buildable machines
- creator attribution
- licensing, royalties, reputation, and earned value
- Digital Physics and Autonomous Worlds as important underlying ideas

Public copy should generally de-emphasize the word "web3". Use it only where technically or historically useful.

## Core Mechanics

The most important Forge concepts are:

- The 3 Personas mechanic
- Patent/licensing/royalty systems
- Automated attribution
- Remixable construction
- Persistent economies
- Fairer reward flows for people who create useful things

The 3 Personas are usually:

- Engineer: designs useful components
- Assembler: combines components into machines
- Player/Battler: proves machines through games, challenges, races, or real-world builds

For homepage-level copy, prefer "Player" over "Battler" unless a specific game needs the battler language.

## Planned Site Structure

- Home: narrative, pillars, projects, RaidGuild context, stay-updated CTA
- Learn: build logs, maker education, essays, experiments
- Games: project catalogue with status/date/context
- Marketplace: components, machines, licenses, kits, designs, and future marketplace activity

Marketplace direction:

- Catalogue items are Components, Machines, and Physical Kits.
- Purchases grant access through licenses rather than treating "Licenses" as a standalone catalogue category.
- Marketplace purchases are expected to use x402.
- The marketplace will eventually need wallet connection.
- Marketplace browsing should support filtering by game.

## Brand System

Use RaidGuild's official brand system as the source of truth:

- Brand guide: `https://www.brand.raidguild.org/`
- Brand repo: `https://github.com/raid-guild/brand`

Key brand tokens:

- Moloch 500: `#bd482d`
- Moloch 800: `#29100a`
- Scroll 100: `#f9f7e7`
- Scroll 700: `#534a13`
- Neutral black: `#0d0d0d`
- Neutral white: `#fafafa`

Typography:

- Display: Mazius Display
- Body: EB Garamond
- Mono: Ubuntu Mono

Implementation should prefer RaidGuild semantic tokens and utilities over hardcoded one-off styles.

## Analytics Principles

Use privacy-friendly analytics.

- Prefer Vercel Web Analytics for site interactions.
- Track custom events page-by-page as the pages are designed.
- Never send email addresses, wallet addresses, names, or freeform personal text to analytics.
- Subscriber preferences can be tracked anonymously, but email collection belongs in the app database/provider flow.

## Responsive QA

Every user-facing page should be checked on desktop, tablet, and mobile before a PR is considered done.

- Preserve readable type and comfortable spacing at small widths.
- Avoid text overlap, clipped buttons, and horizontal page overflow.
- Keep navigation usable on mobile and tablet.
- For visual PRs, include browser verification notes in the final summary.

## Subscribe Flow Direction

The stay-updated CTA should eventually open a form with:

- Email input
- Interest checkboxes for Learn, Games, and Marketplace
- Double opt-in confirmation

Likely stack:

- Neon for subscriber/preferences storage
- Vercel serverless routes for signup/confirmation
- SendGrid for confirmation and future emails
- Vercel Analytics for anonymous interaction events

## PR 1 Scope Reminder

PR 1 is Project Foundation + Brand System.

It should establish the app scaffold and brand foundation, not build the full homepage or backend subscribe flow.
