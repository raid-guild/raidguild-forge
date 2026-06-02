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
  gameExternalClick: "game_external_click",
  gameFilterChange: "game_filter_change",
  learnArticleClick: "learn_article_click",
  projectClick: "project_card_click",
  learnTopicFilterChange: "learn_topic_filter_change",
  marketplaceKitClick: "marketplace_kit_click",
  marketplaceKitResourceClick: "marketplace_kit_resource_click",
  marketplaceKitView: "marketplace_kit_view",
  navClick: "nav_click",
  subscribeConfirm: "subscribe_confirm",
  subscribeError: "subscribe_error",
  subscribePreferenceClick: "subscribe_preference_click",
  subscribeSubmit: "subscribe_submit",
  subscribeSuccess: "subscribe_success",
  subscribeUnsubscribe: "subscribe_unsubscribe",
} as const;

export function trackEvent(
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents],
  properties?: EventProperties,
) {
  track(eventName, properties);
}
