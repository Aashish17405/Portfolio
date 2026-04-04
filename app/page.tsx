"use client";

import { Suspense } from "react";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import SkillsSection from "@/components/skills-section";
import ProjectsSection from "@/components/projects-section";
import ExperienceSection from "@/components/experience-section";
import ContactSection from "@/components/contact-section";
import LoadingScreen from "@/components/loading-screen";
import Header from "@/components/header";
import { AnimatePresence, motion } from "framer-motion";
import CodeProgressBar from "@/components/code-progress-bar";
import IntroAnimation from "@/components/intro-screen";
import { useIntroAnimation } from "@/hooks/use-intro-animation";
import { allProjects, portfolioProfile } from "@/lib/portfolio-data";
import { getSiteUrl } from "@/lib/site-config";

export default function Home() {
  const { showIntro, handleAnimationComplete } = useIntroAnimation();
  const siteUrl = getSiteUrl();

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      {showIntro && (
        <IntroAnimation onAnimationComplete={handleAnimationComplete} />
      )}

      <AnimatePresence mode="wait">
        {!showIntro && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Suspense fallback={<LoadingScreen />}>
              <Header />
              <CodeProgressBar />
              <HeroSection />
              <AboutSection />
              <SkillsSection />
              <ProjectsSection />
              {/* <PortfolioComponent 
                  title="WealthWise: Your Personal finance assisstant"
                  projectHeading="WealthWise"
                  description="A personal finance assistant that helps you manage your finances effectively."
                  imageUrl="/projects/wealthwise/image.png"
                  features={[
                    "Real-time expense tracking",
                    "Budget planning and analysis",
                    "Personalized financial insights",
                  ]}
                  techstack={{"Next.js": "nextjs-icon", "TypeScript": "react-icon", "Tailwind CSS": "react-icon"}}
                  projectUrl="https://wealthwise.example.com"
                  theme="purple-500"
                /> */}
              <ExperienceSection />
              <ContactSection />

              <section
                className="sr-only"
                aria-label="Machine readable profile data"
              >
                <h2>{portfolioProfile.name}</h2>
                <p>{portfolioProfile.headline}</p>
                <p>{portfolioProfile.summary}</p>
                <p>Location: {portfolioProfile.location}</p>
                <p>Email: {portfolioProfile.email}</p>
                <p>Phone: {portfolioProfile.phone}</p>
                <p>GitHub: {portfolioProfile.socialLinks.github}</p>
                <p>LinkedIn: {portfolioProfile.socialLinks.linkedin}</p>
                <p>LeetCode: {portfolioProfile.socialLinks.leetcode}</p>
                <p>Machine-readable JSON profile: {siteUrl}/api/profile</p>
                <p>LLMs profile file: {siteUrl}/llms.txt</p>

                <h3>Projects index</h3>
                <ul>
                  {allProjects.map((project) => (
                    <li key={project.projectHeading}>
                      {project.title} | {project.description} | Tech Stack:{" "}
                      {Object.keys(project.techstack).join(", ")} | URL:{" "}
                      {project.projectUrl || project.githubUrl}
                    </li>
                  ))}
                </ul>
              </section>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
