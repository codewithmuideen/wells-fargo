import { NextRequest, NextResponse } from "next/server";
import otpStore from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  const { userInternalId, code } = await req.json();

  const entry = otpStore.get(userInternalId);

  if (!entry) {
    return NextResponse.json(
      { ok: false, error: "No verification in progress. Please sign in again." },
      { status: 400 }
    );
  }

  if (Date.now() > entry.expires) {
    otpStore.delete(userInternalId);
    return NextResponse.json(
      { ok: false, error: "expired" },
      { status: 400 }
    );
  }

  if (entry.code !== code.trim()) {
    return NextResponse.json(
      { ok: false, error: "invalid" },
      { status: 400 }
    );
  }

  otpStore.delete(userInternalId);
  return NextResponse.json({ ok: true });
}
