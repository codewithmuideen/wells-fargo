import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import PwaProvider from "@/components/PwaProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wells Fargo | Mobile Banking",
  description:
    "Manage your accounts, transfer funds, deposit checks, and pay bills with Wells Fargo Mobile banking.",
  manifest: "/manifest.json",
  applicationName: "Wells Fargo",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Wells Fargo",
  },
  icons: {
    icon: "/favicon_2.png",
    apple: "/favicon_2.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#D71E28",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F5F5] text-[#2D2926]">
        <AuthProvider>
          {children}
          <PwaProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
