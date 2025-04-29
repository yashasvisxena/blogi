import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";
import { verifyAccessToken } from "@/lib/auth";

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  const user = token && verifyAccessToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let userId;
  try {
    const payload = await verifyJWT(token);
    if (typeof payload !== "string" && "userId" in payload) {
      userId = payload.userId;
    } else {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      authorId: userId,
    },
  });

  return NextResponse.json(post);
}
