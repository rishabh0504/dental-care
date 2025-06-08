import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Signed out" });

  // Clear the cookie by setting it to empty and expired
  response.cookies.set({
    name: "token",
    value: "",
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  return response;
}
