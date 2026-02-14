"use client";

import { useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function NotificationProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  return (
    <NotificationProvider userId={user?.id ?? null}>
      {children}
    </NotificationProvider>
  );
}
