"use client";

import { format } from "date-fns";
import { usePosts } from "@/services/postService";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const { useGetPost } = usePosts();
  const { id } = useParams();
  const { data: post, isLoading } = useGetPost(id as string);
  const { isAuthenticated, user } = useAuthStore();

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">Post not found</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              By {post.author.username} • Created{" "}
              {format(new Date(post.createdAt), "MMM d, yyyy")}
              {post.updatedAt !== post.createdAt && (
                <span>
                  • Updated {format(new Date(post.updatedAt), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Link href="/">
            <Button variant="outline">Back to Posts</Button>
          </Link>
          {isAuthenticated && user?.id === post.author.id && (
            <div className="space-x-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button>Edit Post</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
