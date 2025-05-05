"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { usePosts } from "@/services/postService";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { postSchema, type PostFormData } from "@/lib/validations/auth";
import { useRef, useState } from "react";

interface PostFormProps {
  initialData?: {
    id: string;
    title: string;
    content: string;
    cover: string | null;
  };
}

export function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const { useCreatePost, useUpdatePost } = usePosts();
  const { mutate: createPost, isPending: isCreating } = useCreatePost();
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      cover: initialData?.cover || null,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.cover || null
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: PostFormData) => {
    if (initialData) {
      updatePost(
        { id: initialData.id, postData: data },
        {
          onSuccess: () => {
            router.push("/");
          },
        }
      );
    } else {
      createPost(
        { ...data, authorId: "" },
        {
          onSuccess: () => {
            router.push("/");
          },
        }
      );
    }
  };

  // Handle image upload
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data?.data?.secure_url) {
      setImagePreview(data.data.secure_url);
      form.setValue("cover", data.data.secure_url);
    }
    setUploading(false);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Post" : "Create Post"}</CardTitle>
        <CardDescription>
          {initialData ? "Update your blog post" : "Write a new blog post"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="cover"
              render={() => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                      {uploading && <div>Uploading...</div>}
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="mt-2 max-h-48 rounded"
                        />
                      )}
                    </>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating
                ? initialData
                  ? "Updating..."
                  : "Creating..."
                : initialData
                ? "Update Post"
                : "Create Post"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
