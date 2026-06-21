import Link from "next/link";
import { redirect } from "next/navigation";

import { AutoConfirmSubscriptionForm } from "@/components/auto-confirm-subscription-form";
import { SubscribeResultAnalytics } from "@/components/subscribe-confirmation-analytics";
import { analyticsEvents } from "@/lib/analytics";
import { confirmSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type ConfirmPageProps = {
  searchParams: Promise<{
    token?: string;
    result?: string;
  }>;
};

async function confirmAction(formData: FormData) {
  "use server";

  const token = formData.get("token");
  const confirmed =
    typeof token === "string" && token ? await confirmSubscriber(token) : false;

  redirect(`/subscribe/confirm?result=${confirmed ? "success" : "error"}`);
}

export default async function ConfirmSubscribePage({ searchParams }: ConfirmPageProps) {
  const { token, result } = await searchParams;
  const explicitResult = result === "success" || result === "error" ? result : undefined;
  const isAwaitingConfirmation = !explicitResult && Boolean(token);
  const confirmed = explicitResult === "success";
  const failed = explicitResult === "error" || !isAwaitingConfirmation;

  return (
    <section className="bg-scroll-100 py-20 md:py-28">
      {explicitResult ? (
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
              : "Checking your confirmation link."}
        </h1>
        <p className="type-body-lg mt-5 text-moloch-800/75">
          {confirmed
            ? "Thanks for confirming. You are subscribed to RaidGuild Forge updates."
            : failed
              ? "This confirmation link is invalid or no longer active. You can request a fresh one from the homepage."
              : "One moment while we confirm your subscription."}
        </p>
        {isAwaitingConfirmation && token ? (
          <AutoConfirmSubscriptionForm action={confirmAction} token={token} />
        ) : null}
        <div className="mt-8">
          <Link
            className="type-label-sm inline-flex text-moloch-500 transition hover:text-moloch-800"
            href="/"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
