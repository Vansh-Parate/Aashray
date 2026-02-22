"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#testimonials", label: "Stories" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-text/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/aashray-logo.png" alt="Aashray" className="h-12 sm:h-14 w-auto py-1" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text/60">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors text-text"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-text text-background px-4 sm:px-5 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors duration-300 shrink-0"
          >
            Get Started
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(320px,100vw-2rem)]">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-text-primary hover:text-primary transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="border-t border-surface-dark pt-4 flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-text-primary hover:text-primary transition-colors py-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="inline-flex justify-center bg-text text-background px-5 py-3 rounded-full text-sm font-medium hover:bg-primary transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
