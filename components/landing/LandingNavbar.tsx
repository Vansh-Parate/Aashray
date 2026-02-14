import Link from "next/link";
import { Home } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-text/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <img src="/aashray-logo.png" alt="Aashray" className="h-14 w-auto py-1" />
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text/60">
          <a href="#features" className="hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">
            How it Works
          </a>
          <a href="#testimonials" className="hover:text-primary transition-colors">
            Stories
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium hover:text-primary transition-colors text-text"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-text text-background px-5 py-2 rounded-full text-sm font-medium hover:bg-primary transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
