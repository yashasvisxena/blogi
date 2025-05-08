"use client";

import { useEffect } from "react";
import { useAuth } from "@/services/AuthService";
import { useAuthStore } from "@/store/authStore";
import { RefreshCcw } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { useUser } = useAuth();
  const { data: user, isLoading, error } = useUser();
  const { setIsAuthenticated, setUser } = useAuthStore();

  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      setUser(user);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 size-full">
        <RefreshCcw className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
