import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Simple logger
const log = {
  info: (msg: string, meta?: any) => console.log("[INFO]", msg, meta || ""),
  error: (msg: string, meta?: any) => console.error("[ERROR]", msg, meta || ""),
};

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    log.error("No token found in cookies");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };

    log.info("Token verified successfully", JSON.stringify(decoded));
    const chatSessionId = decoded?.chatSessionId;

    if (!chatSessionId) {
      log.error("chatSessionId missing in token");
      return NextResponse.json(
        { error: "No chat session associated" },
        { status: 400 }
      );
    }

    log.info("Token verified successfully", decoded);

    const apiResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/chat/${chatSessionId}/history`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      log.error("Failed to fetch chat history", errorText);
      return NextResponse.json(
        { error: "Failed to fetch chat history" },
        { status: apiResponse.status }
      );
    }

    const chatHistory = await apiResponse.json();
    return NextResponse.json(chatHistory);
  } catch (err: any) {
    log.error("JWT verification failed", {
      message: err.message,
      name: err.name,
    });

    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
