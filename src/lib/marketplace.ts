export type MarketplaceResource = {
  label: string;
  description: string;
  href?: string;
  status?: string;
};

export type MarketplaceItem = {
  title: string;
  slug: string;
  category: string;
  delivery: string;
  status: string;
  game: string;
  headline: string;
  summary: string;
  description: string;
  image: string;
  attribution: string;
  attributionHref?: string;
  licenseName: string;
  licenseSummary: string;
  x402Endpoint: string;
  primaryCta: string;
  contents: string[];
  features: string[];
  resources: MarketplaceResource[];
};

export const marketplaceItems: MarketplaceItem[] = [
  {
    title: "Voice-Controlled Cooking Companion Kit",
    slug: "voice-controlled-cooking-companion-kit",
    category: "Physical Kit",
    delivery: "Downloadable build package",
    status: "Listed",
    game: "Voice Cooking Companion",
    headline: "A countertop recipe helper for hands-busy cooking.",
    summary:
      "A downloadable build package for a low-cost ESP32-S3 countertop cooking companion that answers recipe questions by voice.",
    description:
      "Build a small countertop recipe helper that records cooking questions, sends them to a recipe helper server, and plays spoken answers back through the device. The kit is designed for makers who want to learn from the full system: hardware references, Arduino firmware, server/API expectations, and enclosure files.",
    image: "/assets/marketplace/voice-controlled-cooking-companion-kit.png",
    attribution: "Created by ECWireless",
    attributionHref: "https://github.com/ECWireless",
    licenseName: "Personal Maker License",
    licenseSummary:
      "Buyers may build, modify, and remix the kit for personal use with attribution. The files may not be resold, rehosted, redistributed, or used to sell physical kits.",
    x402Endpoint:
      "https://charactersheets.mypinata.cloud/x402/cid/bafkreiheg4lc4ac3enc56euffz6obgrrtqw2iyni3vc35fvzwyfzroq5ti",
    primaryCta: "Buy Kit Files",
    contents: [
      "Parts shopping list",
      "Build and wiring notes",
      "Arduino firmware for the ESP32-S3",
      "Server/API setup guidance",
      "3D-printable enclosure model",
      "Hardware reference materials",
    ],
    features: [
      "Hold the Talk button to ask a recipe question.",
      "Hear spoken answers through the onboard speaker.",
      "Use the Next button to move through recipe steps.",
      "Read device state through the RGB LED.",
      "Connect the device to a local or hosted recipe helper backend.",
    ],
    resources: [
      {
        label: "Backend server and reference code",
        description:
          "Public project repo for the local recipe UI, voice API, SQLite recipe/session state, ESP32-S3 firmware references, and development notes.",
        href: "https://github.com/ECWireless/voice-cooking-companion",
      },
      {
        label: "Build log",
        description: "A longer writeup will be linked here after publication.",
        status: "Coming soon",
      },
    ],
  },
];

export function getMarketplaceItem(slug: string) {
  return marketplaceItems.find((item) => item.slug === slug);
}
