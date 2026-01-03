import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });
  
  // Clear the token cookie by setting it to empty and expiring it immediately
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), 
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return response;
}
