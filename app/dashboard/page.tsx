"use client";

import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  Camera,
  Download,
  Receipt,
  Send,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import BalanceCard from "@/components/BalanceCard";
import TransactionRow from "@/components/TransactionRow";
import { useAuth } from "@/lib/auth";
import { getStatements, getTransactions } from "@/lib/data";
import {
  downloadStatementPdf,
  getTransactionsForStatement,
} from "@/lib/generate-statement-pdf";

function useGreeting() {
  const [text, setText] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setText(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  return text;
}

const quickActions = [
  { label: "Transfer", href: "/transfer", icon: ArrowLeftRight },
  { label: "Pay bills", href: "/pay-bills", icon: Receipt },
  { label: "Deposit", href: "/deposit", icon: Camera },
  { label: "Send money", href: "/transfer", icon: Send },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const greeting = useGreeting();
  if (!user) return null;
  const allTransactions = getTransactions(user.transactionKey);
  const transactions = allTransactions.slice(0, 10);
  const statements = getStatements(user.transactionKey, user.balance);

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <p className="text-[13px] font-medium text-[#6D6E71]">{greeting},</p>
        <h1 className="text-[26px] sm:text-[30px] font-bold text-[#2D2926] leading-tight">
          {user.firstName} {user.lastName}
        </h1>
      </div>

      <BalanceCard
        accountType={user.accountType}
        accountNumber={user.accountNumber}
        balance={user.balance}
        availableBalance={user.availableBalance}
        pendingBalance={user.pendingBalance}
        routingNumber={user.routingNumber}
      />

      {/* Quick actions — horizontal scroll */}
      <div className="mt-5 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 min-w-min">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-2 shrink-0 w-[88px]"
            >
              <span className="h-14 w-14 rounded-full bg-white shadow-card border border-[#E6E8EB] text-[#D71E28] flex items-center justify-center group-hover:bg-[#D71E28] group-hover:text-white transition-colors">
                <Icon size={22} />
              </span>
              <span className="text-xs font-semibold text-[#2D2926] text-center">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* FICO Credit Score card */}
      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2D2926]">
              View your FICO&reg; Credit Score
            </p>
            <p className="text-xs text-[#6D6E71]">
              Free for Wells Fargo customers, updated monthly
            </p>
          </div>
        </div>
        <ArrowRight size={18} className="text-[#9AA0A6] shrink-0" />
      </div>

      {/* Recent transactions */}
      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-[#E6E8EB]">
          <div>
            <h3 className="text-lg font-semibold text-[#2D2926]">Recent activity</h3>
            <p className="text-xs text-[#6D6E71] mt-0.5">
              Latest 10 transactions
            </p>
          </div>
          <Link
            href="/transactions"
            className="text-sm font-semibold text-[#D71E28] hover:underline inline-flex items-center gap-1"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-[#E6E8EB]">
          {transactions.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-[#6D6E71]">
              No transactions yet.
            </div>
          )}
          {transactions.map((t) => (
            <TransactionRow key={t.id} t={t} />
          ))}
        </div>
      </div>

      {/* Statements */}
      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-[#E6E8EB]">
          <div>
            <h3 className="text-lg font-semibold text-[#2D2926]">Statements</h3>
            <p className="text-xs text-[#6D6E71] mt-0.5">Last 6 months</p>
          </div>
        </div>
        <div className="divide-y divide-[#E6E8EB]">
          {statements.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-[#F5F5F5] transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-[#2D2926]">{s.period}</p>
                <p className="text-xs text-[#6D6E71]">Closing date • {s.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#2D2926]">
                  {s.balance}
                </span>
                <button
                  aria-label="Download statement"
                  onClick={() =>
                    downloadStatementPdf({
                      period: s.period,
                      date: s.date,
                      balance: s.balance,
                      accountHolder: `${user.firstName} ${user.lastName}`,
                      accountType: user.accountType,
                      accountNumber: user.accountNumber,
                      routingNumber: user.routingNumber,
                      transactions: getTransactionsForStatement(allTransactions, s, i + 1),
                    })
                  }
                  className="h-9 w-9 rounded-full bg-[#F5F5F5] hover:bg-[#D71E28] hover:text-white text-[#D71E28] inline-flex items-center justify-center transition"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
