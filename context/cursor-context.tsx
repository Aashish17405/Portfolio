"use client";
// src/context/cursor-context.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface CursorContextType {
  isGlobalCursorVisible: boolean;
  setGlobalCursorVisible: (isVisible: boolean) => void;
}

// Create the context with a default value
const CursorContext = createContext<CursorContextType | undefined>(undefined);

// Create a provider component to wrap your application
export const CursorProvider = ({ children }: { children: ReactNode }) => {
  const [isGlobalCursorVisible, setGlobalCursorVisible] = useState(true);

  return (
    <CursorContext.Provider value={{ isGlobalCursorVisible, setGlobalCursorVisible }}>
      {children}
    </CursorContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useCursorContext = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error("useCursorContext must be used within a CursorProvider");
  }
  return context;
};