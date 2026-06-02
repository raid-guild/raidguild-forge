import { LearnCatalogue } from "@/components/learn-catalogue";
import { StayUpdatedButton } from "@/components/stay-updated-button";
import { getLearnArticles } from "@/lib/learn";

export const metadata = {
  title: "Learn",
  description:
    "Build logs, essays, and experiments from RaidGuild Forge on hardware, game systems, autonomous worlds, royalties, and maker education.",
};

export const revalidate = 3600;

export default async function LearnPage() {
  const articles = await getLearnArticles();

  return (
    <>
      <section className="border-b border-moloch-800/15 bg-scroll-100 py-12 md:py-16">
        <div className="container-custom grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-500">Learn</p>
            <h1 className="font-display text-[clamp(2.4rem,6.2vw,4.25rem)] font-bold leading-[1.05] tracking-[0] text-moloch-800">
              Build logs for playable machines.
            </h1>
          </div>
          <div className="max-w-lg lg:justify-self-end">
            <p className="type-body-lg text-moloch-800/76">
              Published notes from RaidGuild Forge on hardware, game systems,
              autonomous worlds, royalties, and maker experiments.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-custom">
          <LearnCatalogue articles={articles} />
        </div>
      </section>

      <section className="border-t border-moloch-800/15 bg-moloch-800 py-16 text-scroll-100 md:py-20">
        <div className="container-custom grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-3xl">
            <p className="type-label-sm mb-3 text-moloch-300">Keep learning</p>
            <h2 className="type-heading-lg">
              Get educational posts as new Forge experiments are published.
            </h2>
          </div>
          <StayUpdatedButton location="learn_page" />
        </div>
      </section>
    </>
  );
}
