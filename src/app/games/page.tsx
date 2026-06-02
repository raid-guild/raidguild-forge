import { GamesCatalogue } from "@/components/games-catalogue";
import { StayUpdatedButton } from "@/components/stay-updated-button";

export const metadata = {
  title: "Games",
  description:
    "Concept worlds, playable demos, and older alpha experiments where Forge machines are designed, assembled, and tested through play.",
};

export default function GamesPage() {
  return (
    <>
      <section className="border-b border-moloch-800/15 bg-scroll-100 py-12 md:py-16">
        <div className="container-custom grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Games</p>
            <h1 className="font-display text-[clamp(2.4rem,6.2vw,4.25rem)] font-bold leading-[1.05] tracking-[0] text-moloch-800">
              Games for proving real machines.
            </h1>
          </div>
          <div className="max-w-lg lg:justify-self-end">
            <p className="type-body-lg text-moloch-800/76">
              Concept worlds, playable demos, and older alpha experiments where
              useful machines are designed, assembled, and tested through play.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <GamesCatalogue />
        </div>
      </section>

      <section className="border-t border-moloch-800/15 bg-moloch-800 py-16 text-scroll-100 md:py-20">
        <div className="container-custom grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-300">Stay close</p>
            <h2 className="type-heading-lg">
              New game work will start with build logs, prototypes, and tests.
            </h2>
          </div>
          <StayUpdatedButton location="games_page" />
        </div>
      </section>
    </>
  );
}
