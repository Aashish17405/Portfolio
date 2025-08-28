import React, { useState, useEffect } from "react";

const IntroAnimation = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void;
}) => {
  const text = "ERROR 404: Conventional developer not found.";
  const words = text.split(" ");

  // 1. ADDED: State to prevent Flash of Unstyled Content (FOUC)
  const [isReady, setIsReady] = useState(false);
  const [visibleWordsCount, setVisibleWordsCount] = useState(0);
  const [startGlitch, setStartGlitch] = useState(false);

  const wordRevealInterval = 400;
  const glitchAnimationDuration = 4000;
  const revealDuration = words.length * wordRevealInterval;

  useEffect(() => {
    // 2. ADDED: Set the component to "ready" after a tiny delay
    // This ensures styles are applied before the container becomes visible.
    const readyTimer = setTimeout(() => setIsReady(true), 10);

    // --- 1. Word Reveal Phase ---
    const revealInterval = setInterval(() => {
      setVisibleWordsCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (nextCount > words.length) {
          clearInterval(revealInterval);
          return prevCount;
        }
        return nextCount;
      });
    }, wordRevealInterval);

    // --- 2. Glitch Phase ---
    const glitchTimer = setTimeout(() => {
      setStartGlitch(true);
      // Call onAnimationComplete as soon as glitch starts and words begin to vanish
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, revealDuration + 1000);

    // --- 3. Cleanup Phase (no longer needed for completion) ---

    // --- Cleanup ---
    return () => {
      clearTimeout(readyTimer); // Clear the new timer
      clearInterval(revealInterval);
      clearTimeout(glitchTimer);
    };
  }, [onAnimationComplete, words.length, revealDuration]);

  return (
    // 3. MODIFIED: Added `isReady` to the class list
    <div
      className={`intro-container ${isReady ? "ready" : ""} ${
        startGlitch ? "fading-out" : ""
      }`}
    >
      <div className={`intro-text-box ${startGlitch ? "glitching" : ""}`}>
        <div className="words-container">
          {isReady &&
            words.map((word, index) => (
              <span
                key={index}
                className={`word ${index < visibleWordsCount ? "visible" : ""}`}
              >
                {word}
              </span>
            ))}
        </div>
      </div>

      <style jsx>{`
        /* 4. UPDATED: CSS to handle the initial ready state */
        .intro-container {
          position: fixed;
          inset: 0;
          background: linear-gradient(
            180deg,
            #000000 0%,
            #0f172a 100%
          ); /* Gradient that matches main page */
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          opacity: 0; /* Start fully transparent */
          transition: opacity 0.5s ease-out 1s; /* Fade out transition */
          z-index: 9999; /* Ensure it's on top */
        }

        .intro-container.ready {
          opacity: 1; /* Fade in when component is ready */
          transition: opacity 0.2s ease-in; /* Quick fade-in */
        }

        .intro-container.fading-out {
          opacity: 0;
          transform: scale(0.99);
          transition: opacity 2s ease-out, transform 2s ease-out; /* Longer fade-out to overlap with page transition */
        }

        .intro-text-box {
          position: relative;
          color: white;
          font-family: "Space Mono", monospace;
          font-weight: 800;
          font-size: clamp(2rem, 8vw, 6rem);
          letter-spacing: 0.1em;
          text-align: center;
          padding: 2rem;
        }

        .words-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.25em;
        }

        .word {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .word.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .intro-text-box.glitching::before,
        .intro-text-box.glitching::after {
          content: "${text}";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: inherit;
          color: white;
          background-color: #000;
          overflow: hidden;
          opacity: 0;
        }

        .intro-text-box.glitching::before {
          animation: glitch-left 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            infinite;
          text-shadow: -2px 0 #ff00ff;
          z-index: 10;
        }

        .intro-text-box.glitching::after {
          animation: glitch-right 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            infinite;
          text-shadow: 2px 0 #00ffff;
          z-index: 10;
        }

        .intro-text-box.glitching {
          animation: final-dissolve 4s ease-out forwards;
        }

        @keyframes final-dissolve {
          0% {
            opacity: 1;
            filter: blur(0px);
          }
          70% {
            opacity: 1;
            filter: blur(0px);
          }
          90% {
            opacity: 0.7;
            filter: blur(2px);
          }
          100% {
            opacity: 0;
            filter: blur(10px);
            transform: scale(0.9);
          }
        }

        @keyframes glitch-left {
          0%,
          2%,
          64%,
          66%,
          100% {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          3% {
            clip-path: inset(20% 0 70% 0);
            opacity: 0.8;
          }
          5% {
            clip-path: inset(80% 0 5% 0);
            opacity: 0.7;
          }
          7% {
            clip-path: inset(50% 0 30% 0);
            opacity: 0.6;
          }
          9% {
            clip-path: inset(10% 0 85% 0);
            opacity: 0.8;
          }
          11% {
            clip-path: inset(90% 0 2% 0);
            opacity: 0.5;
          }
          65% {
            clip-path: inset(40% 0 40% 0);
            opacity: 0.9;
          }
        }

        @keyframes glitch-right {
          0%,
          2%,
          64%,
          66%,
          100% {
            clip-path: inset(0 0 0 100%);
            opacity: 0;
          }
          4% {
            clip-path: inset(70% 0 20% 0);
            opacity: 0.6;
          }
          6% {
            clip-path: inset(5% 0 80% 0);
            opacity: 0.8;
          }
          8% {
            clip-path: inset(30% 0 50% 0);
            opacity: 0.7;
          }
          10% {
            clip-path: inset(85% 0 10% 0);
            opacity: 0.5;
          }
          12% {
            clip-path: inset(2% 0 90% 0);
            opacity: 0.9;
          }
          65% {
            clip-path: inset(30% 0 55% 0);
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
