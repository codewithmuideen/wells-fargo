"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "wf_install_dismissed";
const DISMISS_DAYS = 3;

function wasDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const ts = localStorage.getItem(DISMISSED_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < DISMISS_DAYS * 86400000;
  } catch {
    return false;
  }
}

function setDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  } catch {
    // ignore
  }
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    if (isIos()) {
      const timer = setTimeout(() => setShowIos(true), 2000);
      return () => clearTimeout(timer);
    }

    // The inline script in layout.tsx captures the event before React hydrates
    type WinWithBip = Window & { __bip?: BeforeInstallPromptEvent };
    const early = (window as WinWithBip).__bip;
    if (early) {
      setDeferredPrompt(early);
      return;
    }

    // Fallback: listen in case we get here before the event fires
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (deferredPrompt) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    setShowIos(false);
    setDeferredPrompt(null);
    setDismissed();
  };

  // Android / Chrome install banner
  if (visible && deferredPrompt) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-slide-up">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lift border border-[#E6E8EB] overflow-hidden">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-white shadow-card shrink-0 flex items-center justify-center border border-[#E6E8EB]">
                <Image
                  src="/favicon_2.png"
                  alt="Wells Fargo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#D71E28] text-[15px]">
                  Install Wells Fargo
                </h3>
                <p className="text-[13px] text-[#6D6E71] mt-0.5 leading-relaxed">
                  Add to your home screen for quick access to your accounts.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] inline-flex items-center justify-center shrink-0"
                aria-label="Dismiss"
              >
                <X size={16} className="text-[#6D6E71]" />
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#6D6E71] hover:bg-[#F5F5F5] transition-colors"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#D71E28] hover:bg-[#A01B22] transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download size={16} /> Install
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // iOS install instructions
  if (showIos) {
    return (
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 animate-slide-up">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lift border border-[#E6E8EB] overflow-hidden">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl overflow-hidden bg-white shadow-card shrink-0 flex items-center justify-center border border-[#E6E8EB]">
                <Image
                  src="/favicon_2.png"
                  alt="Wells Fargo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#D71E28] text-[15px]">
                  Install Wells Fargo
                </h3>
                <p className="text-[13px] text-[#6D6E71] mt-1 leading-relaxed">
                  Tap{" "}
                  <Share size={14} className="inline text-[#D71E28] -mt-0.5" />{" "}
                  <span className="font-semibold">Share</span> at the bottom of
                  your browser, then tap{" "}
                  <span className="font-semibold">&quot;Add to Home Screen&quot;</span>.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] inline-flex items-center justify-center shrink-0"
                aria-label="Dismiss"
              >
                <X size={16} className="text-[#6D6E71]" />
              </button>
            </div>
            <button
              onClick={handleDismiss}
              className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-[#D71E28] hover:bg-[#F5F5F5] transition-colors"
            >
              Got it
            </button>
          </div>
          <div className="flex justify-center pb-3">
            <div className="h-1.5 w-12 rounded-full bg-[#E6E8EB]" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
