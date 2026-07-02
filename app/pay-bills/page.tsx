"use client";

import { useState } from "react";
import { CheckCircle2, DollarSign, Plus, Receipt, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import PinModal from "@/components/PinModal";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, getBillPayments, getPayees } from "@/lib/data";
import type { Payee } from "@/lib/data";

export default function PayBillsPage() {
  return (
    <AppShell>
      <PayBillsContent />
    </AppShell>
  );
}

/* ─── Pay modal ──────────────────────────────────────────────────────────── */
function PayModal({ payee, onClose }: { payee: Payee; onClose: () => void }) {
  const [amount, setAmount]         = useState("");
  const [date, setDate]             = useState(new Date().toISOString().slice(0, 10));
  const [memo, setMemo]             = useState("");
  const [amountError, setAmountError] = useState("");
  const [step, setStep]             = useState<"form" | "review" | "pin" | "done">("form");
  const [showPin, setShowPin]       = useState(false);
  const refNum = `BP${Date.now().toString().slice(-8)}`;

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid payment amount greater than $0.00.");
      return;
    }
    setAmountError("");
    setStep("review");
  };

  if (step === "done") {
    return (
      <div className="px-6 py-8 flex flex-col items-center text-center">
        <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <h3 className="mt-5 text-xl font-bold text-[#2D2926]">Payment Scheduled!</h3>
        <p className="mt-2 text-[14px] text-[#6D6E71] leading-relaxed">
          {formatCurrency(parseFloat(amount))} payment to <span className="font-semibold text-[#2D2926]">{payee.name}</span> has been scheduled.
        </p>
        <div className="mt-4 w-full bg-[#F5F5F5] rounded-2xl p-4 text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-[#6D6E71]">Reference</span><span className="font-mono font-semibold text-[#2D2926]">{refNum}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Payee</span><span className="font-semibold text-[#2D2926]">{payee.name}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Amount</span><span className="font-semibold text-[#2D2926]">{formatCurrency(parseFloat(amount))}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Date</span><span className="font-semibold text-[#2D2926]">{new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
        </div>
        <Button variant="primary" fullWidth size="lg" className="mt-5" onClick={onClose}>Done</Button>
      </div>
    );
  }

  if (step === "review") {
    return (
      <>
        <div className="px-6 py-5">
          <h3 className="text-[15px] font-bold text-[#2D2926] mb-4">Review payment</h3>
          <div className="bg-[#FAFAFA] rounded-2xl border border-[#E6E8EB] divide-y divide-[#E6E8EB] text-sm mb-4">
            {[
              ["Payee",     payee.name],
              ["Account",   `•••• ${payee.accountLast4}`],
              ["Amount",    formatCurrency(parseFloat(amount) || 0)],
              ["Date",      new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })],
              ["Memo",      memo || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <span className="text-[#6D6E71]">{k}</span>
                <span className="font-semibold text-[#2D2926]">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#9AA0A6] leading-relaxed mb-4">
            By confirming, you authorize Wells Fargo to make this bill payment on your behalf. Payments submitted before 8 PM PT on a business day are typically credited the same day.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3 rounded-xl border border-[#E6E8EB] text-sm font-semibold text-[#2D2926] hover:bg-[#F5F5F5] transition">
              Edit
            </button>
            <button onClick={() => setShowPin(true)}
              className="flex-1 py-3 rounded-xl bg-[#D71E28] text-sm font-bold text-white hover:bg-[#A01B22] transition shadow-soft">
              Confirm Payment
            </button>
          </div>
        </div>
        <PinModal
          isOpen={showPin}
          title="Confirm Bill Payment"
          subtitle={`Authorize ${formatCurrency(parseFloat(amount) || 0)} payment to ${payee.name}`}
          onSuccess={() => { setShowPin(false); setStep("done"); }}
          onCancel={() => setShowPin(false)}
        />
      </>
    );
  }

  return (
    <form onSubmit={handleReview} className="px-6 py-5 space-y-4">
      <div className="flex items-center gap-3 pb-2 border-b border-[#E6E8EB]">
        <span className="h-10 w-10 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0">
          <Receipt size={18} />
        </span>
        <div>
          <p className="text-[14px] font-bold text-[#2D2926]">{payee.name}</p>
          <p className="text-xs text-[#6D6E71]">{payee.category} · Account •••• {payee.accountLast4}</p>
        </div>
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
          Payment Amount <span className="text-[#D71E28]">*</span>
        </label>
        <div className="relative">
          <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA0A6]" />
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => { setAmount(e.target.value.replace(/[^0-9.]/g, "")); setAmountError(""); }}
            className={`w-full pl-9 pr-3.5 py-3 rounded-xl border text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:outline-none focus:ring-2 transition ${
              amountError ? "border-red-400 focus:ring-red-100" : "border-[#E6E8EB] bg-[#FAFAFA] focus:border-[#D71E28] focus:ring-[#D71E28]/15"
            }`}
          />
        </div>
        {amountError && <p className="mt-1 text-xs text-red-600 font-medium">{amountError}</p>}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">Payment Date</label>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3.5 py-3 rounded-xl border border-[#E6E8EB] bg-[#FAFAFA] text-sm text-[#2D2926] focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/15 transition"
        />
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">Memo (optional)</label>
        <input
          type="text"
          placeholder="Note for your records"
          value={memo}
          maxLength={80}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full px-3.5 py-3 rounded-xl border border-[#E6E8EB] bg-[#FAFAFA] text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/15 transition"
        />
      </div>

      <Button type="submit" variant="primary" fullWidth size="lg">
        <Receipt size={15} /> Review payment
      </Button>
    </form>
  );
}

/* ─── Main content ───────────────────────────────────────────────────────── */
function PayBillsContent() {
  const { user } = useAuth();
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);

  if (!user) return null;

  const payees   = getPayees(user.transactionKey);
  const payments = getBillPayments(user.transactionKey);

  return (
    <>
      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Pay bills</h1>
        <p className="mt-1 text-sm text-[#6D6E71]">
          Manage payees and pay your bills in one place.
        </p>

        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E8EB]">
            <h3 className="text-sm font-semibold text-[#2D2926]">Your payees</h3>
            <Button variant="secondary" size="sm">
              <Plus size={14} /> Add payee
            </Button>
          </div>
          <div className="divide-y divide-[#E6E8EB]">
            {payees.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center">
                    <Receipt size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2926]">{p.name}</p>
                    <p className="text-xs text-[#6D6E71]">{p.category} • •••• {p.accountLast4}</p>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={() => setSelectedPayee(p)}>
                  Pay
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6E8EB]">
            <h3 className="text-sm font-semibold text-[#2D2926]">Recent payments</h3>
          </div>
          <div className="divide-y divide-[#E6E8EB]">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-[#2D2926]">{p.payee}</p>
                  <p className="text-xs text-[#6D6E71]">{formatDate(p.date)} • {p.status}</p>
                </div>
                <span className="text-sm font-semibold text-[#2D2926]">{formatCurrency(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pay modal */}
      {selectedPayee && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setSelectedPayee(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E8EB]">
              <h2 className="text-[17px] font-bold text-[#2D2926]">Pay a bill</h2>
              <button
                onClick={() => setSelectedPayee(null)}
                className="h-8 w-8 rounded-full hover:bg-[#F5F5F5] flex items-center justify-center text-[#6D6E71]"
              >
                <X size={18} />
              </button>
            </div>
            <PayModal payee={selectedPayee} onClose={() => setSelectedPayee(null)} />
          </div>
        </div>
      )}
    </>
  );
}
