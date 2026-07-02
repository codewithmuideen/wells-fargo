"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, Fingerprint, Lock, LogOut, Mail, MapPin, Phone, Shield, Smartphone } from "lucide-react";
import AppShell from "@/components/AppShell";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth";

export default function ProfilePage() {
  return (
    <AppShell>
      <ProfileContent />
    </AppShell>
  );
}

function Toggle({ label, description, defaultOn = false, icon: Icon }: {
  label: string;
  description: string;
  defaultOn?: boolean;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex gap-3 min-w-0">
        <div className="h-9 w-9 rounded-lg bg-[#D71E28]/10 text-[#D71E28] flex items-center justify-center shrink-0">
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2D2926]">{label}</p>
          <p className="text-xs text-[#6D6E71]">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setOn((s) => !s)}
        className={`relative inline-flex h-[26px] w-[46px] items-center rounded-full transition-colors duration-200 shrink-0 ${
          on ? "bg-[#D71E28]" : "bg-[#E6E8EB]"
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-200 ${
            on ? "translate-x-[22px]" : "translate-x-[2px]"
          }`}
        />
      </button>
    </div>
  );
}

function ProfileContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [imgFailed, setImgFailed] = useState(false);
  if (!user) return null;

  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926]">Profile</h1>
        <p className="mt-1 text-sm text-[#6D6E71]">
          Manage your account information and security settings.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-6 sm:p-8">
        <div className="flex items-center gap-5">
          {user.avatar && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.firstName}
              onError={() => setImgFailed(true)}
              className="h-20 w-20 rounded-full object-cover shrink-0 border-2 border-[#E6E8EB]"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#D71E28] to-[#7A1218] text-white flex items-center justify-center text-2xl font-bold shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-[#2D2926]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-[#6D6E71]">Member since {user.memberSince}</p>
            <p className="text-xs text-[#6D6E71] mt-1">Username: {user.userId}</p>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow
            icon={MapPin}
            label="Account number"
            value={`•••• ${user.accountNumber.slice(-4)}`}
          />
          <InfoRow icon={Shield} label="Routing" value={user.routingNumber} />
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-card border border-[#E6E8EB] p-6 sm:p-8">
        <h3 className="font-semibold text-[#2D2926]">Security &amp; notifications</h3>
        <div className="mt-4 divide-y divide-[#E6E8EB]">
          <Toggle
            icon={Fingerprint}
            label="Biometric sign-on"
            description="Use Face ID or Touch ID on supported devices."
            defaultOn
          />
          <Toggle
            icon={Lock}
            label="Two-factor authentication"
            description="Require a one-time code when signing on from a new device."
            defaultOn
          />
          <Toggle
            icon={Bell}
            label="Transaction alerts"
            description="Get notified when money moves in or out of your account."
            defaultOn
          />
          <Toggle
            icon={Smartphone}
            label="Paperless statements"
            description="Go digital and reduce paper clutter."
          />
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
        >
          <LogOut size={16} /> Sign off
        </Button>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#F5F5F5] p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#6D6E71]">
        <Icon size={12} />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-[#2D2926] truncate">{value}</p>
    </div>
  );
}
