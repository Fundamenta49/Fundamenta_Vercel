import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RobotFundiProps {
  speaking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  interactive?: boolean;
}

export default function RobotFundi({
  speaking = false,
  size = 'md',
  category = 'general',
  interactive = true
}: RobotFundiProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    const startX = e.pageX - position.x;
    const startY = e.pageY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.pageX - startX,
        y: e.pageY - startY
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const sizeVariants = {
    xs: 'w-16 h-16',
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
    xl: 'w-48 h-48'
  };

  const categoryColors: Record<string, string> = {
    finance: '#22c55e',
    career: '#3b82f6',
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
    tour: '#6366f1',
  };

  const color = categoryColors[category] || categoryColors.general;
  const glowColor = color;

  return (
    <div 
      className={cn(
        "fixed flex items-center justify-center",
        sizeVariants[size],
        interactive && "cursor-move hover:scale-105 transition-transform",
        isDragging && "pointer-events-none"
      )}
      style={{
        left: position.x,
        top: position.y,
        zIndex: 50,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={() => {
        if (interactive) {
          setIsClicked(true);
          setTimeout(() => setIsClicked(false), 200);
        }
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{
          filter: isHovered ? 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.4))' : 'none',
          transform: isClicked ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Head */}
        <rect x="25" y="20" width="50" height="40" rx="10" fill="#e6e6e6" />

        {/* Face screen */}
        <rect x="30" y="30" width="40" height="20" rx="5" fill="#222" />

        {/* Eyes */}
        <circle 
          cx="40" 
          cy="40" 
          r="5" 
          fill={color}
          className={speaking ? "animate-pulse" : ""}
        />
        <circle 
          cx="60" 
          cy="40" 
          r="5" 
          fill={color}
          className={speaking ? "animate-pulse" : ""}
        />

        {/* Antenna */}
        <rect x="45" y="15" width="10" height="5" rx="2.5" fill={color} />
        <rect x="47.5" y="10" width="5" height="5" rx="2.5" fill="#e6e6e6" />

        {/* Body */}
        <path 
          d="M30,60 C30,80 30,90 50,90 C70,90 70,80 70,60 Z" 
          fill="#f5f5f5" 
        />

        {/* Status light */}
        <circle 
          cx="50" 
          cy="75" 
          r="8" 
          fill={color} 
          className={speaking ? "animate-pulse" : ""} 
          opacity="0.8"
        />
      </svg>
    </div>
  );
}