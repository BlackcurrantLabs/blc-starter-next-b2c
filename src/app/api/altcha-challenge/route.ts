import { createHash, createHmac, randomBytes, randomInt } from "crypto";
import { env } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_NUMBER = 100000;
const EXPIRES_IN_MS = 30 * 60 * 1000;

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function hmac(value: string) {
  return createHmac("sha256", env.ALTCHA_HMAC_SECRET).update(value).digest("hex");
}

export async function GET() {
  const saltBase = randomBytes(16).toString("hex");
  const expiresAt = Date.now() + EXPIRES_IN_MS;
  const salt = `${saltBase}?expires=${expiresAt}`;
  const number = randomInt(0, MAX_NUMBER + 1);
  const challenge = sha256(`${salt}${number}`);
  const signature = hmac(challenge);

  return Response.json(
    {
      algorithm: "SHA-256",
      challenge,
      maxnumber: MAX_NUMBER,
      salt,
      signature,
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        Expires: new Date(expiresAt).toUTCString(),
      },
    }
  );
}
