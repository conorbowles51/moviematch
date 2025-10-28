import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "../types/user";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>; // refetches auth/me
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API = import.meta.env.VITE_API_URL;

async function jsonFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include", // send/receive flask session cookie
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : null;
  if(!res.ok){
    const msg = (data && (data.error || data.message)) || res.statusText;
    throw new Error(msg);
  }
  return data;
}

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch current user on mount if cookie exists already
  useEffect(() => {
    (async () => {
      try {
        const me = await jsonFetch("/api/auth/me", {method: "GET"});
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    await jsonFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    })

    // After login, fetch /me
    const me = await jsonFetch("/api/auth/me", { method: "GET" });
    setUser(me);
  }

  const register = async (email: string, password: string, displayName: string) => {
    setError(null);
    const me = await jsonFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName }),
    });
    setUser(me);
  }

  const logout = async () => {
    setError(null);
    try {
      await jsonFetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  const refresh = async () => {
    const me = await jsonFetch("/api/auth/me", { method: "GET" });
    setUser(me);
  }

  const value = useMemo(
    () => ({ user, loading, error, login, register, logout, refresh }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}