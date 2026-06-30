"use client";

import { useCallback, useEffect, useState } from "react";
import { Delete, ShieldCheck, X } from "lucide-react";
import { hashPassword } from "@/lib/data";

const PIN_KEY = "wf_pin";

function PinDots({ length, shake }: { length: number; shake: boolean }) {
  return (
    <div className={`flex items-center gap-4 ${shake ? "animate-pin-shake" : ""}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 w-4 flex items-center justify-center">
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

function PinPad({ onKey, onBackspace, disabled }: {
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
    <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
      {PAD_KEYS.map((k, i) =>
        k === "" ? <div key={i} /> : (
          <button
            key={i}
            type="button"
            onClick={() => handlePress(k)}
            disabled={disabled}
            className={`h-[60px] w-full rounded-full flex items-center justify-center transition-all select-none
              ${k === "⌫"
                ? "text-[#2D2926]"
                : `bg-white border border-[#E6E8EB] shadow-card active:scale-95 ${pressed === k ? "scale-90 bg-[#FFF0F0]" : ""}`}
              disabled:opacity-40`}
          >
            {k === "⌫"
              ? <Delete size={20} className="text-[#2D2926]" />
              : <span className="text-xl font-light text-[#2D2926]">{k}</span>}
          </button>
        )
      )}
    </div>
  );
}

interface PinModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinModal({
  isOpen,
  title    = "Confirm with PIN",
  subtitle = "Enter your 6-digit passcode to authorize",
  onSuccess,
  onCancel,
}: PinModalProps) {
  const [pin, setPin]             = useState("");
  const [shake, setShake]         = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError]         = useState("");

  // Reset whenever modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setPin("");
      setError("");
      setShake(false);
      setVerifying(false);
    }
  }, [isOpen]);

  const handleKey = useCallback((k: string) => {
    if (verifying) return;
    setPin((prev) => prev.length < 6 ? prev + k : prev);
  }, [verifying]);

  const handleBackspace = useCallback(() => {
    if (verifying) return;
    setPin((prev) => prev.slice(0, -1));
  }, [verifying]);

  // Auto-verify on 6th digit
  useEffect(() => {
    if (pin.length !== 6 || verifying) return;
    setVerifying(true);
    const storedHash  = localStorage.getItem(PIN_KEY);
    const enteredHash = hashPassword(pin);
    if (storedHash === enteredHash) {
      setTimeout(() => {
        setPin("");
        setVerifying(false);
        onSuccess();
      }, 200);
    } else {
      setError("Incorrect PIN. Please try again.");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin("");
        setError("");
        setVerifying(false);
      }, 700);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Bottom sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-lift animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3">
          <div className="h-1 w-10 rounded-full bg-[#E6E8EB]" />
        </div>

        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Cancel"
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#6D6E71] hover:bg-[#EAECF5] transition"
        >
          <X size={16} />
        </button>

        <div className="px-6 pt-4 pb-10 flex flex-col items-center">
          <div className="h-12 w-12 rounded-2xl bg-[#D71E28]/10 flex items-center justify-center">
            <ShieldCheck size={24} className="text-[#D71E28]" />
          </div>

          <h2 className="mt-4 text-[18px] font-bold text-[#2D2926]">{title}</h2>
          <p className="mt-1 text-[13px] text-[#6D6E71] text-center">{subtitle}</p>

          <div className="mt-6">
            <PinDots length={pin.length} shake={shake} />
          </div>

          {error && (
            <p className="mt-3 text-[12px] text-[#D71E28] font-semibold">{error}</p>
          )}

          <div className="mt-6 w-full">
            <PinPad onKey={handleKey} onBackspace={handleBackspace} disabled={verifying} />
          </div>
        </div>
      </div>
    </div>
  );
}
