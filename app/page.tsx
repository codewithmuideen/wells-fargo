"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STAGE1_MS   = 2200;
const SESSION_KEY = "wf_session";

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // After logo animation, check session and route accordingly
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const sid = localStorage.getItem(SESSION_KEY);
        router.replace(sid ? "/dashboard" : "/login");
      } catch {
        router.replace("/login");
      }
    }, STAGE1_MS);
    return () => clearTimeout(t);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
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

      {/* Loading bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E6E8EB] overflow-hidden">
        <div className="h-full w-1/3 bg-[#D71E28] animate-shimmer" />
      </div>

      <p className="absolute bottom-5 text-[11px] text-[#C4C8CE] font-medium">
        Member FDIC · Equal Housing Lender
      </p>
    </div>
  );
}
