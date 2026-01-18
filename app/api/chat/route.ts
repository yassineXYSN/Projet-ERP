import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { message, sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // 1. Ensure Session Exists or Create it
    // We check if it exists in DB to prevent foreign key errors on message insert
    // Ideally the frontend creates the session first, but we can handle "lazy" creation/verification here if using a known UUID
    // For now, let's assume the frontend passes a valid UUID. If it's a new conversation started by frontend with a generated UUID, we need to insert it.

    // Check if session exists
    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("id", sessionId)
      .single()

    if (!existingSession) {
      // Create new session
      const { error: createError } = await supabase
        .from("chat_sessions")
        .insert({
          id: sessionId,
          user_id: user.id,
          title: message.substring(0, 30) + "..." // Auto-title
        })

      if (createError) {
        console.error("API Route: Failed to create session:", createError)
        return NextResponse.json({ error: "Failed to create chat session" }, { status: 500 })
      }
    }

    // 2. Save User Message
    const { error: msgError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role: "user",
        content: message
      })

    if (msgError) {
      console.error("API Route: Main user message insert failed:", msgError)
      // Continue anyway? Or fail? Let's fail safest.
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL

    console.log("API Route: Received chat request")
    console.log("API Route: Webhook URL configured:", !!webhookUrl)

    if (!webhookUrl) {
      console.error("API Route Error: N8N_WEBHOOK_URL is missing")
      return NextResponse.json(
        { error: "Webhook URL not configured in environment variables" },
        { status: 500 }
      )
    }

    console.log("API Route: Sending request to n8n...")
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Route: n8n webhook error response:", response.status, errorText)
      return NextResponse.json(
        { error: "Failed to communicate with AI service. Status: " + response.status + ". Details: " + errorText },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log("API Route: n8n raw response:", responseText)

    let data
    let botContent = ""
    try {
      data = JSON.parse(responseText)
      // Handle Array or Object
      const item = Array.isArray(data) ? data[0] : data
      botContent = item.output || item.message || JSON.stringify(data)
    } catch (e) {
      console.warn("API Route: n8n response is not JSON. Using text as message.")
      data = { message: responseText }
      botContent = responseText
    }

    // 3. Save Assistant Message
    await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        role: "assistant",
        content: botContent
      })

    console.log("API Route: Success, returning data")
    return NextResponse.json(data)

  } catch (error) {
    console.error("API Route: Internal server error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
