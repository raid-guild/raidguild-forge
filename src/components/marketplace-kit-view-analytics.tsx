"use client";

import { useEffect } from "react";

import { analyticsEvents, trackEvent } from "@/lib/analytics";

export function MarketplaceKitViewAnalytics({ kit }: { kit: string }) {
  useEffect(() => {
    trackEvent(analyticsEvents.marketplaceKitView, { kit });
  }, [kit]);

  return null;
}
