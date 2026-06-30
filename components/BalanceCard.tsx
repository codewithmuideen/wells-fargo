"use client";

import { ChevronRight, Eye, EyeOff } from "lucide-react";
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
  pendingBalance,
  routingNumber,
}: BalanceCardProps) {
  const [show, setShow] = useState(true);
  const last4 = accountNumber.slice(-4);

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-[#E6E8EB] overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        {/* Account type + masked number */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#6D6E71]">
              {accountType}
            </p>
            <p className="mt-0.5 text-[13px] text-[#9AA0A6] font-mono tracking-wider">
              ···· {last4}
            </p>
          </div>
          <button
            onClick={() => setShow((s) => !s)}
            aria-label="Toggle balance visibility"
            className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-[#F2F4FA] hover:bg-[#E8EAEF] text-[#6D6E71] transition shrink-0 mt-0.5"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Large balance */}
        <div className="mt-5">
          <p className="text-[36px] sm:text-[42px] font-bold tracking-tight text-[#2D2926] leading-none">
            {show ? formatCurrency(balance) : "$•••••••"}
          </p>
          <p className="mt-1.5 text-[13px] text-[#9AA0A6] font-medium">
            Available balance
          </p>
        </div>
      </div>

      {/* Divider row: current / pending / arrow */}
      <div className="border-t border-[#F0F0F4] px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA0A6]">
              Current
            </p>
            <p className="mt-1 text-[15px] font-semibold text-[#2D2926]">
              {show ? formatCurrency(balance) : "$••••"}
            </p>
          </div>
          <div className="w-px h-8 bg-[#E6E8EB]" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9AA0A6]">
              Pending
            </p>
            <p className="mt-1 text-[15px] font-semibold text-[#2D2926]">
              {show ? formatCurrency(pendingBalance) : "$••••"}
            </p>
          </div>
        </div>

        <button
          aria-label="View account details"
          className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-[#F2F4FA] hover:bg-[#D71E28] hover:text-white text-[#6D6E71] transition shrink-0"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {routingNumber && (
        <div className="px-5 pb-4">
          <p className="text-[11px] text-[#B0B4BA] font-medium">
            Routing <span className="font-mono">{routingNumber}</span>
          </p>
        </div>
      )}
    </div>
  );
}
