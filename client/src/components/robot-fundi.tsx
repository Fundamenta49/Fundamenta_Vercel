import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAIEventStore } from '@/lib/ai-event-system';

interface RobotFundiProps {
  speaking?: boolean;
  thinking?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  interactive?: boolean;
  emotion?: string;
  onOpen?: () => void;
}

export default function RobotFundi({
  speaking = false,
  thinking = false,
  size = 'md',
  category = 'general',
  interactive = true,
  emotion = 'neutral',
  onOpen
}: RobotFundiProps) {
  const [position, setPosition] = useState({ x: 63, y: 8 });
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showClickIndicator, setShowClickIndicator] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { lastResponse } = useAIEventStore();
  
  // Removed emergency click handlers since they were causing auto-opening after dragging
  useEffect(() => {
    // Log for debugging
    console.log("Emergency click handlers disabled - using only standard click handling");
    
    // Empty cleanup function
    return () => {};
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    // Prevent event propagation to avoid triggering onClick
    e.stopPropagation();
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
    // Prevent event propagation
    e.stopPropagation();
  };
  
  const handleClick = (e: React.MouseEvent) => {
    // Ensure we're not in the middle of a drag
    if (!interactive || isDragging) {
      e.stopPropagation();
      return;
    }
    
    // Get the last drag time and distance moved since drag started
    const lastDragTime = (window as any).lastDragTime || 0;
    const timeSinceLastDrag = Date.now() - lastDragTime;
    
    // Detect if this is an actual click (very minimal movement) vs. the end of a drag
    const isActualClick = 
      // Either mouse didn't move much during this click...
      (Math.abs(e.movementX) < 2 && Math.abs(e.movementY) < 2) && 
      // ...or there was a reasonable delay since last drag (to allow intentional clicks)
      (timeSinceLastDrag > 250);
    
    // Open chat if it's an actual click
    if (isActualClick && onOpen) {
      onOpen();
      console.log("Opening Fundi chat - click detected");
    } else {
      console.log("Click suppressed - detected as part of drag operation");
    }
    
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    // Mark that we've actually moved (dragged)
    setWasDragged(true);
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    // Mark that we've actually moved (dragged)
    setWasDragged(true);
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    // Set isDragging to false immediately
    setIsDragging(false);
    
    // If we've been dragging, we need to prevent the click event that will follow
    if (wasDragged) {
      // Store the last drag time on the window object for reference
      const now = Date.now();
      (window as any).lastDragTime = now;
      
      // Calculate drag distance for logging
      const dragDistance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
      console.log(`Drag ended with distance: ${dragDistance.toFixed(0)}px`);
      
      // CRITICAL: Prevent click events immediately after dragging by capturing the
      // next click event and stopping it. This handles synthetic clicks from pointerup events.
      const preventNextClick = (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();
        console.log('Prevented click after drag');
        document.removeEventListener('click', preventNextClick, true);
      };
      
      // Add capturing click listener to block the first click after dragging
      document.addEventListener('click', preventNextClick, true);
      
      console.log(`Current Fundi position: x=${position.x.toFixed(0)}px, y=${position.y.toFixed(0)}px`);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // Set isDragging to false immediately
    setIsDragging(false);
    
    // If we've been dragging, we need to prevent the touch events that will follow
    if (wasDragged) {
      // Store the last drag time on the window object for reference
      const now = Date.now();
      (window as any).lastDragTime = now;
      
      // Calculate drag distance for logging
      const dragDistance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
      console.log(`Touch drag ended with distance: ${dragDistance.toFixed(0)}px`);
      
      // CRITICAL: Prevent touchend/click events immediately after dragging
      const preventNextClick = (event: MouseEvent | TouchEvent) => {
        event.stopPropagation();
        event.preventDefault();
        console.log('Prevented touch click after drag');
        document.removeEventListener('click', preventNextClick, true);
        document.removeEventListener('touchend', preventNextClick, true);
      };
      
      // Add capturing click and touch listeners to block the first touch after dragging
      document.addEventListener('click', preventNextClick, true);
      document.addEventListener('touchend', preventNextClick, true);
      
      console.log(`Current Fundi position: x=${position.x.toFixed(0)}px, y=${position.y.toFixed(0)}px`);
    }
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
  
  // Reset wasDragged after a shorter delay to make Fundi more responsive
  useEffect(() => {
    if (wasDragged) {
      const timer = setTimeout(() => {
        setWasDragged(false);
      }, 300); // Further reduced from 800ms to 300ms for more immediate response
      
      return () => clearTimeout(timer);
    }
  }, [wasDragged]);
  
  // Log initial position when component mounts and update when position changes
  useEffect(() => {
    console.log(`Fundi position: top=8px, right=24px, translate(${position.x}px, ${position.y}px)`);
  }, [position.x, position.y]);
  
  // Hide the "Click to chat" indicator after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClickIndicator(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);

  // Much smaller size variants
  const sizeVariants = {
    xs: 'w-16 h-16',  // 64px
    sm: 'w-20 h-20',  // 80px
    md: 'w-24 h-24',  // 96px
    lg: 'w-28 h-28',  // 112px
    xl: 'w-32 h-32'   // 128px
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

  // This function handles ONLY opening the chat, separate from any drag handling
  const openChatOnly = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent elements
    if (onOpen && !wasDragged) {
      onOpen();
      console.log("FUNDI CHAT OPENED - Click handled by inner button");
      
      // Also dispatch the force open event with position data
      if (typeof window !== 'undefined') {
        const openFundiEvent = new CustomEvent('forceFundiOpen', { 
          detail: { 
            position: {
              x: position.x,
              y: position.y
            }
          }
        });
        window.dispatchEvent(openFundiEvent);
        console.log(`Dispatched forceFundiOpen event from openChatOnly with position: (${position.x}, ${position.y})`);
      }
    }
  };
  
  // Consolidated function to handle all chat opening scenarios
  const handleOpenChat = (e: React.MouseEvent) => {
    console.log("Handle Open Chat called");
    e.stopPropagation();
    
    // CRITICAL: If the click is too close to the end of a drag, completely ignore it
    const lastDragTime = (window as any).lastDragTime || 0;
    const timeSinceLastDrag = Date.now() - lastDragTime;
    const minClickDelay = 300; // ms - minimum time after a drag before accepting clicks
    
    if (timeSinceLastDrag < minClickDelay) {
      console.log(`Click rejected - too soon after drag (${timeSinceLastDrag}ms < ${minClickDelay}ms)`);
      e.preventDefault();
      return;
    }
    
    // Calculate drag distance (for logging only)
    const dragDistance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
    
    // Only allow opening if not currently dragging
    const canOpen = !isDragging && !wasDragged;
    
    if (canOpen && onOpen) {
      console.log("Opening chat - conditions satisfied");
      // Call the onOpen callback
      onOpen();
      
      // Dispatch custom event with current position so the chat can appear near the Fundi robot
      if (typeof window !== 'undefined') {
        const openFundiEvent = new CustomEvent('forceFundiOpen', { 
          detail: { 
            position: {
              x: position.x,
              y: position.y
            }
          }
        });
        window.dispatchEvent(openFundiEvent);
        console.log(`Dispatched forceFundiOpen event with position: (${position.x}, ${position.y})`);
      }
    } else {
      console.log(`Chat not opened - conditions not met: isDragging=${isDragging}, wasDragged=${wasDragged}, timeSinceLastDrag=${timeSinceLastDrag}ms`);
    }
  };

  return (
    <div 
      data-fundi-robot="true"
      className={cn(
        "fixed",
        // Using cursor-grab instead of cursor-pointer to make draggability obvious
        isDragging ? "cursor-grabbing" : "cursor-grab",
        sizeVariants[size],
        interactive && "hover:scale-105 transition-transform"
      )}
      style={{
        position: 'fixed',
        top: '8px',
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 9999,
        touchAction: 'none',
        userSelect: 'none',
        width: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        height: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        minWidth: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        minHeight: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px'
      }}
      title="Drag to reposition Fundi"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenChat}
    >
      {/* Removed "Click to chat" indicator as requested by the user */}
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
        onClick={handleOpenChat}
      >
        {/* Robot head */}
        <rect x="25" y="20" width="50" height="40" rx="10" fill="#e6e6e6" />
        <rect x="30" y="30" width="40" height="20" rx="5" fill="#222" />
        
        {/* Eyes - change based on emotions */}
        {emotion === 'happy' || lastResponse?.sentiment === 'encouraging' ? (
          // Happy eyes (curved)
          <>
            <path 
              d="M35,40 Q40,35 45,40" 
              stroke={color} 
              strokeWidth="3" 
              fill="none"
              className={speaking ? "animate-pulse" : ""}
            />
            <path 
              d="M55,40 Q60,35 65,40" 
              stroke={color} 
              strokeWidth="3" 
              fill="none"
              className={speaking ? "animate-pulse" : ""}
            />
          </>
        ) : emotion === 'curious' || thinking || lastResponse?.sentiment === 'cautious' ? (
          // Curious/thinking eyes (one wider)
          <>
            <ellipse 
              cx="40" 
              cy="40" 
              rx="5" 
              ry="4" 
              fill={color}
              className={thinking ? "animate-pulse" : ""}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="6" 
              fill={color}
              className={thinking ? "animate-pulse" : ""}
            />
          </>
        ) : emotion === 'supportive' || lastResponse?.sentiment === 'empathetic' ? (
          // Supportive eyes (softer)
          <>
            <circle 
              cx="40" 
              cy="40" 
              r="5" 
              fill={color}
              opacity="0.8"
              className={speaking ? "animate-pulse" : ""}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="5" 
              fill={color}
              opacity="0.8"
              className={speaking ? "animate-pulse" : ""}
            />
          </>
        ) : emotion === 'enthusiastic' || lastResponse?.sentiment === 'excited' ? (
          // Enthusiastic eyes (star-like)
          <>
            <circle 
              cx="40" 
              cy="40" 
              r="5" 
              fill={color}
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="5" 
              fill={color}
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
          </>
        ) : (
          // Default neutral eyes
          <>
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
          </>
        )}
        
        {/* Antenna */}
        <rect x="45" y="15" width="10" height="5" rx="2.5" fill={color} />
        <rect x="47.5" y="10" width="5" height="5" rx="2.5" fill="#e6e6e6" />
        
        {/* Robot body */}
        <path 
          d="M30,60 C30,80 30,90 50,90 C70,90 70,80 70,60 Z" 
          fill="#f5f5f5" 
        />
        
        {/* Mouth/Speaker - changes with speaking state */}
        {speaking ? (
          <path 
            d="M42,75 Q50,80 58,75" 
            stroke={color} 
            strokeWidth="3" 
            fill="none"
            className="animate-pulse"
          />
        ) : emotion === 'happy' || lastResponse?.sentiment === 'encouraging' ? (
          <path 
            d="M42,75 Q50,80 58,75" 
            stroke={color} 
            strokeWidth="3" 
            fill="none"
          />
        ) : emotion === 'curious' || lastResponse?.sentiment === 'cautious' ? (
          <circle 
            cx="50" 
            cy="75" 
            r="5" 
            fill={color} 
            opacity="0.8"
          />
        ) : emotion === 'supportive' || lastResponse?.sentiment === 'empathetic' ? (
          <path 
            d="M42,77 L58,77" 
            stroke={color} 
            strokeWidth="3"
            opacity="0.8" 
          />
        ) : (
          <circle 
            cx="50" 
            cy="75" 
            r="8" 
            fill={color} 
            className={speaking ? "animate-pulse" : ""} 
            opacity="0.8"
          />
        )}
        
        {/* Invisible click target overlay - ensures we have a reliable clickable element */}
        <rect 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="transparent"
          onClick={handleOpenChat}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </svg>
    </div>
  );
}