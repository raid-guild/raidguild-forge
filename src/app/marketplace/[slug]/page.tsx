import {
  ArrowLeft,
  ArrowUpRight,
  Box,
  CheckCircle2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketplaceKitViewAnalytics } from "@/components/marketplace-kit-view-analytics";
import { MarketplacePurchasePanel } from "@/components/marketplace-purchase-panel";
import { TrackLink } from "@/components/track-link";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { getMarketplaceItem, marketplaceItems } from "@/lib/marketplace";

type KitPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return marketplaceItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: KitPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getMarketplaceItem(slug);

  if (!item) {
    return {};
  }

  return {
    title: item.title,
    description: item.summary,
  };
}

export default async function MarketplaceKitPage({ params }: KitPageProps) {
  const { slug } = await params;
  const item = getMarketplaceItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <MarketplaceKitViewAnalytics kit={item.slug} />
      <section className="border-b border-moloch-800/15 py-8">
        <div className="container-custom">
          <Link
            href="/marketplace"
            className="type-label-sm inline-flex items-center gap-2 text-moloch-800/70 transition-colors hover:text-moloch-500"
          >
            <ArrowLeft aria-hidden="true" size={16} strokeWidth={1.8} />
            Back to marketplace
          </Link>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 py-12 md:py-18">
        <div className="container-custom grid gap-10 lg:grid-cols-[1.05fr_0.65fr] lg:items-start">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="type-label-sm border border-moloch-500 bg-moloch-500 px-2 py-1 text-scroll-100">
                {item.category}
              </span>
              <span className="type-label-sm border border-moloch-800/12 px-2 py-1 text-moloch-800/62">
                {item.delivery}
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.45rem,6vw,4.75rem)] font-bold leading-[1.04] tracking-[0]">
              {item.title}
            </h1>
            <p className="type-body-lg mt-6 max-w-3xl text-moloch-800/78">
              {item.summary}
            </p>
            <div className="mt-10">
              <div className="relative min-h-[17rem] overflow-hidden border border-moloch-800/15 bg-moloch-800 shadow-[10px_10px_0_rgba(83,74,19,0.14)] sm:min-h-[24rem] lg:min-h-[28rem]">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
              </div>
            </div>
          </div>

          <MarketplacePurchasePanel endpoint={item.x402Endpoint} kitSlug={item.slug} />
        </div>
      </section>

      <section className="border-b border-moloch-800/15 py-16 md:py-24">
        <div className="container-custom grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="type-label-sm mb-3 text-moloch-500">Build package</p>
            <h2 className="type-heading-lg mb-5">{item.headline}</h2>
            <p className="type-body-lg text-moloch-800/76">{item.description}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "What it does",
                icon: Wrench,
                items: item.features,
              },
              {
                title: "What buyers receive",
                icon: Box,
                items: item.contents,
              },
            ].map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.title}
                  className="border border-moloch-800/15 bg-scroll-100 p-5 shadow-[6px_6px_0_rgba(41,16,10,0.08)]"
                >
                  <div className="mb-8 flex size-11 items-center justify-center rounded-md bg-moloch-800 text-scroll-100">
                    <Icon aria-hidden="true" size={21} strokeWidth={1.8} />
                  </div>
                  <h3 className="type-heading-md mb-4">{section.title}</h3>
                  <ul className="grid gap-3">
                    {section.items.map((feature) => (
                      <li
                        key={feature}
                        className="type-body-md flex gap-2 text-moloch-800/74"
                      >
                        <CheckCircle2
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-moloch-500"
                          size={16}
                          strokeWidth={1.8}
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-moloch-800/15 bg-scroll-200/45 py-10 md:py-14">
        <div className="container-custom">
          <article className="border border-moloch-800/15 bg-scroll-100 p-5">
            <div className="mb-5 flex flex-col gap-3 border-b border-moloch-800/12 pb-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  aria-hidden="true"
                  size={22}
                  className="text-moloch-500"
                  strokeWidth={1.8}
                />
                <p className="type-label-sm text-moloch-500">{item.licenseName}</p>
              </div>
              <div className="type-label-sm flex flex-wrap items-center gap-x-3 gap-y-1 text-moloch-800/60">
                <span>Attribution</span>
                {item.attributionHref ? (
                  <TrackLink
                    href={item.attributionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventName={analyticsEvents.marketplaceKitResourceClick}
                    eventProperties={{
                      kit: item.slug,
                      resource: "Attribution",
                    }}
                    className="inline-flex items-center gap-1 text-moloch-800 underline decoration-moloch-500/35 transition-colors hover:text-moloch-500"
                  >
                    {item.attribution}
                    <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.8} />
                  </TrackLink>
                ) : (
                  <span className="text-moloch-800">{item.attribution}</span>
                )}
              </div>
            </div>
            <h2 className="type-heading-md mb-3">Remix-friendly personal use.</h2>
            <p className="type-body-md text-moloch-800/74">{item.licenseSummary}</p>
          </article>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Extra resources</p>
            <h2 className="type-heading-lg">Reference code and build context.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {item.resources.map((resource) => (
              <article
                key={resource.label}
                className="border border-moloch-800/15 bg-scroll-100 p-5"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <h3 className="type-heading-md">{resource.label}</h3>
                  {resource.status ? (
                    <span className="type-label-sm border border-moloch-800/12 px-2 py-1 text-moloch-800/58">
                      {resource.status}
                    </span>
                  ) : null}
                </div>
                <p className="type-body-md mb-5 text-moloch-800/74">
                  {resource.description}
                </p>
                {resource.href ? (
                  <Button asChild variant="secondary">
                    <TrackLink
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      eventName={analyticsEvents.marketplaceKitResourceClick}
                      eventProperties={{
                        kit: item.slug,
                        resource: resource.label,
                      }}
                    >
                      Open resource
                      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
                    </TrackLink>
                  </Button>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
