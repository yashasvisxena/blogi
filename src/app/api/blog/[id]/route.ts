import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { verifyAccessToken } from "@/lib/auth";

const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  cover: z.string().nullable(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const user = token && verifyAccessToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let userId;
  try {
    const payload = await verifyAccessToken(token);
    if (payload && typeof payload !== "string" && "userId" in payload) {
      userId = payload.userId;
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: id } });

  if (!post || post.authorId !== userId) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }
  console.log(parsed.data);
  const updated = await prisma.post.update({
    where: { id: id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      cover: parsed.data.cover,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  const user = token && verifyAccessToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  let userId;
  try {
    const payload = await verifyAccessToken(token);
    if (payload && typeof payload !== "string" && "userId" in payload) {
      userId = payload.userId;
    } else {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({ where: { id: id } });

  if (!post || post.authorId !== userId) {
    return NextResponse.json(
      { error: "Unauthorized or not found" },
      { status: 403 }
    );
  }

  await prisma.post.delete({ where: { id: id } });

  return NextResponse.json({ message: "Deleted" });
}
