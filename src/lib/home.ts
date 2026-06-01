import type { StaticImageData } from "next/image";

type Project = {
  title: string;
  status: string;
  description: string;
  image: string | StaticImageData;
  href: string;
  cta: string;
};

type LearnItem = {
  title: string;
  eyebrow: string;
  description: string;
  image: string | StaticImageData;
  href: string;
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
  {
    title: "Titan Racers",
    status: "Concept / Prototype planned",
    description:
      "A creator-first sci-fi racing game where players assemble real-world-compatible mini karts and prove them on hidden tracks inside a Titan orbital habitat.",
    image: "/assets/projects/forge-hero-workbench.png",
    href: "/games",
    cta: "View game direction",
  },
  {
    title: "DAO: The Game",
    status: "Playable demo / complete",
    description:
      "A short playable management demo about accidental contracts, improvised organizations, and shipping under pressure.",
    image: "/assets/projects/dao-the-game-card.png",
    href: "https://www.daothegame.com/",
    cta: "Play demo",
  },
  {
    title: "Auto Tower Defense",
    status: "Alpha released / not currently active",
    description:
      "An early tower-defense auto battler experiment around patented components, async saved battles, and royalty splits.",
    image: "/assets/projects/auto-tower-defense.jpg",
    href: "/games",
    cta: "View status",
  },
];

export const learnPreview: LearnItem[] = [
  {
    title: "Building a Web3 Gaming Console",
    eyebrow: "Hardware build log",
    description:
      "A DIY exploration of cheap handheld hardware, Godot, MUD, and what a dedicated on-chain game device could become.",
    image: "/assets/projects/web3-console.jpg",
    href: "https://paragraph.com/@raidguild-forge/building-a-web3-gaming-console-part-1",
  },
  {
    title: "Voice-Controlled Cooking Companion",
    eyebrow: "Coming soon",
    description:
      "A hands-on assistant project that extends Forge beyond games into useful, playful tools for real spaces.",
    image: "/assets/projects/forge-hero-workbench.png",
    href: "/learn",
  },
];
