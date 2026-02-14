import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key for server-side inserts (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, type, title, message } = body;

        if (!userId || !type || !title || !message) {
            return NextResponse.json(
                { error: "Missing required fields: userId, type, title, message" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("notifications")
            .insert({
                user_id: userId,
                type,
                title,
                message,
                read: false,
            })
            .select()
            .single();

        if (error) {
            console.error("Error inserting notification:", error);
            return NextResponse.json(
                { error: "Failed to create notification" },
                { status: 500 }
            );
        }

        return NextResponse.json({ notification: data }, { status: 201 });
    } catch (err) {
        console.error("Notification API error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
