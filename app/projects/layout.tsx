import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-config";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects by Aashish Jaini across AI, full-stack web apps, cloud deployment, and developer tooling.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Aashish Jaini",
    description:
      "Explore Aashish Jaini's projects in AI engineering, web development, and cloud systems.",
    url: `${siteUrl}/projects`,
    type: "website",
    siteName: "Aashish Jaini Portfolio",
    images: [
      {
        url: "/profile.jpg",
        width: 1200,
        height: 630,
        alt: "Projects by Aashish Jaini",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Aashish Jaini",
    description:
      "Explore Aashish Jaini's projects in AI engineering, web development, and cloud systems.",
    images: ["/profile.jpg"],
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
