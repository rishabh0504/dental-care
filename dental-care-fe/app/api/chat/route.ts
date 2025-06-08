import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Logger
const log = {
  info: (msg: string, meta?: any) => console.log("[INFO]", msg, meta || ""),
  error: (msg: string, meta?: any) => console.error("[ERROR]", msg, meta || ""),
};

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      log.error("No token found in cookies");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      chatSessionId?: string;
    };
    log.info("Token verified successfully", decoded);

    const chatSessionId = decoded.chatSessionId;
    if (!chatSessionId) {
      log.error("chatSessionId missing in token");
      return NextResponse.json(
        { error: "No chat session associated" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const userMessage = body.message;

    // Call backend with streaming support
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/chat/${chatSessionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          {
            role: "assistant",
            content: "Please make sure it should not be more than 50 words",
          },
          { role: "user", content: userMessage },
        ]),
      }
    );

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      log.error("Failed to send message to backend", errorText);
      return NextResponse.json(
        { error: errorText },
        { status: backendResponse.status }
      );
    }

    if (!backendResponse.body) {
      log.error("Backend response has no body");
      return NextResponse.json(
        { error: "No response body from backend" },
        { status: 500 }
      );
    }

    // Stream backend response to client
    return new Response(backendResponse.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    log.error("JWT verification failed", {
      message: err.message,
      name: err.name,
    });
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
