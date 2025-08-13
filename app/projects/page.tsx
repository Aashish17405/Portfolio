"use client";

import type React from "react";
import PortfolioComponent from "@/components/ui/project-component";
import { useRouter } from "next/navigation";
import TextScrambleLoop from "@/components/ui/text-scramble-effect";

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
  const router = useRouter();

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
      title:
        "SiteEase: Accessibility-First Chrome Extension for Inclusive Browsing",
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
    {
      title: "CodeVerse Academy: Platform with QR Ticketing & Admin Tools",
      projectHeading: "CodeVerse Academy",
      description:
        "A Next.js platform for an educational institute with QR ticketing and admin management.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "Implemented QR-based ticketing system for demo sessions with email confirmations.",
        "Developed admin panel with QR scanning functionality to track attendance.",
        "Deployed on AWS with CI/CD pipeline using GitHub Actions.",
        "Responsive UI with course showcase and booking functionality.",
        "Full-stack TypeScript with Prisma ORM.",
      ],
      techstack: {
        NextJS: "nextjs-icon.png",
        TypeScript: "typescript-icon.svg",
        Prisma: "prisma-icon.png",
        PostgreSQL: "postgresql-icon.png",
        AWS: "aws-icon.webp",
        CICD: "cicd-icon.webp",
      },
      projectUrl: "https://codeverse.dev-aashish.tech/",
      github: "https://github.com/Aashish17405/codeverse-academy",
      theme: "#9810fa",
    },
    {
      title: "Blockchain Microgrid: Decentralized, Secure Energy Management",
      projectHeading: "Secure Microgrid",
      description:
        "A secure microgrid system using blockchain technology for data integrity and security.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "Developed a user-friendly website for seamless access to microgrid elements.",
        "Integrated robust blockchain infrastructure for secure data storage.",
        "Implemented an advanced simulator for dynamic microgrid setup analysis.",
        "Developed secure communication protocols, access control mechanisms, and logging systems to enhance cybersecurity.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        Flask: "flask-icon.jpg",
        MongoDB: "mongodb-icon.webp",
        CSS: "css-icon.webp",
        Solidity: "solidity-icon.webp",
        Geth: "geth-icon.png",
        Twilio: "twilio-icon.webp",
      },
      projectUrl: "https://placeholder-microgrid.com",
      github:
        "https://github.com/Aashish17405/BlockChain_based_Secured_Microgrid",
      theme: "#e60076",
    },
    {
      title: "NaamOji: Fun Emoji-Based Name Generator with Personalization",
      projectHeading: "NaamOji",
      description:
        "A fun and interactive tool that generates unique emoji-based representations of names.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "Developed a unique and funny name generation tool for creative use.",
        "Fully responsive interface for desktop, tablet, and mobile.",
        "Allows users to request custom NaamOjis and copy them with a single click.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        MongoDB: "mongodb-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
        NodeJS: "nodejs-icon.png",
        ExpressJS: "express-icon.png",
      },
      projectUrl: "https://naamoji.dev-aashish.tech/",
      github: "https://github.com/Aashish17405/NaamOji",
      theme: "#00bc7d",
    },
    {
      title:
        "ReadRite: Next-Gen Library Management with Smart Search & Inventory Control",
      projectHeading: "ReadRite",
      description:
        "A comprehensive library management application for managing library operations.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "Effortless book management, advanced search capabilities, and streamlined inventory control.",
        "Record-keeping for book allocations and returns with restricted access for authorized personnel.",
        "Responsive design and real-time toast notifications for user actions.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        MongoDB: "mongodb-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
        NodeJS: "nodejs-icon.png",
        ExpressJS: "express-icon.png",
      },
      projectUrl: "https://readrite.dev-aashish.tech/",
      github: "https://github.com/Aashish17405/ReadRite",
      theme: "#e60076",
    },
    {
      title: "EduCube Navigator: Role-Based E-Learning with Progress Tracking",
      projectHeading: "EduCube Navigator",
      description:
        "Role-based e-learning platform for instructors and students with progress tracking.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "Distinct dashboards for students and instructors.",
        "Course creation with modules, PDFs, videos, and links.",
        "JWT authentication for secure access control.",
        "Responsive UI with course completion statistics.",
        "MongoDB for flexible data modeling.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        ExpressJS: "express-icon.png",
        NodeJS: "nodejs-icon.png",
        MongoDB: "mongodb-icon.webp",
        JWT: "jwt-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
      },
      projectUrl: "https://educube-navigator.dev-aashish.tech/",
      github: "https://github.com/Aashish17405/educube-navigator",
      theme: "#1447e6",
    },
    {
      title: "Todo99x: Productivity-Focused Task Manager with Real-Time Sync",
      projectHeading: "Todo99x",
      description:
        "A full-stack MERN task manager with real-time CRUD operations and categorization.",
      imageUrl: "https://via.placeholder.com/300",
      features: [
        "CRUD operations with MongoDB for seamless task management.",
        "Responsive UI with Tailwind CSS for all devices.",
        "Task categorization for productivity tracking.",
        "OAuth authentication for secure access.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        NodeJS: "nodejs-icon.png",
        ExpressJS: "express-icon.png",
        MongoDB: "mongodb-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
      },
      projectUrl: "https://todo99x.dev-aashish.tech/",
      github: "https://github.com/Aashish17405/todo99x",
      theme: "#009689",
    },
  ];
  return (
    <section className="relative py-12 bg-gray-950">
      <div className="section-content">
        <div className="flex items-center justify-between mb-8">
          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ease-in-out ml-16"
            onClick={() => router.back()}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
          <TextScrambleLoop text="Stuff I Built" className="absolute left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold" />
          <div></div> {/* Spacer for center alignment */}
        </div>
        <div className="project-cards">
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
      </div>
    </section>
  );
}
