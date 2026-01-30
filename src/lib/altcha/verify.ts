import { createHash, createHmac, timingSafeEqual } from "crypto";
import { env } from "@/lib/env";

type AltchaPayload = {
  algorithm: string;
  challenge: string;
  number: number;
  salt: string;
  signature: string;
};

type AltchaVerificationResult = {
  ok: boolean;
  reason?: string;
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(value: string) {
  return createHmac("sha256", env.ALTCHA_HMAC_SECRET).update(value).digest("hex");
}

function parseExpiration(salt: string) {
  const [, query] = salt.split("?");
  if (!query) return null;
  const params = new URLSearchParams(query);
  const expires = params.get("expires");
  if (!expires) return null;
  const numeric = Number(expires);
  return Number.isFinite(numeric) ? numeric : null;
}

export function verifyAltchaPayload(encodedPayload: string): AltchaVerificationResult {
  if (!encodedPayload) {
    return { ok: false, reason: "missing_payload" };
  }

  let payload: AltchaPayload;
  try {
    const decoded = Buffer.from(encodedPayload, "base64").toString("utf-8");
    payload = JSON.parse(decoded) as AltchaPayload;
  } catch {
    return { ok: false, reason: "invalid_payload" };
  }

  if (payload.algorithm !== "SHA-256") {
    return { ok: false, reason: "invalid_algorithm" };
  }

  const expectedSignature = hmac(payload.challenge);
  if (expectedSignature.length !== payload.signature.length) {
    return { ok: false, reason: "invalid_signature" };
  }
  if (
    !timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(payload.signature)
    )
  ) {
    return { ok: false, reason: "invalid_signature" };
  }

  const expectedChallenge = sha256(`${payload.salt}${payload.number}`);
  if (expectedChallenge !== payload.challenge) {
    return { ok: false, reason: "invalid_solution" };
  }

  const expiresAt = parseExpiration(payload.salt);
  if (expiresAt && Date.now() > expiresAt) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true };
}
