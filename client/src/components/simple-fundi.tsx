import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
  category?: string;
}

export default function SimpleFundi({ speaking = false, size = "md", category = 'general' }: SimpleFundiProps) {
  const sizeVariants = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24"
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
      {/* Radiating glow effect */}
      <div 
        className={`absolute inset-0 rounded-full ${speaking ? 'animate-pulse' : ''}`}
        style={{ 
          boxShadow: `0 0 15px ${glowColor}`,
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Robot SVG */}
      <svg
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        {/* Head */}
        <rect x="60" y="40" width="80" height="70" rx="20" fill="#f5f5f5" />
        
        {/* Face screen */}
        <rect x="70" y="60" width="60" height="30" rx="10" fill="#1f2937" />
        
        {/* Eyes */}
        <ellipse cx="85" cy="75" rx="10" ry="6" fill={glowColor} className={speaking ? "animate-pulse" : ""} />
        <ellipse cx="115" cy="75" rx="10" ry="6" fill={glowColor} className={speaking ? "animate-pulse" : ""} />
        
        {/* Antenna */}
        <rect x="90" y="30" width="20" height="10" rx="5" fill={glowColor} />
        <rect x="95" y="15" width="10" height="15" rx="5" fill="#e6e6e6" />
        
        {/* Ears */}
        <rect x="50" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        <rect x="140" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        
        {/* Body */}
        <path d="M70,110 C70,140 70,160 100,160 C130,160 130,140 130,110 Z" fill="#ffffff" />
        
        {/* Chest light */}
        <circle cx="100" cy="130" r="10" fill={glowColor} className={speaking ? "animate-pulse" : ""} opacity="0.8" />
      </svg>
    </div>
  );
}