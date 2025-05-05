import { NextRequest, NextResponse } from "next/server";

const allowed = ["/login", "/register", "/"];

export default async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;

  const refreshToken = cookies.get("refreshToken")?.value;

  const isAuthenticated = !!refreshToken;

  // Unauthenticated user accessing a protected route
  if (!isAuthenticated && !allowed.includes(nextUrl.pathname)) {
    console.log("No valid token - Redirecting to /login");
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  // Authenticated user trying to access login/signup routes
  if (isAuthenticated && ["/login", "/register"].includes(nextUrl.pathname)) {
    console.log("Authenticated - Redirecting to /connect/chats");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:id/edit", "/login", "/register", "/"],
};
