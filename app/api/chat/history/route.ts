import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET: Fetch all chat sessions for the current user
export async function GET() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: sessions, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(sessions)
}

// POST: Create a new chat session
export async function POST(req: Request) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await req.json().catch(() => ({ title: "New Chat" }))

    const { data: session, error } = await supabase
        .from("chat_sessions")
        .insert({
            user_id: user.id,
            title: title || "New Chat",
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(session)
}
