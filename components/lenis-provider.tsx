"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root>
      {children}
    </ReactLenis>
  );
}
