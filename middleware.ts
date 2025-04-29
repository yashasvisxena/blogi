import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES: (string | RegExp)[] = [
  "/",
  "/login",
  "/signup",
  "/posts",
  /^\/post\/[^\/]+$/, // matches /post/[id]
];

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.some((route) =>
    typeof route === "string" ? route === pathname : route.test(pathname)
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const token = req.cookies.get("refreshToken")?.value;
  const isAuthenticated = Boolean(token);

  // Redirect logged-in users away from login/signup
  if ((pathname === "/login" || pathname === "/signup") && isAuthenticated) {
    return NextResponse.redirect(new URL("/posts", origin));
  }

  // Allow public routes always
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Block protected routes if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next();
}

// Apply middleware to all relevant routes
export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
