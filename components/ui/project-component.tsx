import React, { useState, useEffect, useRef } from "react";
import { EyeIcon, Sparkle } from "lucide-react";
import { useCursorContext } from "@/context/cursor-context";
interface ProjectComponentProps {
  title: string;
  projectHeading: string;
  description: string;
  imageUrl: string;
  features: string[];
  techstack: { [key: string]: string };
  projectUrl?: string;
  theme: string;
  gradient_from?: string;
  gradient_to?: string;
  gradient_via?: string;
  githubUrl: string;
}

const PortfolioComponent: React.FC<ProjectComponentProps> = ({
  title,
  projectHeading,
  description,
  imageUrl,
  features,
  techstack,
  projectUrl,
  theme,
  gradient_from,
  gradient_to,
  gradient_via,
  githubUrl,
}) => {
  const { setGlobalCursorVisible } = useCursorContext();
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setGlobalCursorVisible(false);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setGlobalCursorVisible(true);
    setIsHovering(false);
    // Hide the custom cursor when leaving the card
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.opacity = "0";
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && isHovering) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
        cursorRef.current.style.opacity = "1";
      }
    };

    if (isHovering) {
      document.addEventListener("mousemove", handleMouseMove);
    } else {
      // Ensure cursor is hidden when not hovering
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0";
      }
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovering]);

  return (
    <div className="bg-black text-white px-4 sm:px-6 md:px-8 pb-16 md:pb-24 flex items-center justify-center relative overflow-hidden">
      <style jsx global>{`
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .cursor-rotate {
          animation: rotate 8s linear infinite;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200"
        style={{
          left: "0px",
          top: "0px",
          opacity: "0",
        }}
      >
        <div className="relative w-[100px] h-[100px]">
          {/* Outer Circle Background */}
          <div className="w-full h-full rounded-full border border-gray-400/80 bg-black/40 flex items-center justify-center relative shadow-[0_0_20px_5px_rgba(255,255,255,0.2)] ring-1 ring-white/10">
            {/* Eye Icon */}
            <div className="flex items-center justify-center bg-white/20 rounded-full w-[50px] h-[50px]">
              <EyeIcon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>

            {/* Curved Rotating Text */}
            <div className="absolute inset-0 animate-spin-slow p-2">
              <svg className="w-full h-full" viewBox="0 0 141 141">
                <defs>
                  <path
                    id="circle-path-js"
                    d="M 70.5,70.5 m -60,0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0"
                  />
                </defs>
                <text
                  className="fill-white font-semibold"
                  style={{
                    fontSize: "16px",
                    letterSpacing: "2px",
                  }}
                >
                  <textPath href="#circle-path-js" startOffset="0%">
                    VIEW DETAILS • VIEW DETAILS • VIEW•
                  </textPath>
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8">
        {/* Left Side - Project Showcase */}
        <div className="flex-1">
          <div className="border-2 border-white/50 hover:border-white rounded-3xl transition-all duration-500 ease-in-out">
            <div
              className="relative rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden transition-all duration-300 m-2 md:m-3"
              style={{
                background: `radial-gradient(circle, ${gradient_from}, ${
                  gradient_from || gradient_to
                }, ${gradient_to})`,
              }}
            >
              {/* Header Content */}
              <div className="relative z-10 mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight">
                  {title}
                </h1>
              </div>

              <div className="relative z-10">
                <div
                  ref={cardRef}
                  className={`bg-gray-900 rounded-2xl p-4 md:p-6 shadow-2xl transform transition-all duration-500 hover:scale-[1.02] cursor-none relative
    ${isHovering ? "rotate-0 -translate-y-3" : "rotate-2"}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => window.open(githubUrl, "_blank")}
                >
                  <img
                    src={`/projects/${imageUrl}`}
                    alt="Project Preview"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Project Details */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-8">
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <div
                className="w-1 h-5 md:h-6"
                style={{ backgroundColor: theme }}
              ></div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {projectHeading}
              </h2>
              <button
                onClick={() =>
                  window.open(projectUrl !== undefined ? projectUrl : githubUrl)
                }
                className="group text-xs sm:text-sm font-semibold text-white/80 hover:text-white border border-white/30 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-2 transition-colors duration-100 relative"
              >
                Check out
                <div className="relative w-4 h-4">
                  {/* Arrow animations */}
                  <svg
                    className="w-4 h-4 absolute transition-all duration-500 ease-in-out group-hover:translate-x-8 group-hover:-translate-y-6 group-hover:opacity-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7h-10"
                    />
                  </svg>
                  <svg
                    className="w-4 h-4 absolute transition-all duration-500 ease-in-out delay-300 -translate-x-8 translate-y-6 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7h-10"
                    />
                  </svg>
                </div>
              </button>
            </div>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-5 md:mb-6">
              {description}
            </p>

            <div className="space-y-2 sm:space-y-3 mb-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Sparkle
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{
                      fill: theme,
                      color: theme,
                      stroke: "black",
                      strokeWidth: "1px",
                    }}
                  />
                  <span className="text-gray-300 text-sm sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              {Object.entries(techstack).map(([name, icon], index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-950 border border-white/20 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 hover:border-white/30"
                >
                  <img
                    src={`/icons/${icon}`}
                    alt={`${name} Logo`}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortfolioComponent;
