"use client";

import { format } from "date-fns";
import { usePosts } from "@/services/postService";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function PostDetailPage() {
  const { useGetPost, useDeletePost } = usePosts();
  const { id } = useParams();
  const router = useRouter();
  const { data: post, isLoading } = useGetPost(id as string);
  const { isAuthenticated, user } = useAuthStore();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(id as string, {
        onSuccess: () => {
          router.push("/");
        },
      });
    }
  };

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
            {post.cover && (
              <div className="mb-6 relative aspect-square size-24 w-full overflow-hidden rounded-lg">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
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
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Post"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
