export type GameActivity = "active" | "complete" | "inactive";

export type GameProject = {
  title: string;
  slug: string;
  status: string;
  activity: GameActivity;
  timeframe: string;
  firstRelease: string;
  latestUpdate: string;
  summary: string;
  description: string;
  image: string;
  primaryCta: string;
  href?: string;
  externalLabel?: string;
  notes: string[];
};

export const activityLabels: Record<GameActivity | "all", string> = {
  all: "All",
  active: "Active",
  complete: "Complete",
  inactive: "Not active",
};

export const gameProjects: GameProject[] = [
  {
    title: "Titan Racers",
    slug: "titan-racers",
    status: "In development",
    activity: "active",
    timeframe: "First playable demo targeted for Q3 2026",
    firstRelease: "In development",
    latestUpdate: "Current focus",
    summary:
      "A sci-fi RC kart racing game set inside humanity's last Titan colony.",
    description:
      "Players build small remotely controlled machines from modular components, race them through habitat-scale courses, and turn winning designs into reputation, royalties, and eventually real-world kits.",
    image: "/assets/projects/forge-hero-workbench.png",
    href: "https://titanracers.com/",
    primaryCta: "Visit Titan Racers",
    externalLabel: "Project site",
    notes: [
      "First playable demo is in development",
      "Built around Engineer, Assembler, and Racer roles",
      "Designed for digital racing and future physical kit experiments",
    ],
  },
  {
    title: "DAO: The Game",
    slug: "dao-the-game",
    status: "Playable demo / complete",
    activity: "complete",
    timeframe: "Demo from Mar 4, 2026 to Apr 23, 2026",
    firstRelease: "Mar 4, 2026",
    latestUpdate: "Apr 23, 2026",
    summary:
      "A short playable management demo about creating an impromptu dev studio with autonomous agents.",
    description:
      "DAO: The Game is an experiment in using Forge concepts for an agentic factory. It was always a compact demo rather than a long-running game, and will not be completed beyond the demo form.",
    image: "/assets/projects/dao-the-game-card.png",
    href: "https://www.daothegame.com/",
    primaryCta: "Play demo",
    externalLabel: "External demo",
    notes: [
      "Short demo, not an ongoing production",
      "Explores collaborative operations through play",
      "Last updated Apr 23, 2026",
    ],
  },
  {
    title: "Auto Tower Defense",
    slug: "auto-tower-defense",
    status: "Alpha released / not currently active",
    activity: "inactive",
    timeframe: "Alpha from Jun 27, 2025 to Jul 21, 2025",
    firstRelease: "Jun 27, 2025",
    latestUpdate: "Jul 21, 2025",
    summary:
      "An early tower-defense auto battler experiment around components and royalty splits.",
    description:
      "Auto Tower Defense shipped as a short alpha, but it is no longer playable because Redstone has been sunset. It remains useful as an early Forge experiment in patented parts, async saved battles, and attribution.",
    image: "/assets/projects/auto-tower-defense.jpg",
    href: "https://paragraph.com/@raidguild-forge/introducing-auto-tower-defense",
    primaryCta: "Read introduction",
    externalLabel: "Project article",
    notes: [
      "No longer playable",
      "Oldest Forge game experiment",
      "Latest alpha release was Jul 21, 2025",
    ],
  },
];
