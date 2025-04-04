import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RobotFundiProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
  category?: string;
  onOpen?: () => void; // Callback function when the robot is clicked (not dragged)
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

export default function RobotFundi({ speaking = false, size = "md", category = 'general', onOpen }: RobotFundiProps) {
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
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [clickStartTime, setClickStartTime] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  
  // Size variants scaling (adjusted to be visible on small devices)
  const scaleMap = {
    sm: 0.7,
    md: 1.0,
    lg: 1.3 // Moderate size suitable for all devices
  };
  
  // Get the appropriate color for the current category
  const color = getCategoryColor(category);
  
  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default browser behavior
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    // Reset movement tracking on mouse down
    setHasMoved(false);
    setClickStartTime(Date.now());
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ ...position });
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    // For touch devices
    if (e.touches.length === 1) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      // Reset movement tracking on touch start
      setHasMoved(false);
      setClickStartTime(Date.now());
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setInitialPosition({ ...position });
    }
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate the new position based on mouse movement
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    // Any movement at all should set hasMoved to true immediately
    if (deltaX !== 0 || deltaY !== 0) {
      setHasMoved(true);
    }
    
    // Also calculate total movement from starting position
    // This is a more reliable check than the delta
    const totalMovement = Math.sqrt(
      Math.pow(e.clientX - initialPosition.x, 2) + 
      Math.pow(e.clientY - initialPosition.y, 2)
    );
    
    // If we've moved more than 2 pixels in total, definitely mark as moved
    if (totalMovement > 2) {
      setHasMoved(true);
    }
    
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY
    });
    
    // Update drag start for the next move
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    
    // Calculate the new position based on touch movement
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;
    
    // Any movement at all should set hasMoved to true immediately
    if (deltaX !== 0 || deltaY !== 0) {
      setHasMoved(true);
    }
    
    // Also calculate total movement from starting position
    // This is a more reliable check than the delta
    const totalMovement = Math.sqrt(
      Math.pow(touch.clientX - dragStart.x, 2) + 
      Math.pow(touch.clientY - dragStart.y, 2)
    );
    
    // If we've moved more than 2 pixels in total, definitely mark as moved
    if (totalMovement > 2) {
      setHasMoved(true);
    }
    
    setPosition({
      x: position.x + deltaX,
      y: position.y + deltaY
    });
    
    // Update drag start for the next move
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleMouseUp = (e?: MouseEvent) => {
    if (!isDragging) return;
    
    if (e) {
      // Prevent default browser behavior
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Calculate total movement from initial position
    const totalDragDistance = Math.sqrt(
      Math.pow(position.x - initialPosition.x, 2) + 
      Math.pow(position.y - initialPosition.y, 2)
    );
    
    const clickDuration = Date.now() - clickStartTime;
    
    console.log('Drag distance:', totalDragDistance, 'Click duration:', clickDuration, 'Has moved?', hasMoved);
    
    // Only open if it was a true click (not a drag)
    // We check both our tracking state and the movement distance as a fallback
    if (!hasMoved && totalDragDistance < 5 && onOpen) {
      onOpen();
    }
    
    setIsDragging(false);
    
    // Save position to localStorage when dragging ends
    try {
      localStorage.setItem('fundiPosition', JSON.stringify(position));
    } catch (e) {
      console.error('Failed to save Fundi position:', e);
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    // Calculate total movement from initial position
    const totalDragDistance = Math.sqrt(
      Math.pow(position.x - initialPosition.x, 2) + 
      Math.pow(position.y - initialPosition.y, 2)
    );
    
    const clickDuration = Date.now() - clickStartTime;
    
    console.log('Touch: Drag distance:', totalDragDistance, 'Click duration:', clickDuration, 'Has moved?', hasMoved);
    
    // Only open if it was a true tap (not a drag)
    // We check both our tracking state and the movement distance as a fallback
    if (!hasMoved && totalDragDistance < 3 && onOpen) {
      onOpen();
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
    // Create memoized event handlers that close over the current state
    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = (e: MouseEvent) => handleMouseUp(e);
    const touchMoveHandler = (e: TouchEvent) => handleTouchMove(e);
    const touchEndHandler = (e: TouchEvent) => handleTouchEnd(e);
    
    if (isDragging) {
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('touchmove', touchMoveHandler, { passive: false });
      document.addEventListener('touchend', touchEndHandler);
      
      console.log('Started dragging from position:', initialPosition);
    } else {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    }
    
    // Cleanup event listeners on component unmount or when dependencies change
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };
  }, [
    isDragging, 
    position, 
    initialPosition, 
    hasMoved, 
    dragStart, 
    onOpen
  ]);
  
  return (
    <div 
      className="fixed z-[99999] robot-fundi" 
      style={{ 
        transform: `scale(${scaleMap[size]})`,
        right: `calc(20px - ${position.x}px)`,
        top: `calc(20px + ${position.y}px)`,
        touchAction: 'none', // Prevent touch actions for better mobile drag
        pointerEvents: 'auto', // Ensure we capture all pointer events
        cursor: isDragging ? 'grabbing' : 'grab', // Show grabbing cursor while dragging
        visibility: 'visible'  // Force visibility
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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