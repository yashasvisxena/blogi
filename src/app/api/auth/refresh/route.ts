import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import { getRefreshTokenFromCookie } from "@/lib/cookies";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookie();

  if (!refreshToken) return new Response("No token", { status: 401 });

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded !== "object") {
    return new Response("Invalid refresh token", { status: 401 });
  }

  const newAccessToken = signAccessToken({
    userId: decoded.userId,
    email: decoded.email,
  });

  return Response.json({ accessToken: newAccessToken });
}
