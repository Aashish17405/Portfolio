import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import BackgroundEffect from "@/components/background-effect";
import { Analytics } from "@vercel/analytics/next";
import CustomCursor from "@/components/custom-cursor";
import { CursorProvider } from "@/context/cursor-context";
import Chatbot from "@/components/chatbot";

// Preload fonts to ensure they're available
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aashish Jaini",
  description:
    "Portfolio of Aashish Jaini, a passionate full-stack developer skilled in MERN, Next.js, TypeScript, and more.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to improve font loading performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CursorProvider>
            <BackgroundEffect />
            <Analytics />
            {children}
            <CustomCursor />
            <Chatbot />
            <Toaster />
          </CursorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
