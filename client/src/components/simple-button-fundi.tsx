import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleButtonFundiProps {
  speaking?: boolean;
  category?: string;
  size?: "sm" | "md" | "lg";
}

export default function SimpleButtonFundi({ 
  speaking = false, 
  category = 'general', 
  size = "md" 
}: SimpleButtonFundiProps) {
  
  // Category colors mapping for the glow effect
  const categoryColors: Record<string, string> = {
    finance: '#22c55e', 
    career: '#3b82f6', 
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
  };
  
  // Get the color based on category
  const color = categoryColors[category] || categoryColors.general;
  
  // Define animation class
  const animationClass = speaking ? 'animate-pulse' : '';

  // We're simply creating a rounded button with a light icon centered
  return (
    <div className={cn(
      "relative w-full h-full rounded-full flex items-center justify-center",
    )}>
      <div 
        className={`w-full h-full absolute inset-0 rounded-full shadow-lg ${animationClass}`}
        style={{ background: color, boxShadow: `0 0 15px ${color}` }}
      />
      
      {/* Robot icon - simple white icon to indicate this is the AI assistant */}
      <div className="relative z-10 text-white">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-bot"
        >
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      </div>
    </div>
  );
}