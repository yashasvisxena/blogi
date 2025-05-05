import { clearRefreshTokenCookie } from "@/lib/cookies";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("refreshToken");
  return Response.json({ message: "Logged out" });
}
