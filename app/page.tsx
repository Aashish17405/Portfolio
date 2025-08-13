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
import PortfolioComponent from "@/components/ui/project-component";

export default function Home() {

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <AnimatePresence mode="wait">
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
            </Suspense>
          </motion.div>
      </AnimatePresence>
    </main>
  );
}
