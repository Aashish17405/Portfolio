"use client";

import { useEffect, useState } from "react";
import { Fira_Code } from "next/font/google";
import styles from "@/styles/Typewriter.module.css";

const nunito = Fira_Code({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Typewriter() {
  const words = [
    "Aashish Jaini",
    "Problem Solver",
    "MERN Stack Dev",
    "Next.js Dev",
  ];
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        setText(currentWord.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setText(currentWord.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex]);

  return (
    <div className={`${styles.typewriter} ${nunito.className}`}>
      <h1>
        {text}
        <span className={styles.cursor}>|</span>
      </h1>
    </div>
  );
}
