import { NextRequest, NextResponse } from "next/server";

// Public routes that anyone can access
const publicRoutes = ["/login", "/register", "/"];

// Routes that require authentication
const protectedRoutes = ["/create-post"];

export default async function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const path = nextUrl.pathname;

  const refreshToken = cookies.get("refreshToken")?.value;
  const isAuthenticated = !!refreshToken;

  // Check if it's a post edit route
  const isPostEditRoute = path.match(/^\/posts\/[\w-]+\/edit$/);

  // Check if the current path requires authentication
  const requiresAuth = protectedRoutes.includes(path) || isPostEditRoute;

  // Unauthenticated user accessing a protected route
  if (!isAuthenticated && requiresAuth) {
    console.log(`No valid token - Redirecting to /login from ${path}`);
    return NextResponse.redirect(new URL("/login", nextUrl.origin));
  }

  // Authenticated user trying to access login/signup routes
  if (isAuthenticated && ["/login", "/register"].includes(path)) {
    console.log("Authenticated - Redirecting to /");
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:path*", "/login", "/register", "/", "/create-post"],
};
