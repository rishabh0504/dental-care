"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/lib/i18n";
import { AlertCircle, Bot, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export type ChatMessage = {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: Date;
};

type ChatbotUIProps = {
  onSendMessage: (message: string) => void;
};

export function ChatbotUI({ onSendMessage }: ChatbotUIProps) {
  const { t } = useTranslation();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch("/api/chat/history");
      if (!res.ok) throw new Error("Failed to fetch chat history");

      const data = await res.json();
      const parsed = data.map((msg: any) => ({
        ...msg,
        created_at: new Date(msg.created_at),
      }));
      setMessages(parsed);
    } catch (err: any) {
      setError(err.message || "Could not load chat history");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: "user",
      created_at: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    onSendMessage(newMessage.content);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="h-[580px] flex flex-col">
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
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}

                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                      <div className="prose prose-sm whitespace-pre-wrap">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      <p className="text-xs mt-1 text-gray-500">
                        {formatTime(message.created_at)}
                      </p>
                    </div>

                    {message.role === "user" && (
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
            />
            <Button type="submit" disabled={!inputMessage.trim()}>
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
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
              >
                {t("chatbot.quickActions.toothDecay")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputMessage(t("chatbot.quickActions.cleaningFrequency"))
                }
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
              >
                {t("chatbot.quickActions.cleaningFrequency")}
              </button>
              <button
                type="button"
                onClick={() =>
                  setInputMessage(t("chatbot.quickActions.emergencyCare"))
                }
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full"
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
