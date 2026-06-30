"use client";

import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { formatCurrency, getScheduledPayments, formatDate } from "@/lib/data";

export default function TransferPage() {
  return (
    <AppShell>
      <TransferContent />
    </AppShell>
  );
}

function TransferContent() {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  if (!user) return null;

  const scheduled = getScheduledPayments(user.transactionKey);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Pay &amp; transfer</h1>
      <p className="mt-1 text-sm text-[#6D6E71]">
        Move money between accounts or send with Zelle&reg;.
      </p>

      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
              From
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
          <div>
            <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
              To
            </label>
            <input
              placeholder="Recipient name, email, or mobile number"
              className="w-full rounded-lg border border-[#E6E8EB] bg-white px-4 py-3 text-sm focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/20"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6D6E71]">$</span>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                inputMode="decimal"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E6E8EB] bg-white pl-8 pr-4 py-3 text-sm focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/20"
              />
            </div>
          </div>

          {done && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
              Transfer of ${amount || "0.00"} scheduled successfully.
            </div>
          )}

          <Button type="submit" variant="primary" fullWidth size="lg">
            <ArrowLeftRight size={16} /> Review transfer
          </Button>
        </form>
      </div>

      {scheduled.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6E8EB]">
            <h3 className="text-sm font-semibold text-[#2D2926]">Scheduled payments</h3>
          </div>
          <div className="divide-y divide-[#E6E8EB]">
            {scheduled.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#2D2926]">{s.payee}</p>
                  <p className="text-xs text-[#6D6E71]">{formatDate(s.date)} • {s.status}</p>
                </div>
                <span className="text-sm font-semibold text-[#2D2926]">
                  {formatCurrency(s.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
