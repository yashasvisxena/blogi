"use client";

import { PostForm } from "@/components/blog/PostForm";

export default function CreatePostPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <PostForm />
      </div>
    </main>
  );
}
