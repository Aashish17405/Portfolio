// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";

// export default function TextScramble({
//   text = "Aashish Jaini",
//   speed = 30,
//   triggerOnce = true,
//   className = "",
// }) {
//   const [displayText, setDisplayText] = useState("");
//   const [hasPlayed, setHasPlayed] = useState(false);
//   const ref = useRef(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const scrambleText = useCallback((finalText: string) => {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let frame = 0;
//     const totalFrames = finalText.length * 5;

//     if (intervalRef.current) clearInterval(intervalRef.current);

//     intervalRef.current = setInterval(() => {
//       let scrambled = "";
//       for (let i = 0; i < finalText.length; i++) {
//         if (i < frame / 5) {
//           scrambled += finalText[i];
//         } else {
//           scrambled += chars[Math.floor(Math.random() * chars.length)];
//         }
//       }
//       setDisplayText(scrambled);

//       if (frame >= totalFrames) {
//         clearInterval(intervalRef.current!);
//         setDisplayText(finalText);
//       }
//       frame++;
//     }, speed);
//   }, [speed]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting && (!hasPlayed || !triggerOnce)) {
//           scrambleText(text);
//           setHasPlayed(true);
//         }
//       },
//       { threshold: 0.3 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => {
//       observer.disconnect();
//       if (intervalRef.current) clearInterval(intervalRef.current);
//     };
//   }, [text, triggerOnce, hasPlayed, scrambleText]);

//   return (
//     <span ref={ref} className={className}>
//       {displayText}
//     </span>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";

class TextScramble {
  el: HTMLElement;
  chars: string;
  queue: any[];
  frame: number;
  frameRequest: number | null;
  resolve: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
    this.queue = [];
    this.frame = 0;
    this.frameRequest = null;
    this.resolve = () => {};
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest!);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}
export default function TextScrambleLoop({
  text = "Work Experience",
  className = "",
  delay = 300,
}) {
  const elRef = useRef<HTMLSpanElement>(null);
  const fxRef = useRef<TextScramble | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!elRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          fxRef.current = new TextScramble(elRef.current!);
          setTimeout(() => {
            fxRef.current?.setText(text);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold: 0.6 } // Trigger when 60% of element is visible
    );

    observer.observe(elRef.current);

    return () => observer.disconnect();
  }, [text, delay, hasAnimated]);

  return <span ref={elRef} className={className}></span>;
}
