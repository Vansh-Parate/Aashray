"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as auth from "@/lib/supabase/auth";
import { getFromStorage, saveToStorage, removeFromStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import type { UserProfile } from "@/types";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    role: "student" | "warden",
    displayName?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(() => {
    const stored = getFromStorage<UserProfile | null>(
      STORAGE_KEYS.USER_PROFILE,
      null
    );
    setUser(stored);
  }, []);

  useEffect(() => {
    loadUser();
    const { data } = auth.onAuthStateChange((event, session: unknown) => {
      const s = session as { user?: { id: string; email?: string; user_metadata?: { role?: string; displayName?: string } } } | null;
      if (event === "SIGNED_IN" && s?.user) {
        const meta = s.user.user_metadata;
        const profile: UserProfile = {
          id: s.user.id,
          email: s.user.email ?? "",
          role: (meta?.role as "student" | "warden") ?? "student",
          displayName: meta?.displayName,
          createdAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
        setUser(profile);
      } else if (event === "SIGNED_OUT") {
        removeFromStorage(STORAGE_KEYS.USER_PROFILE);
        setUser(null);
      }
    });
    setLoading(false);
    return () => data?.subscription?.unsubscribe?.();
  }, [loadUser]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      role: "student" | "warden",
      displayName?: string
    ) => {
      const { data: signUpData, error } = await auth.signUp(
        email,
        password,
        role,
        displayName
      );
      if (error) return { error: error as Error };
      if (signUpData?.user) {
        const profile: UserProfile = {
          id: signUpData.user.id,
          email: signUpData.user.email ?? email,
          role,
          displayName,
          createdAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);
        setUser(profile);
        if (role === "student") router.push("/discover");
        else router.push("/warden/dashboard");
      }
      return { error: null };
    },
    [router]
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await auth.signIn(email, password);
      if (error) return { error: error as Error };
      const profile = getFromStorage<UserProfile | null>(
        STORAGE_KEYS.USER_PROFILE,
        null
      );
      if (profile) {
        setUser(profile);
        if (profile.role === "student") router.push("/discover");
        else router.push("/warden/dashboard");
      } else if (data?.user) {
        const meta = (data.user as { user_metadata?: { role?: string } })
          .user_metadata;
        const newProfile: UserProfile = {
          id: data.user.id,
          email: data.user.email ?? email,
          role: (meta?.role as "student" | "warden") ?? "student",
          createdAt: new Date().toISOString(),
        };
        saveToStorage(STORAGE_KEYS.USER_PROFILE, newProfile);
        setUser(newProfile);
        if (newProfile.role === "student") router.push("/discover");
        else router.push("/warden/dashboard");
      }
      return { error: null };
    },
    [router]
  );

  const signOut = useCallback(async () => {
    await auth.signOut();
    removeFromStorage(STORAGE_KEYS.USER_PROFILE);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
