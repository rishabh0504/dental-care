"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/lib/i18n";
import { chatCompletion, type Message } from "@/lib/ollama-service";
import { DENTAL_SYSTEM_PROMPT } from "@/utils/prompt-engineering";
import { AlertCircle, Bot, Send, User } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
export type ChatMessage = {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: Date;
};
type ChatbotUIProps = {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
};

export function ChatbotUI({
  messages: initialMessages,
  onSendMessage: parentOnSendMessage,
}: ChatbotUIProps) {
  const { t } = useTranslation();
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typingRef.current) {
      typingRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setError(null);
    parentOnSendMessage(userMessage.message);

    const tempAiMessageId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      {
        id: tempAiMessageId,
        message: "",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);

    const ollamaMessages: Message[] = [
      {
        role: "system",
        content: DENTAL_SYSTEM_PROMPT,
      },
      ...messages.map((msg) => ({
        role:
          msg.sender === "user"
            ? "user"
            : ("assistant" as "user" | "assistant"),
        content: msg.message,
      })),
      { role: "user", content: userMessage.message },
    ];

    try {
      await chatCompletion({
        messages: ollamaMessages,
        onUpdate: (content) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMessageId ? { ...msg, message: content } : msg
            )
          );
        },
        onFinish: () => {
          setIsTyping(false);
        },
        onError: (err) => {
          setError(err.message);
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMessageId
                ? {
                    ...msg,
                    message: "Sorry, I encountered an error. Please try again.",
                  }
                : msg
            )
          );
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="">
      {/* <div>
        <h2 className="text-3xl font-bold text-gray-900">
          {t("chatbot.title")}
        </h2>
        <p className="text-gray-600">{t("chatbot.subtitle")}</p>
      </div> */}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="h-[580px] flex flex-col">
        {/* <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            {t("chatbot.assistantName")}
            <span className="ml-auto text-sm font-normal text-green-600">
              ● {t("chatbot.online")}
            </span>
          </CardTitle>
        </CardHeader> */}

        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            <ScrollArea
              ref={scrollAreaRef}
              className="flex-1 overflow-y-auto p-4"
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    ref={
                      message.sender === "ai" && message.message === ""
                        ? typingRef
                        : null
                    }
                    className={`flex gap-3 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {/* Left-side Avatar (Assistant only) */}
                    {message.sender === "ai" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                      <div className="prose prose-sm whitespace-pre-wrap">
                        <ReactMarkdown>
                          {message.message || (isTyping ? "..." : "")}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs mt-1 text-gray-500">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>

                    {/* Right-side Avatar (User only) */}
                    {message.sender === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="flex-1"
              disabled={isTyping}
            />
            <Button type="submit" disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  setInputMessage(t("chatbot.quickActions.toothDecay"))
                }
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
              >
                {t("chatbot.quickActions.toothDecay")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputMessage(t("chatbot.quickActions.cleaningFrequency"))
                }
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
              >
                {t("chatbot.quickActions.cleaningFrequency")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputMessage(t("chatbot.quickActions.emergencyCare"))
                }
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
              >
                {t("chatbot.quickActions.emergencyCare")}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
