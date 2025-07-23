"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function AuthLayout({ children }) {
  const { isAuthenticated, loading } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If already authenticated, redirect to home or intended destination
    if (!loading && isAuthenticated) {
      const redirectTo =
        typeof window !== "undefined"
          ? sessionStorage.getItem("redirectAfterLogin") || "/"
          : "/";

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("redirectAfterLogin");
      }

      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router]);

  // Don't render auth pages if already authenticated
  if (isAuthenticated) {
    return null;
  }

  // Render auth content with centered layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="bg-primary rounded-full w-1 h-1 mx-auto my-4"
            ></div>
          ))}
        </div>
      </div>

      {/* Auth Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 Kuvaka Assignment. Built with Next.js & Material 3.
        </p>
      </div>
    </div>
  );
}
