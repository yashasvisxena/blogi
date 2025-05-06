"use client";

import { PostForm } from "@/components/blog/PostForm";
import { useAuthStore } from "@/store/authStore";
import { usePosts } from "@/services/postService";
import { redirect, useParams } from "next/navigation";

export default function EditPostPage() {
  const { isAuthenticated, user } = useAuthStore();
  const { useGetPost } = usePosts();
  const { id } = useParams();
  console.log(id);
  const { data: post, isLoading } = useGetPost(id as string);

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
