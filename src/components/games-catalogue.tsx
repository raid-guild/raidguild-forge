"use client";

import { ArrowUpRight, CalendarDays, CircleDot, Filter } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { TrackLink } from "@/components/track-link";
import { Button } from "@/components/ui/button";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import {
  activityLabels,
  gameProjects,
  type GameActivity,
  type GameProject,
} from "@/lib/games";
import { cn } from "@/lib/utils";

type ActivityFilter = GameActivity | "all";

const activityOptions: ActivityFilter[] = ["all", "active", "complete", "inactive"];

export function GamesCatalogue() {
  const [activity, setActivity] = useState<ActivityFilter>("all");
  const visibleGames = useMemo(
    () =>
      activity === "all"
        ? gameProjects
        : gameProjects.filter((game) => game.activity === activity),
    [activity],
  );

  function selectActivity(nextActivity: ActivityFilter) {
    setActivity(nextActivity);
    trackEvent(analyticsEvents.gameFilterChange, {
      filter: "activity",
      value: nextActivity,
    });
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-col gap-3 border-y border-moloch-800/15 py-4 md:flex-row md:items-center md:justify-between">
        <div className="type-label-sm flex items-center gap-2 text-moloch-800/70">
          <Filter aria-hidden="true" size={15} strokeWidth={1.8} />
          Status
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          {activityOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={cn(
                "type-label-sm cursor-pointer border px-3 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                activity === option
                  ? "border-moloch-500 bg-moloch-500 text-scroll-100"
                  : "border-moloch-800/18 bg-scroll-100 text-moloch-800/75 hover:border-moloch-500 hover:text-moloch-500",
              )}
              onClick={() => selectActivity(option)}
            >
              {activityLabels[option]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {visibleGames.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: GameProject }) {
  const details = (
    <>
      <div className="relative min-h-72 overflow-hidden border-b border-moloch-800/15 lg:border-b-0 lg:border-r">
        <Image
          src={game.image}
          alt=""
          fill
          className="project-card-media object-cover"
          sizes="(min-width: 1024px) 38vw, 100vw"
        />
      </div>
      <div className="grid gap-6 p-5 md:p-6">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge activity={game.activity} label={game.status} />
            {game.externalLabel ? (
              <span className="type-label-sm border border-moloch-800/12 px-2 py-1 text-moloch-800/60">
                {game.externalLabel}
              </span>
            ) : null}
          </div>
          <h2 className="type-heading-lg text-moloch-800">{game.title}</h2>
          <p className="type-body-lg mt-3 text-moloch-800/78">{game.summary}</p>
        </div>

        <p className="type-body-md text-moloch-800/72">{game.description}</p>

        <div className="grid gap-3 border-y border-moloch-800/12 py-4 sm:grid-cols-3">
          <DateItem label="First version" value={game.firstRelease} />
          <DateItem label="Latest update" value={game.latestUpdate} />
          <DateItem label="Timeline" value={game.timeframe} />
        </div>

        <ul className="grid gap-2">
          {game.notes.map((note) => (
            <li key={note} className="type-body-md flex gap-2 text-moloch-800/72">
              <CircleDot
                aria-hidden="true"
                className="mt-1 shrink-0 text-moloch-500"
                size={14}
                strokeWidth={2}
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>

        {game.href ? (
          <div>
            <Button asChild variant={game.activity === "inactive" ? "secondary" : "primary"}>
              <TrackLink
                href={game.href}
                target="_blank"
                rel="noopener noreferrer"
                eventName={analyticsEvents.gameExternalClick}
                eventProperties={{ game: game.title, destination: game.href }}
              >
                {game.primaryCta}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </TrackLink>
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <article className="group grid overflow-hidden border border-moloch-800/15 bg-scroll-100 shadow-[8px_8px_0_rgba(41,16,10,0.08)] lg:grid-cols-[0.72fr_1fr]">
      {details}
    </article>
  );
}

function StatusBadge({
  activity,
  label,
}: {
  activity: GameActivity;
  label: string;
}) {
  return (
    <span
      className={cn(
        "type-label-sm inline-flex items-center gap-2 border px-2 py-1",
        activity === "active" && "border-moloch-500 bg-moloch-500 text-scroll-100",
        activity === "complete" && "border-scroll-700/35 bg-scroll-200/55 text-scroll-800",
        activity === "inactive" && "border-moloch-800/18 bg-neutral-100 text-moloch-800/68",
      )}
    >
      <span className="size-2 rounded-full bg-current" />
      {label}
    </span>
  );
}

function DateItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-label-sm mb-1 flex items-center gap-2 text-moloch-800/55">
        <CalendarDays aria-hidden="true" size={14} strokeWidth={1.8} />
        {label}
      </p>
      <p className="type-body-md text-moloch-800/78">{value}</p>
    </div>
  );
}
