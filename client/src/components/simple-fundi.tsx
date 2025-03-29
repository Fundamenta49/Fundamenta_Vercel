import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
  category?: string;
}

export default function SimpleFundi({ speaking = false, size = "md", category = 'general' }: SimpleFundiProps) {
  const sizeVariants = {
    sm: "w-14 h-14", // Increased from w-10 h-10
    md: "w-20 h-20", // Increased from w-16 h-16
    lg: "w-28 h-28"  // Increased from w-24 h-24
  };

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
  const glowColor = categoryColors[category] || categoryColors.general;

  return (
    <div className={cn(
      "flex items-center justify-center relative",
      sizeVariants[size]
    )}>
      {/* Radiating glow effect - only glow, no background */}
      <div 
        className={`absolute inset-0 ${speaking ? 'animate-pulse' : ''}`}
        style={{ 
          filter: `drop-shadow(0 0 8px ${glowColor})`,
          // No background color
        }}
      />
      
      {/* Robot SVG - Redesigned to match original image more closely */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        {/* Head */}
        <rect x="60" y="40" width="80" height="70" rx="20" fill="#f0f0f0" />
        
        {/* Face screen */}
        <rect x="70" y="60" width="60" height="30" rx="15" fill="#1a1a2e" />
        
        {/* Eyes */}
        <ellipse cx="85" cy="75" rx="10" ry="5" fill={glowColor} className={speaking ? "animate-pulse" : ""} />
        <ellipse cx="115" cy="75" rx="10" ry="5" fill={glowColor} className={speaking ? "animate-pulse" : ""} />
        
        {/* Antenna */}
        <rect x="90" y="28" width="20" height="12" rx="6" fill={glowColor} />
        <rect x="95" y="15" width="10" height="13" rx="5" fill="#e6e6e6" />
        
        {/* Ears */}
        <rect x="50" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        <rect x="140" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        
        {/* Body */}
        <path d="M70,110 C70,135 70,160 100,165 C130,160 130,135 130,110 Z" fill="#f8f8f8" />
        <path d="M80,110 L120,110 C120,110 115,125 100,125 C85,125 80,110 80,110 Z" fill="#f0f0f0" />
        
        {/* Chest light */}
        <circle cx="100" cy="132" r="8" fill={glowColor} className={speaking ? "animate-pulse" : ""} opacity="0.9" />
        
        {/* Shadow effect */}
        <ellipse cx="100" cy="175" rx="30" ry="5" fill="#00000010" opacity="0.2" />
      </svg>
    </div>
  );
}