"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SplashPage() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setLeaving(true), 2000);
    const navTimer = setTimeout(() => router.replace("/login"), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${
        leaving ? "animate-splash-out" : ""
      }`}
    >
      <div className="flex flex-col items-center animate-splash-fade">
        <Image
          src="/well_logo.png"
          alt="Wells Fargo"
          width={132}
          height={132}
          priority
          className="rounded-2xl shadow-soft"
        />
        <p className="mt-6 text-sm font-medium tracking-wide text-[#6D6E71]">
          Wells Fargo Mobile
        </p>
      </div>

      <div className="absolute bottom-12 flex flex-col items-center gap-3">
        <div className="h-1 w-10 rounded-full bg-[#D71E28]/20 overflow-hidden">
          <div className="h-full w-full bg-[#D71E28] animate-pulse" />
        </div>
        <p className="text-[11px] text-[#9AA0A6]">Member FDIC</p>
      </div>
    </div>
  );
}
