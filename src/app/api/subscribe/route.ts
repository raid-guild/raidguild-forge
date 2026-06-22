import { after, NextResponse, type NextRequest } from "next/server";

import { createConfirmationToken } from "@/lib/subscribe/crypto";
import {
  confirmationEmailContexts,
  type ConfirmationEmailContext,
  escapeHtml,
  sendAdminNotification,
  sendConfirmationEmail,
} from "@/lib/subscribe/email";
import { normalizePreferences } from "@/lib/subscribe/preferences";
import { createConfirmation, upsertSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type SubscribeRequestBody = {
  confirmationOrigin?: unknown;
  email?: unknown;
  preferences?: {
    learn?: unknown;
    games?: unknown;
    marketplace?: unknown;
  };
  projectInterests?: unknown;
  source?: unknown;
};

const allowedProjectInterests = new Set(["titan-racers"]);
const defaultAllowedOrigins = ["https://titanracers.com"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getOrigin(request: NextRequest) {
  return (
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    request.nextUrl.origin
  );
}

function getAllowedOrigins(request: NextRequest) {
  const configuredOrigins = process.env.SUBSCRIBE_ALLOWED_ORIGINS?.split(",") ?? [];

  return new Set(
    [getOrigin(request), ...defaultAllowedOrigins, ...configuredOrigins]
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (!origin || !getAllowedOrigins(request).has(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
}

function jsonResponse(
  request: NextRequest,
  body: Record<string, unknown>,
  init?: ResponseInit,
) {
  const corsHeaders = getCorsHeaders(request);
  const headers = new Headers(init?.headers);

  if (corsHeaders) {
    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
  }

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

function normalizeSource(source: unknown) {
  if (typeof source !== "string") {
    return undefined;
  }

  return source.replace(/[^a-z0-9_-]/gi, "").slice(0, 48) || undefined;
}

function parseConfirmationOrigin(input: unknown, request: NextRequest) {
  if (input === undefined) {
    return undefined;
  }

  if (typeof input !== "string") {
    return null;
  }

  try {
    const url = new URL(input.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    if (!getAllowedOrigins(request).has(url.origin)) {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function parseProjectInterests(input: unknown) {
  if (input === undefined) {
    return [];
  }

  if (!Array.isArray(input)) {
    return null;
  }

  const projectInterests = new Set<string>();

  for (const value of input) {
    if (typeof value !== "string") {
      return null;
    }

    const slug = value.trim().toLowerCase();

    if (!allowedProjectInterests.has(slug)) {
      return null;
    }

    projectInterests.add(slug);
  }

  return [...projectInterests];
}

function getConfirmationEmailContext(
  projectInterests: string[],
): ConfirmationEmailContext {
  if (projectInterests.includes("titan-racers")) {
    return confirmationEmailContexts.titanRacers;
  }

  return confirmationEmailContexts.default;
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

export function OPTIONS(request: NextRequest) {
  const corsHeaders = getCorsHeaders(request);

  if (!corsHeaders) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, {
    headers: corsHeaders,
    status: 204,
  });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  if (origin && !getAllowedOrigins(request).has(origin)) {
    return jsonResponse(request, { error: "Origin not allowed." }, { status: 403 });
  }

  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse(request, { error: "Invalid request." }, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return jsonResponse(request, { error: "Invalid request." }, { status: 400 });
  }

  const body = rawBody as SubscribeRequestBody;

  if (typeof body.email !== "string" || !emailPattern.test(body.email.trim())) {
    return jsonResponse(
      request,
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const projectInterests = parseProjectInterests(body.projectInterests);

  if (!projectInterests) {
    return jsonResponse(request, { error: "Invalid request." }, { status: 400 });
  }

  const confirmationOrigin = parseConfirmationOrigin(
    body.confirmationOrigin,
    request,
  );

  if (confirmationOrigin === null) {
    return jsonResponse(request, { error: "Invalid request." }, { status: 400 });
  }

  const hasExplicitPreferences = body.preferences !== undefined;
  const preferences = parsePreferences(
    hasExplicitPreferences || projectInterests.length === 0
      ? body.preferences
      : { learn: false, games: false, marketplace: false },
  );

  if (!preferences) {
    return jsonResponse(request, { error: "Invalid request." }, { status: 400 });
  }

  if (
    !preferences.learn &&
    !preferences.games &&
    !preferences.marketplace &&
    projectInterests.length === 0
  ) {
    return jsonResponse(
      request,
      { error: "Choose at least one update category." },
      { status: 400 },
    );
  }

  try {
    const unsubscribeToken = createConfirmationToken();
    const subscriber = await upsertSubscriber({
      email: body.email,
      preferences,
      shouldUpdatePreferences: hasExplicitPreferences || projectInterests.length === 0,
      projectInterests,
      source: normalizeSource(body.source),
      unsubscribeToken,
    });

    const token = createConfirmationToken();
    await createConfirmation({ subscriberId: subscriber.id, token });

    const confirmationUrl = new URL(
      "/subscribe/confirm",
      confirmationOrigin ?? getOrigin(request),
    );
    confirmationUrl.searchParams.set("token", token);

    const unsubscribeUrl = new URL("/subscribe/unsubscribe", getOrigin(request));
    unsubscribeUrl.searchParams.set("token", unsubscribeToken);

    await sendConfirmationEmail({
      to: subscriber.email,
      confirmationUrl: confirmationUrl.toString(),
      context: getConfirmationEmailContext(projectInterests),
      unsubscribeUrl: unsubscribeUrl.toString(),
    });

    after(() =>
      notifyAdminOfSubscribe({
        email: subscriber.email,
        preferences,
        projectInterests,
        source: normalizeSource(body.source),
      }),
    );

    return jsonResponse(request, {
      ok: true,
      message: "Confirmation email sent.",
    });
  } catch (error) {
    console.error("Subscribe request failed", error);

    return jsonResponse(
      request,
      { error: "Something went wrong. Please try again soon." },
      { status: 500 },
    );
  }
}

async function notifyAdminOfSubscribe({
  email,
  preferences,
  projectInterests,
  source,
}: {
  email: string;
  preferences: {
    learn: boolean;
    games: boolean;
    marketplace: boolean;
  };
  projectInterests: string[];
  source?: string;
}) {
  const selectedPreferences = Object.entries(preferences)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key)
    .join(", ");
  const selectedProjects = projectInterests.join(", ") || "none";
  const safeEmail = escapeHtml(email);
  const safePreferences = escapeHtml(selectedPreferences || "none");
  const safeProjects = escapeHtml(selectedProjects);
  const safeSource = escapeHtml(source ?? "unknown");

  try {
    await sendAdminNotification({
      subject: "New RaidGuild Forge update subscription",
      textLines: [
        "Someone requested RaidGuild Forge updates.",
        "",
        `Email: ${email}`,
        `Requested preferences: ${selectedPreferences || "none"}`,
        `Project interests: ${selectedProjects}`,
        `Source: ${source ?? "unknown"}`,
      ],
      htmlLines: [
        "<p>Someone requested RaidGuild Forge updates.</p>",
        "<ul>",
        `<li><strong>Email:</strong> ${safeEmail}</li>`,
        `<li><strong>Requested preferences:</strong> ${safePreferences}</li>`,
        `<li><strong>Project interests:</strong> ${safeProjects}</li>`,
        `<li><strong>Source:</strong> ${safeSource}</li>`,
        "</ul>",
      ],
    });
  } catch (error) {
    console.warn("Admin subscribe notification failed", error);
  }
}
