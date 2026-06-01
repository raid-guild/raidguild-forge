import Link from "next/link";
import { redirect } from "next/navigation";

import { SubscribeResultAnalytics } from "@/components/subscribe-confirmation-analytics";
import { Button } from "@/components/ui/button";
import { analyticsEvents } from "@/lib/analytics";
import { confirmSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type ConfirmPageProps = {
  searchParams: Promise<{
    token?: string;
    result?: string;
  }>;
};

async function confirmSubscribeAction(formData: FormData) {
  "use server";

  const token = formData.get("token");
  const confirmed =
    typeof token === "string" && token ? await confirmSubscriber(token) : false;

  redirect(`/subscribe/confirm?result=${confirmed ? "success" : "error"}`);
}

export default async function ConfirmSubscribePage({ searchParams }: ConfirmPageProps) {
  const { token, result } = await searchParams;
  const confirmed = result === "success";
  const failed = result === "error";

  return (
    <section className="bg-scroll-100 py-20 md:py-28">
      {result ? (
        <SubscribeResultAnalytics
          eventName={analyticsEvents.subscribeConfirm}
          result={confirmed ? "success" : "error"}
        />
      ) : null}
      <div className="container-custom max-w-3xl">
        <p className="type-label-sm mb-4 text-moloch-500">Stay up to date</p>
        <h1 className="type-heading-lg text-moloch-800">
          {confirmed
            ? "You are confirmed."
            : failed
              ? "Confirmation link expired."
              : "Confirm your email."}
        </h1>
        <p className="type-body-lg mt-5 text-moloch-800/75">
          {confirmed
            ? "Thanks for confirming. You are subscribed to RaidGuild Forge updates."
            : failed
              ? "This confirmation link is invalid or no longer active. You can request a fresh one from the homepage."
              : "Click the button below to finish subscribing to RaidGuild Forge updates."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {!result && token ? (
            <form action={confirmSubscribeAction}>
              <input type="hidden" name="token" value={token} />
              <Button type="submit">Confirm email</Button>
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
