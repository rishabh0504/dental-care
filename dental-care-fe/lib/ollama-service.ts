"use client";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OllamaStreamResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: Message[];
  stream?: boolean;
  onUpdate?: (content: string) => void;
  onFinish?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

export async function chatCompletion({
  model = "gemma3:1b",
  messages,
  stream = true,
  onUpdate,
  onFinish,
  onError,
}: ChatCompletionOptions): Promise<string | undefined> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_OLLAMA_HOST}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages,
          stream,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${errorText}`);
    }

    if (stream) {
      let fullContent = "";
      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onFinish?.(fullContent);
          return fullContent;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const parsed: OllamaStreamResponse = JSON.parse(line);

            if (parsed.message?.content) {
              fullContent += parsed.message.content;
              onUpdate?.(fullContent);
            }

            if (parsed.done) {
              onFinish?.(fullContent);
              return fullContent;
            }
          } catch (e) {
            console.error("Failed to parse streaming response:", e);
          }
        }
      }
    } else {
      const data = await response.json();
      const content = data.message?.content || "";
      onFinish?.(content);
      return content;
    }
  } catch (error) {
    console.error("Error in chat completion:", error);
    onError?.(error instanceof Error ? error : new Error(String(error)));
    return undefined;
  }
}
