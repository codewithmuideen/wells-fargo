"use client";

import { useState } from "react";
import { formatCurrency, formatDate, type Transaction } from "@/lib/data";
import {
  ShoppingBag,
  Coffee,
  Fuel,
  Home,
  Tv,
  Utensils,
  ArrowLeftRight,
  HeartPulse,
  Banknote,
  Briefcase,
  Plane,
  Car,
  Wallet,
  ChevronDown,
} from "lucide-react";

const iconFor = (category: string) => {
  switch (category) {
    case "Shopping":
      return ShoppingBag;
    case "Dining":
      return Utensils;
    case "Coffee":
      return Coffee;
    case "Gas":
      return Fuel;
    case "Subscription":
      return Tv;
    case "Transfer":
      return ArrowLeftRight;
    case "Health":
      return HeartPulse;
    case "Income":
      return Banknote;
    case "Groceries":
      return ShoppingBag;
    case "ATM":
      return Wallet;
    case "Utilities":
      return Home;
    case "Business":
      return Briefcase;
    case "Travel":
      return Plane;
    case "Auto":
    case "Transport":
      return Car;
    case "Housing":
      return Home;
    default:
      return Wallet;
  }
};

const categoryColor = (category: string) => {
  switch (category) {
    case "Income":
      return "bg-emerald-50 text-emerald-700";
    case "Transfer":
      return "bg-blue-50 text-blue-700";
    case "Shopping":
      return "bg-purple-50 text-purple-700";
    case "Dining":
      return "bg-orange-50 text-orange-700";
    case "Gas":
      return "bg-amber-50 text-amber-700";
    case "Subscription":
      return "bg-pink-50 text-pink-700";
    case "Utilities":
      return "bg-sky-50 text-sky-700";
    case "Health":
      return "bg-rose-50 text-rose-700";
    case "Groceries":
      return "bg-lime-50 text-lime-700";
    case "Travel":
      return "bg-cyan-50 text-cyan-700";
    case "ATM":
      return "bg-stone-100 text-stone-700";
    default:
      return "bg-[#F5F5F5] text-[#6D6E71]";
  }
};

export default function TransactionRow({ t }: { t: Transaction }) {
  const [open, setOpen] = useState(false);
  const Icon = iconFor(t.category);
  const isCredit = t.type === "credit";

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between gap-4 px-4 sm:px-6 py-4 hover:bg-[#F5F5F5] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div
            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${categoryColor(t.category)}`}
          >
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2D2926] truncate">{t.merchant}</p>
            <p className="text-xs text-[#6D6E71] truncate">
              {formatDate(t.date)} • {t.description}
            </p>
          </div>
        </div>

        <div className="hidden sm:block">
          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${categoryColor(t.category)}`}
          >
            {t.category}
          </span>
        </div>

        <div className="text-right shrink-0 flex items-center gap-2">
          <div>
            <p
              className={`text-sm sm:text-base font-semibold ${
                isCredit ? "text-emerald-600" : "text-[#2D2926]"
              }`}
            >
              {isCredit ? "+" : "−"}
              {formatCurrency(t.amount)}
            </p>
            <p
              className={`text-[11px] ${
                t.status === "Pending" ? "text-amber-600" : "text-[#6D6E71]"
              }`}
            >
              {t.status}
            </p>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#9AA0A6] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-4 sm:px-6 pb-4">
          <div className="ml-[52px] sm:ml-[56px] rounded-xl bg-[#F5F5F5] p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <Detail label="Date" value={formatDate(t.date)} />
            <Detail label="Merchant" value={t.merchant} />
            <Detail label="Category" value={t.category} />
            <Detail label="Type" value={isCredit ? "Credit" : "Debit"} />
            <Detail
              label="Amount"
              value={`${isCredit ? "+" : "−"}${formatCurrency(t.amount)}`}
            />
            <Detail label="Status" value={t.status} />
            <div className="col-span-2 sm:col-span-3">
              <Detail label="Description" value={t.description} />
            </div>
            <div className="col-span-2 sm:col-span-3">
              <Detail label="Transaction ID" value={t.id.toUpperCase()} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-[#6D6E71]">
        {label}
      </p>
      <p className="mt-0.5 font-medium text-[#2D2926]">{value}</p>
    </div>
  );
}
