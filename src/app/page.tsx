import { ArrowRight, BadgeDollarSign, BookOpen, DraftingCompass, Hammer, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StayUpdatedButton } from "@/components/stay-updated-button";
import { TrackLink } from "@/components/track-link";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { featuredGames, focusPillars, learnPreview, personaSteps } from "@/lib/home";

const pillarIcons = [Hammer, DraftingCompass, BadgeDollarSign];

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FocusSection />
      <PersonaSection />
      <FeaturedProjectsSection />
      <MarketplaceSection />
      <LearnSection />
      <RaidGuildSection />
      <FinalCtaSection />
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative isolate min-h-[calc(100svh-8.25rem)] overflow-hidden border-b border-moloch-800/15 md:min-h-[calc(100svh-5rem)]">
      <Image
        src="/assets/projects/forge-hero-workbench.png"
        alt=""
        fill
        priority
        className="animate-forge-drift object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-scroll-100/38" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(189,72,45,0.28),transparent_32%),linear-gradient(90deg,rgba(249,247,231,0.98)_0%,rgba(249,247,231,0.94)_34%,rgba(249,247,231,0.66)_58%,rgba(249,247,231,0.22)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-scroll-100/92 to-transparent" />
      <div className="container-custom relative flex min-h-[calc(100svh-8.25rem)] items-center py-12 md:min-h-[calc(100svh-5rem)] md:py-16">
        <div className="min-w-0 max-w-5xl w-full pt-2 md:pt-0">
          <p className="animate-forge-rise type-label-sm mb-5 text-moloch-500">
            RaidGuild Forge
          </p>
          <h1 className="animate-forge-rise anim-delay-100 max-w-4xl font-display text-[clamp(2.3rem,10vw,5rem)] font-bold leading-[1.08] tracking-[0]">
            Forge <br className="md:hidden" />
            Autonomous <br className="md:hidden" />
            Worlds With <br className="md:hidden" />
            Real Machines
          </h1>
          <p className="animate-forge-rise anim-delay-200 type-heading-md mt-6 max-w-2xl text-moloch-800/85">
            Where makerspace and gaming meet.
          </p>
          <p className="animate-forge-rise anim-delay-300 type-body-lg mt-6 max-w-2xl text-moloch-800/78">
            RaidGuild Forge builds games and tools where players design useful
            machines, test them through physics, and earn from their work when
            others build on it.
          </p>
          <div className="animate-forge-rise anim-delay-400 mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <StayUpdatedButton location="hero" />
            <Button asChild variant="secondary">
              <Link href="/games">Explore games</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FocusSection() {
  return (
    <section className="border-b border-moloch-800/15 py-16 md:py-24">
      <div className="container-custom">
        <div className="mb-10 max-w-3xl">
          <p className="type-label-sm mb-3 text-moloch-500">The focus</p>
          <h2 className="type-heading-lg">
            Education, play, and economic value should reinforce each other.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {focusPillars.map((pillar, index) => {
            const Icon = pillarIcons[index];

            return (
              <article
                key={pillar.title}
                className="border border-moloch-800/15 bg-scroll-100 p-6 shadow-[8px_8px_0_rgba(41,16,10,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                <div className="mb-8 flex size-11 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
                  <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
                </div>
                <h3 className="type-heading-md mb-3">{pillar.title}</h3>
                <p className="type-body-md text-moloch-800/75">
                  {pillar.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PersonaSection() {
  return (
    <section className="border-b border-moloch-800/15 bg-moloch-800 py-16 text-scroll-100 md:py-24">
      <div className="container-custom grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="type-label-sm mb-3 text-moloch-300">How Forge works</p>
          <h2 className="type-heading-lg mb-5">
            Useful machines need engineers, assemblers, and players.
          </h2>
          <p className="type-body-lg text-scroll-100/78">
            Forge projects are built around a simple loop: people design parts,
            combine them into machines, then prove those machines through games,
            challenges, and physical constraints.
          </p>
        </div>
        <div className="grid gap-4">
          {personaSteps.map((step, index) => (
            <article
              key={step.title}
              className="grid gap-4 border border-scroll-100/18 bg-scroll-100/[0.04] p-5 sm:grid-cols-[4rem_1fr]"
            >
              <div className="type-heading-md flex size-14 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
                {index + 1}
              </div>
              <div>
                <h3 className="type-heading-md mb-2">{step.title}</h3>
                <p className="type-body-md text-scroll-100/75">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsSection() {
  return (
    <section className="border-b border-moloch-800/15 py-16 md:py-24">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Featured games</p>
            <h2 className="type-heading-lg">Worlds for testing what works.</h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/games">View all games</Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredGames.map((project) => {
            const isExternal = project.href.startsWith("http");
            const content = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden border-b border-moloch-800/15">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="project-card-media object-cover"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="flex min-h-[18rem] flex-col p-5">
                  <p className="type-label-sm mb-3 text-moloch-500">
                    {project.status}
                  </p>
                  <h3 className="type-heading-md mb-3">{project.title}</h3>
                  <p className="type-body-md flex-1 text-moloch-800/75">
                    {project.description}
                  </p>
                  <span className="type-label-sm mt-6 inline-flex items-center gap-2 text-moloch-500">
                    {project.cta}
                    <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
                  </span>
                </div>
              </>
            );

            return (
              <TrackLink
                key={project.title}
                href={project.href}
                eventName={analyticsEvents.projectClick}
                eventProperties={{ project: project.title, location: "featured_games" }}
                className="group border border-moloch-800/15 bg-scroll-100 transition-[box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_rgba(189,72,45,0.14)]"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {content}
              </TrackLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MarketplaceSection() {
  return (
    <section className="border-b border-moloch-800/15 bg-scroll-200/45 py-16 md:py-24">
      <div className="container-custom grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div className="max-w-3xl">
          <p className="type-label-sm mb-3 text-moloch-500">Marketplace preview</p>
          <h2 className="type-heading-lg mb-5">
            Proven designs should have somewhere to go next.
          </h2>
          <p className="type-body-lg text-moloch-800/78">
            Forge is building toward a marketplace for components, machines,
            and physical kits that have been tested through play. Purchases will
            grant access through licenses, making each creation&apos;s story
            visible: who built it, who proved it, and why others want access.
          </p>
        </div>
        <div className="border border-moloch-800/15 bg-scroll-100 p-6 shadow-[10px_10px_0_rgba(83,74,19,0.14)]">
          <p className="type-label-sm mb-4 text-moloch-500">Future catalogue</p>
          <ul className="grid gap-3">
            {["Components", "Machines", "Physical kits", "Filter by game"].map((item) => (
              <li
                key={item}
                className="group flex items-center justify-between border-b border-moloch-800/12 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="type-body-lg">{item}</span>
                <Wrench
                  aria-hidden="true"
                  size={18}
                  className="text-moloch-500 transition-transform duration-300 ease-out group-hover:rotate-12"
                />
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <StayUpdatedButton location="marketplace_preview" variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}

function LearnSection() {
  return (
    <section className="border-b border-moloch-800/15 py-16 md:py-24">
      <div className="container-custom">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Learn</p>
            <h2 className="type-heading-lg">Follow the experiments as they are built.</h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/learn">Go to Learn</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {learnPreview.map((item) => {
            const isExternal = item.href.startsWith("http");

            return (
              <TrackLink
                key={item.title}
                href={item.href}
                eventName={analyticsEvents.learnClick}
                eventProperties={{ article: item.title, location: "learn_preview" }}
                className="group grid overflow-hidden border border-moloch-800/15 bg-scroll-100 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:bg-neutral-100 hover:shadow-[5px_5px_0_rgba(41,16,10,0.08)] md:grid-cols-[0.8fr_1fr]"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                <div className="relative min-h-64 border-b border-moloch-800/15 md:border-b-0 md:border-r">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="project-card-media object-cover"
                    sizes="(min-width: 768px) 40vw, 100vw"
                  />
                </div>
                <div className="grid p-6">
                  <div>
                    <div className="mb-8 flex size-11 items-center justify-center rounded-md bg-moloch-500 text-scroll-100">
                      <BookOpen aria-hidden="true" size={21} strokeWidth={1.8} />
                    </div>
                    <p className="type-label-sm mb-3 text-moloch-500">
                      {item.eyebrow}
                    </p>
                    <h3 className="type-heading-md mb-3">{item.title}</h3>
                    <p className="type-body-md text-moloch-800/75">
                      {item.description}
                    </p>
                  </div>
                  <span className="type-label-sm mt-8 inline-flex items-center gap-2 self-end text-moloch-500">
                    Read more
                    <ArrowRight aria-hidden="true" size={16} strokeWidth={1.8} />
                  </span>
                </div>
              </TrackLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RaidGuildSection() {
  return (
    <section className="border-b border-moloch-800/15 py-16 md:py-24">
      <div className="container-custom grid gap-8 md:grid-cols-[0.7fr_1fr] md:items-center">
        <Link
          href="https://www.raidguild.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit RaidGuild"
          className="w-fit"
        >
          <Image
            src="/assets/logos/full-m800-m500.svg"
            alt=""
            width={360}
            height={104}
            className="h-auto w-56"
          />
        </Link>
        <div>
          <p className="type-label-sm mb-3 text-moloch-500">Built from RaidGuild</p>
          <p className="type-body-lg max-w-3xl text-moloch-800/78">
            RaidGuild Forge comes from RaidGuild DAO, a decentralized network of
            builders that has shipped 200+ projects since 2019.
          </p>
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="bg-moloch-800 py-16 text-scroll-100 md:py-24">
      <div className="container-custom grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="max-w-3xl">
          <p className="type-label-sm mb-3 text-moloch-300">Follow the Forge</p>
          <h2 className="type-heading-lg mb-4">
            Get educational posts, game updates, and marketplace activity.
          </h2>
          <p className="type-body-lg text-scroll-100/75">
            Choose only the updates you want.
          </p>
        </div>
        <StayUpdatedButton location="final_cta" />
      </div>
    </section>
  );
}
