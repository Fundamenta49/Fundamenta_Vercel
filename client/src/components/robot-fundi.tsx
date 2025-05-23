import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAIEventStore } from '@/lib/ai-event-system';
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';

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
  // Get stored position from localStorage or use default
  const getStoredPosition = () => {
    if (typeof window !== 'undefined') {
      const storedPosition = localStorage.getItem('fundiPosition');
      if (storedPosition) {
        try {
          return JSON.parse(storedPosition);
        } catch (e) {
          console.error('Failed to parse stored position', e);
        }
      }
    }
    return { x: 57, y: 8 }; // Default position (moved 6px to the left)
  };
  
  // Get stored minimized state from localStorage or use default
  const getStoredMinimizedState = () => {
    if (typeof window !== 'undefined') {
      const storedState = localStorage.getItem('fundiMinimized');
      if (storedState) {
        try {
          return JSON.parse(storedState) === true;
        } catch (e) {
          console.error('Failed to parse stored minimized state', e);
        }
      }
    }
    return false; // Default to not minimized
  };
  
  const [position, setPosition] = useState(getStoredPosition());
  const [isDragging, setIsDragging] = useState(false);
  const [wasDragged, setWasDragged] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showClickIndicator, setShowClickIndicator] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragEndTime, setDragEndTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(getStoredMinimizedState());
  const { lastResponse } = useAIEventStore();
  const { isJungleTheme } = useJungleTheme();
  
  // For double tap detection - new approach using click counter
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // For double click detection
  const lastTapTimeRef = useRef(0);
  const doubleTapProcessingRef = useRef(false);
  
  // Track if this is the first render to avoid auto-opening immediately after page load
  const isFirstRender = React.useRef(true);
  
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
    
    // Using the same click counter approach for touch events
    // Increment the click count
    clickCountRef.current += 1;
    
    // Clear any existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    // If this is the first tap, set a timer to reset the count
    if (clickCountRef.current === 1) {
      // Set a timer to reset after 400ms (standard double-tap timeout)
      clickTimerRef.current = setTimeout(() => {
        // If only one tap happened in the time window, proceed with dragging
        if (clickCountRef.current === 1) {
          // Reset click count for next time
          clickCountRef.current = 0;
          clickTimerRef.current = null;
        }
      }, 400);
    } 
    // If this is the second tap, handle as a double-tap
    else if (clickCountRef.current === 2) {
      console.log(`Double-tap detected! Toggling Fundi minimized state`);
      
      // Toggle minimize state
      setIsMinimized(prev => !prev);
      
      // Reset click count immediately
      clickCountRef.current = 0;
      clickTimerRef.current = null;
      
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    // Continue with normal touch handling for dragging
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
    
    // If we're already processing a double click, don't trigger again
    if (doubleTapProcessingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    // Check for double click
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;
    
    // If double click detected (time between clicks is between 10-300ms)
    if (timeDiff < 300 && timeDiff > 10) {
      // Set processing flag to prevent double triggers
      doubleTapProcessingRef.current = true;
      
      // Toggle minimize state
      setIsMinimized(prev => !prev);
      console.log(`Double-click detected! Fundi ${isMinimized ? 'maximized' : 'minimized'}`);
      e.stopPropagation();
      e.preventDefault();
      
      // Reset last click time
      lastTapTimeRef.current = 0;
      
      // Reset processing flag after animation completes
      setTimeout(() => {
        doubleTapProcessingRef.current = false;
      }, 500);
      return;
    }
    
    // Store the time of this click for potential double-click detection
    lastTapTimeRef.current = now;
    
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
    if (isActualClick && onOpen && !isMinimized) {
      onOpen();
      console.log("Opening Fundi chat - click detected");
    } else {
      console.log("Click suppressed - detected as part of drag operation or Fundi is minimized");
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
    
    // If we've been dragging, save the position but don't block any clicks
    if (wasDragged) {
      // Store the last drag time for reference
      const now = Date.now();
      setDragEndTime(now);
      (window as any).lastDragTime = now;
      
      // Important: NEVER set disableClicks to true anymore
      (window as any).disableClicks = false;
      
      // Save Fundi's position to localStorage immediately after drag ends
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fundiPosition', JSON.stringify(position));
          console.log('Saved Fundi position to localStorage after drag');
        } catch (e) {
          console.error('Failed to save position to localStorage', e);
        }
      }
      
      // Calculate drag distance for logging
      const dragDistance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
      console.log(`Drag ended with distance: ${dragDistance.toFixed(0)}px`);
      
      // Reset wasDragged very quickly now
      setTimeout(() => {
        setWasDragged(false);
        console.log('Quick reset of wasDragged state');
      }, 50);
      
      console.log(`Current Fundi position: x=${position.x.toFixed(0)}px, y=${position.y.toFixed(0)}px`);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // Set isDragging to false immediately
    setIsDragging(false);
    
    // If we've been dragging, save the position but don't block any clicks
    if (wasDragged) {
      // Store the last drag time for reference
      const now = Date.now();
      setDragEndTime(now);
      (window as any).lastDragTime = now;
      
      // Important: NEVER set disableClicks to true anymore
      (window as any).disableClicks = false;
      
      // Save Fundi's position to localStorage immediately after drag ends
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('fundiPosition', JSON.stringify(position));
          console.log('Saved Fundi position to localStorage after touch drag');
        } catch (e) {
          console.error('Failed to save position to localStorage', e);
        }
      }
      
      // Calculate drag distance for logging
      const dragDistance = Math.sqrt(Math.pow(position.x, 2) + Math.pow(position.y, 2));
      console.log(`Touch drag ended with distance: ${dragDistance.toFixed(0)}px`);
      
      // Reset wasDragged very quickly now
      setTimeout(() => {
        setWasDragged(false);
        console.log('Quick reset of wasDragged state after touch');
      }, 50);
      
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
        // Also reset the disableClicks flag to ensure clickability returns
        (window as any).disableClicks = false;
        console.log('Explicitly resetting wasDragged and disableClicks states');
      }, 500); // Increased from 300ms to 500ms for better stability
      
      return () => clearTimeout(timer);
    }
  }, [wasDragged]);
  
  // Log initial position when component mounts and update when position changes
  // Also store position in localStorage to persist across page refreshes
  useEffect(() => {
    console.log(`Fundi position: top=8px, right=24px, translate(${position.x}px, ${position.y}px)`);
    
    // Save position to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('fundiPosition', JSON.stringify(position));
    }
  }, [position.x, position.y]);
  
  // Hide the "Click to chat" indicator after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClickIndicator(false);
    }, 6000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Save minimized state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fundiMinimized', JSON.stringify(isMinimized));
      console.log(`Saved Fundi minimized state (${isMinimized}) to localStorage`);
    }
  }, [isMinimized]);
  
  // Force reset position on first load to ensure new position takes effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear any stored position to force using the new default
      localStorage.removeItem('fundiPosition');
      console.log('Forced reset of Fundi position to use new default position');
    }
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

  // When in jungle mode, use jungle theme colors regardless of category
  const color = isJungleTheme 
    ? '#2A6D4D' // Jungle green for eyes/features when in jungle mode 
    : (categoryColors[category] || categoryColors.general);
    
  // Define accent colors for different parts of the robot based on the main color
  const robotColors = {
    // Main accent color (from category)
    main: color,
    // Light background for head and body in non-jungle mode
    lightBg: isJungleTheme ? "#ECEFD2" : "#e6e6e6",
    // Very light background for body in non-jungle mode
    veryLightBg: isJungleTheme ? "#EFF3D6" : "#f5f5f5",
    // Antenna light color - uses category color in non-jungle mode
    antennaLight: isJungleTheme ? "#AECBA9" : color,
    // Screen background is always dark
    screenBg: "#222"
  };
  
  // For debugging - log the category and color being used
  console.log(`Fundi using category: ${category} with color: ${color}`);

  // This function handles ONLY opening the chat, separate from any drag handling
  const openChatOnly = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to parent elements
    
    // If we're already processing a double click, don't trigger again
    if (doubleTapProcessingRef.current) {
      e.preventDefault();
      return;
    }
    
    // Check for double click first
    const now = Date.now();
    const timeDiff = now - lastTapTimeRef.current;
    
    // If double click detected (time between clicks is between 10-300ms)
    if (timeDiff < 300 && timeDiff > 10) {
      // Set processing flag to prevent double triggers
      doubleTapProcessingRef.current = true;
      
      // Toggle minimize state
      setIsMinimized(prev => !prev);
      console.log(`Double-click detected! Fundi ${isMinimized ? 'maximized' : 'minimized'}`);
      e.preventDefault();
      
      // Reset last click time
      lastTapTimeRef.current = 0;
      
      // Reset processing flag after animation completes
      setTimeout(() => {
        doubleTapProcessingRef.current = false;
      }, 500);
      return;
    }
    
    // Store the time of this click for potential double-click detection
    lastTapTimeRef.current = now;
    
    // Reset ALL global flags to ensure clickability
    (window as any).disableClicks = false;
    (window as any).lastDragTime = 0;
    (window as any).fundiPageLoadTime = 0;
    
    // Very simplified checks - ONLY check if currently dragging
    if (isDragging) {
      console.log('Inner click rejected - currently dragging');
      e.preventDefault();
      return;
    }
    
    // If minimized, don't open chat on single click
    if (isMinimized) {
      console.log('Chat opening suppressed - Fundi is minimized');
      return;
    }
    
    // Force reset drag state
    setWasDragged(false);
    
    // ALWAYS open the chat - GUARANTEED to work (unless minimized)
    if (onOpen) {
      onOpen();
      console.log("FUNDI CHAT OPENED - Click handled by inner button (GUARANTEED CLICK)");
      
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
    e.preventDefault(); // ALWAYS prevent default

    // Increment the click count
    clickCountRef.current += 1;
    
    // Clear any existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    // If this is the first click, set a timer to reset the count
    if (clickCountRef.current === 1) {
      // Set a timer to reset after 400ms (standard double-click timeout)
      clickTimerRef.current = setTimeout(() => {
        // If only one click happened in the time window, treat as a single click
        if (clickCountRef.current === 1) {
          console.log("Single click detected - attempting to open chat");
          
          // Only open if not minimized and not dragging
          if (!isMinimized && !isDragging) {
            // EMERGENCY OVERRIDE - Reset all flags
            (window as any).disableClicks = false;
            (window as any).fundiPageLoadTime = 0;
            
            // Force reset drag state
            setWasDragged(false);
            
            // Open the chat
            if (onOpen) {
              onOpen();
              console.log("Opening chat - single click verified");
              
              // Dispatch positioning event
              if (typeof window !== 'undefined') {
                const openFundiEvent = new CustomEvent('forceFundiOpen', { 
                  detail: { position: { x: position.x, y: position.y } }
                });
                window.dispatchEvent(openFundiEvent);
              }
            }
          } else {
            console.log('Chat opening suppressed - Fundi is minimized or dragging');
          }
        }
        
        // Reset click count for next time
        clickCountRef.current = 0;
        clickTimerRef.current = null;
      }, 400);
    } 
    // If this is the second click, handle as a double-click
    else if (clickCountRef.current === 2) {
      console.log(`Double-click detected! Toggling Fundi minimized state`);
      
      // Toggle minimize state
      setIsMinimized(prev => !prev);
      
      // Reset click count immediately
      clickCountRef.current = 0;
      clickTimerRef.current = null;
    }
    // If somehow more than two clicks registered, reset
    else {
      clickCountRef.current = 0;
      clickTimerRef.current = null;
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
        zIndex: 9999,
        touchAction: 'none',
        userSelect: 'none',
        width: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        height: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        minWidth: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        minHeight: size === 'xl' ? '128px' : size === 'lg' ? '112px' : size === 'md' ? '96px' : size === 'sm' ? '80px' : '64px',
        opacity: isMinimized ? 0.3 : 1,
        transform: `translate(${position.x}px, ${position.y}px) scale(${isMinimized ? 0.5 : 1})`,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
      title={isMinimized ? "Double-tap to restore Fundi" : "Drag to reposition Fundi or double-tap to minimize"}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenChat}
    >
      {/* Radiating glow effect */}
      <div 
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '90%',
          height: '90%',
          borderRadius: '50%',
          backgroundColor: robotColors.main,
          filter: 'blur(10px)',
          opacity: 0.3,
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
          pointerEvents: 'none',
          transition: 'background-color 0.3s ease'
        }}
      />
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
        {/* Jungle hat for themed mode */}
        {isJungleTheme && (
          <>
            {/* Safari/explorer hat - bigger and more prominent */}
            <ellipse cx="50" cy="20" rx="30" ry="9" fill="#E6B933" />
            <path d="M30 20 Q50 5 70 20" fill="#C49A2B" stroke="#BF8C25" strokeWidth="1.5" />
            <rect x="35" y="13" width="30" height="7" rx="2" fill="#BF8C25" />
            {/* Small leaf on hat */}
            <path d="M65 14 Q70 10 68 16" fill="#2A6D4D" stroke="#2A6D4D" strokeWidth="1.5" />
            {/* Second leaf */}
            <path d="M62 12 Q65 8 67 13" fill="#2A6D4D" stroke="#2A6D4D" strokeWidth="1" />
            {/* Hat band */}
            <path d="M28 20 C28 20, 72 20, 72 20" stroke="#5A3D1C" strokeWidth="2.5" fill="none" />
          </>
        )}
        
        {/* Robot head */}
        <rect 
          x="25" 
          y="20" 
          width="50" 
          height="40" 
          rx="10" 
          fill={robotColors.lightBg} 
        />
        <rect x="30" y="30" width="40" height="20" rx="5" fill={robotColors.screenBg} />
        
        {/* Eyes - change based on emotions */}
        {emotion === 'happy' || lastResponse?.sentiment === 'encouraging' ? (
          // Happy eyes (curved)
          <>
            <path 
              d="M35,40 Q40,35 45,40" 
              stroke={robotColors.main} 
              strokeWidth="3" 
              fill="none"
              className={speaking ? "animate-pulse" : ""}
            />
            <path 
              d="M55,40 Q60,35 65,40" 
              stroke={robotColors.main} 
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
              fill={robotColors.main}
              className={thinking ? "animate-pulse" : ""}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="6" 
              fill={robotColors.main}
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
              fill={robotColors.main}
              opacity="0.8"
              className={speaking ? "animate-pulse" : ""}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="5" 
              fill={robotColors.main}
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
              fill={robotColors.main}
              className="animate-ping"
              style={{ animationDuration: '3s' }}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="5" 
              fill={robotColors.main}
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
              fill={robotColors.main}
              className={speaking ? "animate-pulse" : ""}
            />
            <circle 
              cx="60" 
              cy="40" 
              r="5" 
              fill={robotColors.main}
              className={speaking ? "animate-pulse" : ""}
            />
          </>
        )}
        
        {/* Antenna */}
        <rect x="45" y="15" width="10" height="5" rx="2.5" fill={robotColors.main} />
        <rect x="47.5" y="10" width="5" height="5" rx="2.5" fill={robotColors.antennaLight} />
        
        {/* Robot body - only show in non-jungle mode */}
        {!isJungleTheme && (
          <path 
            d="M30,60 C30,80 30,90 50,90 C70,90 70,80 70,60 Z" 
            fill={robotColors.veryLightBg} 
          />
        )}
        
        {/* Jungle adventure outfit */}
        {isJungleTheme && (
          <>
            {/* Left shoulder strap */}
            <path 
              d="M40,60 L35,90" 
              stroke="#2A6D4D" 
              strokeWidth="5" 
              strokeLinecap="round"
            />
            {/* Right shoulder strap */}
            <path 
              d="M60,60 L65,90" 
              stroke="#2A6D4D" 
              strokeWidth="5" 
              strokeLinecap="round"
            />
            {/* Explorer badge */}
            <circle 
              cx="50" 
              cy="65" 
              r="7" 
              fill="#E6B933" 
              stroke="#5A3D1C" 
              strokeWidth="1"
            />
            <path 
              d="M46,65 L54,65" 
              stroke="#5A3D1C" 
              strokeWidth="1.5"
            />
            <path 
              d="M50,61 L50,69" 
              stroke="#5A3D1C" 
              strokeWidth="1.5"
            />
          </>
        )}
        
        {/* Mouth/Speaker - changes with speaking state */}
        {speaking ? (
          <path 
            d="M42,75 Q50,80 58,75" 
            stroke={robotColors.main} 
            strokeWidth="3" 
            fill="none"
            className="animate-pulse"
          />
        ) : emotion === 'happy' || lastResponse?.sentiment === 'encouraging' ? (
          <path 
            d="M42,75 Q50,80 58,75" 
            stroke={robotColors.main} 
            strokeWidth="3" 
            fill="none"
          />
        ) : emotion === 'curious' || lastResponse?.sentiment === 'cautious' ? (
          <circle 
            cx="50" 
            cy="75" 
            r="5" 
            fill={robotColors.main} 
            opacity="0.8"
          />
        ) : emotion === 'supportive' || lastResponse?.sentiment === 'empathetic' ? (
          <path 
            d="M42,77 L58,77" 
            stroke={robotColors.main} 
            strokeWidth="3"
            opacity="0.8" 
          />
        ) : (
          <circle 
            cx="50" 
            cy="75" 
            r="8" 
            fill={robotColors.main} 
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