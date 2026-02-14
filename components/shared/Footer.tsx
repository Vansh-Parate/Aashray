import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-surface-dark bg-surface mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/aashray-logo.png"
                alt="Aashray"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-2 text-sm text-text-muted">
              Safe student housing discovery and management.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">For Students</h4>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              <li><Link href="/discover" className="hover:text-primary">Discover</Link></li>
              <li><Link href="/roommate-matcher" className="hover:text-primary">Roommate Matcher</Link></li>
              <li><Link href="/my-bookings" className="hover:text-primary">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">For Wardens</h4>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              <li><Link href="/warden/dashboard" className="hover:text-primary">Dashboard</Link></li>
              <li><Link href="/warden/add-listing" className="hover:text-primary">Add Listing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary">Company</h4>
            <ul className="mt-2 space-y-2 text-sm text-text-muted">
              <li><Link href="/login" className="hover:text-primary">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-primary">Sign up</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-surface-dark pt-8 text-center text-sm text-text-muted">
          © {new Date().getFullYear()} AASHRAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
