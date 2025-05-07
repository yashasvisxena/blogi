import { NextRequest, NextResponse } from "next/server";

const allowed = ["/login", "/register", "/"];

export default async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const pathname = nextUrl.pathname;

  const refreshToken = cookies.get("refreshToken")?.value;
  const isAuthenticated = !!refreshToken;

  // Check if the current path is a protected route
  const isProtectedRoute =
    !allowed.includes(pathname) &&
    (pathname.startsWith("/posts/") || pathname === "/posts/create");

  // Unauthenticated user accessing a protected route
  if (!isAuthenticated && isProtectedRoute) {
    console.log(`No valid token - Redirecting to /login from ${pathname}`);
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  // Authenticated user trying to access login/signup routes
  if (isAuthenticated && ["/login", "/register"].includes(pathname)) {
    console.log("Authenticated - Redirecting to /");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/posts/:path*", "/"],
};
