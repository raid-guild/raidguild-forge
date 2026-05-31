"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { analyticsEvents, trackEvent } from "@/lib/analytics";

type TrackLinkProps = ComponentProps<typeof Link> & {
  eventName: (typeof analyticsEvents)[keyof typeof analyticsEvents];
  eventProperties?: Record<string, string | number | boolean | null>;
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
