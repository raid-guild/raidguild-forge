import type { NextConfig } from "next";

// RaidGuild Forge has closed. Every path redirects, and no page is ever served.
const titanRacers = "https://titanracers.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Unsubscribe links in emails Forge sent. The list moved to Titan
      // Racers, which kept each subscriber's unsubscribe token, so the token
      // carries through in the query string.
      {
        source: "/subscribe/unsubscribe",
        destination: `${titanRacers}/updates/unsubscribe`,
        permanent: false,
      },
      // Confirmation links from Forge signups that were never confirmed.
      // Those signups didn't move, so offer the Titan Racers signup instead.
      {
        source: "/subscribe/:path*",
        destination: titanRacers,
        permanent: false,
      },
      {
        source: "/:path*",
        destination: "https://raidguild.org",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
