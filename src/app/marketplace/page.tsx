import {
  BadgeDollarSign,
  Boxes,
  CircuitBoard,
  Factory,
  Filter,
  Fingerprint,
  Hammer,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import Image from "next/image";

import { StayUpdatedButton } from "@/components/stay-updated-button";
import type { SubscriberPreferences } from "@/lib/subscribe/preferences";

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
      <section className="relative isolate overflow-hidden border-b border-moloch-800/15 bg-moloch-800 text-scroll-100">
        <Image
          src="/assets/projects/forge-hero-workbench.png"
          alt=""
          fill
          priority
          className="animate-forge-drift object-cover opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(41,16,10,0.96)_0%,rgba(41,16,10,0.88)_42%,rgba(41,16,10,0.54)_100%)]" />
        <div className="container-custom relative py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="type-label-sm mb-4 text-moloch-300">Marketplace</p>
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[1.04] tracking-[0]">
              Buildable designs, tested through play.
            </h1>
            <p className="type-body-lg mt-6 max-w-2xl text-scroll-100/78">
              The Forge Marketplace is where useful components, machines, and
              physical kits become available to license, build, and remix.
            </p>
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
