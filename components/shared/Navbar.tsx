"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut, LayoutDashboard, Compass, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationBadge } from "@/components/shared/NotificationBadge";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/signup");
  if (isAuthRoute) return null;

  const studentLinks = [
    { href: "/discover", label: "Discover" },
    { href: "/roommate-matcher", label: "Roommate Matcher" },
    { href: "/my-bookings", label: "My Bookings" },
  ];
  const wardenLinks = [
    { href: "/warden/dashboard", label: "Dashboard" },
    { href: "/warden/occupancy", label: "Occupancy" },
    { href: "/warden/rent-tracker", label: "Rent Tracker" },
    { href: "/warden/add-listing", label: "Add Listing" },
  ];
  const links = user?.role === "warden" ? wardenLinks : studentLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-surface-dark">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/aashray-logo.png"
              alt="Aashray"
              width={160}
              height={56}
              className="h-14 w-auto py-1 object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === link.href ? "text-primary" : "text-text-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <NotificationBadge />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={user.role === "student" ? "/discover" : "/warden/dashboard"}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "student" && (
                      <DropdownMenuItem asChild>
                        <Link href="/roommate-matcher/profile">
                          <User className="mr-2 h-4 w-4" />
                          Your Profile
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                {user ? (
                  <>
                    {links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "text-lg font-medium py-2",
                          pathname === link.href ? "text-primary" : "text-text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                    {user.role === "student" && (
                      <Link
                        href="/roommate-matcher/profile"
                        onClick={() => setOpen(false)}
                        className={cn(
                          "text-lg font-medium py-2 flex items-center gap-2",
                          pathname === "/roommate-matcher/profile" ? "text-primary" : "text-text-primary"
                        )}
                      >
                        <User className="h-5 w-5" />
                        Your Profile
                      </Link>
                    )}
                    <NotificationBadge />
                    <Button variant="outline" onClick={() => { signOut(); setOpen(false); }}>
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
