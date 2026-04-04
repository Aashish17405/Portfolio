import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

import { useEffect, useRef, useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          href={item?.link}
          key={item?.link}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const HoverEffectNav = ({
  items,
  className,
  onItemClick,
}: {
  items: {
    id: string;
    label: string;
  }[];
  className?: string;
  onItemClick: (id: string) => void;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoverRect, setHoverRect] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  const updateHoverRect = (idx: number) => {
    const container = containerRef.current;
    const button = buttonRefs.current[idx];
    if (!container || !button) return;

    const containerRect = container.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    setHoverRect({
      left: buttonRect.left - containerRect.left,
      top: buttonRect.top - containerRect.top,
      width: buttonRect.width,
      height: buttonRect.height,
    });
  };

  useEffect(() => {
    if (hoveredIndex === null) return;

    const handleResize = () => updateHoverRect(hoveredIndex);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [hoveredIndex]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex items-center gap-1 rounded-full p-1", className)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {hoverRect && (
        <motion.span
          className="pointer-events-none absolute rounded-full bg-neutral-200 dark:bg-slate-800/[0.8]"
          animate={{
            left: hoverRect.left,
            top: hoverRect.top,
            width: hoverRect.width,
            height: hoverRect.height,
            opacity: hoveredIndex === null ? 0 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 30,
            mass: 1,
          }}
        />
      )}
      {items.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            buttonRefs.current[idx] = el;
          }}
          className="relative z-10 block rounded-full px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white focus-visible:text-white"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseMove={() => updateHoverRect(idx)}
          onFocus={() => {
            setHoveredIndex(idx);
            updateHoverRect(idx);
          }}
          onBlur={() => setHoveredIndex(null)}
          onMouseOver={() => updateHoverRect(idx)}
          onClick={() => onItemClick(item.id)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
