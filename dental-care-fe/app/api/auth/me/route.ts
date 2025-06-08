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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
    };
    log.info("Token verified successfully: ", JSON.stringify(decoded));
    return NextResponse.json({ email: decoded.sub });
  } catch (err: any) {
    log.error("JWT verification failed", {
      message: err.message,
      name: err.name,
    });

    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
