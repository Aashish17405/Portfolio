import type React from "react";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-config";
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

const siteUrl = getSiteUrl();
const seoTitle = "Aashish Jaini | AI, Web, and Cloud Engineer";
const seoDescription =
  "Aashish Jaini portfolio showcasing AI engineering, full-stack web development, backend APIs, cloud deployment, and production-ready projects.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoTitle,
    template: "%s | Aashish Jaini",
  },
  description: seoDescription,
  applicationName: "Aashish Jaini Portfolio",
  creator: "Aashish Jaini",
  publisher: "Aashish Jaini",
  authors: [{ name: "Aashish Jaini", url: siteUrl }],
  keywords: [
    "Aashish",
    "Aashish Jaini",
    "Jaini",
    "Jaini Aashish",
    "Aashish17405",
    "Aashish developer",
    "Aashish Jaini portfolio",
    "AI engineer",
    "full stack developer",
    "cloud engineer",
    "Aashish Jaini projects",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: siteUrl,
    siteName: "Aashish Jaini Portfolio",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Aashish Jaini Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashish Jaini | AI, Web, and Cloud Engineer",
    description: seoDescription,
    images: ["/profile.jpg"],
  },
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
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aashish Jaini Portfolio",
    url: siteUrl,
    inLanguage: "en-US",
    description: seoDescription,
    publisher: {
      "@type": "Person",
      name: "Aashish Jaini",
      url: siteUrl,
    },
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aashish Jaini",
    alternateName: ["Jaini Aashish", "Aashish17405"],
    description: seoDescription,
    url: siteUrl,
    image: `${siteUrl}/profile.jpg`,
    jobTitle: "AI, Web, and Cloud Engineer",
    email: "mailto:aashish17405@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
    mainEntityOfPage: siteUrl,
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "Keshav Memorial Institute Of Technology",
      },
    ],
    knowsAbout: [
      "AI Engineering",
      "LLM Applications",
      "Full-Stack Web Development",
      "Backend APIs",
      "Cloud Deployment",
      "TypeScript",
      "Next.js",
      "React",
      "Node.js",
      "PostgreSQL",
      "AWS",
    ],
    sameAs: [
      "https://github.com/Aashish17405",
      "https://www.linkedin.com/in/jaini-aashish-62a202290/",
      "https://leetcode.com/u/aashish17405/",
    ],
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
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
