import { cookies } from "next/headers";

export async function setRefreshTokenCookie(token: string) {
  (await cookies()).set({
    name: "refreshToken",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getRefreshTokenFromCookie() {
  return (await cookies()).get("refreshToken")?.value;
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete("refreshToken");
}
