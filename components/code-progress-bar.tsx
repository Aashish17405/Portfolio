"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react"; // You'll need to install lucide-react if not already

export default function CodeProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Define the sections to track
  const sections = [
    { id: "intro", name: "intro" },
    { id: "about", name: "about me" },
    { id: "skills", name: "skills" },
    { id: "projects", name: "projects" },
    { id: "experience", name: "experience" },
    { id: "achievements", name: "achievements" },
    { id: "certifications", name: "certifications" },
    { id: "contact", name: "contact" },
  ];

  // Track which sections are currently visible (up to current position)
  const [visibleSections, setVisibleSections] = useState<string[]>([]);

  useEffect(() => {
    // Initial check for sections
    const checkSections = () => {
      // Find all section elements in the document
      const allSections = document.querySelectorAll("section[id], div[id]");

      // Map our predefined sections to actual DOM elements
      const sectionElements = Array.from(allSections)
        .filter((element) =>
          sections.some((section) => section.id === element.id)
        )
        .map((element) => ({
          id: element.id,
          element: element,
          top: element.getBoundingClientRect().top + window.scrollY,
        }));

      return sectionElements;
    };

    const handleScroll = () => {
      // Calculate scroll progress
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / totalHeight, 1);
      setScrollProgress(progress);

      // Set visibility of progress bar based on scroll position
      const shouldBeVisible = window.scrollY > 100;
      setIsVisible(shouldBeVisible);

      // Hide/show the header when progress bar is visible/hidden
      const header = document.querySelector("header");
      if (header) {
        if (shouldBeVisible) {
          header.classList.add("opacity-0", "pointer-events-none");
          header.classList.remove("opacity-100");
        } else {
          header.classList.add("opacity-100");
          header.classList.remove("opacity-0", "pointer-events-none");
        }
      }

      // Get all valid section elements with their positions
      const sectionElements = checkSections();
      if (sectionElements.length === 0) return;

      // Sort sections by their position on the page
      sectionElements.sort((a, b) => a.top - b.top);

      // Find which section is currently in view
      let currentlyInView = "";
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;

      // Find the last section that's above the current scroll position
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        if (sectionElements[i].top <= scrollPosition) {
          currentlyInView = sectionElements[i].id;
          break;
        }
      }

      if (currentlyInView && currentSection !== currentlyInView) {
        setCurrentSection(currentlyInView);

        // Find the index of the current section in the sorted sections array
        const currentIndex = sectionElements.findIndex(
          (section) => section.id === currentlyInView
        );

        // Get all sections up to and including the current one
        const newVisibleSections = sectionElements
          .slice(0, currentIndex + 1)
          .map((section) => section.id);

        setVisibleSections(newVisibleSections);
      }

      // If we're at the bottom of the page, show all sections
      if (progress > 0.95) {
        const allSectionIds = sectionElements.map((section) => section.id);
        setVisibleSections(allSectionIds);
        setCurrentSection(allSectionIds[allSectionIds.length - 1]);
      }
    };

    // Run once on mount to initialize
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentSection]);

  const progressPercent = Math.round(scrollProgress * 100);

  // Generate the code content based on visible sections
  const generateCodeContent = () => {
    if (visibleSections.length === 0)
      return <span className="animate-pulse">_</span>;

    return (
      <>
        {visibleSections.map((sectionId, index) => {
          const section = sections.find((s) => s.id === sectionId);
          const isCurrentSection = currentSection === sectionId;
          const isLastSection = index === visibleSections.length - 1;

          return (
            <span key={index} className="opacity-90">
              {"{"}
              {section && section.name}
              {/* Add closing brace if: 
                  1. This is not the current section, OR
                  2. This is the last section AND we've reached 100% progress */}
              {(!isCurrentSection ||
                (isLastSection && progressPercent >= 100)) &&
                "}"}
              {/* Add cursor only to the current section and when not at 100% */}
              {isLastSection && isCurrentSection && progressPercent < 100 && (
                <span className="animate-pulse">_</span>
              )}
            </span>
          );
        })}
      </>
    );
  };

  // Function to scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-[60] px-4 py-2 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800"
    >
      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 font-mono text-xs sm:text-sm">
          <div className="flex items-center">
            <span className="text-green-400 mr-1 hidden sm:block">➜</span>
            <span className="ml-2 text-yellow-400 hidden sm:block">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-gray-800 rounded-md h-6 overflow-hidden relative border border-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-150 ease-out"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute top-0 left-0 w-full h-full flex items-center px-2 text-xs">
                <code className="text-gray-900 font-bold whitespace-nowrap">
                  {generateCodeContent()}
                </code>
              </div>
            </div>

            <div className="absolute top-0 right-2 h-full flex items-center">
              <code className="text-gray-400 text-xs">
                <span className="hidden sm:block">
                  {progressPercent < 100
                    ? `${100 - progressPercent}% remaining`
                    : "complete"}
                </span>
              </code>
            </div>
          </div>

          {/* Navigation Dropdown */}
          <div className="relative ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded-md p-1.5 transition-colors"
              aria-label="Navigation menu"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        currentSection === section.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
