
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
    sm: { container: "w-12 h-12", iconSize: "w-8 h-8" },
    md: { container: "w-16 h-16", iconSize: "w-12 h-12" },
    lg: { container: "w-24 h-24", iconSize: "w-20 h-20" }
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizes[size].container
    )}>
      <div className={cn(
        "absolute inset-0 rounded-full",
        speaking ? "animate-pulse" : "",
        "transition-colors duration-300"
      )} 
      style={{ 
        background: `radial-gradient(circle, ${color}33 0%, transparent 70%)` 
      }} />
      
      <svg 
        viewBox="0 0 100 100" 
        className={cn(sizes[size].iconSize)}
        style={{ color: color }}
      >
        {/* Robot Head - Style 3 */}
        <path
          d="M20,30 L80,30 L80,80 L20,80 Z"
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
        {/* Eyes */}
        <circle cx="35" cy="50" r="8" fill={color} />
        <circle cx="65" cy="50" r="8" fill={color} />
        {/* Antenna */}
        <path
          d="M50,10 L50,30"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
        <circle cx="50" cy="10" r="3" fill={color} />
        {/* Mouth */}
        <path
          d="M35,65 Q50,75 65,65"
          stroke={color}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
}
