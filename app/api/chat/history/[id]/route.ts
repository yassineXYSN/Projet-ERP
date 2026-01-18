import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET: Fetch messages for a specific session
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership of session (implicit via RLS, but good practice to handle if needed)
    const { data: messages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(messages)
}
