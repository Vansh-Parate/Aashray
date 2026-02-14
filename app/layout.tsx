import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListingProvider } from "@/contexts/ListingContext";
import { NotificationProviderWrapper } from "@/components/providers/NotificationProviderWrapper";
import { Navbar } from "@/components/shared/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AASHRAY - Safe Student Housing",
  description: "Find verified, safe student housing and manage your property with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans min-h-screen">
        <AuthProvider>
          <ListingProvider>
            <NotificationProviderWrapper>
              <Navbar />
              <main className="pt-16">{children}</main>
            </NotificationProviderWrapper>
          </ListingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

