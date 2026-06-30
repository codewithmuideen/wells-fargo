"use client";

import { ArrowRight, CreditCard, Home, PiggyBank, TrendingUp, ShieldCheck, Gift } from "lucide-react";
import AppShell from "@/components/AppShell";

const products = [
  { title: "Credit Cards", desc: "Cash back, travel rewards, and low intro APR offers.", icon: CreditCard },
  { title: "Home Loans", desc: "Mortgages, refinancing, and home equity lines of credit.", icon: Home },
  { title: "Savings & CDs", desc: "Grow your money with competitive rates.", icon: PiggyBank },
  { title: "Investing", desc: "Build your portfolio with WellsTrade®.", icon: TrendingUp },
  { title: "Account Protection", desc: "Zero Liability and 24/7 fraud monitoring.", icon: ShieldCheck },
  { title: "Rewards", desc: "Redeem points for travel, cash, and more.", icon: Gift },
];

export default function ExplorePage() {
  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Explore</h1>
        <p className="mt-1 text-sm text-[#6D6E71]">
          Discover products and services to reach your financial goals.
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {products.map(({ title, desc, icon: Icon }) => (
            <a
              key={title}
              href="#"
              className="group bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-5 hover:border-[#D71E28] hover:shadow-soft transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center mb-3 group-hover:bg-[#D71E28] group-hover:text-white transition-colors">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-[#2D2926]">{title}</h3>
              <p className="mt-1 text-sm text-[#6D6E71]">{desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#D71E28]">
                Learn more <ArrowRight size={14} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
