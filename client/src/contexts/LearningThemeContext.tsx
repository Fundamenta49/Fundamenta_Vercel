/**
 * Learning Theme Context
 * 
 * Provides theming context for the learning experience
 * Allows theme information to be accessed throughout the component tree
 * without explicit prop drilling
 */

import * as React from "react";
import { createContext, useContext, useState } from "react";
import { ThemeType } from "@/data/zones-config";

// Define the shape of the context
interface LearningThemeContextType {
  /** Current theme ("jungle" or "standard") */
  theme: ThemeType;
  /** Function to change the current theme */
  setTheme: (theme: ThemeType) => void;
}

// Create context with default values
const LearningThemeContext = createContext<LearningThemeContextType>({
  theme: "standard",
  setTheme: () => {},
});

interface LearningThemeProviderProps {
  /** Initial theme value */
  initialTheme?: ThemeType;
  /** Child components */
  children: React.ReactNode;
}

/**
 * Theme Provider Component
 * Wraps application or section that needs theme awareness
 */
export function LearningThemeProvider({
  initialTheme = "standard",
  children,
}: LearningThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  return (
    <LearningThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </LearningThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context from any component
 * @returns Theme context with current theme and setTheme function
 */
export function useTheme(): LearningThemeContextType {
  const context = useContext(LearningThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a LearningThemeProvider");
  }
  
  return context;
}

/**
 * Component that provides a theme-specific wrapper
 * Useful for theme-specific styling without explicit conditional rendering
 */
interface ThemedWrapperProps {
  /** Content to be wrapped */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function ThemedWrapper({ children, className = "" }: ThemedWrapperProps) {
  const { theme } = useTheme();
  
  const themeClasses = theme === "jungle"
    ? "bg-[#1E4A3D] text-white" 
    : "bg-white text-slate-900";
  
  return (
    <div className={`${themeClasses} ${className}`}>
      {children}
    </div>
  );
}