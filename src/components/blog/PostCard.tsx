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

  return (
    <Card className="w-full">
      <CardHeader>
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
      <CardContent>
        <p className="line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
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
