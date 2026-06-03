import { NextResponse } from "next/server";

import { marketplaceItems } from "@/lib/marketplace";

const allowedEndpoints = new Set(marketplaceItems.map((item) => item.x402Endpoint));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint || !allowedEndpoints.has(endpoint)) {
    return NextResponse.json(
      { error: "Unknown marketplace x402 endpoint." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });
    const contentType = response.headers.get("content-type") ?? "";
    const text = await response.text();

    if (!text) {
      return NextResponse.json(
        { error: "The x402 endpoint returned an empty metadata response." },
        { status: 502 },
      );
    }

    if (!contentType.includes("application/json") && !looksLikeJson(text)) {
      return NextResponse.json(
        {
          error: "The x402 endpoint did not return JSON metadata.",
          status: response.status,
        },
        { status: 502 },
      );
    }

    return new NextResponse(text, {
      status: response.status,
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The x402 endpoint could not be reached.",
      },
      { status: 502 },
    );
  }
}

function looksLikeJson(text: string) {
  const trimmed = text.trim();

  return trimmed.startsWith("{") || trimmed.startsWith("[");
}
