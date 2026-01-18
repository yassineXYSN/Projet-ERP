import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, sessionId } = body

    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

    console.log("API Route: Received chat request")
    console.log("API Route: Webhook URL configured:", !!webhookUrl)

    if (!webhookUrl) {
      console.error("API Route Error: NEXT_PUBLIC_N8N_WEBHOOK_URL is missing")
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
        { error: `Failed to communicate with AI service: ${response.status} ${errorText}` },
        { status: response.status }
      )
    }

    const responseText = await response.text()
    console.log("API Route: n8n raw response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.warn("API Route: n8n response is not JSON. Using text as message.")
      data = { message: responseText }
    }

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
