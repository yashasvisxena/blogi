import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyAccessToken } from "@/lib/auth";

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  cover: z.string().nullable(),
});

export async function POST(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  const user = token && verifyAccessToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let userId;
  try {
    const payload = await verifyAccessToken(token);
    if (payload && typeof payload !== "string" && "userId" in payload) {
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
      title: parsed.data.title,
      content: parsed.data.content,
      cover: parsed.data.cover || "",
      author: {
        connect: {
          id: userId
        }
      }
    }
  });

  return NextResponse.json(post);
}
