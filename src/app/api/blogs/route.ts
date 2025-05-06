import { prisma } from "@/lib/prisma"; // your Prisma client
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  ) as Prisma.SortOrder;

  const userId = searchParams.get("userId"); // optional — filters to user's posts

  const where: Prisma.PostWhereInput = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
      ],
    }),
    ...(userId && { authorId: userId }),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput =
    sortBy === "author.username"
      ? { author: { username: sortOrder } }
      : { [sortBy]: sortOrder };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),
    prisma.post.count(),
  ]);

  return NextResponse.json({
    posts,
    total,
  });
}
