"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, GraduationCap, Server } from "lucide-react";
import TextScrambleLoop from "./ui/text-scramble-effect";

export default function AboutSection() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
      },
    }),
  };

  const educationData = [
    {
      degree: "B.Tech Computer Science and Engineering",
      institution: "Keshav Memorial Institute Of Technology",
      period: "Nov 2022 - June 2026",
      grade: "CGPA: 9.0/10.0",
    },
    {
      degree: "Intermediate Education",
      institution: "Keshav Smarak Junior College",
      period: "2020 - 2022",
      grade: "Marks: 977/1000",
    },
    {
      degree: "Secondary Schooling",
      institution: "Gowtham Model School",
      period: "2020",
      grade: "CGPA: 10.0/10.0",
    },
  ];

  return (
    <section id="about" className="relative py-20 bg-gray-950">
      <div className="section-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title text-gradient"
        >
          <TextScrambleLoop text="About Me" />
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-full">
              <div className="relative bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg h-full">
                <div className="absolute inset-0 bg-dots opacity-30 rounded-lg"></div>
                <div className="relative">
                  <p className="text-lg mb-6">
                    I am a passionate full-stack developer skilled in MERN,
                    Next.js, TypeScript, and DSA(Java), and I have experience in
                    AI and blockchain. Enthusiastic about solving real-time
                    problems by exploring new technologies and building
                    scalable, impactful solutions.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Email</h3>
                        <p className="text-gray-400 text-sm">
                          aashish17405@gmail.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Location</h3>
                        <p className="text-gray-400 text-sm">
                          Hyderabad, Telangana, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-white">Education</h3>
                        <p className="text-gray-400 text-sm">
                          B.Tech in Computer Science
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-3">Tech Stack</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Node.js",
                        "MongoDB",
                        "Express",
                        "Tailwind CSS",
                        "C++",
                        "AI",
                        "Blockchain",
                        "AWS S3",
                        "AWS EC2",
                      ].map((tech, index) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-6">
              <h3 className="section-subtitle">Education</h3>

              <div className="space-y-4">
                {educationData.map((edu, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors">
                      <CardContent className="p-5">
                        <h4 className="font-bold text-lg mb-1">{edu.degree}</h4>
                        <p className="text-blue-400 mb-2">{edu.institution}</p>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{edu.period}</span>
                          <span>{edu.grade}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
