"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type StayUpdatedButtonProps = {
  location: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function StayUpdatedButton({
  location,
  variant = "primary",
}: StayUpdatedButtonProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <div className="inline-flex w-full flex-col items-start gap-2 sm:w-auto">
      <Button
        variant={variant}
        className="w-full sm:w-auto"
        onClick={() => {
          trackEvent(analyticsEvents.stayUpdatedClick, { location });
          setShowPlaceholder(true);
        }}
      >
        Stay up to date
      </Button>
      {showPlaceholder ? (
        <p className="type-body-md max-w-xs text-moloch-800/70" role="status">
          Email preferences are coming soon.
        </p>
      ) : null}
    </div>
  );
}
