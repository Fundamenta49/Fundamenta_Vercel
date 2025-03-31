import React from 'react';
import { cn } from '@/lib/utils';

interface FundiAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  speaking?: boolean;
  category?: string;
  className?: string;
}

export default function FundiAvatar({
  size = 'md',
  speaking = false,
  category = 'general',
  className
}: FundiAvatarProps) {
  // Category colors
  const categoryColors: Record<string, string> = {
    finance: '#22c55e', // green-500
    career: '#3b82f6', // blue-500
    wellness: '#a855f7', // purple-500
    learning: '#f97316', // orange-500
    emergency: '#ef4444', // red-500
    cooking: '#f59e0b', // amber-500
    fitness: '#06b6d4', // cyan-500
    general: '#6366f1', // indigo-500
    tour: '#6366f1', // indigo-500
  };

  // Size mapping
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const color = categoryColors[category] || categoryColors.general;

  // Using SVG for consistent rendering across browsers
  return (
    <div className={cn(
      "flex items-center justify-center",
      sizes[size],
      className
    )}>
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {/* Background Circle */}
        <circle cx="50" cy="50" r="50" fill={color} />
        
        {/* Eyes */}
        <circle cx="35" cy="40" r="10" fill="white" />
        <circle cx="65" cy="40" r="10" fill="white" />
        
        {/* Pupils */}
        <circle 
          cx="35" 
          cy="40" 
          r="5" 
          fill={color} 
          className={speaking ? "animate-pulse" : ""} 
        />
        <circle 
          cx="65" 
          cy="40" 
          r="5" 
          fill={color} 
          className={speaking ? "animate-pulse" : ""} 
        />
        
        {/* Mouth */}
        <path 
          d="M 30 65 Q 50 75 70 65" 
          stroke="white" 
          strokeWidth="3" 
          fill="none" 
        />
        
        {/* Antenna */}
        <circle cx="50" cy="15" r="7" fill={color} stroke="white" strokeWidth="2" />
        <line x1="50" y1="22" x2="50" y2="30" stroke="white" strokeWidth="3" />
      </svg>
    </div>
  );
}