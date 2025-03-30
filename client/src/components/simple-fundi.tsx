
import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
  category?: string;
}

export default function SimpleFundi({ 
  speaking = false, 
  category = 'general', 
  size = "md" 
}: SimpleFundiProps) {
  
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

  const sizeVariants = {
    sm: "w-14 h-14",
    md: "w-20 h-20",
    lg: "w-28 h-28"
  };
  
  const color = categoryColors[category] || categoryColors.general;
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeVariants[size]
    )}>
      {/* Glowing background effect */}
      <div 
        className="absolute inset-0 rounded-full opacity-20 animate-pulse"
        style={{ backgroundColor: color }}
      />
      
      {/* Main robot body */}
      <div className="relative w-full h-full">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Base shape */}
          <circle cx="50" cy="50" r="45" fill="white" />
          
          {/* Face plate */}
          <ellipse cx="50" cy="50" rx="40" ry="35" fill="#f8f9fa" stroke="#e2e8f0" strokeWidth="1" />
          
          {/* Eyes */}
          <g className={speaking ? 'animate-pulse' : ''}>
            <circle cx="35" cy="45" r="12" fill="#e2e8f0" />
            <circle cx="35" cy="45" r="8" fill={color} />
            <circle cx="35" cy="45" r="4" fill="white" />
            
            <circle cx="65" cy="45" r="12" fill="#e2e8f0" />
            <circle cx="65" cy="45" r="8" fill={color} />
            <circle cx="65" cy="45" r="4" fill="white" />
          </g>
          
          {/* Smile */}
          <path
            d="M 40 60 Q 50 70 60 60"
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* Top antenna */}
          <circle cx="50" cy="15" r="3" fill={color} />
          <line x1="50" y1="15" x2="50" y2="25" stroke={color} strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
