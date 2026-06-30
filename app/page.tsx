"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Delete } from "lucide-react";
import { getUserById } from "@/lib/auth";
import { hashPassword } from "@/lib/data";

type Stage = 1 | 3;

const STAGE1_MS     = 2200;
const TRANSITION_MS = 450;

const PIN_KEY       = "wf_pin";
const SESSION_KEY   = "wf_session";
const LAST_USER_KEY = "wf_last_user";

function PinDots({ length, shake }: { length: number; shake: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${shake ? "animate-pin-shake" : ""}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative h-4 w-4 flex items-center justify-center">
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

const PAD_KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

function PinPad({
  onKey, onBackspace, disabled,
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
        k === "" ? <div key={i} /> : (
          <button
            key={i}
            type="button"
            onClick={() => handlePress(k)}
            disabled={disabled || k === ""}
            className={`h-[68px] w-full rounded-full flex items-center justify-center transition-all select-none
              ${k === "⌫" ? "text-[#2D2926]"
                : `bg-white border border-[#E6E8EB] shadow-card text-[#2D2926] text-2xl font-light active:scale-95 ${pressed === k ? "scale-90 bg-[#FFF0F0]" : ""}`}
              disabled:opacity-40`}
          >
            {k === "⌫" ? <Delete size={22} className="text-[#2D2926]" /> : <span className="text-2xl font-light">{k}</span>}
          </button>
        )
      )}
    </div>
  );
}

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted]           = useState(false);
  const [stage, setStage]               = useState<Stage>(1);
  const [exiting, setExiting]           = useState(false);
  const [savedUser, setSavedUser]       = useState<{
    firstName: string; lastName: string; initials: string; avatar: string;
  } | null>(null);
  const [pin, setPin]                   = useState("");
  const [pinShake, setPinShake]         = useState(false);
  const [pinVerifying, setPinVerifying] = useState(false);
  const navigatedRef = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  // Load saved user on mount
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
    } catch { /* ignore */ }
  }, []);

  const navigate = useCallback((dest: string | Stage) => {
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
  }, [router]);

  // Stage 1 → PIN screen or login
  useEffect(() => {
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
    }, STAGE1_MS);
    return () => clearTimeout(t);
  }, [navigate]);

  // Auto-verify PIN when 6 digits entered
  useEffect(() => {
    if (pin.length !== 6 || pinVerifying) return;
    setPinVerifying(true);
    try {
      const storedHash  = localStorage.getItem(PIN_KEY);
      const enteredHash = hashPassword(pin);
      if (storedHash === enteredHash) {
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
    setPin((prev) => prev.length < 6 ? prev + k : prev);
  }, [pinVerifying]);

  const handleBackspace = useCallback(() => {
    if (pinVerifying) return;
    setPin((prev) => prev.slice(0, -1));
  }, [pinVerifying]);

  if (!mounted) return null;

  const stageClass = exiting ? "animate-stage-exit" : "animate-stage-enter";

  // ── Stage 1: Clean brand splash ───────────────────────────────────────────
  if (stage === 1) {
    return (
      <div className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center ${stageClass}`}>
        <div className="flex flex-col items-center animate-logo-rise">
          <Image src="/well_logo.png" alt="Wells Fargo" width={120} height={120} priority className="rounded-[26px]" />
          <h1 className="mt-5 text-[28px] font-bold text-[#2D2926] tracking-tight leading-none">Wells Fargo</h1>
          <p className="mt-1.5 text-[13px] text-[#9AA0A6] font-medium tracking-wide">Together we&apos;ll go far.</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E6E8EB] overflow-hidden">
          <div className="h-full w-1/3 bg-[#D71E28] animate-shimmer" />
        </div>
        <p className="absolute bottom-5 text-[11px] text-[#C4C8CE] font-medium">Member FDIC · Equal Housing Lender</p>
      </div>
    );
  }

  // ── Stage 3: PIN entry ────────────────────────────────────────────────────
  const initials  = savedUser?.initials  ?? "WF";
  const firstName = savedUser?.firstName ?? "User";
  const avatarSrc = savedUser?.avatar    ?? "";

  return (
    <div className={`fixed inset-0 z-50 bg-white flex flex-col ${stageClass}`}>
      <div className="h-1 w-full bg-[#D71E28]" />

      <div className="flex-1 flex flex-col items-center pt-10 pb-6 px-6 overflow-y-auto">
        {/* Avatar */}
        <div className="animate-avatar-pop">
          {avatarSrc ? (
            <div className="h-[88px] w-[88px] rounded-full shadow-lift ring-4 ring-[#D71E28]/20 overflow-hidden">
              <Image src={avatarSrc} alt={firstName} width={88} height={88} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-[88px] w-[88px] rounded-full bg-[#D71E28] flex items-center justify-center shadow-lift ring-4 ring-[#D71E28]/20">
              <span className="text-white font-bold text-[28px] tracking-wide">{initials}</span>
            </div>
          )}
        </div>

        {/* Welcome */}
        <div className="mt-5 text-center animate-fade-up-d1">
          <p className="text-sm text-[#9AA0A6] font-medium">Welcome back,</p>
          <h2 className="mt-0.5 text-[26px] font-bold text-[#2D2926]">{firstName}</h2>
        </div>

        <p className="mt-6 text-[13px] text-[#6D6E71] font-medium animate-fade-up-d2">
          Enter your 6-digit passcode
        </p>

        <div className="mt-5 animate-fade-up-d2">
          <PinDots length={pin.length} shake={pinShake} />
        </div>

        {pinShake && (
          <p className="mt-3 text-[12px] text-[#D71E28] font-semibold animate-fade-up">
            Incorrect passcode. Try again.
          </p>
        )}

        <div className="mt-8 w-full animate-fade-up-d3">
          <PinPad onKey={handleKey} onBackspace={handleBackspace} disabled={pinVerifying} />
        </div>

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

      <div className="py-4 text-center">
        <p className="text-[11px] text-[#9AA0A6]">Wells Fargo Bank, N.A. · Member FDIC</p>
      </div>
    </div>
  );
}
