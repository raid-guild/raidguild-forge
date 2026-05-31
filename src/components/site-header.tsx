import Image from "next/image";
import Link from "next/link";

import { TrackLink } from "@/components/track-link";
import { analyticsEvents } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-moloch-800/15 bg-scroll-100/94 backdrop-blur">
      <div className="container-custom flex h-20 items-center justify-between gap-8">
        <Link href="/" className="flex items-center gap-3" aria-label="RaidGuild Forge home">
          <Image
            src="/assets/logos/symbol-m800-m500.svg"
            alt=""
            width={36}
            height={36}
            priority
          />
          <span className="type-heading-md leading-none">Forge</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <TrackLink
              key={item.href}
              href={item.href}
              eventName={analyticsEvents.navClick}
              eventProperties={{ target: item.href, location: "desktop_header" }}
              className="type-label-sm text-moloch-800/80 transition-colors hover:text-moloch-500"
            >
              {item.label}
            </TrackLink>
          ))}
        </nav>
      </div>
      <nav
        aria-label="Mobile primary navigation"
        className="container-custom grid grid-cols-4 gap-2 border-t border-moloch-800/10 py-3 md:hidden"
      >
        {siteConfig.nav.map((item) => (
          <TrackLink
            key={item.href}
            href={item.href}
            eventName={analyticsEvents.navClick}
            eventProperties={{ target: item.href, location: "mobile_header" }}
            className="type-label-sm text-center text-moloch-800/80 transition-colors hover:text-moloch-500"
          >
            <span className="sm:hidden">
              {item.label === "Marketplace" ? "Market" : item.label}
            </span>
            <span className="hidden sm:inline">{item.label}</span>
          </TrackLink>
        ))}
      </nav>
    </header>
  );
}
