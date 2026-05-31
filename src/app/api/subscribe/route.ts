import { NextResponse, type NextRequest } from "next/server";

import { createConfirmationToken } from "@/lib/subscribe/crypto";
import { sendConfirmationEmail } from "@/lib/subscribe/email";
import { normalizePreferences } from "@/lib/subscribe/preferences";
import { createConfirmation, upsertSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type SubscribeRequestBody = {
  email?: unknown;
  preferences?: {
    learn?: unknown;
    games?: unknown;
    marketplace?: unknown;
  };
  source?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getOrigin(request: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    request.nextUrl.origin
  );
}

function normalizeSource(source: unknown) {
  if (typeof source !== "string") {
    return undefined;
  }

  return source.replace(/[^a-z0-9_-]/gi, "").slice(0, 48) || undefined;
}

export async function POST(request: NextRequest) {
  let body: SubscribeRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.email !== "string" || !emailPattern.test(body.email.trim())) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const preferences = normalizePreferences({
    learn: body.preferences?.learn === true,
    games: body.preferences?.games === true,
    marketplace: body.preferences?.marketplace === true,
  });

  if (!preferences.learn && !preferences.games && !preferences.marketplace) {
    return NextResponse.json(
      { error: "Choose at least one update category." },
      { status: 400 },
    );
  }

  try {
    const unsubscribeToken = createConfirmationToken();
    const subscriber = await upsertSubscriber({
      email: body.email,
      preferences,
      source: normalizeSource(body.source),
      unsubscribeToken,
    });

    const token = createConfirmationToken();
    await createConfirmation({ subscriberId: subscriber.id, token });

    const confirmationUrl = new URL("/subscribe/confirm", getOrigin(request));
    confirmationUrl.searchParams.set("token", token);

    const unsubscribeUrl = new URL("/subscribe/unsubscribe", getOrigin(request));
    unsubscribeUrl.searchParams.set("token", unsubscribeToken);

    await sendConfirmationEmail({
      to: subscriber.email,
      confirmationUrl: confirmationUrl.toString(),
      unsubscribeUrl: unsubscribeUrl.toString(),
    });

    return NextResponse.json({
      ok: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    console.error("Subscribe request failed", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again soon." },
      { status: 500 },
    );
  }
}
