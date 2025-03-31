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
  };

  // Size mapping
  const sizes = {
    xs: 'w-8 h-8',
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const color = categoryColors[category] || categoryColors.general;

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-b flex items-center justify-center",
      sizes[size],
      className
    )} style={{ background: color }}>
      <div className="relative w-full h-full">
        {/* Eyes */}
        <div className="absolute rounded-full bg-white w-[25%] h-[25%] top-[30%] left-[25%] flex items-center justify-center">
          <div className={cn(
            "rounded-full bg-current w-1/2 h-1/2",
            speaking && "animate-pulse"
          )} style={{ color }}></div>
        </div>
        <div className="absolute rounded-full bg-white w-[25%] h-[25%] top-[30%] right-[25%] flex items-center justify-center">
          <div className={cn(
            "rounded-full bg-current w-1/2 h-1/2",
            speaking && "animate-pulse"
          )} style={{ color }}></div>
        </div>
        
        {/* Mouth */}
        <div className="absolute bg-white h-[3px] w-[40%] rounded-full bottom-[30%] left-[30%]"
          style={{ 
            transform: 'rotate(5deg)',
            boxShadow: `0 2px 0 rgba(255,255,255,0.5)`
          }}
        ></div>

        {/* Antenna */}
        <div className="absolute w-[12%] h-[12%] rounded-full bg-white top-[5%] left-[44%]"></div>
        <div className="absolute w-[2px] h-[15%] bg-white top-[17%] left-[49%]"></div>
      </div>
    </div>
  );
}