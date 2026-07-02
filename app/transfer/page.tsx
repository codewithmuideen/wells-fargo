"use client";

import { useState } from "react";
import {
  ArrowLeftRight, Building2, CheckCircle2, ChevronDown,
  ChevronRight, Clock, Send, Smartphone, X,
} from "lucide-react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import PinModal from "@/components/PinModal";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, getScheduledPayments } from "@/lib/data";

type Tab = "zelle" | "bank" | "wire";

const ACCOUNT_TYPES = ["Checking", "Savings", "Money Market"];
const WIRE_PURPOSES = [
  "Business Payment",
  "Family Support",
  "Investment",
  "Property Purchase",
  "Tax Payment",
  "Personal Transfer",
  "Other",
];

function TabButton({
  active, onClick, icon: Icon, label, sub,
}: {
  active: boolean; onClick: () => void; icon: React.ElementType; label: string; sub: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all text-center ${
        active
          ? "bg-[#D71E28] border-[#D71E28] text-white shadow-soft"
          : "bg-white border-[#E6E8EB] text-[#6D6E71] hover:border-[#D71E28]/40"
      }`}
    >
      <Icon size={18} className={active ? "text-white" : "text-[#D71E28]"} />
      <span className={`text-[12px] font-bold leading-tight ${active ? "text-white" : "text-[#2D2926]"}`}>{label}</span>
      <span className={`text-[10px] leading-tight ${active ? "text-white/75" : "text-[#9AA0A6]"}`}>{sub}</span>
    </button>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-semibold text-[#2D2926] mb-1.5">
      {children}{required && <span className="text-[#D71E28] ml-0.5">*</span>}
    </label>
  );
}

function Input({
  placeholder, value, onChange, type = "text", inputMode,
  maxLength, prefix, readOnly, error,
}: {
  placeholder?: string; value: string; onChange?: (v: string) => void;
  type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number; prefix?: string; readOnly?: boolean; error?: string;
}) {
  return (
    <div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6D6E71] text-sm font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          readOnly={readOnly}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full ${prefix ? "pl-7" : "pl-3.5"} pr-3.5 py-3 rounded-xl border bg-[#FAFAFA] text-sm text-[#2D2926] placeholder-[#B0B4BA] focus:outline-none focus:ring-2 transition ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-[#E6E8EB] focus:border-[#D71E28] focus:ring-[#D71E28]/15"
          } ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

function Select({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-3.5 pr-9 py-3 rounded-xl border border-[#E6E8EB] bg-[#FAFAFA] text-sm text-[#2D2926] focus:border-[#D71E28] focus:outline-none focus:ring-2 focus:ring-[#D71E28]/15 appearance-none transition"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA0A6] pointer-events-none" />
    </div>
  );
}

/* ─── Zelle Form ─────────────────────────────────────────────────────────── */
function ZelleForm({ fromAccount }: { fromAccount: string }) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount]       = useState("");
  const [memo, setMemo]           = useState("");
  const [step, setStep]           = useState<"form" | "review" | "done">("form");
  const [showPin, setShowPin]     = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const refNum = `ZEL${Date.now().toString().slice(-8)}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!recipient.trim()) e.recipient = "Please enter a recipient name, email, or US mobile number.";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Please enter a valid amount greater than $0.00.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((p) => { const c = { ...p }; delete c[key]; return c; });
  };

  if (step === "done") {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop shadow-soft">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#2D2926]">Payment Sent!</h3>
          <p className="mt-1 text-sm text-[#6D6E71]">
            {formatCurrency(parseFloat(amount) || 0)} sent via Zelle® to{" "}
            <span className="font-semibold text-[#2D2926]">{recipient}</span>
          </p>
        </div>
        <div className="bg-[#F5F5F5] rounded-2xl p-4 w-full text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-[#6D6E71]">Reference</span><span className="font-mono font-semibold text-[#2D2926]">{refNum}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Date</span><span className="font-semibold text-[#2D2926]">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">From</span><span className="font-semibold text-[#2D2926]">{fromAccount}</span></div>
          {memo && <div className="flex justify-between"><span className="text-[#6D6E71]">Memo</span><span className="font-semibold text-[#2D2926]">{memo}</span></div>}
        </div>
        <button onClick={() => { setStep("form"); setRecipient(""); setAmount(""); setMemo(""); setErrors({}); }}
          className="text-sm font-semibold text-[#D71E28] hover:underline">
          Send another payment
        </button>
      </div>
    );
  }

  if (step === "review") {
    return (
      <>
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#2D2926]">Review your payment</h3>
          <div className="bg-[#FAFAFA] rounded-2xl border border-[#E6E8EB] divide-y divide-[#E6E8EB] text-sm">
            {[
              ["Send to",  recipient],
              ["Amount",   formatCurrency(parseFloat(amount) || 0)],
              ["From",     fromAccount],
              ["Method",   "Zelle®"],
              ["Delivers", "Within minutes"],
              ["Memo",     memo || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-3">
                <span className="text-[#6D6E71]">{k}</span>
                <span className="font-semibold text-[#2D2926] text-right max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#9AA0A6] leading-relaxed">
            By tapping Send, you authorize Wells Fargo to initiate a Zelle® payment. Money sent with Zelle® typically arrives within minutes and is usually not reversible.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setStep("form")}
              className="flex-1 py-3 rounded-xl border border-[#E6E8EB] text-sm font-semibold text-[#2D2926] hover:bg-[#F5F5F5] transition">
              Edit
            </button>
            <button onClick={() => setShowPin(true)}
              className="flex-1 py-3 rounded-xl bg-[#D71E28] text-sm font-bold text-white hover:bg-[#A01B22] transition shadow-soft">
              Send ${amount || "0.00"}
            </button>
          </div>
        </div>
        <PinModal
          isOpen={showPin}
          title="Confirm Zelle® Payment"
          subtitle={`Authorize sending ${formatCurrency(parseFloat(amount) || 0)} to ${recipient}`}
          onSuccess={() => { setShowPin(false); setStep("done"); }}
          onCancel={() => setShowPin(false)}
        />
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (validate()) setStep("review"); }}
      className="space-y-4"
    >
      <div>
        <FieldLabel required>To (name, email, or US mobile)</FieldLabel>
        <Input
          placeholder="e.g. Jane Smith or jane@email.com"
          value={recipient}
          onChange={(v) => { setRecipient(v); clearError("recipient"); }}
          error={errors.recipient}
        />
      </div>
      <div>
        <FieldLabel required>Amount</FieldLabel>
        <Input
          placeholder="0.00"
          value={amount}
          onChange={(v) => { setAmount(v.replace(/[^0-9.]/g, "")); clearError("amount"); }}
          inputMode="decimal"
          prefix="$"
          error={errors.amount}
        />
      </div>
      <div>
        <FieldLabel>Memo (optional)</FieldLabel>
        <Input placeholder="What's it for?" value={memo} onChange={setMemo} maxLength={80} />
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <Smartphone size={15} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-[12px] text-blue-700 leading-relaxed">
          <strong>Zelle®</strong> transfers typically arrive within minutes. Both sender and recipient must have a US bank account.
        </p>
      </div>
      <Button type="submit" variant="primary" fullWidth size="lg">
        <Send size={15} /> Review payment
      </Button>
    </form>
  );
}

/* ─── Bank Transfer Form ─────────────────────────────────────────────────── */
function BankTransferForm({ fromAccount }: { fromAccount: string }) {
  const [firstName,   setFirstName]   = useState("");
  const [lastName,    setLastName]    = useState("");
  const [bankName,    setBankName]    = useState("");
  const [accountNum,  setAccountNum]  = useState("");
  const [routingNum,  setRoutingNum]  = useState("");
  const [accountType, setAccountType] = useState("Checking");
  const [amount,      setAmount]      = useState("");
  const [memo,        setMemo]        = useState("");
  const [step,        setStep]        = useState<"form" | "review" | "done">("form");
  const [showPin,     setShowPin]     = useState(false);
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const refNum = `ACH${Date.now().toString().slice(-9)}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim())  e.lastName  = "Last name is required.";
    if (!bankName.trim())  e.bankName  = "Recipient's bank name is required.";
    if (!accountNum)       e.accountNum = "Account number is required.";
    if (!routingNum || routingNum.length !== 9) e.routingNum = "Please enter a valid 9-digit ABA routing number.";
    if (!amount || parseFloat(amount) <= 0)     e.amount     = "Please enter a valid amount greater than $0.00.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((p) => { const c = { ...p }; delete c[key]; return c; });
  };

  if (step === "done") {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop shadow-soft">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#2D2926]">Transfer Initiated!</h3>
          <p className="mt-1 text-sm text-[#6D6E71]">
            {formatCurrency(parseFloat(amount) || 0)} will be delivered to{" "}
            <span className="font-semibold text-[#2D2926]">{firstName} {lastName}</span> in 1–3 business days.
          </p>
        </div>
        <div className="bg-[#F5F5F5] rounded-2xl p-4 w-full text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-[#6D6E71]">Reference</span><span className="font-mono font-semibold text-[#2D2926]">{refNum}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Delivery</span><span className="font-semibold text-[#2D2926]">1–3 business days</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">From</span><span className="font-semibold text-[#2D2926]">{fromAccount}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Bank</span><span className="font-semibold text-[#2D2926]">{bankName}</span></div>
        </div>
        <button onClick={() => { setStep("form"); setErrors({}); }} className="text-sm font-semibold text-[#D71E28] hover:underline">
          Make another transfer
        </button>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#2D2926]">Review ACH Transfer</h3>
        <div className="bg-[#FAFAFA] rounded-2xl border border-[#E6E8EB] divide-y divide-[#E6E8EB] text-sm">
          {[
            ["Recipient",  `${firstName} ${lastName}`],
            ["Bank",        bankName],
            ["Account",     `••••${accountNum.slice(-4)} (${accountType})`],
            ["Routing #",   routingNum],
            ["Amount",      formatCurrency(parseFloat(amount) || 0)],
            ["From",        fromAccount],
            ["Delivery",    "1–3 Business Days"],
            ["Memo",        memo || "—"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3">
              <span className="text-[#6D6E71]">{k}</span>
              <span className="font-semibold text-[#2D2926] text-right max-w-[55%]">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-[#9AA0A6] leading-relaxed">
          By submitting, you authorize Wells Fargo to initiate an ACH debit from your account. Processing typically takes 1–3 business days.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setStep("form")} className="flex-1 py-3 rounded-xl border border-[#E6E8EB] text-sm font-semibold text-[#2D2926] hover:bg-[#F5F5F5] transition">
            Edit
          </button>
          <button onClick={() => setShowPin(true)} className="flex-1 py-3 rounded-xl bg-[#D71E28] text-sm font-bold text-white hover:bg-[#A01B22] transition shadow-soft">
            Confirm Transfer
          </button>
        </div>
        <PinModal
          isOpen={showPin}
          title="Confirm Bank Transfer"
          subtitle={`Authorize ${formatCurrency(parseFloat(amount) || 0)} ACH transfer to ${firstName} ${lastName}`}
          onSuccess={() => { setShowPin(false); setStep("done"); }}
          onCancel={() => setShowPin(false)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (validate()) setStep("review"); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel required>First Name</FieldLabel>
          <Input placeholder="First name" value={firstName}
            onChange={(v) => { setFirstName(v); clearError("firstName"); }} error={errors.firstName} />
        </div>
        <div>
          <FieldLabel required>Last Name</FieldLabel>
          <Input placeholder="Last name" value={lastName}
            onChange={(v) => { setLastName(v); clearError("lastName"); }} error={errors.lastName} />
        </div>
      </div>
      <div>
        <FieldLabel required>Recipient&apos;s Bank Name</FieldLabel>
        <Input placeholder="e.g. Chase Bank, Bank of America" value={bankName}
          onChange={(v) => { setBankName(v); clearError("bankName"); }} error={errors.bankName} />
      </div>
      <div>
        <FieldLabel required>Account Number</FieldLabel>
        <Input placeholder="Account number" value={accountNum}
          onChange={(v) => { setAccountNum(v.replace(/\D/g, "")); clearError("accountNum"); }}
          inputMode="numeric" maxLength={17} error={errors.accountNum} />
      </div>
      <div>
        <FieldLabel required>Routing Number (9 digits)</FieldLabel>
        <Input placeholder="9-digit ABA routing number" value={routingNum}
          onChange={(v) => { setRoutingNum(v.replace(/\D/g, "")); clearError("routingNum"); }}
          inputMode="numeric" maxLength={9} error={errors.routingNum} />
      </div>
      <div>
        <FieldLabel>Account Type</FieldLabel>
        <Select value={accountType} onChange={setAccountType} options={ACCOUNT_TYPES} />
      </div>
      <div>
        <FieldLabel required>Amount</FieldLabel>
        <Input placeholder="0.00" value={amount}
          onChange={(v) => { setAmount(v.replace(/[^0-9.]/g, "")); clearError("amount"); }}
          inputMode="decimal" prefix="$" error={errors.amount} />
      </div>
      <div>
        <FieldLabel>Memo / Reference (optional)</FieldLabel>
        <Input placeholder="Purpose or reference" value={memo} onChange={setMemo} maxLength={80} />
      </div>
      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <Clock size={15} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          ACH transfers are processed within <strong>1–3 business days</strong>. Funds may not be immediately available to the recipient.
        </p>
      </div>
      <Button type="submit" variant="primary" fullWidth size="lg">
        <ArrowLeftRight size={15} /> Review Transfer
      </Button>
    </form>
  );
}

/* ─── Wire Transfer Form ─────────────────────────────────────────────────── */
function WireForm({ fromAccount }: { fromAccount: string }) {
  const [wireType,     setWireType]     = useState<"domestic" | "international">("domestic");
  const [recipName,    setRecipName]    = useState("");
  const [bankName,     setBankName]     = useState("");
  const [bankAddress,  setBankAddress]  = useState("");
  const [accountNum,   setAccountNum]   = useState("");
  const [routingSwift, setRoutingSwift] = useState("");
  const [amount,       setAmount]       = useState("");
  const [purpose,      setPurpose]      = useState(WIRE_PURPOSES[0]);
  const [step,         setStep]         = useState<"form" | "review" | "done">("form");
  const [showPin,      setShowPin]      = useState(false);
  const [errors,       setErrors]       = useState<Record<string, string>>({});
  const refNum = `WRE${Date.now().toString().slice(-9)}`;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!recipName.trim())    e.recipName    = "Recipient full name is required.";
    if (!bankName.trim())     e.bankName     = "Recipient's bank name is required.";
    if (!accountNum)          e.accountNum   = "Account number is required.";
    if (!routingSwift.trim()) e.routingSwift = wireType === "domestic"
      ? "Please enter a valid 9-digit ABA routing number."
      : "SWIFT / BIC code is required.";
    if (wireType === "domestic" && routingSwift.length > 0 && routingSwift.length !== 9)
      e.routingSwift = "ABA routing number must be exactly 9 digits.";
    if (!amount || parseFloat(amount) <= 0) e.amount = "Please enter a valid amount greater than $0.00.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearError = (key: string) => {
    if (errors[key]) setErrors((p) => { const c = { ...p }; delete c[key]; return c; });
  };

  if (step === "done") {
    return (
      <div className="text-center py-8 flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center animate-check-pop shadow-soft">
          <CheckCircle2 size={40} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#2D2926]">Wire Submitted!</h3>
          <p className="mt-1 text-sm text-[#6D6E71]">
            Your wire transfer of {formatCurrency(parseFloat(amount) || 0)} has been submitted for processing.
          </p>
        </div>
        <div className="bg-[#F5F5F5] rounded-2xl p-4 w-full text-left text-sm space-y-2">
          <div className="flex justify-between"><span className="text-[#6D6E71]">Reference</span><span className="font-mono font-semibold text-[#2D2926]">{refNum}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Type</span><span className="font-semibold text-[#2D2926]">{wireType === "domestic" ? "Domestic Wire" : "International Wire"}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Recipient</span><span className="font-semibold text-[#2D2926]">{recipName}</span></div>
          <div className="flex justify-between"><span className="text-[#6D6E71]">Est. Delivery</span><span className="font-semibold text-[#2D2926]">{wireType === "domestic" ? "Same business day" : "1–5 business days"}</span></div>
        </div>
        <button onClick={() => { setStep("form"); setErrors({}); }} className="text-sm font-semibold text-[#D71E28] hover:underline">
          Send another wire
        </button>
      </div>
    );
  }

  if (step === "review") {
    const rows = [
      ["Wire Type",       wireType === "domestic" ? "Domestic Wire (USD)" : "International Wire"],
      ["Recipient",       recipName],
      ["Recipient Bank",  bankName],
      ["Bank Address",    bankAddress || "—"],
      ["Account Number",  `••••${accountNum.slice(-4)}`],
      [wireType === "domestic" ? "Routing (ABA)" : "SWIFT / BIC", routingSwift],
      ["Amount",          formatCurrency(parseFloat(amount) || 0)],
      ["From",            fromAccount],
      ["Purpose",         purpose],
      ["Delivery",        wireType === "domestic" ? "Same business day" : "1–5 business days"],
    ];
    return (
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#2D2926]">Review Wire Transfer</h3>
        <div className="bg-[#FAFAFA] rounded-2xl border border-[#E6E8EB] divide-y divide-[#E6E8EB] text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between px-4 py-3">
              <span className="text-[#6D6E71] shrink-0">{k}</span>
              <span className="font-semibold text-[#2D2926] text-right max-w-[55%]">{v}</span>
            </div>
          ))}
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <p className="text-[12px] text-[#A01B22] font-semibold">⚠ Wire transfers are generally irreversible.</p>
          <p className="text-[12px] text-[#A01B22] mt-0.5 leading-relaxed">
            Wells Fargo will never ask you to wire money to avoid fraud or to claim a prize. Verify the recipient before confirming.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep("form")} className="flex-1 py-3 rounded-xl border border-[#E6E8EB] text-sm font-semibold text-[#2D2926] hover:bg-[#F5F5F5] transition">
            Edit
          </button>
          <button onClick={() => setShowPin(true)} className="flex-1 py-3 rounded-xl bg-[#D71E28] text-sm font-bold text-white hover:bg-[#A01B22] transition shadow-soft">
            Confirm Wire
          </button>
        </div>
        <PinModal
          isOpen={showPin}
          title="Confirm Wire Transfer"
          subtitle={`Authorize ${formatCurrency(parseFloat(amount) || 0)} wire to ${recipName}`}
          onSuccess={() => { setShowPin(false); setStep("done"); }}
          onCancel={() => setShowPin(false)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (validate()) setStep("review"); }} className="space-y-4">
      <div>
        <FieldLabel>Wire Type</FieldLabel>
        <div className="flex gap-2">
          {(["domestic", "international"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setWireType(t); setRoutingSwift(""); clearError("routingSwift"); }}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${
                wireType === t
                  ? "bg-[#D71E28] border-[#D71E28] text-white"
                  : "border-[#E6E8EB] text-[#6D6E71] hover:border-[#D71E28]/40"
              }`}
            >
              {t === "domestic" ? "🇺🇸 Domestic" : "🌐 International"}
            </button>
          ))}
        </div>
      </div>
      <div>
        <FieldLabel required>Recipient Full Name</FieldLabel>
        <Input placeholder="Legal name as it appears on account" value={recipName}
          onChange={(v) => { setRecipName(v); clearError("recipName"); }} error={errors.recipName} />
      </div>
      <div>
        <FieldLabel required>Recipient&apos;s Bank Name</FieldLabel>
        <Input placeholder="Full bank name" value={bankName}
          onChange={(v) => { setBankName(v); clearError("bankName"); }} error={errors.bankName} />
      </div>
      <div>
        <FieldLabel>Bank Address (optional)</FieldLabel>
        <Input placeholder="Street, City, State/Country" value={bankAddress} onChange={setBankAddress} />
      </div>
      <div>
        <FieldLabel required>Recipient Account Number</FieldLabel>
        <Input placeholder="Account number" value={accountNum}
          onChange={(v) => { setAccountNum(v.replace(/\D/g, "")); clearError("accountNum"); }}
          inputMode="numeric" maxLength={18} error={errors.accountNum} />
      </div>
      <div>
        <FieldLabel required>
          {wireType === "domestic" ? "ABA Routing Number (9 digits)" : "SWIFT / BIC Code"}
        </FieldLabel>
        <Input
          placeholder={wireType === "domestic" ? "9-digit routing number" : "SWIFT / BIC code"}
          value={routingSwift}
          onChange={(v) => {
            setRoutingSwift(wireType === "domestic" ? v.replace(/\D/g, "") : v.toUpperCase());
            clearError("routingSwift");
          }}
          maxLength={wireType === "domestic" ? 9 : 11}
          error={errors.routingSwift}
        />
      </div>
      <div>
        <FieldLabel required>Amount (USD)</FieldLabel>
        <Input placeholder="0.00" value={amount}
          onChange={(v) => { setAmount(v.replace(/[^0-9.]/g, "")); clearError("amount"); }}
          inputMode="decimal" prefix="$" error={errors.amount} />
      </div>
      <div>
        <FieldLabel>Purpose of Wire</FieldLabel>
        <Select value={purpose} onChange={setPurpose} options={WIRE_PURPOSES} />
      </div>
      <Button type="submit" variant="primary" fullWidth size="lg">
        <Building2 size={15} /> Review Wire Transfer
      </Button>
    </form>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function TransferPage() {
  return (
    <AppShell>
      <TransferContent />
    </AppShell>
  );
}

function TransferContent() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("zelle");

  if (!user) return null;

  const fromAccount = `${user.accountType} ••••${user.accountNumber.slice(-4)}`;
  const scheduled   = getScheduledPayments(user.transactionKey);

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#2D2926]">Pay &amp; Transfer</h1>
      <p className="mt-1 text-sm text-[#6D6E71]">Move money securely to anyone, anywhere.</p>

      {/* From account badge */}
      <div className="mt-4 flex items-center gap-3 bg-white rounded-2xl border border-[#E6E8EB] shadow-card px-4 py-3">
        <div className="h-9 w-9 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0">
          <Building2 size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[#9AA0A6] font-semibold uppercase tracking-wider">From</p>
          <p className="text-[13px] font-bold text-[#2D2926] truncate">{fromAccount}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-[#9AA0A6]">Available</p>
          <p className="text-[14px] font-bold text-[#2D2926]">{formatCurrency(user.availableBalance)}</p>
        </div>
      </div>

      {/* Transfer type tabs */}
      <div className="mt-4 flex gap-2">
        <TabButton active={tab === "zelle"} onClick={() => setTab("zelle")} icon={Smartphone} label="Zelle®" sub="Instant · Free" />
        <TabButton active={tab === "bank"}  onClick={() => setTab("bank")}  icon={ArrowLeftRight} label="Bank Transfer" sub="ACH · 1–3 days" />
        <TabButton active={tab === "wire"}  onClick={() => setTab("wire")}  icon={Building2} label="Wire Transfer" sub="Same day · Fee" />
      </div>

      {/* Tab content */}
      <div className="mt-4 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-5 sm:p-6">
        {tab === "zelle" && <ZelleForm fromAccount={fromAccount} />}
        {tab === "bank"  && <BankTransferForm fromAccount={fromAccount} />}
        {tab === "wire"  && <WireForm fromAccount={fromAccount} />}
      </div>

      {/* Scheduled payments */}
      {scheduled.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E6E8EB]">
            <div>
              <h3 className="text-[14px] font-bold text-[#2D2926]">Scheduled Payments</h3>
              <p className="text-[11px] text-[#9AA0A6] mt-0.5">Upcoming automatic payments</p>
            </div>
            <Clock size={16} className="text-[#9AA0A6]" />
          </div>
          <div className="divide-y divide-[#E6E8EB]">
            {scheduled.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA] transition">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[#2D2926] truncate">{s.payee}</p>
                  <p className="text-[11px] text-[#9AA0A6] mt-0.5">
                    {formatDate(s.date)} · <span className="text-amber-600 font-medium">{s.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[14px] font-bold text-[#2D2926]">{formatCurrency(s.amount)}</span>
                  <ChevronRight size={14} className="text-[#9AA0A6]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fraud warning */}
      <div className="mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
        <X size={15} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          <strong>Fraud alert:</strong> Wells Fargo will <em>never</em> ask you to transfer money to protect your account, verify your identity, or claim a reward. If someone does, it&apos;s a scam — call 1-800-869-3557 immediately.
        </p>
      </div>
    </div>
  );
}
