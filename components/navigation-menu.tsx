"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Code,
  Briefcase,
  Mail,
  Award,
  Home,
} from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface NavigationMenuProps {
  activeSection: string;
  refs: {
    [key: string]: any;
  };
}

export default function NavigationMenu({
  activeSection,
  refs,
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const isMobile = useMobile();

  const menuItems = [
    { id: "hero", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "about", label: "About", icon: <User className="w-5 h-5" /> },
    { id: "skills", label: "Skills", icon: <Code className="w-5 h-5" /> },
    { id: "projects", label: "Projects", icon: <Award className="w-5 h-5" /> },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="w-5 h-5" />,
    },
    { id: "contact", label: "Contact", icon: <Mail className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // Always show navbar at the top or bottom of the page
      if (
        currentScrollY < 100 ||
        window.innerHeight + currentScrollY >= document.body.offsetHeight - 100
      ) {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    if (refs[id]) {
      refs[id].scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className={`fixed top-4 right-4 z-40 p-2 rounded-full ${
          isScrolled ? "bg-gray-900/80 backdrop-blur-md" : "bg-transparent"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -20,
        }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-purple-400" />
        ) : (
          <Menu className="w-6 h-6 text-purple-400" />
        )}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.nav
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`flex items-center gap-3 px-6 py-3 rounded-full text-lg font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                  }`}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  {item.label}
                </motion.button>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation */}
      {!isMobile && (
        <motion.nav
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-full flex items-center gap-1 transition-all ${
            isScrolled
              ? "bg-gray-900/80 backdrop-blur-md shadow-lg shadow-purple-500/10"
              : "bg-transparent"
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {activeSection === item.id && (
                <motion.div
                  className="absolute inset-0 bg-purple-600 rounded-full -z-10"
                  layoutId="activeSection"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.button>
          ))}
        </motion.nav>
      )}
    </>
  );
}
