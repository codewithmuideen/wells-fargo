"use client";

import { Plus, Receipt } from "lucide-react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";
import { formatCurrency, formatDate, getBillPayments, getPayees } from "@/lib/data";

export default function PayBillsPage() {
  return (
    <AppShell>
      <PayBillsContent />
    </AppShell>
  );
}

function PayBillsContent() {
  const { user } = useAuth();
  if (!user) return null;

  const payees = getPayees(user.transactionKey);
  const payments = getBillPayments(user.transactionKey);

  return (
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
                  <p className="text-xs text-[#6D6E71]">
                    {p.category} • •••• {p.accountLast4}
                  </p>
                </div>
              </div>
              <Button variant="primary" size="sm">
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
              <span className="text-sm font-semibold text-[#2D2926]">
                {formatCurrency(p.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
