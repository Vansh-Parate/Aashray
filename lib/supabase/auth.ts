import { supabase } from "./client";
import type { UserRole } from "./client";

export async function signUp(
  email: string,
  password: string,
  role: UserRole,
  displayName?: string
) {
  if (!supabase) {
    return {
      data: { user: { id: `local_${Date.now()}`, email } },
      error: null,
    };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role, displayName },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    return {
      data: { user: { id: `local_${Date.now()}`, email }, session: null },
      error: null,
    };
  }
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) return { error: null };
  return supabase.auth.signOut();
}

export async function getSession() {
  if (!supabase) return { data: { session: null }, error: null };
  return supabase.auth.getSession();
}

export function onAuthStateChange(
  callback: (event: string, session: unknown) => void
) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}
