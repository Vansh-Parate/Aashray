"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { LandingNavbar } from "@/components/landing/LandingNavbar";

export function NavbarWithMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      {isLanding ? <LandingNavbar /> : <Navbar />}
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}
