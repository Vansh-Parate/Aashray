import { supabase } from "@/lib/supabase/client";
import type { Notification } from "@/types";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Map Supabase row (snake_case) to our Notification type (camelCase)
function mapRow(row: Record<string, unknown>): Notification {
    return {
        id: row.id as string,
        userId: row.user_id as string,
        type: row.type as string,
        title: row.title as string,
        message: row.message as string,
        read: row.read as boolean,
        createdAt: row.created_at as string,
    };
}

export async function getNotificationsByUserId(
    userId: string
): Promise<Notification[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }

    return (data ?? []).map(mapRow);
}

export async function markNotificationAsRead(id: string): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

    if (error) {
        console.error("Error marking notification as read:", error);
    }
}

export async function markAllNotificationsAsRead(
    userId: string
): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);

    if (error) {
        console.error("Error marking all notifications as read:", error);
    }
}

/**
 * Subscribe to real-time INSERT events on the notifications table
 * for a specific user. Returns an unsubscribe function.
 */
export function subscribeToNotifications(
    userId: string,
    onInsert: (notification: Notification) => void
): () => void {
    if (!supabase) return () => { };

    const channel: RealtimeChannel = supabase
        .channel(`notifications:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "notifications",
                filter: `user_id=eq.${userId}`,
            },
            (payload) => {
                onInsert(mapRow(payload.new as Record<string, unknown>));
            }
        )
        .subscribe();

    return () => {
        supabase?.removeChannel(channel);
    };
}
