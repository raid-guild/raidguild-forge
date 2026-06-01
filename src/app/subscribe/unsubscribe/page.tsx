import Link from "next/link";
import { redirect } from "next/navigation";

import { SubscribeResultAnalytics } from "@/components/subscribe-confirmation-analytics";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { unsubscribeSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type UnsubscribePageProps = {
  searchParams: Promise<{
    token?: string;
    result?: string;
  }>;
};

async function unsubscribeAction(formData: FormData) {
  "use server";

  const token = formData.get("token");
  const unsubscribed =
    typeof token === "string" && token ? await unsubscribeSubscriber(token) : false;

  redirect(`/subscribe/unsubscribe?result=${unsubscribed ? "success" : "error"}`);
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { token, result } = await searchParams;
  const unsubscribed = result === "success";
  const failed = result === "error";

  return (
    <section className="bg-scroll-100 py-20 md:py-28">
      {result ? (
        <SubscribeResultAnalytics
          eventName={analyticsEvents.subscribeUnsubscribe}
          result={unsubscribed ? "success" : "error"}
        />
      ) : null}
      <div className="container-custom max-w-3xl">
        <p className="type-label-sm mb-4 text-moloch-500">Email preferences</p>
        <h1 className="type-heading-lg text-moloch-800">
          {unsubscribed
            ? "You are unsubscribed."
            : failed
              ? "Unsubscribe link expired."
              : "Unsubscribe from updates?"}
        </h1>
        <p className="type-body-lg mt-5 text-moloch-800/75">
          {unsubscribed
            ? "You will no longer receive RaidGuild Forge updates. You can subscribe again any time."
            : failed
              ? "This unsubscribe link is invalid or no longer active."
              : "Click the button below to stop receiving RaidGuild Forge updates."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!result && token ? (
            <form action={unsubscribeAction}>
              <input type="hidden" name="token" value={token} />
              <Button type="submit">Unsubscribe</Button>
            </form>
          ) : null}
          <Button asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
