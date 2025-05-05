import axios from "axios";
import setupInterceptors from "./axiosInterceptor";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const open = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});

const close = axios.create({
  baseURL: "http://localhost:3000/api/",
  withCredentials: true,
});
setupInterceptors(close);

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface GetPostsResponse {
  posts: Post[];
  total: number;
}

export const usePosts = () => {
  const queryClient = new QueryClient();
  const useGetPosts = ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    userId,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    userId?: string;
  }) => {
    return useQuery<GetPostsResponse>({
      queryKey: ["posts", { page, limit, search, sortBy, sortOrder, userId }],
      queryFn: async () => {
        try {
          const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            search,
            sortBy,
            sortOrder,
          });

          if (userId) {
            params.append("userId", userId);
          }

          const { data } = await open.get(`blogs?${params.toString()}`);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
    });
  };

  const useGetPost = (id: string) => {
    return useQuery<Post>({
      queryKey: [`post${id}`, id],
      queryFn: async () => {
        try {
          const { data } = await open.get(`blog/${id}`);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
    });
  };

  const useDeletePost = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        try {
          const { data } = await close.delete(`blog/${id}`);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete post");
      },
    });
  };

  const useUpdatePost = () => {
    return useMutation({
      mutationFn: async ({
        id,
        postData,
      }: {
        id: string;
        postData: Partial<Post>;
      }) => {
        try {
          const { data } = await close.put(`blog/${id}`, postData);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post updated successfully");
      },
      onError: () => {
        toast.error("Failed to update post");
      },
    });
  };

  const useCreatePost = () => {
    return useMutation({
      mutationFn: async (postData: {
        title: string;
        content: string;
        authorId: string;
      }) => {
        try {
          const { data } = await close.post(`blog/`, postData);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Post created successfully");
      },
      onError: () => {
        toast.error("Failed to create post");
      },
    });
  };

  const useUpload = () => {
    return useMutation({
      mutationFn: async (file: File) => {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const { data } = await close.post(`upload/`, formData);
          console.log("Response data:", data);
          return data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["posts"] });
        toast.success("Image uploaded successfully");
      },
      onError: () => {
        toast.error("Failed to upload image");
      },
    });
  };

  return {
    useGetPosts,
    useGetPost,
    useDeletePost,
    useUpdatePost,
    useCreatePost,
    useUpload,
  };
};
