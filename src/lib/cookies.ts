import { cookies } from "next/headers";

export async function setRefreshTokenCookie(token: string) {
  (await cookies()).set("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getRefreshTokenFromCookie() {
  return (await cookies()).get("refreshToken")?.value;
}

export async function clearRefreshTokenCookie() {
  (await cookies()).delete("refreshToken");
}
