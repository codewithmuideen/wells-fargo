"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { hashPassword, PREDEFINED_USERS, type UserRecord } from "./data";

export type PublicUser = Omit<UserRecord, "passwordHash">;

const SESSION_KEY = "wf_session";

const stripHash = (u: UserRecord): PublicUser => {
  const { passwordHash: _omit, ...rest } = u;
  void _omit;
  return rest;
};

export const authenticateUser = (
  userId: string,
  password: string
): PublicUser | null => {
  const hash = hashPassword(password);
  const match = PREDEFINED_USERS.find(
    (u) =>
      u.userId.toLowerCase() === userId.trim().toLowerCase() &&
      u.passwordHash === hash
  );
  return match ? stripHash(match) : null;
};

export const verifyCredentials = (
  userId: string,
  password: string
): { ok: true; userId: string } | { ok: false; error: string } => {
  const hash = hashPassword(password);
  const match = PREDEFINED_USERS.find(
    (u) =>
      u.userId.toLowerCase() === userId.trim().toLowerCase() &&
      u.passwordHash === hash
  );
  if (!match) {
    return {
      ok: false,
      error:
        "We don't recognize that username and password. Please try again or visit a branch to verify your account.",
    };
  }
  return { ok: true, userId: match.userId };
};

export const getUserById = (id: string): PublicUser | null => {
  const user = PREDEFINED_USERS.find((u) => u.id === id);
  return user ? stripHash(user) : null;
};

interface AuthContextValue {
  user: PublicUser | null;
  loading: boolean;
  signIn: (userId: string, password: string) => { ok: true } | { ok: false; error: string };
  signInById: (id: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const id = typeof window !== "undefined" ? localStorage.getItem(SESSION_KEY) : null;
      if (id) {
        const u = getUserById(id);
        if (u) setUser(u);
      }
    } catch {
      // ignore storage errors
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>((userId, password) => {
    const u = authenticateUser(userId, password);
    if (!u) {
      return {
        ok: false,
        error:
          "We don't recognize that username and password. Please try again or visit a branch to verify your account.",
      };
    }
    setUser(u);
    try {
      localStorage.setItem(SESSION_KEY, u.id);
    } catch {
      // ignore
    }
    return { ok: true };
  }, []);

  const signInById = useCallback((id: string): boolean => {
    const u = getUserById(id);
    if (!u) return false;
    setUser(u);
    try {
      localStorage.setItem(SESSION_KEY, u.id);
    } catch {
      // ignore
    }
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      // Keep wf_session if PIN is set — splash Stage 3 will handle auth on next launch.
      // Only wipe the session when there's no PIN (user goes straight to login).
      const hasPin = localStorage.getItem("wf_pin");
      if (!hasPin) {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signInById, signOut }),
    [user, loading, signIn, signInById, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
