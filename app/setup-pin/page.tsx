"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, Delete, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { hashPassword } from "@/lib/data";

const PIN_KEY = "wf_pin";
const PAD_KEYS = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

function PinDots({ length, shake, success }: { length: number; shake: boolean; success?: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${shake ? "animate-pin-shake" : ""}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative h-4 w-4 flex items-center justify-center">
          {i < length ? (
            <div className={`h-4 w-4 rounded-full animate-dot-fill ${success ? "bg-emerald-500" : "bg-[#D71E28]"}`} />
          ) : (
            <div className="h-4 w-4 rounded-full border-2 border-[#D0D5DD]" />
          )}
        </div>
      ))}
    </div>
  );
}

function PinPad({ onKey, onBackspace, disabled }: { onKey: (k: string) => void; onBackspace: () => void; disabled?: boolean }) {
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
            disabled={disabled}
            className={`h-[68px] w-full rounded-full flex items-center justify-center transition-all select-none
              ${k === "⌫"
                ? "text-[#2D2926]"
                : `bg-white border border-[#E6E8EB] shadow-card text-[#2D2926] active:scale-95 ${pressed === k ? "scale-90 bg-[#FFF0F0]" : ""}`
              }
              disabled:opacity-40`}
          >
            {k === "⌫"
              ? <Delete size={22} className="text-[#2D2926]" />
              : <span className="text-2xl font-light">{k}</span>
            }
          </button>
        )
      )}
    </div>
  );
}

type Step = "create" | "confirm" | "done";

export default function SetupPinPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep]         = useState<Step>("create");
  const [pin, setPin]           = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [shake, setShake]       = useState(false);
  const [busy, setBusy]         = useState(false);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const handleKey = useCallback((k: string) => {
    if (busy) return;
    setPin((prev) => prev.length < 6 ? prev + k : prev);
  }, [busy]);

  const handleBackspace = useCallback(() => {
    if (busy) return;
    setPin((prev) => prev.slice(0, -1));
  }, [busy]);

  // Auto-advance when 6 digits entered
  useEffect(() => {
    if (pin.length !== 6) return;
    setBusy(true);

    if (step === "create") {
      // Move to confirm step
      setFirstPin(pin);
      setTimeout(() => {
        setStep("confirm");
        setPin("");
        setBusy(false);
      }, 300);
    } else if (step === "confirm") {
      if (pin === firstPin) {
        // PINs match — save and finish
        try {
          localStorage.setItem(PIN_KEY, hashPassword(pin));
          // Persist last user so splash shows PIN screen on future launches
          const sid = localStorage.getItem("wf_session");
          if (sid) localStorage.setItem("wf_last_user", sid);
        } catch { /* ignore */ }
        setStep("done");
        setBusy(false);
        setTimeout(() => router.replace("/dashboard"), 1800);
      } else {
        // Mismatch
        setShake(true);
        setTimeout(() => {
          setShake(false);
          setPin("");
          setBusy(false);
        }, 600);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const stepMeta = {
    create:  { heading: "Create your passcode",  sub: "Choose a 6-digit PIN for quick sign-on" },
    confirm: { heading: "Confirm your passcode", sub: "Enter the same 6 digits again" },
    done:    { heading: "Passcode set!",         sub: "Redirecting you to your dashboard…"       },
  };
  const { heading, sub } = stepMeta[step];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      <div className="h-1 w-full bg-[#D71E28]" />

      {/* Header */}
      <div className="flex items-center justify-center pt-8 pb-2">
        <Image src="/well_logo.png" alt="Wells Fargo" width={48} height={48} className="rounded-xl" />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-soft border border-[#E6E8EB] p-7 flex flex-col items-center">

          {step === "done" ? (
            <>
              <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop shadow-soft">
                <CheckCircle2 size={40} className="text-white" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-[#2D2926]">{heading}</h2>
              <p className="mt-2 text-sm text-[#6D6E71] text-center">{sub}</p>
              <div className="mt-5 flex items-center justify-center gap-2 text-sm text-[#D71E28]">
                <span className="h-2 w-2 rounded-full bg-[#D71E28] animate-pulse" />
                Taking you to your accounts
              </div>
            </>
          ) : (
            <>
              {/* Security badge */}
              <div className="h-14 w-14 rounded-2xl bg-[#D71E28]/10 flex items-center justify-center">
                <ShieldCheck size={28} className="text-[#D71E28]" />
              </div>

              <h2 className="mt-5 text-[22px] font-bold text-[#2D2926] text-center">{heading}</h2>
              <p className="mt-1.5 text-[13px] text-[#6D6E71] text-center">{sub}</p>

              {/* Step indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-colors ${step === "create" ? "bg-[#D71E28]" : "bg-emerald-500"}`} />
                <div className={`h-2 w-2 rounded-full transition-colors ${step === "confirm" ? "bg-[#D71E28]" : "bg-[#E6E8EB]"}`} />
              </div>

              {/* PIN dots */}
              <div className="mt-7">
                <PinDots length={pin.length} shake={shake} />
              </div>

              {shake && (
                <p className="mt-3 text-[12px] text-[#D71E28] font-semibold animate-fade-up">
                  Passcodes don&apos;t match. Try again.
                </p>
              )}

              {/* Keypad */}
              <div className="mt-8 w-full">
                <PinPad onKey={handleKey} onBackspace={handleBackspace} disabled={busy} />
              </div>
            </>
          )}
        </div>

        {/* Skip link */}
        {step !== "done" && (
          <button
            type="button"
            onClick={() => router.replace("/dashboard")}
            className="mt-5 text-[13px] text-[#9AA0A6] hover:text-[#6D6E71] transition"
          >
            Skip for now
          </button>
        )}
      </div>

      <div className="pb-6 text-center">
        <p className="text-[11px] text-[#9AA0A6]">Wells Fargo Bank, N.A. · Member FDIC</p>
      </div>
    </div>
  );
}
