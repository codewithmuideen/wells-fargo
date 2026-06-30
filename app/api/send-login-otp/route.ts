import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PREDEFINED_USERS } from "@/lib/data";
import { generateOtp } from "@/lib/registration";
import otpStore from "@/lib/otp-store";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  const needle = userId.trim().toLowerCase();
  const user = PREDEFINED_USERS.find(
    (u) => u.userId.toLowerCase() === needle || u.id.toLowerCase() === needle
  );

  if (!user) {
    return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });
  }

  const code = generateOtp();
  const expires = Date.now() + 10 * 60 * 1000;
  otpStore.set(user.id, { code, expires });

  try {
    await resend.emails.send({
      from: "Wells Fargo <onboarding@resend.dev>",
      to: user.email,
      subject: `${code} is your Wells Fargo verification code`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 0; border: 1px solid #E6E8EB; border-radius: 12px; overflow: hidden;">
          <div style="background: #D71E28; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: -0.3px;">Wells Fargo</h2>
          </div>
          <div style="padding: 32px 24px;">
            <p style="color: #2D2926; font-size: 15px; line-height: 1.6; margin-top: 0;">
              Hi ${user.firstName},
            </p>
            <p style="color: #6D6E71; font-size: 15px; line-height: 1.6;">
              Your one-time verification code is:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <span style="display: inline-block; background: #F5F5F5; border: 2px solid #E6E8EB; border-radius: 12px; padding: 16px 32px; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #D71E28; font-family: monospace;">
                ${code}
              </span>
            </div>
            <p style="color: #6D6E71; font-size: 13px; line-height: 1.6;">
              This code expires in <strong>10 minutes</strong>. If you did not request this code, please ignore this email or contact us immediately.
            </p>
            <hr style="border: none; border-top: 1px solid #E6E8EB; margin: 28px 0;" />
            <p style="color: #9AA0A6; font-size: 11px; line-height: 1.5; text-align: center; margin-bottom: 0;">
              Wells Fargo Bank, N.A. Member FDIC.<br />
              Never share your verification code with anyone.
            </p>
          </div>
        </div>
      `,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }

  const masked = user.email.replace(
    /^(.{2})(.*)(@.*)$/,
    (_, a, b, c) => a + b.replace(/./g, "•") + c
  );

  return NextResponse.json({ ok: true, maskedEmail: masked, userInternalId: user.id });
}
