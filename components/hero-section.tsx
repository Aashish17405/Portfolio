"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Linkedin, Download, Mail } from "lucide-react";
import Image from "next/image";
import { SiLeetcode } from "react-icons/si";

export default function HeroSection() {
  return (
    <section
      id="intro"
      className="relative min-h-screen flex items-center pt-20"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="space-y-6">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-blue-500 font-medium mb-2"
                >
                  Hello, I'm
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
                >
                  Aashish Jaini
                </motion.h1>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl md:text-2xl text-gradient font-semibold"
                >
                  Full-Stack Developer & AI Enthusiast
                </motion.h2>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-gray-300 max-w-lg"
              >
                I'm passionate about creating innovative solutions using
                cutting-edge technologies. With expertise in MERN stack,
                Next.js, and AI integration, I build applications that are both
                powerful and user-friendly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                  asChild
                >
                  <a href="/jaini aashish.pdf" download="Aashish Jaini.pdf">
                    <Download className="mr-2 h-4 w-4" /> Download Resume
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-4 pt-2"
              >
                <motion.a
                  href="https://github.com/Aashish17405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Github className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/jaini-aashish-62a202290/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>

                <motion.a
                  href="https://leetcode.com/u/aashish17405/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <SiLeetcode className="h-5 w-5" />
                </motion.a>

                <motion.a
                  href="mailto:aashish17405@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Mail className="h-5 w-5" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 h-full w-full overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                <div className="h-full w-full rounded-xl overflow-hidden relative">
                  <Image
                    src="/profile.png"
                    alt="Aashish Jaini"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="animate-bounce"
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm"
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ArrowRight className="h-4 w-4 rotate-90" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
