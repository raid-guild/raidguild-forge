import Link from "next/link";

import { SubscribeResultAnalytics } from "@/components/subscribe-confirmation-analytics";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { confirmSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type ConfirmPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ConfirmSubscribePage({ searchParams }: ConfirmPageProps) {
  const { token } = await searchParams;
  const confirmed = token ? await confirmSubscriber(token) : false;

  return (
    <section className="bg-scroll-100 py-20 md:py-28">
      <SubscribeResultAnalytics
        eventName={analyticsEvents.subscribeConfirm}
        result={confirmed ? "success" : "error"}
      />
      <div className="container-custom max-w-3xl">
        <p className="type-label-sm mb-4 text-moloch-500">Stay up to date</p>
        <h1 className="type-heading-lg text-moloch-800">
          {confirmed ? "You are confirmed." : "Confirmation link expired."}
        </h1>
        <p className="type-body-lg mt-5 text-moloch-800/75">
          {confirmed
            ? "Thanks for confirming. You are subscribed to RaidGuild Forge updates."
            : "This confirmation link is invalid or no longer active. You can request a fresh one from the homepage."}
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
