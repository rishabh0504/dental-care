"use client";

import { ChatbotUI } from "@/components/chatbot-ui";

export default function ChatPage() {
  return (
    <ChatbotUI
      messages={[]}
      onSendMessage={function (message: string): void {
        throw new Error("Function not implemented.");
      }}
    />
  );
}
