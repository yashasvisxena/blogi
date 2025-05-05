import { verifyRefreshToken, signAccessToken } from "@/lib/auth";
import { getRefreshTokenFromCookie } from "@/lib/cookies";
import { NextResponse } from "next/server";

export async function POST() {
  const refreshToken = await getRefreshTokenFromCookie();

  if (!refreshToken)
    return NextResponse.json({ error: "No token" }, { status: 401 });

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded !== "object") {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }

  const newAccessToken = signAccessToken({
    userId: decoded.userId,
    username: decoded.username,
  });

  return NextResponse.json({ accessToken: newAccessToken });
}
