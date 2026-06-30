import React from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-ring cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#D71E28] text-white hover:bg-[#A01B22] shadow-soft hover:shadow-lift active:translate-y-[1px]",
  secondary:
    "border-2 border-[#D71E28] text-[#D71E28] hover:bg-[#D71E28] hover:text-white",
  outline:
    "border border-[#D9D9D6] text-[#2D2926] hover:bg-[#F5F5F5]",
  ghost: "text-[#D71E28] hover:bg-[#D71E28]/10",
  danger: "bg-[#A01B22] text-white hover:bg-[#8a161d] shadow-soft hover:shadow-lift",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
