"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { formatRelativeTime } from "@/lib/utils/notifications";
import { cn } from "@/lib/utils/cn";

export function NotificationBadge() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  if (!user) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-danger text-xs text-white"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="h-[360px]">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">
                No notifications
              </p>
            ) : (
              notifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "cursor-pointer rounded-lg p-4 transition-colors hover:bg-surface-dark",
                    !notif.read && "bg-surface-dark"
                  )}
                  onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-text-muted">{notif.message}</p>
                      <p className="text-xs text-text-muted">
                        {formatRelativeTime(notif.createdAt)}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
