"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Delete, Lock, ShieldCheck, Smartphone, Zap } from "lucide-react";
import { getUserById } from "@/lib/auth";
import { hashPassword } from "@/lib/data";

type Stage = 1 | 2 | 3;

const STAGE1_MS = 2800;
const STAGE2_MS = 3000;
const TRANSITION_MS = 450;

const PIN_KEY       = "wf_pin";
const SESSION_KEY   = "wf_session";
const LAST_USER_KEY = "wf_last_user";

function PinDots({ length, shake }: { length: number; shake: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${shake ? "animate-pin-shake" : ""}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative h-4 w-4 flex items-center justify-center"
        >
          {i < length ? (
            <div className="h-4 w-4 rounded-full bg-[#D71E28] animate-dot-fill" />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-[#D0D5DD]" />
          )}
        </div>
      ))}
    </div>
  );
}

const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

function PinPad({
  onKey,
  onBackspace,
  disabled,
}: {
  onKey: (k: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState<string | null>(null);

  const handlePress = (k: string) => {
    if (disabled) return;
    setPressed(k);
    setTimeout(() => setPressed(null), 160);
    if (k === "⌫") onBackspace();
    else if (k) onKey(k);
  };

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mx-auto">
      {PAD_KEYS.map((k, i) =>
        k === "" ? (
          <div key={i} />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => handlePress(k)}
            disabled={disabled || k === ""}
            className={`
              h-[68px] w-full rounded-full flex items-center justify-center transition-all select-none
              ${k === "⌫"
                ? "text-[#2D2926]"
                : "bg-white border border-[#E6E8EB] shadow-card text-[#2D2926] text-2xl font-light active:scale-95"
              }
              ${pressed === k ? "scale-90 bg-[#FFF0F0]" : ""}
              disabled:opacity-40
            `}
          >
            {k === "⌫" ? (
              <Delete size={22} className="text-[#2D2926]" />
            ) : (
              <span className="text-2xl font-light">{k}</span>
            )}
          </button>
        )
      )}
    </div>
  );
}

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<Stage>(1);
  const [exiting, setExiting] = useState(false);
  const [savedUser, setSavedUser] = useState<{
    firstName: string;
    lastName: string;
    initials: string;
    avatar: string;
  } | null>(null);
  const [pin, setPin] = useState("");
  const [pinShake, setPinShake] = useState(false);
  const [pinVerifying, setPinVerifying] = useState(false);
  const navigatedRef = useRef(false);

  // Prevent SSR/CSR hydration mismatch — render nothing until mounted
  useEffect(() => { setMounted(true); }, []);

  // Check for saved last-user + PIN on mount (drives Stage 3 avatar display)
  useEffect(() => {
    try {
      const lastUid = localStorage.getItem(LAST_USER_KEY);
      const pinHash = localStorage.getItem(PIN_KEY);
      if (lastUid && pinHash) {
        const u = getUserById(lastUid);
        if (u) {
          setSavedUser({
            firstName: u.firstName,
            lastName: u.lastName,
            initials: u.firstName[0] + u.lastName[0],
            avatar: u.avatar ?? "",
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const navigate = useCallback(
    (dest: string | Stage) => {
      if (navigatedRef.current && typeof dest === "string") return;
      setExiting(true);
      setTimeout(() => {
        if (typeof dest === "string") {
          navigatedRef.current = true;
          router.replace(dest);
        } else {
          setStage(dest);
          setExiting(false);
        }
      }, TRANSITION_MS);
    },
    [router]
  );

  // Stage 1 → 2
  useEffect(() => {
    const t = setTimeout(() => navigate(2), STAGE1_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stage 2 → 3 or login/dashboard
  useEffect(() => {
    if (stage !== 2) return;
    const t = setTimeout(() => {
      try {
        const lastUid = localStorage.getItem(LAST_USER_KEY);
        const pinHash = localStorage.getItem(PIN_KEY);
        if (lastUid && pinHash && getUserById(lastUid)) {
          navigate(3);
          return;
        }
        const sid = localStorage.getItem(SESSION_KEY);
        navigate(sid ? "/dashboard" : "/login");
      } catch {
        navigate("/login");
      }
    }, STAGE2_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Auto-verify PIN when 6 digits entered
  useEffect(() => {
    if (pin.length !== 6 || pinVerifying) return;
    setPinVerifying(true);
    try {
      const storedHash = localStorage.getItem(PIN_KEY);
      const enteredHash = hashPassword(pin);
      if (storedHash === enteredHash) {
        // Restore the active session so AuthContext recognises the user
        const lastUid = localStorage.getItem(LAST_USER_KEY);
        if (lastUid) localStorage.setItem(SESSION_KEY, lastUid);
        navigate("/dashboard");
      } else {
        setPinShake(true);
        setTimeout(() => {
          setPin("");
          setPinShake(false);
          setPinVerifying(false);
        }, 600);
      }
    } catch {
      setPin("");
      setPinVerifying(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const handleKey = useCallback((k: string) => {
    if (pinVerifying) return;
    setPin((prev) => (prev.length < 6 ? prev + k : prev));
  }, [pinVerifying]);

  const handleBackspace = useCallback(() => {
    if (pinVerifying) return;
    setPin((prev) => prev.slice(0, -1));
  }, [pinVerifying]);

  // Render nothing on server to avoid SSR/CSR mismatch
  if (!mounted) return null;

  const stageClass = exiting ? "animate-stage-exit" : "animate-stage-enter";

  // ── Stage 1: Clean brand splash (white, minimal — like real WF / BOA) ───────
  if (stage === 1) {
    return (
      <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center ${stageClass}`}>
        {/* Centered logo + wordmark — clean, no decorations */}
        <div className="flex flex-col items-center animate-logo-rise">
          <Image
            src="/well_logo.png"
            alt="Wells Fargo"
            width={120}
            height={120}
            priority
            className="rounded-[26px]"
          />
          <h1 className="mt-5 text-[28px] font-bold text-[#2D2926] tracking-tight leading-none">
            Wells Fargo
          </h1>
          <p className="mt-1.5 text-[13px] text-[#9AA0A6] font-medium tracking-wide">
            Together we&apos;ll go far.
          </p>
        </div>

        {/* Thin red loading bar at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E6E8EB] overflow-hidden">
          <div className="h-full w-1/3 bg-[#D71E28] animate-shimmer" />
        </div>

        {/* FDIC */}
        <p className="absolute bottom-5 text-[11px] text-[#C4C8CE] font-medium">
          Member FDIC · Equal Housing Lender
        </p>
      </div>
    );
  }

  // ── Stage 2: Premium feature screen ───────────────────────────────────────
  if (stage === 2) {
    return (
      <div
        className={`fixed inset-0 z-50 overflow-hidden flex flex-col ${stageClass}`}
        style={{ background: "linear-gradient(175deg,#1A0607 0%,#290810 40%,#0D0D0D 100%)" }}
      >
        {/* Glow accents */}
        <div className="absolute top-[-60px] right-[-40px] h-[280px] w-[280px] rounded-full bg-[#D71E28]/20 blur-3xl animate-glow-pulse" />
        <div
          className="absolute bottom-[30%] left-[-60px] h-[200px] w-[200px] rounded-full bg-[#D71E28]/10 blur-2xl animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />

        {/* Top logo */}
        <div className="pt-14 flex flex-col items-center">
          <div className="animate-fade-up flex items-center gap-2.5">
            <Image
              src="/well_logo.png"
              alt="Wells Fargo"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="text-white font-bold text-lg tracking-tight">Wells Fargo</span>
          </div>
        </div>

        {/* Center headline */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="animate-fade-up-d1 inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck size={14} className="text-[#FFD700]" />
            <span className="text-[12px] font-semibold text-white/80 tracking-wide uppercase">
              Bank-grade security
            </span>
          </div>

          <h2 className="animate-fade-up-d2 text-[38px] font-bold text-white leading-[1.15] tracking-tight">
            Your money.<br />
            <span className="text-[#FF6B6B]">Always protected.</span>
          </h2>

          <p className="animate-fade-up-d3 mt-4 text-[15px] text-white/55 leading-relaxed max-w-[300px]">
            256-bit encryption, real-time fraud alerts, and zero liability protection on every account.
          </p>

          {/* Feature cards */}
          <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-[340px]">
            {[
              { icon: Lock, label: "256-bit\nEncryption", delay: "animate-card-pop-d1" },
              { icon: Zap, label: "Real-time\nAlerts", delay: "animate-card-pop-d2" },
              { icon: Smartphone, label: "24/7 Mobile\nAccess", delay: "animate-card-pop-d3" },
            ].map(({ icon: Icon, label, delay }) => (
              <div
                key={label}
                className={`${delay} bg-white/8 border border-white/12 rounded-2xl p-3.5 flex flex-col items-center gap-2`}
              >
                <div className="h-9 w-9 rounded-xl bg-[#D71E28]/25 flex items-center justify-center">
                  <Icon size={18} className="text-[#FF6B6B]" />
                </div>
                <p className="text-[11px] font-semibold text-white/70 text-center leading-tight whitespace-pre-line">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: progress dots */}
        <div className="pb-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/30" />
            <div className="h-2 w-5 rounded-full bg-[#D71E28]" />
            <div className="h-2 w-2 rounded-full bg-white/30" />
          </div>
          <p className="text-[11px] text-white/30 tracking-wide font-medium">
            Member FDIC · Equal Housing Lender
          </p>
        </div>
      </div>
    );
  }

  // ── Stage 3: PIN entry ─────────────────────────────────────────────────────
  const initials = savedUser?.initials ?? "WF";
  const firstName = savedUser?.firstName ?? "User";
  const avatarSrc = savedUser?.avatar ?? "";

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col ${stageClass}`}
    >
      {/* Red stripe */}
      <div className="h-1 w-full bg-[#D71E28]" />

      {/* Scrollable body */}
      <div className="flex-1 flex flex-col items-center pt-10 pb-6 px-6 overflow-y-auto">
        {/* Avatar */}
        <div className="animate-avatar-pop">
          {avatarSrc ? (
            <div className="h-[88px] w-[88px] rounded-full shadow-lift ring-4 ring-[#D71E28]/20 overflow-hidden">
              <Image
                src={avatarSrc}
                alt={firstName}
                width={88}
                height={88}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-[88px] w-[88px] rounded-full bg-[#D71E28] flex items-center justify-center shadow-lift ring-4 ring-[#D71E28]/20">
              <span className="text-white font-bold text-[28px] tracking-wide">
                {initials}
              </span>
            </div>
          )}
        </div>

        {/* Welcome text */}
        <div className="mt-5 text-center animate-fade-up-d1">
          <p className="text-sm text-[#9AA0A6] font-medium">Welcome back,</p>
          <h2 className="mt-0.5 text-[26px] font-bold text-[#2D2926]">{firstName}</h2>
        </div>

        {/* Instruction */}
        <p className="mt-6 text-[13px] text-[#6D6E71] font-medium animate-fade-up-d2">
          Enter your 6-digit passcode
        </p>

        {/* PIN dots */}
        <div className="mt-5 animate-fade-up-d2">
          <PinDots length={pin.length} shake={pinShake} />
        </div>

        {pinShake && (
          <p className="mt-3 text-[12px] text-[#D71E28] font-semibold animate-fade-up">
            Incorrect passcode. Try again.
          </p>
        )}

        {/* Keypad */}
        <div className="mt-8 w-full animate-fade-up-d3">
          <PinPad
            onKey={handleKey}
            onBackspace={handleBackspace}
            disabled={pinVerifying}
          />
        </div>

        {/* Alt options */}
        <div className="mt-8 flex flex-col items-center gap-3 animate-fade-up-d4">
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D71E28] hover:underline"
          >
            Use username &amp; password instead
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem(PIN_KEY);
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(LAST_USER_KEY);
              } catch { /**/ }
              router.replace("/login");
            }}
            className="text-xs text-[#9AA0A6] hover:text-[#6D6E71] transition-colors"
          >
            Not {firstName}? Switch account
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-[11px] text-[#9AA0A6]">
          Wells Fargo Bank, N.A. · Member FDIC
        </p>
      </div>
    </div>
  );
}
