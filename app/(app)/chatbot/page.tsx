"use client"

import { useState, useEffect } from "react"
import { Send, User, Bot, Loader2, ArrowRight, MessageSquare, Plus, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
}

interface ChatSession {
    id: string
    title: string
    updated_at: string
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string>("")
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Load sessions on mount
    useEffect(() => {
        fetchSessions()

        // Initialize with a new session if none selected
        // Or check localstorage? Let's default to new session logic
        const storedSession = localStorage.getItem("chat_session_id")
        if (storedSession) {
            setSessionId(storedSession)
            fetchMessages(storedSession)
        } else {
            const newId = uuidv4()
            setSessionId(newId)
            localStorage.setItem("chat_session_id", newId)
        }
    }, [])

    const fetchSessions = async () => {
        try {
            const res = await fetch("/api/chat/history")
            if (res.ok) {
                const data = await res.json()
                setSessions(data)
            }
        } catch (e) {
            console.error("Failed to fetch sessions", e)
        }
    }

    const fetchMessages = async (id: string) => {
        try {
            const res = await fetch(`/api/chat/history/${id}`)
            if (res.ok) {
                const data = await res.json()
                const formatted: Message[] = data.map((m: any) => ({
                    id: m.id,
                    role: m.role,
                    content: m.content,
                    timestamp: new Date(m.created_at)
                }))
                // Sort by timestamp just in case
                setMessages(formatted)
            }
        } catch (e) {
            console.error("Failed to fetch messages", e)
        }
    }

    const handleNewChat = () => {
        const newId = uuidv4()
        setSessionId(newId)
        setMessages([])
        localStorage.setItem("chat_session_id", newId)
        // Optimistically add to sessions? No, wait for first message or explicit create
    }

    const handleSessionSelect = (id: string) => {
        setSessionId(id)
        localStorage.setItem("chat_session_id", id)
        fetchMessages(id)
    }

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
                // ... same error handling ...
                throw new Error(`Failed to send message: ${response.status}`)
            }

            const data = await response.json()

            // ... same response handling ...
            const responseItem = Array.isArray(data) ? data[0] : data
            const botResponseText = responseItem.output || responseItem.message || JSON.stringify(data)

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: typeof botResponseText === 'string' ? botResponseText : JSON.stringify(botResponseText),
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])

            // Refresh session list to show new title/update time
            fetchSessions()

        } catch (error) {
            console.error("Chat error details:", error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant", // Using generic error role?
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
        <div className="relative flex flex-col gap-4 h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
                    <p className="text-sm text-muted-foreground">Chat and keep context across sessions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => setIsSidebarOpen(true)}>
                        <MessageSquare className="h-4 w-4" /> History
                    </Button>
                    <Button onClick={handleNewChat} className="gap-2">
                        <Plus className="h-4 w-4" /> New Chat
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <CardHeader className="p-4 border-b">
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-primary" />
                        Conversation
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full p-4">
                        <div className="space-y-4 pb-4">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                                    <Bot className="h-12 w-12 mb-4 opacity-20" />
                                    <p>Start a new conversation!</p>
                                </div>
                            )}
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className={message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                                            {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[85%] text-sm ${message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                            }`}
                                    >
                                        {renderMessageContent(message.content)}
                                        <span className="text-[10px] opacity-50 mt-1 block">
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
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
                            placeholder="Type a message..."
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

            {/* History Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-40 flex items-start justify-end bg-background/70 backdrop-blur-sm">
                    <div className="absolute inset-0" onClick={() => setIsSidebarOpen(false)} aria-hidden />
                    <div className="relative h-full w-full max-w-[360px] bg-card shadow-2xl border-l flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span className="text-sm font-semibold">History</span>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="gap-2" onClick={handleNewChat}>
                                    <Plus className="h-4 w-4" /> New
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => setIsSidebarOpen(false)}>
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="flex flex-col p-2 gap-1">
                                {sessions.map((session) => (
                                    <Button
                                        key={session.id}
                                        variant={sessionId === session.id ? "secondary" : "ghost"}
                                        className="w-full justify-start text-left truncate h-auto py-2 px-3"
                                        onClick={() => {
                                            handleSessionSelect(session.id)
                                            setIsSidebarOpen(false)
                                        }}
                                    >
                                        <MessageSquare className="h-4 w-4 mr-2 shrink-0 opacity-50" />
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="truncate text-sm font-medium">{session.title}</span>
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(session.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </Button>
                                ))}
                                {sessions.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center p-4">No history yet.</p>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            )}
        </div>
    )
}
