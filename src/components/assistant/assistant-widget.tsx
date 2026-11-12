"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Bot,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { SafeMarkdown } from "@/components/ui/safe-markdown";
import type { CitationLink } from "@/features/assistant/domain/contracts";
import type { FaqItem } from "@/types/portfolio";

const WELCOME_MESSAGE =
  "Hi! I’m Logesh’s AI portfolio assistant. I can help you explore his experience, technical skills, projects, and professional background. What would you like to know?";

const SUGGESTED_PROMPTS = [
  "Tell me about Logesh",
  "Explore his React experience",
  "What is TracAssets?",
  "What are his major projects?",
  "Which AI coding tools does he use?",
];

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: CitationLink[];
  mode?: "ollama" | "deterministic-rag" | "policy-refusal";
  error?: boolean;
  originalQuestion?: string;
}

interface AssistantWidgetProps {
  faqs: FaqItem[];
}

export function AssistantWidget({ faqs }: AssistantWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "faq">("chat");
  const [input, setInput] = useState("");
  const [faqSearch, setFaqSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: "welcome",
      role: "assistant",
      content: WELCOME_MESSAGE,
      citations: [
        { label: "Explore All 13 Projects", href: "/projects" },
        { label: "Experience Timeline", href: "/experience" },
      ],
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt?: string }>;
      setIsOpen(true);
      setActiveTab("chat");
      if (customEvent.detail?.prompt) {
        void submitQuestion(customEvent.detail.prompt);
      } else {
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    };

    window.addEventListener("open-portfolio-assistant", handleOpen);
    return () =>
      window.removeEventListener("open-portfolio-assistant", handleOpen);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  async function submitQuestion(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || isLoading) return;

    const userTurnId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userTurnId, role: "user", content: question },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          history: messages
            .slice(-4)
            .map((m) => ({ role: m.role, content: m.content.slice(0, 500) })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              data.error ||
              "Unable to process your question right now. You can retry or browse the verified FAQ tab.",
            error: true,
            originalQuestion: question,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          citations: data.citations,
          mode: data.mode,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Network error while reaching the portfolio assistant. Please retry or switch to the Instant FAQ Search tab.",
          error: true,
          originalQuestion: question,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: WELCOME_MESSAGE,
        citations: [
          { label: "Explore All 13 Projects", href: "/projects" },
          { label: "Experience Timeline", href: "/experience" },
        ],
      },
    ]);
  }

  const filteredFaqs = faqs.filter((item) => {
    if (!faqSearch.trim()) return true;
    const q = faqSearch.toLowerCase();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Floating Launcher */}
      <div className="fixed bottom-5 right-5 z-50">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 80);
            }}
            aria-label="Open Logesh's AI portfolio assistant"
            className="group flex items-center gap-2.5 rounded-full border border-blue-500/40 bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg shadow-black/20 hover:border-blue-500 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
              <Bot className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="pr-1">Ask Logesh&apos;s AI</span>
          </button>
        ) : null}
      </div>

      {/* Assistant Drawer / Modal */}
      {isOpen ? (
        <section
          role="dialog"
          aria-modal="false"
          aria-label="Logesh's AI Portfolio Assistant"
          className="fixed inset-x-3 bottom-3 top-16 sm:inset-auto sm:bottom-5 sm:right-5 z-50 flex w-auto sm:w-[430px] sm:h-[620px] max-h-[calc(100vh-5rem)] flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-foreground leading-tight">
                  AI Portfolio Assistant
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Grounded on Verified Public Facts
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                title="Clear conversation"
                aria-label="Clear conversation"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant (Esc)"
                aria-label="Close assistant"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Mode Tabs (Chat vs Instant FAQ Fallback) */}
          <div className="grid grid-cols-2 border-b border-border bg-background/60 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                activeTab === "chat"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Interactive AI Chat</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("faq")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 transition-colors ${
                activeTab === "faq"
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Instant FAQ & Search</span>
            </button>
          </div>

          {activeTab === "chat" ? (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white"
                          : msg.error
                          ? "border border-red-500/40 bg-red-500/10 text-foreground"
                          : "border border-border bg-background text-foreground"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="leading-relaxed">{msg.content}</p>
                      ) : (
                        <SafeMarkdown content={msg.content} />
                      )}

                      {msg.error && msg.originalQuestion ? (
                        <button
                          type="button"
                          onClick={() =>
                            void submitQuestion(msg.originalQuestion!)
                          }
                          className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <RefreshCw className="h-3 w-3" aria-hidden="true" />
                          <span>Retry Question</span>
                        </button>
                      ) : null}

                      {msg.citations && msg.citations.length > 0 ? (
                        <div className="mt-3 border-t border-border/70 pt-2">
                          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                            Verified Sources
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.citations.map((cite) => (
                              <Link
                                key={cite.href}
                                href={cite.href}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:border-blue-500/50"
                              >
                                <span>{cite.label}</span>
                                <ArrowUpRight
                                  className="h-3 w-3"
                                  aria-hidden="true"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono px-2">
                    <RefreshCw
                      className="h-3.5 w-3.5 animate-spin text-blue-500"
                      aria-hidden="true"
                    />
                    <span>Retrieving verified portfolio facts...</span>
                  </div>
                ) : null}

                {/* Suggested Prompts */}
                <div className="pt-2">
                  <p className="font-mono text-[11px] text-muted-foreground mb-2">
                    Suggested prompts:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        disabled={isLoading}
                        onClick={() => void submitQuestion(prompt)}
                        className="rounded-lg border border-border bg-background px-2.5 py-1 text-left text-xs text-muted-foreground hover:border-blue-500/40 hover:text-foreground transition-colors disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void submitQuestion(input);
                }}
                className="border-t border-border bg-muted/30 p-3"
              >
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={500}
                    placeholder="Ask about projects, skills, or experience..."
                    aria-label="Ask a question about Logesh T"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send question"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            /* Instant FAQ / Search Fallback Experience */
            <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Filter verified FAQs (e.g. TracAssets, React, IoT)..."
                  aria-label="Filter verified FAQs"
                  className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {filteredFaqs.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>No matching FAQ entries found.</span>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-border bg-background p-3 space-y-1.5"
                    >
                      <p className="text-xs font-semibold text-foreground">
                        {faq.question}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {faq.relatedLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>{link.label}</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      ) : null}
    </>
  );
}
