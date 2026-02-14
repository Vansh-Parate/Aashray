import type { Metadata } from "next";
import { Inter, Outfit, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListingProvider } from "@/contexts/ListingContext";
import { NotificationProviderWrapper } from "@/components/providers/NotificationProviderWrapper";
import { NavbarWithMain } from "@/components/layout/NavbarWithMain";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aashray.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aashray | Verified Student Housing & Safe PG Hostels",
    template: "%s | Aashray",
  },
  description:
    "Find verified, safe student housing and PG hostels. Discover listings with security scores, match with roommates, and manage your stay. Home security and quality accommodation for students.",
  keywords: [
    "student housing",
    "PG hostel",
    "verified listings",
    "home security",
    "student accommodation",
    "safe housing",
    "roommate finder",
    "property management",
    "warden",
    "real estate",
  ],
  authors: [{ name: "Aashray" }],
  creator: "Aashray",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Aashray",
    title: "Aashray - Verified Student Housing & Safe PG Hostels",
    description: "Find verified housing. Perfect roommates. Peace of mind. The premium marketplace for student living.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Aashray - Home security and verified student housing logo" }],
  },
  twitter: {
    card: "summary",
    title: "Aashray - Verified Student Housing",
    description: "Find verified housing. Perfect roommates. Peace of mind.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${outfit.variable} ${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen">
        <AuthProvider>
          <ListingProvider>
            <NotificationProviderWrapper>
              <NavbarWithMain>{children}</NavbarWithMain>
            <Toaster position="top-center" richColors closeButton />
            </NotificationProviderWrapper>
          </ListingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

