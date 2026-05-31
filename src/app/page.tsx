import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="container-custom py-20 md:py-28">
      <div className="grid-custom items-end">
        <div className="col-span-4 md:col-span-7 lg:col-span-8">
          <p className="type-label-sm mb-4 text-moloch-500">RaidGuild Forge</p>
          <h1 className="type-display-lg max-w-4xl">
            Forge Autonomous Worlds With Real Machines
          </h1>
        </div>
        <div className="col-span-4 mt-8 md:col-span-5 md:mt-0 lg:col-span-4">
          <p className="type-body-lg mb-6 text-moloch-800/80">
            Where makerspace and gaming meet.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button>Stay up to date</Button>
            <Button asChild variant="secondary">
              <Link href="/games">Explore games</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
