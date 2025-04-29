import { clearRefreshTokenCookie } from "@/lib/cookies";

export async function POST() {
  clearRefreshTokenCookie();
  return Response.json({ message: "Logged out" });
}
