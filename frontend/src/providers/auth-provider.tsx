"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_CACHE_KEY = "crypto-vault:user";
const USER_CACHE_TTL_MS = 5 * 60 * 1000;

function readCachedUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { user: User | null; ts: number };
    if (!cached || typeof cached.ts !== "number" || Date.now() - cached.ts > USER_CACHE_TTL_MS) {
      sessionStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return cached.user;
  } catch {
    return null;
  }
}

function writeUserCache(user: User | null) {
  try {
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
  } catch {
    // storage unavailable, ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = readCachedUser();
    if (cached) {
      setUser(cached);
      setLoading(false);
      return;
    }
    api.auth
      .me()
      .then((res) => {
        setUser(res.user);
        writeUserCache(res.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    setUser(res.user);
    writeUserCache(res.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await api.auth.register({ email, password, name });
    setUser(res.user);
    writeUserCache(res.user);
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    writeUserCache(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
