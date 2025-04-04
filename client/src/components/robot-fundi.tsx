import React, { useState, useEffect, useRef } from 'react';
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
  // Load saved position from localStorage if available, otherwise use default
  const getSavedPosition = () => {
    try {
      const savedPosition = localStorage.getItem('fundiPosition');
      return savedPosition ? JSON.parse(savedPosition) : { x: 0, y: 0 };
    } catch (e) {
      return { x: 0, y: 0 };
    }
  };
  
  // State for dragging
  const [position, setPosition] = useState(getSavedPosition());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // We'll ignore size variants and use direct SVG scaling
  const scaleMap = {
    sm: 0.5,
    md: 1,
    lg: 5
  };
  
  // Get the appropriate color for the current category
  const color = getCategoryColor(category);
  
  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default browser behavior
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate the new position based on mouse movement
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY
    });
    
    // Update drag start for the next move
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleMouseUp = (e?: MouseEvent) => {
    if (e) {
      // Prevent default browser behavior
      e.preventDefault();
      e.stopPropagation();
    }
    
    setIsDragging(false);
    
    // Save position to localStorage when dragging ends
    try {
      localStorage.setItem('fundiPosition', JSON.stringify(position));
    } catch (e) {
      console.error('Failed to save Fundi position:', e);
    }
  };
  
  // Set up global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart.x, dragStart.y, position.x, position.y]);
  
  // Handler to prevent click events from propagating
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  return (
    <div 
      className="fixed z-[9999] cursor-grab" 
      style={{ 
        transform: `scale(${scaleMap[size]})`,
        right: `calc(20px - ${position.x}px)`,
        top: `calc(20px + ${position.y}px)`,
        touchAction: 'none', // Prevent touch actions for better mobile drag
        pointerEvents: 'auto', // Ensure we capture all pointer events
        cursor: isDragging ? 'grabbing' : 'grab' // Show grabbing cursor while dragging
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
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
        style={{ filter: 'url(#glow)', pointerEvents: 'none' }}
        onClick={handleClick}
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