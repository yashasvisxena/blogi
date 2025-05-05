"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { usePosts } from "@/services/postService";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    cover: string;
    authorId: string;
    author: {
      id: string;
      username: string;
    };
    createdAt: string;
    updatedAt: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { useDeletePost } = usePosts();
  const { mutate: deletePost } = useDeletePost();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
    }
  };

  // Utility to trim content
  const trimContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  return (
    <Card className="w-full h-[420px] flex flex-col shadow-lg">
      {/* Cover Image or Fallback */}
      {post.cover && post.cover === "null" ? (
        <div className="h-40 w-full flex items-center justify-center bg-gray-200 rounded-t-md text-gray-500 text-3xl font-bold">
          No Image
        </div>
      ) : (
        <div className="h-40 w-full overflow-hidden rounded-t-md">
          <img
            src={post.cover}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <CardTitle className="text-xl">
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          By {post.author.username} • Created{" "}
          {format(new Date(post.createdAt), "MMM d, yyyy")}
          {post.updatedAt !== post.createdAt && (
            <span>
              {" "}
              • Updated {format(new Date(post.updatedAt), "MMM d, yyyy")}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-base">{trimContent(post.content, 120)}</p>
      </CardContent>
      <CardFooter className="flex justify-between mt-auto">
        <Link href={`/posts/${post.id}`}>
          <Button variant="ghost">Read More</Button>
        </Link>
        {isAuthenticated && user?.id === post.authorId && (
          <div className="space-x-2">
            <Link href={`/posts/${post.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
