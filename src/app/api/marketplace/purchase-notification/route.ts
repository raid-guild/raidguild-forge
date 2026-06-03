import { NextResponse } from "next/server";

import { marketplaceItems } from "@/lib/marketplace";
import { sendAdminNotification } from "@/lib/subscribe/email";

export const runtime = "nodejs";

type PurchaseNotificationRequestBody = {
  kitSlug?: unknown;
  purchaseNotificationId?: unknown;
};

const purchaseNotificationIdPattern = /^[a-zA-Z0-9_-]{8,80}$/;

export async function POST(request: Request) {
  let body: PurchaseNotificationRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof body.kitSlug !== "string") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (
    typeof body.purchaseNotificationId !== "string" ||
    !purchaseNotificationIdPattern.test(body.purchaseNotificationId)
  ) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const item = marketplaceItems.find((marketplaceItem) => {
    return marketplaceItem.slug === body.kitSlug;
  });

  if (!item) {
    return NextResponse.json({ error: "Unknown marketplace item." }, { status: 400 });
  }

  const notificationCookieName = getNotificationCookieName(item.slug);
  const notifiedPurchaseId = getCookieValue(
    request.headers.get("cookie"),
    notificationCookieName,
  );

  if (notifiedPurchaseId === body.purchaseNotificationId) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    await sendAdminNotification({
      subject: "RaidGuild Forge kit purchase completed",
      textLines: [
        "A marketplace kit purchase completed.",
        "",
        `Kit: ${item.title}`,
        `Slug: ${item.slug}`,
        `Category: ${item.category}`,
      ],
      htmlLines: [
        "<p>A marketplace kit purchase completed.</p>",
        "<ul>",
        `<li><strong>Kit:</strong> ${item.title}</li>`,
        `<li><strong>Slug:</strong> ${item.slug}</li>`,
        `<li><strong>Category:</strong> ${item.category}</li>`,
        "</ul>",
      ],
    });
  } catch (error) {
    console.warn("Admin purchase notification failed", error);
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set(notificationCookieName, body.purchaseNotificationId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function getNotificationCookieName(slug: string) {
  return `forge_purchase_notified_${slug.replace(/[^a-z0-9_-]/gi, "_")}`;
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [rawName, ...rawValueParts] = cookie.trim().split("=");

    if (rawName === name) {
      return decodeURIComponent(rawValueParts.join("="));
    }
  }

  return null;
}
