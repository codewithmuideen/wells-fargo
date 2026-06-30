// Registration & verification helpers (localStorage-backed, no backend).

export interface PendingRegistration {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string; // MM/DD/YYYY
  ssnLast4: string; // 4 digits
  otp: string; // 6-digit string
  otpExpires: number; // epoch ms
  verified: boolean;
  verifiedAt?: string; // iso
  referenceNumber?: string; // ENR-2026-XXXXXX
  createdAt: string; // iso
}

const REG_KEY = "wf_registrations";
const PENDING_KEY = "wf_pending_registration";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

/** Simple UUID v4-ish generator — no deps. */
export const generateId = (): string => {
  const rand = (n: number) =>
    Array.from({ length: n }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
  return `${rand(8)}-${rand(4)}-4${rand(3)}-${(8 + Math.floor(Math.random() * 4)).toString(
    16
  )}${rand(3)}-${rand(12)}`;
};

/** 6-digit zero-padded OTP string. */
export const generateOtp = (): string =>
  Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");

/** Reference like ENR-2026-A1B2C3 (uppercase alnum, 6 chars). */
export const generateReference = (): string => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 for clarity
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const year = new Date().getFullYear();
  return `ENR-${year}-${suffix}`;
};

const isBrowser = (): boolean => typeof window !== "undefined";

const readRegistrations = (): PendingRegistration[] => {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(REG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingRegistration[]) : [];
  } catch {
    return [];
  }
};

const writeRegistrations = (list: PendingRegistration[]): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(REG_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
};

const writePending = (reg: PendingRegistration): void => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(reg));
  } catch {
    // ignore
  }
};

/** Get the most recently saved pending registration (regardless of email). */
export const getPending = (): PendingRegistration | null => {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingRegistration;
  } catch {
    return null;
  }
};

/** Find a registration by email (case-insensitive). Returns the freshest match. */
export const getPendingByEmail = (email: string): PendingRegistration | null => {
  const list = readRegistrations();
  const target = email.trim().toLowerCase();
  const matches = list.filter((r) => r.email.toLowerCase() === target);
  if (matches.length === 0) return null;
  return matches.reduce((latest, cur) =>
    new Date(cur.createdAt).getTime() > new Date(latest.createdAt).getTime()
      ? cur
      : latest
  );
};

export interface CreatePendingInput {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  ssnLast4: string;
}

/** Create a new pending registration, persist it, return it. */
export const createPendingRegistration = (
  input: CreatePendingInput
): PendingRegistration => {
  const now = Date.now();
  const reg: PendingRegistration = {
    id: generateId(),
    email: input.email.trim(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone.trim(),
    dob: input.dob.trim(),
    ssnLast4: input.ssnLast4.trim(),
    otp: generateOtp(),
    otpExpires: now + OTP_TTL_MS,
    verified: false,
    createdAt: new Date(now).toISOString(),
  };

  const list = readRegistrations();
  list.push(reg);
  writeRegistrations(list);
  writePending(reg);
  return reg;
};

/** Replace or update the stored record for an id. */
const updateRegistration = (
  id: string,
  patch: Partial<PendingRegistration>
): PendingRegistration | null => {
  const list = readRegistrations();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated: PendingRegistration = { ...list[idx], ...patch };
  list[idx] = updated;
  writeRegistrations(list);

  const pending = getPending();
  if (pending && pending.id === id) {
    writePending(updated);
  }
  return updated;
};

export type VerifyResult =
  | { ok: true; registration: PendingRegistration }
  | { ok: false; error: "not_found" | "expired" | "invalid" };

/** Verify an OTP against a pending registration looked up by email. */
export const verifyOtp = (email: string, code: string): VerifyResult => {
  const reg = getPendingByEmail(email);
  if (!reg) return { ok: false, error: "not_found" };
  if (Date.now() > reg.otpExpires) return { ok: false, error: "expired" };
  if (reg.otp !== code.trim()) return { ok: false, error: "invalid" };

  const referenceNumber = reg.referenceNumber ?? generateReference();
  const updated = updateRegistration(reg.id, {
    verified: true,
    verifiedAt: new Date().toISOString(),
    referenceNumber,
  });
  return updated
    ? { ok: true, registration: updated }
    : { ok: false, error: "not_found" };
};

/** Regenerate an OTP (resend). */
export const resendOtp = (email: string): PendingRegistration | null => {
  const reg = getPendingByEmail(email);
  if (!reg) return null;
  return updateRegistration(reg.id, {
    otp: generateOtp(),
    otpExpires: Date.now() + OTP_TTL_MS,
  });
};

/** Mark a registration verified explicitly (e.g. via magic-link token). */
export const markVerified = (id: string): PendingRegistration | null => {
  const list = readRegistrations();
  const reg = list.find((r) => r.id === id);
  if (!reg) return null;
  const referenceNumber = reg.referenceNumber ?? generateReference();
  return updateRegistration(id, {
    verified: true,
    verifiedAt: new Date().toISOString(),
    referenceNumber,
  });
};

/** Attach/ensure a reference number on a registration. */
export const ensureReference = (id: string): PendingRegistration | null => {
  const list = readRegistrations();
  const reg = list.find((r) => r.id === id);
  if (!reg) return null;
  if (reg.referenceNumber) return reg;
  return updateRegistration(id, { referenceNumber: generateReference() });
};

/** Password-strength classifier. */
export type PasswordStrength = "empty" | "weak" | "fair" | "strong";

export const scorePassword = (pwd: string): PasswordStrength => {
  if (!pwd) return "empty";
  const classes =
    (/[a-z]/.test(pwd) ? 1 : 0) +
    (/[A-Z]/.test(pwd) ? 1 : 0) +
    (/[0-9]/.test(pwd) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pwd) ? 1 : 0);
  if (pwd.length >= 12 && classes >= 3) return "strong";
  if (pwd.length >= 8 && classes >= 2) return "fair";
  return "weak";
};
