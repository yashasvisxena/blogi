"use client";

import { AuthProvider } from "@/providers/AuthProvider";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-0 flex-grow flex-1">{children}</div>
    </AuthProvider>
  );
}
