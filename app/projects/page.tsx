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
  githubUrl: string;
  gradient_from: string;
  gradient_via: string;
  gradient_to: string;
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
    {
      title: "CodeVerse Academy: Platform with QR Ticketing & Admin Tools",
      projectHeading: "CodeVerse Academy",
      description:
        "A Next.js platform for an educational institute with QR ticketing and admin management.",
      imageUrl: "codeverse.jpg",
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
      githubUrl: "https://github.com/Aashish17405/codeverse-academy",
      theme: "#0072ff", // vivid blue base
      gradient_from: "#1996ff", // brighter sky blue (less white)
      gradient_via: "#0072ff", // strong mid blue
      gradient_to: "#002f6c", // deep navy blue for contrast
    },
    {
      title: "Blockchain Microgrid: Decentralized, Secure Energy Management",
      projectHeading: "Secure Microgrid",
      description:
        "A secure microgrid system using blockchain technology for data integrity and security.",
      imageUrl: "microgrid.jpg",
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
      projectUrl: "https://github.com/Aashish17405/BlockChain_based_Secured_Microgrid",
      githubUrl:
        "https://github.com/Aashish17405/BlockChain_based_Secured_Microgrid",
      theme: "#e11d48", // rose base
      gradient_from: "#fb7185", // soft rose highlight
      gradient_via: "#e11d48", // deep pink/rose
      gradient_to: "#7f1d4c", // wine/burgundy
    },
    {
      title: "NaamOji: Fun Emoji-Based Name Generator with Personalization",
      projectHeading: "NaamOji",
      description:
        "A fun and interactive tool that generates unique emoji-based representations of names.",
      imageUrl: "naamoji.jpg",
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
      githubUrl: "https://github.com/Aashish17405/NaamOji",
      theme: "#0ea5e9", // deeper sky blue base
      gradient_from: "#38bdf8", // balanced bright sky blue
      gradient_via: "#0ea5e9", // richer mid-tone sky blue
      gradient_to: "#0369a1", // dark blue/cyan for depth
    },
    {
      title: "CAW: Real-Time Weather Dashboard with Forecasts & Smart Caching",
      projectHeading: "CAW",
      description:
        "A modern, feature-rich weather application built with React(Vite) that provides real-time weather information and forecasts with a beautiful, responsive UI.",
      imageUrl: "weather.jpg",
      features: [
        "Real-time weather data and 5-day forecasts with hourly breakdowns, dynamic icons, and condition-based animations.",
        "Search any city, use geolocation for local weather, and save favorite places for quick access via sidebar.",
        "Download full weather reports as PDFs. Smart caching reduces API calls and improves performance.",
        "Mobile-first design with dark mode, smooth transitions, semantic HTML, and ARIA labels for accessibility.",
      ],
      techstack: {
        Vite: "vite-icon.webp",
        MongoDB: "mongodb-icon.webp",
        TailwindCSS: "tailwind-icon.svg",
        NodeJS: "nodejs-icon.png",
        ExpressJS: "express-icon.png",
      },
      projectUrl: "https://weather-app.dev-aashish.tech/",
      githubUrl: "https://github.com/Aashish17405/CAW",
      theme: "#64748b", // deep indigo base (echoes stormy sky)
      gradient_from: "#64748b", // slate gray (clouds and dusk tones)
      gradient_via: "#1e3a8a", // rich indigo (night sky, rain)
      gradient_to: "#0f172a", // dark navy
    },
    {
      title:
        "ReadRite: Next-Gen Library Management with Smart Search & Inventory Control",
      projectHeading: "ReadRite",
      description:
        "A comprehensive library management application for managing library operations.",
      imageUrl: "readrite.jpg",
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
      githubUrl: "https://github.com/Aashish17405/ReadRite",
      theme: "#e11d48", // rich rose base
      gradient_from: "#fb7185", // soft rose highlight
      gradient_via: "#e11d48", // vibrant pink-red
      gradient_to: "#7f1d1d", // dark wine/burgundy
    },
    {
      title: "EduCube Navigator: Role-Based E-Learning with Progress Tracking",
      projectHeading: "EduCube Navigator",
      description:
        "Role-based e-learning platform for instructors and students with progress tracking.",
      imageUrl: "educube.jpg",
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
      githubUrl: "https://github.com/Aashish17405/educube-navigator",
      theme: "#1447e6", // vivid royal blue base
      gradient_from: "#3b82f6", // lighter sky blue highlight
      gradient_via: "#1447e6", // strong royal blue
      gradient_to: "#1e3a8a", // deep navy for contrast
    },
    {
      title: "Todo99x: Productivity-Focused Task Manager with Real-Time Sync",
      projectHeading: "Todo99x",
      description:
        "A full-stack MERN task manager with real-time CRUD operations and categorization.",
      imageUrl: "todo99x.jpg",
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
      githubUrl: "https://github.com/Aashish17405/todo99x",
      theme: "#f8d23aed", // golden yellow base
      gradient_from: "#f8dd54e0", // light yellow highlight
      gradient_via: "#fed327d5", // rich golden yellow
      gradient_to: "#c58f19e1", // deep amber/mustard
    },
  ];

  return (
    <section className="relative pt-6 md:pt-12 bg-gray-950">
      <div className="section-content px-4 sm:px-6 lg:px-8">
        {/* Mobile: Header with back button and centered title */}
        <div className="block sm:hidden mb-8">
          <div className="relative flex items-center justify-center mb-4">
            <button
              className="absolute left-0 flex items-center gap-2 px-3 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ease-in-out"
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
            <TextScrambleLoop
              text="Stuff I Built"
              className="text-white text-2xl font-bold"
            />
          </div>
        </div>

        {/* Desktop: Original layout */}
        <div className="hidden sm:flex items-center justify-between mb-8 md:mb-12">
          <button
            className="flex items-center gap-2 px-4 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ease-in-out ml-8 md:ml-16"
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
          <TextScrambleLoop
            text="Stuff I Built"
            className="text-white text-3xl md:text-4xl font-bold absolute left-1/2 transform -translate-x-1/2"
          />
        </div>
        <div className="space-y-8 md:space-y-12 lg:space-y-16">
          {projects.map((project, index) => (
            <div key={index} className="max-w-7xl mx-auto">
              <PortfolioComponent
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
