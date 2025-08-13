"use client";

import type React from "react";
import PortfolioComponent from "./ui/project-component";
import Router from "next/navigation";
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
  github?: string;
}

export default function ProjectsSection() {
  const router = Router.useRouter();

  const projects: Project[] = [
    {
      title: "WealthWise: AI-Powered Financial Planning & Investment Guide",
      projectHeading: "WealthWise",
      description:
        "AI-powered financial tool for personalized investment recommendations and financial literacy.",
      imageUrl: "https://via.placeholder.com/300",
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
      github:
        "https://github.com/Abhiyantrana-Navonmesakah/Wealth-wise-frontend",
      theme: "#1447e6",
    },
    {
      title: "Vercel Clone: Cloud Deployment Platform with CI/CD Magic",
      projectHeading: "Vercel Clone",
      description:
        "A simplified clone of Vercel's deployment platform with CI/CD capabilities.",
      imageUrl: "https://via.placeholder.com/300",
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
      projectUrl: "https://placeholder-vercel-clone.com",
      github: "https://github.com/Aashish17405/Vercel-Clone",
      theme: "#e60076",
    },
    {
      title: "SiteEase: Accessibility-First Chrome Extension for Inclusive Browsing",
      projectHeading: "SiteEase",
      description:
        "Chrome extension to assist people with color blindness and dyslexia.",
      imageUrl: "https://via.placeholder.com/300",
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
      projectUrl:
        "https://chromewebstore.google.com/detail/site-ease/hhfjlgpooppjdgbnlemkpkjkddfbfpfj",
      github: "https://github.com/Aashish17405/SiteEase",
      theme: "#009689",
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
