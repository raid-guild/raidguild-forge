import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-moloch-800/15 bg-scroll-100">
      <div className="container-custom grid gap-6 py-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="type-label-sm text-moloch-500">RaidGuild Forge</p>
          <p className="type-body-md mt-2 text-moloch-800/70">
            Autonomous worlds, real machines, useful creations.
          </p>
        </div>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-4 md:justify-end">
          {siteConfig.footerNav.map((item) => (
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
