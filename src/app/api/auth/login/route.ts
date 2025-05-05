import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { setRefreshTokenCookie } from "@/lib/cookies";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const payload = { userId: user.id, username: user.username };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  setRefreshTokenCookie(refreshToken);

  return Response.json({ accessToken });
}
