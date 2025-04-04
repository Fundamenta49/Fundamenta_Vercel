import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RobotFundiProps {
  speaking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  interactive?: boolean;
  onOpen?: () => void;
}

export default function RobotFundi({
  speaking = false,
  size = 'md',
  category = 'general',
  interactive = true,
  onOpen
}: RobotFundiProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };
  
  const handleClick = () => {
    if (onOpen && interactive) {
      onOpen();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  // Much larger size variants
  const sizeVariants = {
    xs: 'w-48 h-48',  // 192px
    sm: 'w-56 h-56',  // 224px
    md: 'w-64 h-64',  // 256px
    lg: 'w-80 h-80',  // 320px
    xl: 'w-96 h-96'   // 384px
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

  return (
    <div 
      className={cn(
        "fixed cursor-move",
        sizeVariants[size],
        interactive && "hover:scale-105 transition-transform"
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        touchAction: 'none',
        userSelect: 'none',
        bottom: position.y === 0 ? '20px' : 'auto',
        right: position.x === 0 ? '20px' : 'auto',
        width: size === 'xl' ? '384px' : size === 'lg' ? '320px' : size === 'md' ? '256px' : size === 'sm' ? '224px' : '192px',
        height: size === 'xl' ? '384px' : size === 'lg' ? '320px' : size === 'md' ? '256px' : size === 'sm' ? '224px' : '192px',
        minWidth: size === 'xl' ? '384px' : size === 'lg' ? '320px' : size === 'md' ? '256px' : size === 'sm' ? '224px' : '192px',
        minHeight: size === 'xl' ? '384px' : size === 'lg' ? '320px' : size === 'md' ? '256px' : size === 'sm' ? '224px' : '192px'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <rect x="25" y="20" width="50" height="40" rx="10" fill="#e6e6e6" />
        <rect x="30" y="30" width="40" height="20" rx="5" fill="#222" />
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
        <rect x="45" y="15" width="10" height="5" rx="2.5" fill={color} />
        <rect x="47.5" y="10" width="5" height="5" rx="2.5" fill="#e6e6e6" />
        <path 
          d="M30,60 C30,80 30,90 50,90 C70,90 70,80 70,60 Z" 
          fill="#f5f5f5" 
        />
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