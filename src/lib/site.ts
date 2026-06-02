function normalizeSiteUrl(url: string) {
  const withProtocol = url.startsWith("http") ? url : `https://${url}`;

  return withProtocol.replace(/\/$/, "");
}

const fallbackSiteUrl = "https://forge.raidguild.org";
const getEnvUrl = (...values: Array<string | undefined>) =>
  values.find((value) => value?.trim()) ?? fallbackSiteUrl;
const envSiteUrl =
  getEnvUrl(
    process.env.SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  );

type SiteNavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export const siteConfig: {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  nav: SiteNavItem[];
  footerNav: SiteNavItem[];
} = {
  name: "RaidGuild Forge",
  title: "RaidGuild Forge | Autonomous Worlds With Real Machines",
  description:
    "RaidGuild Forge builds games and tools where players design useful machines, test them through physics, and earn from their work when others build on it.",
  url: normalizeSiteUrl(envSiteUrl),
  ogImage: "/assets/social/raidguild-forge-og-1200x630.png",
  nav: [
    { href: "/", label: "Home" },
    { href: "/learn", label: "Learn" },
    { href: "/games", label: "Games" },
    { href: "/marketplace", label: "Marketplace" },
  ],
  footerNav: [
    { href: "/", label: "Home" },
    { href: "/learn", label: "Learn" },
    { href: "/games", label: "Games" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "https://discord.gg/2vx47gT95y", label: "Discord", external: true },
    { href: "/privacy", label: "Privacy" },
  ],
};
