"use client";

import { useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Info, MapPin, PhoneCall, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { formatCurrency } from "@/lib/data";

export default function DepositPage() {
  return (
    <AppShell>
      <DepositContent />
    </AppShell>
  );
}

function DepositContent() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [checkImage, setCheckImage]     = useState<string | null>(null);
  const [captureError, setCaptureError] = useState("");
  const [processing, setProcessing]     = useState(false);
  const [showResult, setShowResult]     = useState(false);
  const refNum = `MDC${Date.now().toString().slice(-8)}`;

  if (!user) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCaptureError("");
    const reader = new FileReader();
    reader.onload = (ev) => setCheckImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!checkImage) {
      setCaptureError("Please capture the front of your check before continuing.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowResult(true);
    }, 2200);
  };

  const handleReset = () => {
    setCheckImage(null);
    setCaptureError("");
    setShowResult(false);
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Deposit a check</h1>
        <p className="mt-1 text-sm text-[#6D6E71]">
          Snap a photo of your check to deposit it instantly.
        </p>

        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-6">
          {/* Camera capture area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={handleFileChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center py-10 ${
              checkImage
                ? "border-emerald-300 bg-emerald-50"
                : captureError
                ? "border-red-300 bg-red-50"
                : "border-[#D9D9D6] bg-[#F5F5F5] hover:border-[#D71E28] hover:bg-red-50/30 active:scale-[0.98]"
            } transition`}
          >
            {checkImage ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={checkImage}
                  alt="Check front"
                  className="max-h-36 rounded-lg object-contain shadow-sm mb-3"
                />
                <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Check captured — tap to retake
                </p>
              </>
            ) : (
              <>
                <span className={`h-14 w-14 rounded-full flex items-center justify-center ${captureError ? "bg-red-100 text-red-500" : "bg-[#D71E28]/10 text-[#D71E28]"}`}>
                  <Camera size={26} />
                </span>
                <p className="mt-4 text-sm font-semibold text-[#2D2926]">Front of check</p>
                <p className="text-xs text-[#6D6E71]">Tap to capture</p>
              </>
            )}
          </button>
          {captureError && (
            <p className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle size={12} /> {captureError}
            </p>
          )}

          <div className="mt-5">
            <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
              Deposit to
            </label>
            <div className="rounded-lg border border-[#E6E8EB] bg-white px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[#2D2926]">
                {user.accountType} •••• {user.accountNumber.slice(-4)}
              </span>
              <span className="text-sm text-[#6D6E71]">
                {formatCurrency(user.availableBalance)}
              </span>
            </div>
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            className="mt-6"
            onClick={handleContinue}
            disabled={processing}
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing…
              </span>
            ) : "Continue"}
          </Button>

          <div className="mt-4 flex items-start gap-2 text-xs text-[#6D6E71]">
            <Info size={14} className="mt-0.5 shrink-0 text-[#D71E28]" />
            <p>
              Funds from mobile deposits are typically available the next business
              day. Member FDIC.
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-5 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-[#2D2926]">
            Your mobile deposit limit is{" "}
            <span className="font-semibold">$10,000.00</span> per day.
          </p>
        </div>
      </div>

      {/* ─── Result modal ─── */}
      {showResult && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle size={36} className="text-amber-600" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-[#2D2926]">Deposit Not Processed</h2>
              <p className="mt-2 text-[14px] text-[#6D6E71] leading-relaxed max-w-xs">
                We were unable to process your mobile deposit at this time. Please try the following:
              </p>

              <div className="mt-5 w-full space-y-3">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E6E8EB] text-left">
                  <Camera size={18} className="text-[#D71E28] shrink-0" />
                  <p className="text-[13px] text-[#2D2926]">Retake in good lighting with a flat background</p>
                </div>
                <a href="tel:18008693557"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E6E8EB] hover:border-[#D71E28] transition text-left">
                  <PhoneCall size={18} className="text-[#D71E28] shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-[#2D2926]">Call us</p>
                    <p className="text-[11px] text-[#6D6E71]">1-800-869-3557 · Available 24/7</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E6E8EB] text-left">
                  <MapPin size={18} className="text-[#D71E28] shrink-0" />
                  <p className="text-[13px] text-[#2D2926]">Visit your nearest Wells Fargo branch</p>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-[#9AA0A6]">Reference: {refNum}</p>

              <div className="mt-5 flex gap-3 w-full">
                <button onClick={handleReset}
                  className="flex-1 py-3 rounded-xl border border-[#E6E8EB] text-sm font-semibold text-[#2D2926] hover:bg-[#F5F5F5] transition">
                  Try Again
                </button>
                <button onClick={() => setShowResult(false)}
                  className="flex-1 py-3 rounded-xl bg-[#D71E28] text-sm font-bold text-white hover:bg-[#A01B22] transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
