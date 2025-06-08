import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("[API] Received signin data:", data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    console.log(`[API] Backend responded with status: ${response.status}`);

    const result = await response.json();
    console.log("[API] Backend response body:", result);

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Signin failed" },
        { status: response.status }
      );
    }

    // Extract the token from backend response
    const token = result.access_token;

    if (!token) {
      return NextResponse.json(
        { error: "No token received from backend" },
        { status: 500 }
      );
    }

    // Create response and set HttpOnly cookie
    const res = NextResponse.json(
      { message: "Signin successful" },
      { status: 200 }
    );

    // Set cookie options — secure should be true in production with HTTPS
    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: true,
      maxAge: 60 * 30, // 7 days
      sameSite: "lax",
    });

    return res;
  } catch (error: any) {
    console.error("[API] Error in signin handler:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
