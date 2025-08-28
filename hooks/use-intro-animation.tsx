import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to determine if the intro animation should be shown
 * Shows animation ONLY for:
 * 1. Page refresh on '/' route
 * 2. Direct navigation to '/' route (typing URL, bookmark, etc.)
 * Does NOT show for internal navigation back from other pages
 */
export const useIntroAnimation = () => {
  const [showIntro, setShowIntro] = useState(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent double execution
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Check if user is coming back from internal navigation
    const hasInternalNavigation = localStorage.getItem(
      "portfolio-internal-nav"
    );

    if (hasInternalNavigation) {
      // User navigated back from another page - don't show intro
      setShowIntro(false);
      localStorage.removeItem("portfolio-internal-nav");
      return;
    }

    // Check navigation type
    const navigationEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    const navigationType =
      navigationEntries.length > 0 ? navigationEntries[0].type : "navigate";

    // Show intro for both refresh and direct navigation
    if (navigationType === "reload" || navigationType === "navigate") {
      setShowIntro(true);
    }
  }, []);

  const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowIntro(false);
    }, 500);
  };

  return {
    showIntro,
    handleAnimationComplete,
  };
};

/**
 * Hook to mark that the user is navigating internally within the site
 * Use this on pages other than the home page
 */
export const useMarkInternalNavigation = () => {
  useEffect(() => {
    // Mark that user has navigated internally within the site
    localStorage.setItem("portfolio-internal-nav", "true");
  }, []);
};

/**
 * Hook to mark internal navigation when navigating to home page
 * Use this in navigation components when linking to home
 */
export const markInternalNavigationToHome = () => {
  localStorage.setItem("portfolio-internal-nav", "true");
};
