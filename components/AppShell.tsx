"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Wallet,
  Camera,
  ArrowLeftRight,
  Compass,
  Menu as MenuIcon,
  Bell,
  Search,
  ArrowLeft,
  Shield,
  X,
  UserCircle2,
  FileText,
  Receipt,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const tabs = [
  { label: "Accounts", href: "/dashboard", icon: Wallet },
  { label: "Deposit", href: "/deposit", icon: Camera },
  { label: "Pay & Transfer", href: "/transfer", icon: ArrowLeftRight },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Menu", href: "#menu", icon: MenuIcon },
];

const menuLinks = [
  { label: "Transactions", href: "/transactions", icon: FileText },
  { label: "Pay bills", href: "/pay-bills", icon: Receipt },
  { label: "Transfer money", href: "/transfer", icon: ArrowLeftRight },
  { label: "Deposit a check", href: "/deposit", icon: Camera },
  { label: "Profile & settings", href: "/profile", icon: UserCircle2 },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="h-10 w-10 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isInner = pathname !== "/dashboard";

  const handleSignOut = () => {
    signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E6E8EB]">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isInner && (
              <button
                onClick={() => router.back()}
                aria-label="Go back"
                className="h-9 w-9 -ml-1 inline-flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#2D2926] shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <Link
              href="/transactions"
              className="flex items-center gap-2 px-3 h-9 rounded-full bg-[#F5F5F5] text-[#6D6E71] text-sm hover:bg-[#ececec] transition min-w-0 max-w-[200px]"
            >
              <Search size={16} className="shrink-0" />
              <span className="truncate">Ask Fargo</span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-[#D71E28] text-white">
              <Shield size={18} />
            </div>
            <button
              aria-label="Notifications"
              className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-[#F5F5F5] text-[#2D2926] relative"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-[#D71E28]" />
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm font-semibold text-[#D71E28] hover:underline px-2"
            >
              Sign off
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 min-w-0 pb-24">{children}</main>

      {/* Menu sheet */}
      {menuOpen && (
        <>
          <button
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
          <div className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl shadow-lift animate-slide-up max-w-lg mx-auto">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#E6E8EB]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 rounded-full bg-[#D71E28] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {(user.firstName[0] ?? "") + (user.lastName[0] ?? "")}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#2D2926] truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[#6D6E71] truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="h-9 w-9 rounded-full hover:bg-[#F5F5F5] inline-flex items-center justify-center text-[#6D6E71]"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-3">
              {menuLinks.map((m) => {
                const Icon = m.icon;
                return (
                  <Link
                    key={m.label}
                    href={m.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-[#2D2926] hover:bg-[#F5F5F5]"
                  >
                    <span className="h-9 w-9 rounded-lg bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center">
                      <Icon size={18} />
                    </span>
                    {m.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-[#D71E28] hover:bg-[#D71E28]/5 mt-1"
              >
                <span className="h-9 w-9 rounded-lg bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center">
                  <LogOut size={18} />
                </span>
                Sign off
              </button>
            </nav>
            <div className="h-[env(safe-area-inset-bottom)]" />
          </div>
        </>
      )}

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E6E8EB]">
        <div className="max-w-lg mx-auto grid grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isMenu = tab.href === "#menu";
            const active = !isMenu && pathname === tab.href;

            const content = (
              <span
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                  active ? "text-[#D71E28]" : "text-[#6D6E71]"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                <span className="text-[10px] font-medium leading-tight text-center">
                  {tab.label}
                </span>
              </span>
            );

            if (isMenu) {
              return (
                <button
                  key={tab.label}
                  onClick={() => setMenuOpen(true)}
                  className="outline-none"
                >
                  {content}
                </button>
              );
            }
            return (
              <Link key={tab.label} href={tab.href} className="outline-none">
                {content}
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white" />
      </nav>
    </div>
  );
}
