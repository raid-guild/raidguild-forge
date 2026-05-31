"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { analyticsEvents, trackEvent, type EventProperties } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<typeof Link> & {
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents];
  eventProperties?: EventProperties;
};

export function TrackLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventProperties);
        onClick?.(event);
      }}
    />
  );
}
