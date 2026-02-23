import Link from "next/link";
import { Home } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-surface pt-20 pb-10 border-t border-text/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 mb-8 sm:mb-12 md:mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 mb-6"
            >
              <img src="/aashray-logo.png" alt="Aashray" className="h-8 w-auto" />
            </Link>
            <p className="text-text/50 max-w-xs mb-6">
              Making student housing search simple, safe, and social. Find your tribe.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text">Product</h4>
            <ul className="space-y-3 text-sm text-text/60">
              <li>
                <Link href="#features" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Trust & Safety
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text">Company</h4>
            <ul className="space-y-3 text-sm text-text/60">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text">Legal</h4>
            <ul className="space-y-3 text-sm text-text/60">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-text/5 text-xs text-text/40">
          <p>© 2026 AASHRAY Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
              𝕏
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              in
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
