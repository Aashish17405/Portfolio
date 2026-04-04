"use client";

import type React from "react";
import PortfolioComponent from "@/components/ui/project-component";
import { useRouter } from "next/navigation";
import TextScrambleLoop from "@/components/ui/text-scramble-effect";
import {
  useMarkInternalNavigation,
  markInternalNavigationToHome,
} from "@/hooks/use-intro-animation";
import { allProjects } from "@/lib/portfolio-data";

export default function ProjectsSection() {
  const router = useRouter();

  // Mark that user has navigated within the site
  useMarkInternalNavigation();

  return (
    <section className="relative pt-6 md:pt-12 bg-gray-950">
      <div className="section-content px-4 sm:px-6 lg:px-8">
        {/* Mobile: Header with back button and centered title */}
        <div className="block sm:hidden mb-8">
          <div className="relative flex items-center justify-center mb-4">
            <button
              className="absolute left-0 flex items-center gap-2 px-3 py-2 text-white bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-all duration-300 ease-in-out"
              onClick={() => {
                markInternalNavigationToHome();
                router.back();
              }}
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
            onClick={() => {
              markInternalNavigationToHome();
              router.back();
            }}
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
          {allProjects.map((project, index) => (
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

        <section
          className="sr-only"
          aria-label="Machine readable project details"
        >
          <h1>Projects by Aashish Jaini</h1>
          <ul>
            {allProjects.map((project) => (
              <li key={project.projectHeading}>
                {project.title} | {project.description} | Features:{" "}
                {project.features.join(" | ")} | Tech:{" "}
                {Object.keys(project.techstack).join(", ")} | URL:{" "}
                {project.projectUrl || project.githubUrl} | GitHub:{" "}
                {project.githubUrl}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
