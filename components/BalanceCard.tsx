"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/data";

interface BalanceCardProps {
  accountType: string;
  accountNumber: string;
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  routingNumber?: string;
}

export default function BalanceCard({
  accountType,
  accountNumber,
  balance,
  availableBalance,
  pendingBalance,
  routingNumber,
}: BalanceCardProps) {
  const [show, setShow] = useState(true);
  const last4 = accountNumber.slice(-4);

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-[#E6E8EB] overflow-hidden">
      {/* Red accent bar */}
      <div className="h-1.5 bg-[#D71E28]" />
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#D71E28]">
              {accountType}
            </p>
            <p className="mt-1 text-sm text-[#6D6E71] font-mono">
              •••• {last4}
            </p>
          </div>
          <button
            onClick={() => setShow((s) => !s)}
            aria-label="Toggle balance visibility"
            className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-[#F5F5F5] hover:bg-[#ececec] text-[#6D6E71] transition shrink-0"
          >
            {show ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        <div className="mt-6">
          <p className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2D2926]">
            {show ? formatCurrency(balance) : "$•••••••"}
          </p>
          <p className="mt-1 text-sm text-[#6D6E71]">Available balance</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-[#E6E8EB]">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#6D6E71]">
              Current
            </p>
            <p className="mt-1 text-base sm:text-lg font-semibold text-[#2D2926]">
              {show ? formatCurrency(balance) : "$••••"}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#6D6E71]">
              Pending
            </p>
            <p className="mt-1 text-base sm:text-lg font-semibold text-[#2D2926]">
              {show ? formatCurrency(pendingBalance) : "$••••"}
            </p>
          </div>
        </div>

        {routingNumber && (
          <p className="mt-5 text-[11px] text-[#9AA0A6]">
            Routing • {routingNumber}
          </p>
        )}
      </div>
    </div>
  );
}
