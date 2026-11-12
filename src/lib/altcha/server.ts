import { randomInt } from "node:crypto";

import { deriveKey } from "altcha-lib/algorithms/pbkdf2";
import { CappedMap, create } from "altcha-lib/frameworks/nextjs";

import { env } from "@/lib/env";

const EXPIRES_IN_MS = 30 * 60 * 1000;

interface AltchaVerificationResult {
  ok: boolean;
  reason?: string;
}

/**
 * Challenges that have already been redeemed, so a solved payload cannot be
 * replayed. This is in-memory and per process: when running more than one
 * instance (or on serverless), replace it with a shared store (Redis, database)
 * implementing `{ get, set, setIfAbsent }`.
 */
const usedChallenges = new CappedMap<string, boolean>({ maxSize: 10_000 });

/**
 * Self-hosted ALTCHA proof-of-work, backed by the official `altcha-lib`.
 * The client has to find the counter the server picked, which costs roughly
 * `counter * cost` PBKDF2 iterations; raise either number to make it harder.
 */
export const altcha = create({
  hmacSignatureSecret: env.ALTCHA_HMAC_SECRET,
  deriveKey,
  store: usedChallenges,
  createChallengeParameters: () => ({
    algorithm: "PBKDF2/SHA-256",
    cost: 5_000,
    counter: randomInt(5_000, 10_001),
    expiresAt: new Date(Date.now() + EXPIRES_IN_MS),
  }),
});

/** Verifies the payload submitted by `<altcha-widget>`. A payload is valid once. */
export async function verifyAltchaPayload(
  encodedPayload: string
): Promise<AltchaVerificationResult> {
  const { error } = await altcha.verify(
    encodedPayload,
    deriveKey,
    env.ALTCHA_HMAC_SECRET,
    undefined,
    usedChallenges
  );

  return error ? { ok: false, reason: error } : { ok: true };
}
