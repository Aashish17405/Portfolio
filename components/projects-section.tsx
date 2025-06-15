"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Info,
  Laptop,
  Code,
  BookOpen,
  Shield,
  Eye,
  LightbulbIcon,
  CheckCircle,
  UploadCloud,
} from "lucide-react";
import { Coda } from "next/font/google";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  live?: string;
  icon: React.ReactNode;
  bullets: string[];
}

export default function ProjectsSection() {
  const [activeProject, setActiveProject] = useState(0);

  const projects: Project[] = [
    {
      title: "WealthWise",
      description:
        "AI-powered financial tool for personalized investment recommendations and financial literacy.",
      technologies: [
        "React",
        "MongoDB",
        "Node.js",
        "Express.js",
        "Tailwind CSS",
        "CrewAI",
      ],
      github:
        "https://github.com/Abhiyantrana-Navonmesakah/Wealth-wise-frontend",
      live: "https://wealthwisee.live/",
      icon: <Laptop className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Developed an AI-powered tool utilizing custom algorithms and AI Agents for personalized stock, mutual fund, and fixed deposit recommendations.",
        "Designed a RAG-based chatbot providing users with real-time financial insights and learning modules, including video tutorials to enhance financial literacy.",
        "Built an expense tracker to help users optimize savings and reduce unnecessary expenditures.",
        "Enhanced usability with a responsive interface across devices.",
      ],
    },
    {
      title: "Vercel Clone",
      description:
        "This project is a clone of Vercel's deployment platform, providing a simplified but functional version of Vercel's core features. It allows users to upload projects, build them, and deploy them to the web with automatic CI/CD capabilities.",
      technologies: [
        "AWS S3",
        "Redis",
        "Typescript",
        "Express.js",
        "React (Vite)",
        "Tailwind CSS",
      ],
      github: "https://github.com/Aashish17405/Vercel-Clone",
      icon: <UploadCloud className="h-10 w-10 text-blue-400" />,
      bullets: [
        " Developed a Vercel-like deployment platform with a user-friendly UI for seamless project uploads via Git repos.",
        "Designed a deployment pipeline where projects are stored in AWS S3, built using dynamic environment detection, and served via cloud storage.",
        "Implemented automatic CI/CD with Redis-backed queues for real-time build tracking and deployment updates.",
      ],
    },
    {
      title: "SiteEase",
      description:
        "Chrome extension to assist people with color blindness and dyslexia, ensuring seamless accessibility across any website.",
      technologies: ["HTML", "CSS", "JavaScript", "Tailwind CSS"],
      github: "https://github.com/Aashish17405/SiteEase",
      live: "https://chromewebstore.google.com/detail/site-ease/hhfjlgpooppjdgbnlemkpkjkddfbfpfj",
      icon: <Eye className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Built a Chrome extension to assist people with color blindness and dyslexia, ensuring seamless accessibility across any website.",
        "Designed an accessible UI with colorblind-friendly toggle controls that provide visual feedback appropriate for each impairment type.",
        "Added dyslexia-friendly features, including special fonts, better spacing, and improved contrast.",
        "Used Chrome Extension Storage API to save preferences and auto-apply accessibility settings on browser reopen.",
      ],
    },
    {
      title: "CodeVerse Academy",
      description:
        "A Next.js platform for an educational institute showcasing courses, handling demo session bookings with QR ticketing, and providing admin management.",
      technologies: [
        "Next.js",
        "TypeScript",
        "Prisma",
        "PostgreSQL",
        "AWS",
        "CI/CD",
      ],
      github: "https://github.com/Aashish17405/codeverse-academy",
      live: "https://codeverse.dev-aashish.tech/", 
      icon: <Code className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Implemented QR-based ticketing system for demo sessions with email confirmations",
        "Developed admin panel with QR scanning functionality to track attendance status",
        "Deployed on AWS with automated CI/CD pipeline using GitHub Actions",
        "Designed responsive UI with course showcase and booking functionality",
        "Built with full-stack TypeScript using Prisma ORM for database operations",
      ],
    },
    {
      title: "Blockchain-Based Secure Microgrid",
      description:
        "A secure microgrid system using blockchain technology for data integrity and security.",
      technologies: [
        "React (Vite)",
        "Flask",
        "MongoDB",
        "CSS",
        "Solidity",
        "Geth",
        "Twilio",
      ],
      github:
        "https://github.com/Aashish17405/BlockChain_based_Secured_Microgrid",
      icon: <Shield className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Developed a user-friendly website for seamless access to microgrid elements.",
        "Integrated robust blockchain infrastructure for secure data storage.",
        "Implemented an advanced simulator for dynamic microgrid setup analysis.",
        "Developed secure communication protocols, access control mechanisms, and logging systems to enhance cybersecurity.",
      ],
    },
    {
      title: "NaamOji",
      description:
        "NaamOji is a fun and interactive tool that generates unique emoji-based representations of names.",
      technologies: [
        "React (Vite)",
        "MongoDB",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
      ],
      github: "https://github.com/Aashish17405/NaamOji",
      live: "https://naamoji.dev-aashish.tech/", // Optional
      icon: <LightbulbIcon className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Developed a unique and funny name generation tool for creative use.",
        "Designed and implemented a fully responsive interface, ensuring compatibility across devices and delivering a seamless user experience on desktop, tablet, and mobile.",
        "If a naamOji isn't available for a name, users can request a custom one. The generated naamOji can be copied easily with a single click!",
      ],
    },
    {
      title: "ReadRite",
      description:
        "ReadRite is a comprehensive library management application designed to streamline the process of managing library operations.",
      technologies: [
        "React (Vite)",
        "MongoDB",
        "Tailwind CSS",
        "Node.js",
        "Express.js",
      ],
      github: "https://github.com/Aashish17405/ReadRite",
      live: "https://readrite.dev-aashish.tech/", // Optional
      icon: <Code className="h-10 w-10 text-blue-400" />,
      bullets: [
        "Developed a responsive tool enabling effortless book management, advanced search capabilities, and streamlined library inventory control.",
        "Implemented features for precise record-keeping of book allocations and returns, along with restricted access for authorized personnel, ensuring data security.",
        "Enhanced usability with a responsive interface across devices and integrated real-time toast notifications for instant feedback on user actions.",
      ],
    },
    {
      title: "EduCube Navigator",
      description:
        "A role-based e-learning platform where instructors create courses with multimedia content and students enroll to study, track progress, and access resources.",
      technologies: [
        "React (Vite)",
        "Express.js",
        "Node.js",
        "MongoDB",
        "JWT Auth",
        "Tailwind CSS",
      ],
      github: "https://github.com/Aashish17405/educube-navigator", // Update with your repo
      live: "https://educube-navigator.dev-aashish.tech/", // Optional – replace if deployed
      icon: <BookOpen className="h-10 w-10 text-blue-400" />, // More thematic than <Code />
      bullets: [
        "Designed distinct dashboards for students (progress tracking) and instructors (course management)",
        "Enabled instructors to create courses with modules, PDFs, videos, and external links",
        "Implemented JWT authentication for secure role-based access control",
        "Built a responsive UI with dynamic statistics for course completion and engagement analytics",
        "Used MongoDB for flexible data modeling of courses, enrollments, and user profiles",
      ],
    },
    {
      title: "Todo99x",
      description:
        "A full-stack MERN task manager with real-time CRUD operations, task categorization, and responsive design.",
      technologies: [
        "React (Vite)",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Tailwind CSS",
      ],
      github: "https://github.com/Aashish17405/todo99x",
      live: "https://todo99x.dev-aashish.tech/",
      icon: <CheckCircle className="h-10 w-10 text-blue-400" />, // More thematic for a todo app
      bullets: [
        "Implemented CRUD operations with MongoDB for seamless task management (create, complete, update, delete).",
        "Designed a responsive UI with Tailwind CSS, optimizing for both mobile and desktop users.",
        "Added task categorization (active/completed) for better productivity tracking.",
        "Used Express.js for RESTful API endpoints and OAuth for secure user authentication.",
      ],
    },
    // Add more projects here following the same structure
    // {
    //   title: "Project Name",
    //   description: "Short description of the project",
    //   technologies: ["Tech1", "Tech2", "Tech3"],
    //   github: "https://github.com/yourusername/project",
    //   live: "https://project-demo.com", // Optional
    //   icon: <Code className="h-10 w-10 text-blue-400" />,
    //   bullets: [
    //     "Key accomplishment or feature 1",
    //     "Key accomplishment or feature 2",
    //     "Key accomplishment or feature 3",
    //   ],
    // },
  ];

  // Navigation functions
  const nextProject = () => {
    setActiveProject((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
  };

  // Get the current project
  const currentProject = projects[activeProject];

  return (
    <section id="projects" className="relative py-16 bg-gray-950">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title text-gradient mb-12"
        >
          My Projects
        </motion.h2>

        {/* Fixed-width container for the projects carousel */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Fixed position navigation buttons in fixed containers */}
          <div className="fixed-nav-left">
            <Button
              variant="outline"
              size="icon"
              onClick={prevProject}
              className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-800/80 border-gray-700 hover:bg-blue-500/20 hover:border-blue-500 shadow-lg"
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          <div className="fixed-nav-right">
            <Button
              variant="outline"
              size="icon"
              onClick={nextProject}
              className="rounded-full w-8 h-8 md:w-10 md:h-10 bg-gray-800/80 border-gray-700 hover:bg-blue-500/20 hover:border-blue-500 shadow-lg"
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>

          {/* Add CSS for fixed navigation positioning */}
          <style jsx>{`
            .fixed-nav-left,
            .fixed-nav-right {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              z-index: 20;
            }
            .fixed-nav-left {
              left: 0;
              transform: translate(-50px, -50%);
            }
            .fixed-nav-right {
              right: 0;
              transform: translate(50px, -50%);
            }
            @media (max-width: 768px) {
              .fixed-nav-left {
                transform: translate(-6px, -50%);
              }
              .fixed-nav-right {
                transform: translate(6px, -50%);
              }
            }
          `}</style>

          {/* Project display with auto height */}
          <div className="project-carousel-container relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <Card className="bg-gray-800/50 border-gray-700 shadow-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
                    {/* Project sidebar with auto height */}
                    <div className="md:col-span-1 p-6 flex flex-col items-center justify-center bg-gray-800/50 border-r border-gray-700">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                        {currentProject.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-center">
                        {currentProject.title}
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {currentProject.technologies.map((tech, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {currentProject.github && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 hover:border-blue-500 hover:bg-blue-500/10"
                            onClick={() =>
                              window.open(currentProject.github, "_blank")
                            }
                          >
                            <Github className="mr-2 h-4 w-4" /> GitHub
                          </Button>
                        )}
                        {currentProject.live && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() =>
                              window.open(currentProject.live, "_blank")
                            }
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Demo
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Project details with auto-height */}
                    <div className="md:col-span-2 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">Project Details</h3>
                      </div>

                      {/* Content with no fixed height */}
                      <div>
                        <ul className="space-y-2 list-disc pl-5">
                          {currentProject.bullets.map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Project navigation dots */}
          <div className="flex justify-center mt-8">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                  index === activeProject ? "bg-blue-500" : "bg-gray-700"
                }`}
                onClick={() => {
                  setActiveProject(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
