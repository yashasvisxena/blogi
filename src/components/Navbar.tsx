"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/AuthService";
import { ModeToggle } from "./ui/mode-toggle";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const { useLogout } = useAuth();
  const { mutate: logoutUser } = useLogout();

  const handleLogout = () => {
    logoutUser(undefined, {
      onSuccess: () => {
        logout();
        window.location.reload();
      },
    });
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Blogi
          </Link>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/create-post">
                  <Button variant="outline">Create Post</Button>
                </Link>
                <span className="text-sm">Welcome, {user?.username}</span>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
