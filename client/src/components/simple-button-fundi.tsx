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

  const color = categoryColors[category] || categoryColors.general;

  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <div className={cn(
      "flex items-center justify-center",
      sizes[size]
    )}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
      >
        {/* Robot Head */}
        <rect x="20" y="20" width="60" height="60" rx="10" fill={color} />

        {/* Eyes */}
        <circle cx="35" cy="45" r="8" fill="white" />
        <circle cx="65" cy="45" r="8" fill="white" />
        <circle cx="35" cy="45" r="4" fill={color} className={speaking ? "animate-pulse" : ""} />
        <circle cx="65" cy="45" r="4" fill={color} className={speaking ? "animate-pulse" : ""} />

        {/* Antenna */}
        <rect x="45" y="10" width="10" height="10" rx="5" fill={color} />

        {/* Mouth */}
        <path
          d="M35,65 Q50,75 65,65"
          stroke="white"
          strokeWidth="3"
          fill="none"
        />
      </svg>
    </div>
  );
}