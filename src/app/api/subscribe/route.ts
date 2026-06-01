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
    process.env.SITE_URL ??
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

function parsePreferences(input: unknown) {
  if (input === undefined) {
    return normalizePreferences(undefined);
  }

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const values = input as Record<string, unknown>;
  const keys = ["learn", "games", "marketplace"] as const;
  const parsed: Partial<Record<(typeof keys)[number], boolean>> = {};

  for (const key of keys) {
    if (values[key] !== undefined && typeof values[key] !== "boolean") {
      return null;
    }

    if (typeof values[key] === "boolean") {
      parsed[key] = values[key];
    }
  }

  return normalizePreferences(parsed);
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

  const preferences = parsePreferences(body.preferences);

  if (!preferences) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

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
