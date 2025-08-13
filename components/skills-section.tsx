"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  Database,
  Server,
  Globe,
  Layers,
  GitBranch,
  Palette,
  Braces,
  FileCode,
  LayoutGrid,
  Cloud,
  Repeat,
} from "lucide-react";
import TextScrambleLoop from "./ui/text-scramble-effect";

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  skills: { name: string; icon: React.ReactNode }[];
}

export default function SkillsSection() {
  const skillCategories: SkillCategory[] = [
    {
      title: "Programming Languages",
      icon: <Code className="h-5 w-5" />,
      skills: [
        { name: "JavaScript", icon: <Braces className="h-4 w-4" /> },
        { name: "TypeScript", icon: <FileCode className="h-4 w-4" /> },
        { name: "C++", icon: <Code className="h-4 w-4" /> },
        { name: "Java", icon: <Code className="h-4 w-4" /> },
      ],
    },
    {
      title: "Frontend Development",
      icon: <Globe className="h-5 w-5" />,
      skills: [
        { name: "React.js", icon: <LayoutGrid className="h-4 w-4" /> },
        { name: "Next.js", icon: <Globe className="h-4 w-4" /> },
        { name: "Tailwind CSS", icon: <Palette className="h-4 w-4" /> },
        { name: "HTML/CSS", icon: <Code className="h-4 w-4" /> },
      ],
    },
    {
      title: "Backend Development",
      icon: <Server className="h-5 w-5" />,
      skills: [
        { name: "Node.js", icon: <Server className="h-4 w-4" /> },
        { name: "Express.js", icon: <Server className="h-4 w-4" /> },
        { name: "MongoDB", icon: <Database className="h-4 w-4" /> },
        { name: "PostgreSQL", icon: <Database className="h-4 w-4" /> },
      ],
    },
    {
      title: "Tools & Technologies",
      icon: <Layers className="h-5 w-5" />,
      skills: [
        { name: "Git & GitHub", icon: <GitBranch className="h-4 w-4" /> },
        { name: "AWS", icon: <Cloud className="h-4 w-4" /> },
        { name: "Prisma", icon: <Database className="h-4 w-4" /> },
        { name: "CI/CD", icon: <Repeat className="h-4 w-4" /> },
      ],
    },
  ];

  return (
    <section id="skills" className="relative py-0 bg-gray-900">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title text-gradient"
        >
          <TextScrambleLoop text="Skills" />
        </motion.h2>

        <Tabs defaultValue="programming" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8 bg-gray-800/50 p-1 rounded-lg">
            {skillCategories.map((category) => (
              <TabsTrigger
                key={category.title}
                value={category.title.toLowerCase().split(" ")[0]}
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden md:inline">{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {skillCategories.map((category) => (
            <TabsContent
              key={category.title}
              value={category.title.toLowerCase().split(" ")[0]}
              className="mt-0 animate-fade-in"
            >
              <Card className="bg-gray-800/30 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6 text-gradient flex items-center gap-2">
                    {category.icon}{" "}
                    <TextScrambleLoop
                      text={category.title}
                      className="inline"
                    />
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all card-hover">
                          <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 text-blue-400">
                              {skill.icon}
                            </div>
                            <h4 className="font-medium">{skill.name}</h4>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-gray-800/30 border-gray-700 border-blue-500/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-6 text-center">
                <TextScrambleLoop text="Tools and Technologies" />
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  "Git",
                  "GitHub",
                  "Postman",
                  "Gemini",
                  "ChatGPT",
                  "Vercel",
                  "Netlify",
                  "Render",
                  "Langchain",
                  "Flask",
                  "Docker",
                  "AWS",
                ].map((tool, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="px-4 py-2 bg-gray-800/70 rounded-full text-sm border border-gray-700 hover:border-blue-500/30 transition-colors">
                      {tool}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
