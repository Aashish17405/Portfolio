"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";

export default function CursorFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    if (isMobile) return;

    // Show cursor only after mouse has moved
    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Hide cursor when mouse leaves the window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Track mouse position with high accuracy
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Handle cursor state changes for interactive elements
    const handleLinkHover = () => {
      setCursorVariant("link");
    };

    const handleButtonHover = () => {
      setCursorVariant("button");
    };

    const handleDefaultCursor = () => {
      setCursorVariant("default");
    };

    // Handle mouse click animation
    const handleMouseDown = () => {
      setCursorVariant("click");
    };

    const handleMouseUp = () => {
      setCursorVariant(
        document.querySelectorAll(":hover")[1]?.tagName === "A"
          ? "link"
          : document.querySelectorAll(":hover")[1]?.tagName === "BUTTON"
          ? "button"
          : "default"
      );
    };

    // Add all event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Add hover effects for interactive elements
    const links = document.querySelectorAll(
      "a, button, [role=button], input, textarea, select, [tabindex='0']"
    );
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover);
      link.addEventListener("mouseleave", handleDefaultCursor);
    });

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", handleButtonHover);
      button.addEventListener("mouseleave", handleDefaultCursor);
    });

    // Clean up all event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHover);
        link.removeEventListener("mouseleave", handleDefaultCursor);
      });

      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", handleButtonHover);
        button.removeEventListener("mouseleave", handleDefaultCursor);
      });
    };
  }, [isMobile]);

  // Cursor variants for different states
  const variants = {
    default: {
      height: 32,
      width: 32,
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      border: "2px solid rgb(168, 85, 247)",
      backgroundColor: "transparent",
    },
    link: {
      height: 48,
      width: 48,
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      border: "2px solid rgb(168, 85, 247)",
      backgroundColor: "rgba(168, 85, 247, 0.1)",
    },
    button: {
      height: 40,
      width: 40,
      x: mousePosition.x - 20,
      y: mousePosition.y - 20,
      border: "2px solid rgb(168, 85, 247)",
      backgroundColor: "rgba(168, 85, 247, 0.2)",
    },
    click: {
      height: 24,
      width: 24,
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
      border: "2px solid rgb(168, 85, 247)",
      backgroundColor: "rgba(168, 85, 247, 0.4)",
    },
  };

  // Dot variants for different states
  const dotVariants = {
    default: {
      height: 8,
      width: 8,
      x: mousePosition.x - 4,
      y: mousePosition.y - 4,
      backgroundColor: "white",
    },
    link: {
      height: 10,
      width: 10,
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      backgroundColor: "rgb(168, 85, 247)",
    },
    button: {
      height: 10,
      width: 10,
      x: mousePosition.x - 5,
      y: mousePosition.y - 5,
      backgroundColor: "rgb(168, 85, 247)",
    },
    click: {
      height: 6,
      width: 6,
      x: mousePosition.x - 3,
      y: mousePosition.y - 3,
      backgroundColor: "white",
    },
  };

  if (isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference"
            variants={variants}
            animate={cursorVariant}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              mass: 0.5,
            }}
          />
          <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference"
            variants={dotVariants}
            animate={cursorVariant}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 500,
              mass: 0.1,
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
