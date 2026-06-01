import type { StaticImageData } from "next/image";

import { gameProjects } from "@/lib/games";

type Project = {
  title: string;
  status: string;
  description: string;
  image: string | StaticImageData;
  href: string;
  cta: string;
};

export const focusPillars = [
  {
    title: "Learn by building",
    description:
      "Build logs and experiments turn physics, hardware, and game systems into practical lessons.",
  },
  {
    title: "Play through physics",
    description:
      "Forge games reward machines that actually handle, hold together, and perform under constraints.",
  },
  {
    title: "Earn from useful creations",
    description:
      "Designs can build reputation, licensing value, and rewards when other players put them to work.",
  },
];

export const personaSteps = [
  {
    title: "Engineers",
    description:
      "Design components from real constraints: materials, circuits, weight, handling, durability, and physics.",
  },
  {
    title: "Assemblers",
    description:
      "Combine proven components into machines that can be tested, raced, licensed, or eventually built as kits.",
  },
  {
    title: "Players",
    description:
      "Use those machines in games and challenges, creating the performance history that makes designs matter.",
  },
];

export const featuredGames: Project[] = [
  ...gameProjects.map((game) => ({
    title: game.title,
    status: game.status,
    description: game.summary,
    image: game.image,
    href: game.href ?? "/games",
    cta: game.primaryCta,
  })),
];
