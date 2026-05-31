import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-moloch-800/15">
      <div className="container-custom grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-xl">
          <Image
            src="/assets/logos/full-m800-m500.svg"
            alt="RaidGuild"
            width={180}
            height={52}
            className="mb-4 h-auto w-36"
          />
          <p className="type-body-md text-moloch-800/75">
            RaidGuild Forge is an experimental venture from RaidGuild DAO, a
            decentralized network of builders that has shipped 200+ projects
            since 2019.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 md:justify-end">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="type-label-sm text-moloch-800/75 hover:text-moloch-500"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
