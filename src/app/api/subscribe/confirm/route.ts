import { NextResponse } from "next/server";

import { confirmSubscriber } from "@/lib/subscribe/repository";

export const runtime = "nodejs";

type ConfirmRequestBody = {
  token?: unknown;
};

function jsonResponse(body: Record<string, unknown>, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...init?.headers,
    },
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

  const confirmed = await confirmSubscriber(body.token);

  if (!confirmed) {
    return jsonResponse(
      { error: "Confirmation link expired." },
      { status: 400 },
    );
  }

  return jsonResponse({ ok: true });
}
