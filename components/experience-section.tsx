"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Award,
  ArrowUpRight,
  Download,
  FileText,
  Medal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  type: "work" | "achievement";
  link?: string;
  experienceCertificate?: string;
}

interface certification {
  title: string;
  badge?: string;
  issuer: string;
}

export default function ExperienceSection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const workExperiences: Experience[] = [
    {
      title: "React Developer Intern",
      company: "Blue  Digital Media Pvt. Ltd.",
      period: "2024",
      description:
        "Developed and maintained a web application using React.js during an internship. Collaborated with a team of developers to implement new features and improve existing ones. Gained hands-on experience in front-end development and enhanced problem-solving skills while working remotely for Blue Digital Media Pvt. Ltd.",
      type: "work",
      link: "https://elsopro.com/",
      experienceCertificate: "/Internship Certificate Aashish Jaini.pdf",
    },
    {
      title: "Web Developer Intern",
      company: "Scorely",
      period: "2025",
      description:
        "Enhanced front-end features using React and Next.js while developing robust APIs with TypeScript RPC. Contributed to code quality through comprehensive reviews and documentation. Collaborated effectively in an agile environment through daily stand-ups, sprint planning, and team retrospectives.",
      type: "work",
      link: "https://www.astratechai.com/",
      experienceCertificate: "/Experience Certificate - Aashish Jaini1.pdf",
    },
    {
      title: "Frontend Developer",
      company: "Varun Reddy Foods",
      period: "2024",
      description:
        "Designed and built a website for Varun Reddy Foods, a local sweet shop, featuring an online ordering system.",
      type: "work",
      link: "https://www.varunreddyfoods.co.in/",
    },
  ];

  const achievements: Experience[] = [
    {
      title: "Runner-up at EPITOME25",
      company: "Gokaraju Rangaraju Institute of Engineering and Technology",
      period: "2025",
      description:
        "Runner-up at EPITOME25 conducted by Gokaraju Rangaraju Institute of Engineering and Technology under the Fintech domain.",
      type: "achievement",
    },
    {
      title: "Runner-up at Code4AI",
      company: "Rajiv Gandhi Institute of Technology",
      period: "2024",
      description:
        "Runner-up at Code4AI conducted by Rajiv Gandhi Institute of Technology under the AI domain.",
      type: "achievement",
    },
    {
      title: "2nd Place at Zignasa2k23",
      company: "Brain O Vision",
      period: "2023",
      description:
        "Won the 2nd place at Zignasa2k23 conducted by Brain O Vision under the Smart Education domain.",
      type: "achievement",
    },
  ];

  const certifications: certification[] = [
    {
      title: "Postman API Fundamentals Student Expert",
      issuer: "Postman",
      // badge: "/postman-badge.png", // optional
    },
    {
      title: "Build Your Generative AI Productivity Skills",
      issuer: "LinkedIn Learning & Microsoft",
      // badge: "/ai-badge.png", // optional
    },
    {
      title: "Git and GitHub Bootcamp",
      issuer: "Let's Upgrade",
      // badge: "/git-badge.png", // optional
    },
  ];

  return (
    <section className="relative py-0 pb-4 bg-gray-900">
      {/* Work Experience Section */}
      <div
        id="experience"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title text-gradient"
        >
          Work Experience
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>

            {workExperiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`mb-8 md:mb-12 flex ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-start relative`}
              >
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-gray-900 z-10"></div>

                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-colors card-hover">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                          <Briefcase className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base md:text-lg">
                            {experience.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-400">
                            {experience.company}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-gray-300 mb-4">
                        {experience.description}
                      </p>

                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-blue-500/30 text-blue-400 text-xs md:text-sm"
                        >
                          {experience.period}
                        </Badge>

                        {experience.experienceCertificate && (
                          <Dialog
                            onOpenChange={(open) => {
                              if (open) setIsLoading(true);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 text-xs md:text-sm border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                              >
                                <FileText className="h-3.5 w-3.5" />
                                Experience Certificate
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] flex flex-col bg-gray-900 border-gray-700 mt-4">
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  {experience.title} - Internship Certificate
                                </DialogTitle>
                              </DialogHeader>

                              <div className="flex-1 overflow-hidden rounded-md border border-gray-700 mt-4 relative">
                                {isLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
                                    <div className="flex flex-col items-center">
                                      <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-2"></div>
                                      <p className="text-sm text-gray-400">
                                        Loading certificate...
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <iframe
                                  src={`${experience.experienceCertificate}#toolbar=0`}
                                  className="w-full h-[60vh]"
                                  title="Experience Certificate"
                                  onLoad={() => setIsLoading(false)}
                                />
                              </div>

                              <DialogFooter className="mt-0 flex justify-between items-center">
                                <div className="flex gap-2">
                                  <a
                                    href={experience.experienceCertificate}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  </a>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        <a
                          href={experience.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md"
                        >
                          <Badge className="bg-gradient-to-r from-blue-600 to-blue-400 text-white border-0 text-xs md:text-sm px-3 py-1 shadow-md shadow-blue-500/20 flex items-center gap-1 font-medium">
                            <span>Work</span>
                            <ArrowUpRight className="h-3.5 w-3.5 md:h-4 md:w-4 stroke-[2.5]" />
                          </Badge>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div
        id="achievements"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="section-title text-gradient"
        >
          Achievements
        </motion.h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-700"></div>

            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`mb-8 md:mb-12 flex ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-start relative`}
              >
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-yellow-500 border-4 border-gray-900 z-10"></div>

                <div
                  className={`w-full md:w-1/2 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500/50 transition-colors card-hover">
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                          <Award className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base md:text-lg">
                            {achievement.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-400">
                            {achievement.company}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm md:text-base text-gray-300 mb-4">
                        {achievement.description}
                      </p>

                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400 text-xs md:text-sm"
                        >
                          {achievement.period}
                        </Badge>
                        <Badge className="bg-yellow-500/80 text-white border-0 text-xs md:text-sm">
                          Achievement
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications Section */}
      <div
        id="certifications"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="section-title text-3xl md:text-4xl font-bold text-center mb-12 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
        >
          Certifications
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto px-4"
        >
          <Card className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:border-blue-400/30 transition-all duration-300 shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 * index,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2)",
                    }}
                    className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/80 rounded-xl border border-gray-700/50 hover:border-blue-400/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-500/10 p-3 rounded-lg group-hover:bg-blue-500/20 transition-all">
                        <Medal className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {cert.issuer}
                        </p>
                        {cert?.badge && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mt-3"
                          >
                            <Image
                              src={cert?.badge}
                              alt={`${cert.title} badge`}
                              width={80}
                              height={80}
                              className="rounded-lg"
                            />
                          </motion.div>
                        )}
                      </div>
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
