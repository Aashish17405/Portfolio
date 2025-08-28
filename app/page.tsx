"use client";

import { useState, useEffect } from "react";
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
import IntroScreen from "@/components/intro-screen";
import IntroAnimation from "@/components/intro-screen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Handle the transition from intro to main content
  const handleAnimationComplete = () => {
    // Immediately show main content when intro completes
    setIsLoading(false);
  };

  // Simulate loading for better UX (fallback)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 8000); // Increased timeout to match actual intro duration
    return () => clearTimeout(timer);
  }, [isLoading]);
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 text-white min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.99,
              filter: "blur(1px)",
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 1, 1], // Fast exit
            }}
          >
            <IntroAnimation onAnimationComplete={handleAnimationComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{
              opacity: 0,
              y: -50,
              scale: 1.1,
              filter: "blur(10px) hue-rotate(180deg)",
              rotateX: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px) hue-rotate(0deg)",
              rotateX: 0,
            }}
            transition={{
              duration: 1.5,
              ease: [0.16, 1, 0.3, 1], // Dramatic easing
              delay: 0,
            }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
            className="relative"
          >
            {/* Digital Rain Effect Overlay */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="fixed inset-0 pointer-events-none z-50"
              style={{
                background: `repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 255, 255, 0.03) 2px,
                  rgba(0, 255, 255, 0.03) 4px
                )`,
                animation: "digitalRain 0.1s linear infinite",
              }}
            />

            {/* Matrix Rain Characters */}
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 3, delay: 0.2 }}
              className="fixed inset-0 pointer-events-none z-45 overflow-hidden"
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -100, opacity: 0 }}
                  animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 2,
                    repeat: 2,
                  }}
                  className="absolute text-green-400 font-mono text-xs"
                  style={{
                    left: `${Math.random() * 100}%`,
                    filter: "blur(1px)",
                  }}
                >
                  {Math.random().toString(36).substring(7)}
                </motion.div>
              ))}
            </motion.div>

            {/* Glitch Overlay */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="fixed inset-0 pointer-events-none z-40"
              style={{
                background: `linear-gradient(
                  45deg,
                  transparent 48%,
                  rgba(255, 0, 255, 0.05) 49%,
                  rgba(255, 0, 255, 0.05) 51%,
                  transparent 52%
                )`,
                animation: "glitchOverlay 0.3s ease-in-out infinite",
              }}
            />

            {/* Scan Lines */}
            <motion.div
              initial={{ opacity: 0.8, scaleY: 0 }}
              animate={{ opacity: 0, scaleY: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="fixed inset-0 pointer-events-none z-30"
              style={{
                background: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(0, 255, 255, 0.1) 2px,
                  rgba(0, 255, 255, 0.1) 4px
                )`,
                transformOrigin: "top",
              }}
            />

            {/* Main Content with Staggered Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative z-10"
            >
              <Suspense fallback={<LoadingScreen />}>
                <motion.div
                  initial={{ opacity: 0, x: -100, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Header />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 100, filter: "blur(5px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <CodeProgressBar />
                </motion.div>

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 100,
                    scale: 0.9,
                    filter: "blur(8px)",
                  }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <HeroSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -150, rotateY: -15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <AboutSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 80, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <SkillsSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 200, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <ProjectsSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -60, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 1.1 }}
                >
                  <ExperienceSection />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.7, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, delay: 1.3 }}
                >
                  <ContactSection />
                </motion.div>
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for crazy animations */}
      <style jsx global>{`
        @keyframes digitalRain {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }

        @keyframes glitchOverlay {
          0%,
          100% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-2px);
          }
          20% {
            transform: translateX(2px);
          }
          30% {
            transform: translateX(-1px);
          }
          40% {
            transform: translateX(1px);
          }
          50% {
            transform: translateX(-2px);
          }
          60% {
            transform: translateX(2px);
          }
          70% {
            transform: translateX(-1px);
          }
          80% {
            transform: translateX(1px);
          }
          90% {
            transform: translateX(-2px);
          }
        }

        @keyframes matrixRain {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}</style>
    </main>
  );
}
