import {
  ArrowRight,
  BadgeDollarSign,
  Boxes,
  CircuitBoard,
  Factory,
  Filter,
  Fingerprint,
  Hammer,
  LayoutGrid,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import Image from "next/image";

import { StayUpdatedButton } from "@/components/stay-updated-button";
import { TrackLink } from "@/components/track-link";
import { analyticsEvents } from "@/lib/analytics";
import { marketplaceItems } from "@/lib/marketplace";
import type { SubscriberPreferences } from "@/lib/subscribe/preferences";

export const metadata = {
  title: "Marketplace",
  description:
    "Buildable components, machines, and physical kits from RaidGuild Forge, organized around licenses, attribution, royalties, and remixable work.",
};

const marketplacePreferences: SubscriberPreferences = {
  learn: false,
  games: false,
  marketplace: true,
};

const catalogueItems = [
  {
    title: "Components",
    description:
      "Useful parts, mechanisms, materials, patterns, and build files that can become part of larger machines.",
    icon: CircuitBoard,
  },
  {
    title: "Machines",
    description:
      "Assemblies that combine components into systems tested through games, constraints, and physical builds.",
    icon: Factory,
  },
  {
    title: "Physical kits",
    description:
      "Buildable bundles for people who want to move from a proven idea to a real-world construction path.",
    icon: Boxes,
  },
];

const marketplaceFlow = [
  {
    title: "Browse by game",
    description:
      "Filter marketplace activity by the Forge world where a component or machine was designed, assembled, or proven.",
    icon: Filter,
  },
  {
    title: "Inspect provenance",
    description:
      "See who engineered the part, who assembled the machine, and where players proved it was useful.",
    icon: Fingerprint,
  },
  {
    title: "Purchase access",
    description:
      "Use license-based purchases, with x402 as the intended payment rail for lightweight marketplace transactions.",
    icon: WalletCards,
  },
  {
    title: "Reward the chain",
    description:
      "Route royalties, attribution, and reputation back to the people whose work made the useful creation possible.",
    icon: BadgeDollarSign,
  },
];

export default function MarketplacePage() {
  return (
    <>
      <section className="border-b border-moloch-800/15 bg-scroll-100">
        <div className="container-custom py-8 md:py-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="type-label-sm mb-3 text-moloch-500">Marketplace</p>
              <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-[0]">
                Buildable designs, tested through play.
              </h1>
              <p className="type-body-lg mt-4 max-w-2xl text-moloch-800/76">
                Browse licensed components, machines, and physical kit files as
                Forge projects move useful creations into builder inventory.
              </p>
            </div>
            <div className="grid gap-2 sm:flex sm:flex-wrap lg:justify-end">
              <DashboardMetric label="Listings" value={`${marketplaceItems.length}`} />
              <DashboardMetric label="Type" value="Physical kits" />
              <DashboardMetric label="Access" value="x402" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 bg-scroll-200/35 py-10 md:py-14">
        <div className="container-custom">
          <div className="mb-5 grid gap-3 border-y border-moloch-800/12 py-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
                <LayoutGrid aria-hidden="true" size={18} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="type-label-sm text-moloch-500">Inventory</p>
                <p className="type-body-md truncate text-moloch-800/68">
                  Active and upcoming marketplace listings
                </p>
              </div>
            </div>
            <div className="type-label-sm flex flex-wrap gap-x-4 gap-y-2 text-moloch-800/60">
              <span>{marketplaceItems.length} listed</span>
              <span>Physical kit files</span>
              <span>x402 access</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {marketplaceItems.map((item) => (
              <TrackLink
                key={item.slug}
                href={`/marketplace/${item.slug}`}
                eventName={analyticsEvents.marketplaceKitClick}
                eventProperties={{ kit: item.slug, location: "marketplace_catalogue" }}
                className="group grid overflow-hidden border border-moloch-800/15 bg-scroll-100 text-moloch-800 transition-[box-shadow,transform,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-moloch-500 hover:shadow-[5px_5px_0_rgba(189,72,45,0.16)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-moloch-800/15">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="project-card-media object-cover"
                    sizes="(min-width: 1280px) 38vw, 100vw"
                  />
                </div>
                <div className="grid gap-5 p-5">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="type-label-sm border border-moloch-500 bg-moloch-500 px-2 py-1 text-scroll-100">
                        Listed
                      </span>
                      <span className="type-label-sm border border-moloch-800/12 px-2 py-1 text-moloch-800/62">
                        {item.category}
                      </span>
                    </div>
                    <h2 className="type-heading-md text-moloch-800">{item.title}</h2>
                    <p className="type-body-md mt-3 text-moloch-800/74">
                      {item.summary}
                    </p>
                  </div>
                  <div className="grid gap-3 border-y border-moloch-800/12 py-4 sm:grid-cols-2">
                    <DetailItem label="Creator" value={item.attribution} />
                    <DetailItem label="License" value={item.licenseName} />
                    <DetailItem label="Access" value="Gated download" />
                    <DetailItem label="Payment" value="x402 endpoint" />
                  </div>
                  <span className="type-label-sm inline-flex items-center gap-2 text-moloch-500">
                    {item.primaryCta}
                    <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
                  </span>
                </div>
              </TrackLink>
            ))}
            <div className="grid min-h-72 place-items-center border border-dashed border-moloch-800/20 bg-scroll-200/25 p-6 text-center">
              <div className="max-w-sm">
                <p className="type-label-sm mb-3 text-moloch-500">More listings</p>
                <h3 className="type-heading-md mb-3 text-moloch-800">
                  Components and machines will land here.
                </h3>
                <p className="type-body-md text-moloch-800/62">
                  As Forge projects produce reusable parts, assemblies, and
                  physical build packages, they will join this catalogue.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 py-16 md:py-24">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="type-label-sm mb-3 text-moloch-500">Marketplace</p>
            <h2 className="type-heading-lg mb-5">
              Buy the useful thing, credit the people behind it.
            </h2>
            <p className="type-body-lg text-moloch-800/76">
              Items are organized around what builders can actually use: parts,
              assemblies, and kits. Purchases grant access through licenses, so
              each item can carry permissions, attribution, and rewards with it.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {catalogueItems.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="border border-moloch-800/15 bg-scroll-100 p-5 shadow-[6px_6px_0_rgba(41,16,10,0.08)]"
                >
                  <div className="mb-8 flex size-11 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
                    <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="type-heading-md mb-3">{item.title}</h3>
                  <p className="type-body-md text-moloch-800/74">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 bg-scroll-200/45 py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">How it works</p>
            <h2 className="type-heading-lg">
              Find the game, trace the build, license the work.
            </h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {marketplaceFlow.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="grid border border-moloch-800/15 bg-scroll-100 p-5"
                >
                  <div className="mb-8 flex size-11 items-center justify-center rounded-md bg-moloch-800 text-scroll-100">
                    <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                  </div>
                  <h3 className="type-heading-md mb-3">{step.title}</h3>
                  <p className="type-body-md text-moloch-800/74">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 py-16 md:py-24">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-80 overflow-hidden border border-moloch-800/15 bg-moloch-800 shadow-[10px_10px_0_rgba(83,74,19,0.14)]">
            <Image
              src="/assets/projects/auto-tower-defense-board.png"
              alt=""
              fill
              className="object-cover opacity-80"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(41,16,10,0.05)_0%,rgba(41,16,10,0.7)_100%)]" />
            <div className="absolute bottom-0 left-0 p-6 text-scroll-100">
              <p className="type-label-sm mb-2 text-moloch-300">Checkout</p>
              <p className="type-heading-md max-w-md">
                Wallet connection, game filters, and x402 purchases will support
                marketplace checkout.
              </p>
            </div>
          </div>
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Coming after the first builds</p>
            <h2 className="type-heading-lg mb-5">
              First the worlds, then the economy around them.
            </h2>
            <p className="type-body-lg text-moloch-800/76">
              Marketplace listings will open when Forge projects have useful
              artifacts, clear attribution, and enough player proof for people
              to confidently license, build, or remix the work.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="border border-moloch-800/15 bg-scroll-100 p-4">
                <ShieldCheck
                  aria-hidden="true"
                  size={22}
                  className="mb-4 text-moloch-500"
                  strokeWidth={1.8}
                />
                <p className="type-label-sm mb-2 text-moloch-800">Proof before sale</p>
                <p className="type-body-md text-moloch-800/72">
                  Marketplace readiness should follow testing, not hype.
                </p>
              </div>
              <div className="border border-moloch-800/15 bg-scroll-100 p-4">
                <Hammer
                  aria-hidden="true"
                  size={22}
                  className="mb-4 text-moloch-500"
                  strokeWidth={1.8}
                />
                <p className="type-label-sm mb-2 text-moloch-800">Built to leave the game</p>
                <p className="type-body-md text-moloch-800/72">
                  The best designs should be legible enough to build in the real
                  world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-moloch-800 py-16 text-scroll-100 md:py-24">
        <div className="container-custom grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-300">Follow marketplace activity</p>
            <h2 className="type-heading-lg mb-4">
              Get updates when marketplace listings and purchase flows are ready.
            </h2>
            <p className="type-body-lg text-scroll-100/75">
              Marketplace updates are selected by default here.
            </p>
          </div>
          <StayUpdatedButton
            location="marketplace_page"
            initialPreferences={marketplacePreferences}
          />
        </div>
      </section>
    </>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-label-sm mb-1 text-moloch-800/55">{label}</p>
      <p className="type-body-md text-moloch-800/78">{value}</p>
    </div>
  );
}

function DashboardMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="type-label-sm inline-flex items-baseline gap-2 border border-moloch-800/14 bg-scroll-200/35 px-3 py-2 text-moloch-800/58">
      <span>{label}</span>
      <span className="text-moloch-800">{value}</span>
    </div>
  );
}
