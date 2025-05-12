"use client";

import { Suspense, useEffect, useState } from "react";
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

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        ) : (
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
              <ExperienceSection />
              <ContactSection />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
