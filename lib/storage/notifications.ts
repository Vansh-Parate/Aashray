// ──────────────────────────────────────────────────────────────
// DEPRECATED: localStorage notification helpers
// Notifications are now powered by Supabase Realtime.
// See: lib/supabase/notifications.ts
// This file is kept only for reference / backward compatibility.
// ──────────────────────────────────────────────────────────────

import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { getFromStorage, saveToStorage } from "@/lib/storage";
import type { Notification } from "@/types";

/** @deprecated Use lib/supabase/notifications.ts instead */
export function getNotifications(): Notification[] {
  return getFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
}

/** @deprecated Use lib/supabase/notifications.ts instead */
export function getNotificationsByUserId(userId: string): Notification[] {
  return getNotifications()
    .filter((n) => n.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/** @deprecated Use lib/supabase/notifications.ts instead */
export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const n = notifications.find((x) => x.id === id);
  if (n) {
    n.read = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
}

/** @deprecated Use lib/supabase/notifications.ts instead */
export function markAllNotificationsAsRead(userId: string): void {
  const notifications = getNotifications();
  notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}

/** @deprecated Use the POST /api/notifications API route instead */
export function addNotification(notification: Omit<Notification, "id">): void {
  const notifications = getNotifications();
  notifications.push({
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  });
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
}
