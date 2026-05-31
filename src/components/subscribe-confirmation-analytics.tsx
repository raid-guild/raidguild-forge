"use client";

import { useEffect } from "react";

import { analyticsEvents, trackEvent } from "@/lib/analytics";

type SubscribeResultAnalyticsProps = {
  eventName:
    | typeof analyticsEvents.subscribeConfirm
    | typeof analyticsEvents.subscribeUnsubscribe;
  result: "success" | "error";
};

export function SubscribeResultAnalytics({
  eventName,
  result,
}: SubscribeResultAnalyticsProps) {
  useEffect(() => {
    trackEvent(eventName, { result });
  }, [eventName, result]);

  return null;
}
