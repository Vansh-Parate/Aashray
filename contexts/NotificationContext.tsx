"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  getNotificationsByUserId,
  markNotificationAsRead as supaMarkAsRead,
  markAllNotificationsAsRead as supaMarkAllAsRead,
  subscribeToNotifications,
} from "@/lib/supabase/notifications";
import type { Notification } from "@/types";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refresh: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string | null;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);

  // Fetch existing notifications from Supabase
  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }
    const data = await getNotificationsByUserId(userId);
    setNotifications(data);
  }, [userId]);

  // Initial fetch + realtime subscription
  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    // Fetch existing notifications
    refresh();

    // Subscribe to real-time INSERT events
    unsubRef.current = subscribeToNotifications(userId, (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [userId, refresh]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback(
    async (id: string) => {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      await supaMarkAsRead(id);
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supaMarkAllAsRead(userId);
  }, [userId]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refresh,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  return ctx;
}
