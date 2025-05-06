import axios from "axios";
import setupInterceptors from "./axiosInterceptor";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const open = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const close = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
setupInterceptors(close);

export const useAuth = () => {
  const router = useRouter();
  const useLogin = () => {
    return useMutation({
      mutationFn: async (data: { username: string; password: string }) => {
        try {
          const response = await open.post("auth/login/", data);
          console.log("Response data:", response.data);
          return response.data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("Login success");
        router.push("/");
      },
      onError: () => {
        toast.error("Login failed");
      },
    });
  };

  const useRegister = () => {
    return useMutation({
      mutationFn: async (data: { username: string; password: string }) => {
        try {
          const response = await open.post("auth/register/", data);
          console.log("Response data:", response.data);
          return response.data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("Register success");
        router.push("/login");
      },
      onError: () => {
        toast.error("Register failed");
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        try {
          const response = await open.post("auth/logout/");
          console.log("Response data:", response.data);
          return response.data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("Logout success");
      },
      onError: () => {
        toast.error("Logout failed");
      },
    });
  };

  const useUser = (options?: any) => {
    return useQuery({
      queryKey: ["user"],
      queryFn: async () => {
        try {
          const response = await close.get("auth/me/");
          console.log("Response data:", response.data);
          return response.data;
        } catch (error: any) {
          console.error("Error response data:", error.response?.data);
          throw error;
        }
      },
      ...options,
    });
  };

  return { useLogin, useRegister, useLogout, useUser };
};
