 "use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useI18n } from "@/lib/i18n"
import type { RepoAnalysis } from "@/lib/github"

interface AIAssistantProps {
  analysis: RepoAnalysis | null
  projectName: string
}

interface Message {
  role: "user" | "assistant"
  content: string
  id?: string
}

const AIAssistant = ({ analysis, projectName }: AIAssistantProps) => {
  const { t } = useI18n()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: "user", content }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: analysis
            ? {
                projectName,
                repo: analysis.repo,
                metrics: analysis.metrics,
                totalCommits: analysis.totalCommits,
                totalPRs: analysis.totalPRs,
                mergedPRs: analysis.mergedPRs,
                developers: analysis.developers.map(d => ({
                  login: d.login,
                  commits: d.commits,
                  prs: d.pullRequests,
                })),
              }
            : null,
        }),
      })

      if (!res.body) throw new Error("No response from API")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let assistantMessage: Message = { role: "assistant", content: "" }

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          assistantMessage.content += decoder.decode(value)
          setMessages(prev => {
            const other = prev.filter(m => m.role !== "assistant" || m.id)
            return [...other, assistantMessage]
          })
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to get response from Dora")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void sendMessage(input)
  }

  const suggestedQuestions = [t("ai.q1"), t("ai.q2"), t("ai.q3"), t("ai.q4")]

  const handleSuggestionClick = (question: string) => {
    void sendMessage(question)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
      <Card className="border-border/50 bg-card h-[600px] flex flex-col shadow-lg">
        <CardHeader className="pb-3 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <span>Dora - {t("dashboard.aiAssistant")}</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions about your DevOps performance and get AI-powered insights
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20"
                    >
                      <Bot className="h-4 w-4 text-primary" />
                    </motion.div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      <p>
                        Hi! I'm <span className="font-semibold text-primary">Dora</span>, your AI-powered DevOps assistant.
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                        <li>Understand your DORA metrics</li>
                        <li>Explain performance changes</li>
                        <li>Identify bottlenecks in your delivery pipeline</li>
                        <li>Get suggestions to optimize DevOps</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`p-2 rounded-lg ${msg.role === "user" ? "bg-primary/20" : "bg-accent/20"}`}>
                      {msg.role === "user" ? <User className="h-4 w-4 text-primary" /> : <Bot className="h-4 w-4 text-accent" />}
                    </div>
                    <div className={`flex-1 ${msg.role === "user" ? "text-right" : ""}`}>
                      <div className={`inline-block p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Dora is thinking...</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t("ai.placeholder")}
              className="flex-1 bg-input border-border"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AIAssistant

