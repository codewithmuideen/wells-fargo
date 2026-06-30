"use client";

import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  hint,
  error,
  icon,
  className = "",
  type = "text",
  ...rest
}: InputProps) {
  const id = useId();
  const [showPwd, setShowPwd] = useState(false);
  const isPwd = type === "password";
  const inputType = isPwd ? (showPwd ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={rest.id ?? id}
          className="block text-[13px] font-semibold text-[#2D2926] mb-1.5"
        >
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center border ${
          error ? "border-[#D71E28]" : "border-[#D9D9D6]"
        } bg-white rounded-lg focus-within:border-[#D71E28] focus-within:ring-2 focus-within:ring-[#D71E28]/20 transition-all`}
      >
        {icon && (
          <span className="pl-4 text-[#6D6E71] pointer-events-none">{icon}</span>
        )}
        <input
          id={rest.id ?? id}
          type={inputType}
          {...rest}
          className={`flex-1 bg-transparent px-4 py-3 text-[15px] text-[#2D2926] placeholder-[#9AA0A6] outline-none ${className}`}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShowPwd((s) => !s)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="px-3 text-[#6D6E71] hover:text-[#D71E28] transition-colors"
          >
            {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-[#6D6E71]">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-[#D71E28]">{error}</p>}
    </div>
  );
}
