"use client";

import type React from "react";
import PortfolioComponent from "./ui/project-component";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/portfolio-data";

export default function ProjectsSection() {
  const router = useRouter();

  return (
    <section id="projects" className="relative bg-black">
      <div className="section-content">
        <h2 className="section-title pt-8">Stuff I Built</h2>
        <div className="">
          {featuredProjects.map((project, index) => (
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
