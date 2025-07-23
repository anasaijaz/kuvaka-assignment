"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  User,
  LogOut,
  Sun,
  Moon,
  Menu,
  Github,
  Twitter,
  Mail,
} from "lucide-react";

export function PublicLayout({ children }) {
  const { user, isAuthenticated, theme, setTheme } = useAppStore();
  const { logout } = useAuth();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  K
                </span>
              </div>
              <span className="font-bold text-lg hidden sm:inline-block">
                Kuvaka
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Profile
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* User Actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="hidden sm:flex items-center space-x-2">
                    <Badge variant="secondary" className="px-2 py-1">
                      {user?.firstName}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">
                    K
                  </span>
                </div>
                <span className="font-bold">Kuvaka Assignment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern web application built with Next.js, Tailwind CSS, and
                Material 3 design system.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Profile
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="space-y-3">
              <h4 className="font-semibold">Built With</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary" className="text-xs">
                  Next.js
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  React
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Tailwind
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Zustand
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  SWR
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Zod
                </Badge>
              </div>
            </div>

            {/* Social/Contact */}
            <div className="space-y-3">
              <h4 className="font-semibold">Connect</h4>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Kuvaka Assignment. Built with ❤️ for demonstration
              purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
