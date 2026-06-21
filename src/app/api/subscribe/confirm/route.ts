import { NextResponse } from "next/server";

import { confirmSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

// This route is called server-to-server by project sites such as Titan Racers.
type ConfirmRequestBody = {
  token?: unknown;
};

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

export async function POST(request: Request) {
  let rawBody: unknown;

  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof rawBody !== "object" || rawBody === null || Array.isArray(rawBody)) {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  const body = rawBody as ConfirmRequestBody;

  if (typeof body.token !== "string" || !body.token.trim()) {
    return jsonResponse({ error: "Invalid request." }, { status: 400 });
  }

  const token = body.token.trim();
  let confirmed: boolean;

  try {
    confirmed = await confirmSubscriber(token);
  } catch (error) {
    console.error("Subscribe confirmation request failed", error);

    return jsonResponse(
      { error: "Something went wrong. Please try again soon." },
      { status: 500 },
    );
  }

  if (!confirmed) {
    return jsonResponse(
      { error: "Confirmation link expired." },
      { status: 400 },
    );
  }

  return jsonResponse({ ok: true });
}
