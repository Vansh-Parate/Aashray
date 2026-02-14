import type { Metadata } from "next";
import { Inter, Outfit, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListingProvider } from "@/contexts/ListingContext";
import { NotificationProviderWrapper } from "@/components/providers/NotificationProviderWrapper";
import { NavbarWithMain } from "@/components/layout/NavbarWithMain";

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

export const metadata: Metadata = {
  title: "AASHRAY - Student Housing Marketplace",
  description: "Find verified housing. Perfect roommates. Peace of mind. The premium marketplace for student living.",
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
            </NotificationProviderWrapper>
          </ListingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

