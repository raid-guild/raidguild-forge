import { createHash, randomBytes, timingSafeEqual } from "crypto";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function createEmailHash(email: string) {
  return createHash("sha256").update(normalizeEmail(email)).digest("hex");
}

export function createConfirmationToken() {
  return randomBytes(32).toString("base64url");
}

export function hashConfirmationToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function safeTokenHashEquals(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  return left.length === right.length && timingSafeEqual(left, right);
}
