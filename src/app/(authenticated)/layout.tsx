"use client";

import { AuthProvider } from "@/providers/AuthProvider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
