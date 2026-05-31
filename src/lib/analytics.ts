import { track } from "@vercel/analytics";

/**
 * Properties for analytics events.
 *
 * PRIVACY: Never include email addresses, wallet addresses, user names,
 * or freeform personal text. Only send anonymous interaction metadata.
 * Personal data belongs in the database or provider flow, not analytics.
 */
export type EventProperties = Record<string, string | number | boolean | null>;

export const analyticsEvents = {
  stayUpdatedClick: "cta_stay_updated_click",
  projectClick: "project_card_click",
  learnClick: "learn_preview_click",
  marketplaceClick: "marketplace_interest_click",
  navClick: "nav_click",
} as const;

export function trackEvent(
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents],
  properties?: EventProperties,
) {
  track(eventName, properties);
}
