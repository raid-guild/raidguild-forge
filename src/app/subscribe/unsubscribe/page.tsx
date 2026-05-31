import Link from "next/link";

import { SubscribeResultAnalytics } from "@/components/subscribe-confirmation-analytics";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { unsubscribeSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type UnsubscribePageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token } = await searchParams;
  const unsubscribed = token ? await unsubscribeSubscriber(token) : false;

  return (
    <section className="bg-scroll-100 py-20 md:py-28">
      <SubscribeResultAnalytics
        eventName={analyticsEvents.subscribeUnsubscribe}
        result={unsubscribed ? "success" : "error"}
      />
      <div className="container-custom max-w-3xl">
        <p className="type-label-sm mb-4 text-moloch-500">Email preferences</p>
        <h1 className="type-heading-lg text-moloch-800">
          {unsubscribed ? "You are unsubscribed." : "Unsubscribe link expired."}
        </h1>
        <p className="type-body-lg mt-5 text-moloch-800/75">
          {unsubscribed
            ? "You will no longer receive RaidGuild Forge updates. You can subscribe again any time."
            : "This unsubscribe link is invalid or no longer active."}
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
