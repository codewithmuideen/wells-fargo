"use client";

import React, {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const arr = new Array<string>(length).fill("");
    for (let i = 0; i < Math.min(length, value.length); i++) {
      arr[i] = value[i] ?? "";
    }
    return arr;
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) {
      const first = refs.current[0];
      if (first) {
        requestAnimationFrame(() => first.focus());
      }
    }
  }, [autoFocus]);

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    const joined = next.join("");
    onChange(joined);
    if (joined.length === length && next.every((d) => d !== "") && onComplete) {
      onComplete(joined);
    }
  };

  const focusIndex = (i: number) => {
    const el = refs.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleInput = (i: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      setDigit(i, "");
      return;
    }
    const char = cleaned[cleaned.length - 1];
    setDigit(i, char);
    if (i < length - 1) focusIndex(i + 1);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        setDigit(i, "");
        return;
      }
      if (i > 0) {
        e.preventDefault();
        setDigit(i - 1, "");
        focusIndex(i - 1);
      }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusIndex(i - 1);
      return;
    }
    if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusIndex(i + 1);
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      focusIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      focusIndex(length - 1);
      return;
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const cleaned = text.replace(/\D/g, "");
    if (!cleaned) return;
    e.preventDefault();
    const next = digits.slice();
    let cursor = i;
    for (let k = 0; k < cleaned.length && cursor < length; k++, cursor++) {
      next[cursor] = cleaned[k];
    }
    const joined = next.join("");
    onChange(joined);
    const lastFilled = Math.min(length - 1, i + cleaned.length - 1);
    focusIndex(Math.min(lastFilled + 1, length - 1));
    if (joined.length === length && next.every((d) => d !== "") && onComplete) {
      onComplete(joined);
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 sm:gap-3 ${
        error ? "animate-otp-shake" : ""
      }`}
      role="group"
      aria-label="One-time verification code"
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          disabled={disabled}
          value={d}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => handlePaste(i, e)}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={`Digit ${i + 1}`}
          className={`size-12 sm:size-14 text-center text-2xl font-semibold rounded-xl border-2 bg-white outline-none transition-all ${
            error
              ? "border-red-400 text-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : d
                ? "border-[#D71E28] text-[#D71E28] focus:ring-2 focus:ring-[#D71E28]/25"
                : "border-[#E6E8EB] text-[#2D2926] focus:border-[#D71E28] focus:ring-2 focus:ring-[#D71E28]/25"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />
      ))}
    </div>
  );
}
