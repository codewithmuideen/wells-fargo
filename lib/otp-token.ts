const OTP_SECRET = process.env.OTP_SECRET ?? "wf-otp-demo-secret-2026";

async function hmacSign(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    enc.encode(OTP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

/** Creates a stateless, HMAC-signed token embedding code verifier + expiry */
export async function createOtpToken(
  code: string,
  userId: string,
  expiresAt: number
): Promise<string> {
  const sig = await hmacSign(`${code}:${userId}:${expiresAt}`);
  const payload = JSON.stringify({ u: userId, e: expiresAt, s: sig });
  return Buffer.from(payload).toString("base64url");
}

/** Verifies a submitted code against the token — no shared state required */
export async function verifyOtpToken(
  token: string,
  submittedCode: string
): Promise<{ ok: true; userId: string } | { ok: false; error: "expired" | "invalid" }> {
  try {
    const { u: userId, e: expiresAt, s: storedSig } = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8")
    ) as { u: string; e: number; s: string };

    if (Date.now() > expiresAt) return { ok: false, error: "expired" };

    const expectedSig = await hmacSign(`${submittedCode.trim()}:${userId}:${expiresAt}`);
    if (expectedSig !== storedSig) return { ok: false, error: "invalid" };

    return { ok: true, userId };
  } catch {
    return { ok: false, error: "invalid" };
  }
}
