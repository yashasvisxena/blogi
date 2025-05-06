"use client";

import { PostForm } from "@/components/blog/PostForm";
import { useAuthStore } from "@/store/authStore";
import { usePosts } from "@/services/postService";
import { redirect } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { useGetPost } = usePosts();
  const { id } = await params;
  const { data: post, isLoading } = useGetPost(id);

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!post || post.author.id !== user?.id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <PostForm initialData={post} />
        </div>
      </main>
    </div>
  );
}
