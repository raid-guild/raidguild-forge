import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-moloch-800/15">
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
            <Link
              key={item.href}
              href={item.href}
              className="type-label-sm text-moloch-800/80 transition-colors hover:text-moloch-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <nav
        aria-label="Mobile primary navigation"
        className="container-custom flex gap-5 overflow-x-auto border-t border-moloch-800/10 py-3 md:hidden"
      >
        {siteConfig.nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="type-label-sm shrink-0 text-moloch-800/80 transition-colors hover:text-moloch-500"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
