"use client";

import { Camera, CheckCircle2, Info } from "lucide-react";
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
  if (!user) return null;

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Deposit a check</h1>
      <p className="mt-1 text-sm text-[#6D6E71]">
        Snap a photo of your check to deposit it instantly.
      </p>

      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-6">
        <div className="rounded-xl border border-dashed border-[#D9D9D6] bg-[#F5F5F5] py-12 flex flex-col items-center justify-center">
          <span className="h-14 w-14 rounded-full bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center">
            <Camera size={26} />
          </span>
          <p className="mt-4 text-sm font-semibold text-[#2D2926]">Front of check</p>
          <p className="text-xs text-[#6D6E71]">Tap to capture</p>
        </div>

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

        <Button variant="primary" fullWidth size="lg" className="mt-6">
          Continue
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
  );
}
