import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

const routes = ["", "/learn", "/games", "/marketplace", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
