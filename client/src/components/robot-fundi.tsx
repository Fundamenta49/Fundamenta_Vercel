import React from 'react';
import { cn } from '@/lib/utils';

interface RobotFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
  category?: string;
}

// Function to determine the glow color based on category
const getCategoryColor = (category: string = 'general') => {
  const colorMap: Record<string, string> = {
    general: '#3b82f6',    // blue
    cooking: '#22c55e',    // green
    fitness: '#f97316',    // orange
    finance: '#6366f1',    // indigo
    career: '#ec4899',     // pink
    wellness: '#8b5cf6',   // purple
    nutrition: '#10b981',  // emerald
    mental: '#8b5cf6',     // purple
    mindfulness: '#a855f7' // purple-500
  };

  return colorMap[category] || colorMap.general;
};

export default function RobotFundi({ speaking = false, size = "md", category = 'general' }: RobotFundiProps) {
  // We'll ignore size variants and use direct SVG scaling
  const scaleMap = {
    sm: 0.5,
    md: 1,
    lg: 5
  };
  
  // Get the appropriate color for the current category
  const color = getCategoryColor(category);
  
  return (
    <div className="fixed right-20 top-20 z-[9999]" style={{ transform: `scale(${scaleMap[size]})` }}>
      {/* Define the glow filter */}
      <svg width="0" height="0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feFlood floodColor={color} floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glowBlur" />
            <feComposite in="SourceGraphic" in2="glowBlur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Robot avatar with dynamic color glow */}
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: 'url(#glow)' }}
      >
        {/* Head */}
        <rect x="60" y="40" width="80" height="70" rx="20" fill="#e6e6e6" />
        
        {/* Face screen */}
        <rect x="70" y="60" width="60" height="30" rx="10" fill="#222" />
        
        {/* Eyes - using dynamic category color */}
        <ellipse cx="85" cy="75" rx="10" ry="6" fill={color} className={speaking ? "animate-pulse" : ""} />
        <ellipse cx="115" cy="75" rx="10" ry="6" fill={color} className={speaking ? "animate-pulse" : ""} />
        
        {/* Antenna - using dynamic category color */}
        <rect x="90" y="30" width="20" height="10" rx="5" fill={color} />
        <rect x="95" y="15" width="10" height="15" rx="5" fill="#e6e6e6" />
        
        {/* Ears */}
        <rect x="50" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        <rect x="140" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
        
        {/* Body */}
        <path d="M70,110 C70,140 70,160 100,160 C130,160 130,140 130,110 Z" fill="#f5f5f5" />
        
        {/* Chest light - using dynamic category color */}
        <circle cx="100" cy="130" r="15" fill={color} className={speaking ? "animate-pulse" : ""} opacity="0.8" />
        
        {/* Arms */}
        <path d="M70,115 C50,125 50,140 60,150" fill="none" stroke="#e6e6e6" strokeWidth="10" strokeLinecap="round" />
        <path d="M130,115 C150,125 150,140 140,150" fill="none" stroke="#e6e6e6" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  );
}