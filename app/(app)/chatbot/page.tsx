"use client"

import { useState, useEffect } from "react"
import { Send, User, Bot, Loader2, ArrowRight } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string>("")

    useEffect(() => {
        // Set initial welcome message on client side only to prevent hydration mismatch
        setMessages([
            {
                id: "1",
                role: "assistant",
                content: "Hello! I'm your procurement assistant. How can I help you today?",
                timestamp: new Date(),
            },
        ])

        // Generate or retrieve session ID
        const storedSession = localStorage.getItem("chat_session_id")
        if (storedSession) {
            setSessionId(storedSession)
        } else {
            const newSession = uuidv4()
            localStorage.setItem("chat_session_id", newSession)
            setSessionId(newSession)
        }
    }, [])

    const handleSend = async () => {
        if (!input.trim() || !sessionId) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: userMessage.content,
                    sessionId: sessionId,
                }),
            })

            if (!response.ok) {
                let errorDetails = "Unknown error"
                try {
                    const errorJson = await response.json()
                    errorDetails = errorJson.error || JSON.stringify(errorJson)
                } catch {
                    errorDetails = await response.text()
                }
                throw new Error(`Failed to send message: ${response.status} ${errorDetails}`)
            }

            const data = await response.json()

            // Handle n8n response which might be an array or object
            // data format: [{ "output": "messsage" }] or { "output": "message" }
            const responseItem = Array.isArray(data) ? data[0] : data
            const botResponseText = responseItem.output || responseItem.message || JSON.stringify(data)

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: typeof botResponseText === 'string' ? botResponseText : JSON.stringify(botResponseText),
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
        } catch (error) {
            console.error("Chat error details:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `Error: ${error instanceof Error ? error.message : "Connection failed"}`,
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const renderMessageContent = (content: string) => {
        const actionRegex = /<<ACTION:([^|]+)\|([^>]+)>>/g
        const match = actionRegex.exec(content)

        if (!match) {
            return <p className="text-sm whitespace-pre-wrap">{content}</p>
        }

        const [fullMatch, label, url] = match
        const cleanContent = content.replace(fullMatch, "").trim()

        return (
            <div className="flex flex-col gap-3 mt-2">
                <p className="text-sm whitespace-pre-wrap">{cleanContent}</p>
                <Button asChild className="w-fit gap-2 shadow-sm font-medium" size="sm">
                    <a href={url}>
                        {label}
                        <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                </Button>
            </div>
        )
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex h-full flex-col p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
            </div>

            <Card className="flex-1 flex flex-col min-h-[500px]">
                <CardHeader>
                    <CardTitle>Chat Session</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[calc(100vh-350px)] p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar>
                                        <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {renderMessageContent(message.content)}
                                        <span className="text-xs opacity-50 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback className="bg-muted">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg px-4 py-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t bg-muted/20">
                    <div className="flex w-full items-end gap-2">
                        <Textarea
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                            className="flex-1 min-h-[44px] max-h-32 resize-none bg-background focus-visible:ring-1"
                            rows={1}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="h-11 w-11 shrink-0"
                        >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
