"use client";

import type React from "react";
import PortfolioComponent from "./ui/project-component";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface Project {
  title: string;
  projectHeading: string;
  description: string;
  imageUrl: string;
  features: string[];
  techstack: { [key: string]: string };
  projectUrl?: string;
  theme: string;
  githubUrl: string;
  gradient_from?: string;
  gradient_to?: string;
  gradient_via?: string;
}

export default function ProjectsSection() {
  const router = useRouter();

  const projects: Project[] = [
    {
      title: "WealthWise: AI-Powered Financial Planning & Investment Guide",
      projectHeading: "WealthWise",
      description:
        "AI-powered financial tool for personalized investment recommendations and financial literacy.",
      imageUrl: "wealthwise.jpg",
      features: [
        "Developed an AI-powered tool utilizing custom algorithms and AI Agents for personalized stock, mutual fund, and fixed deposit recommendations.",
        "Designed a RAG-based chatbot providing users with real-time financial insights and learning modules, including video tutorials to enhance financial literacy.",
        "Built an expense tracker to help users optimize savings and reduce unnecessary expenditures.",
        "Enhanced usability with a responsive interface across devices.",
      ],
      techstack: {
        React: "react-icon.png",
        MongoDB: "mongodb-icon.webp",
        NodeJS: "nodejs-icon.png",
        ExpressJS: "express-icon.png",
        TailwindCSS: "tailwind-icon.svg",
        CrewAI: "crewai-icon.png",
      },
      projectUrl: "https://wealthwisee.live/",
      githubUrl:
        "https://github.com/Abhiyantrana-Navonmesakah/Wealth-wise-frontend",
      theme: "#28418f",
      gradient_from: "#6a5acd", // lighter indigo highlight
      gradient_via: "#28418f", // your base theme indigo
      gradient_to: "#14235c", // deeper navy/blue shadow
    },
    {
      title: "Vercel Clone: Cloud Deployment Platform with CI/CD Magic",
      projectHeading: "Vercel Clone",
      description:
        "A simplified clone of Vercel's deployment platform with CI/CD capabilities.",
      imageUrl: "demo.gif",
      features: [
        "Developed a Vercel-like deployment platform with a user-friendly UI for seamless project uploads via Git repos.",
        "Designed a deployment pipeline where projects are stored in AWS S3, built using dynamic environment detection, and served via cloud storage.",
        "Implemented automatic CI/CD with Redis-backed queues for real-time build tracking and deployment updates.",
      ],
      techstack: {
        AWS: "aws-icon.webp",
        Redis: "redis-icon.png",
        TypeScript: "typescript-icon.svg",
        ExpressJS: "express-icon.png",
        Vite: "vite-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
      },
      projectUrl: "https://github.com/Aashish17405/Vercel-Clone",
      githubUrl: "https://github.com/Aashish17405/Vercel-Clone",
      theme: "#dc2626", // vibrant red base
      gradient_from: "#f87171", // bright red highlight
      gradient_via: "#dc2626", // strong crimson
      gradient_to: "#7f1d1d", // deep wine red
    },
    {
      title:
        "SiteEase: Accessibility-First Chrome Extension for Inclusive Browsing",
      projectHeading: "SiteEase",
      description:
        "Chrome extension to assist people with color blindness and dyslexia.",
      imageUrl: "siteease.jpg",
      features: [
        "Built a Chrome extension to assist people with color blindness and dyslexia, ensuring seamless accessibility across any website.",
        "Designed an accessible UI with colorblind-friendly toggle controls.",
        "Added dyslexia-friendly features like special fonts, better spacing, and improved contrast.",
        "Used Chrome Extension Storage API to save preferences.",
      ],
      techstack: {
        HTML: "html-icon.webp",
        CSS: "css-icon.webp",
        JavaScript: "javascript-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
      },
      projectUrl: "https://siteease.dev-aashish.tech",
      githubUrl: "https://github.com/Aashish17405/SiteEase",
      theme: "#009689",
      gradient_from: "#00c9a7", // brighter teal highlight
      gradient_via: "#009689", // your base theme teal
      gradient_to: "#005b4f", // deep teal/green shadow
    },
  ];
  return (
    <section id="projects" className="relative bg-black">
      <div className="section-content">
        <h2 className="section-title pt-8">Projects</h2>
        <div className="">
          {projects.map((project, index) => (
            <PortfolioComponent
              key={index}
              title={project.title}
              projectHeading={project.projectHeading}
              description={project.description}
              imageUrl={project.imageUrl}
              features={project.features}
              techstack={project.techstack}
              projectUrl={project.projectUrl}
              theme={project.theme}
              gradient_from={project.gradient_from}
              gradient_via={project.gradient_via}
              gradient_to={project.gradient_to}
              githubUrl={project.githubUrl}
            />
          ))}
        </div>
        <div className="flex justify-center pb-8">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            onClick={() => router.push("/projects")}
          >
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}