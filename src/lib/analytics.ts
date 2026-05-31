import { track } from "@vercel/analytics";

type EventProperties = Record<string, string | number | boolean | null>;

export const analyticsEvents = {
  stayUpdatedClick: "cta_stay_updated_click",
  projectClick: "project_card_click",
  learnClick: "learn_preview_click",
  marketplaceClick: "marketplace_interest_click",
} as const;

export function trackEvent(
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents],
  properties?: EventProperties,
) {
  track(eventName, properties);
}
