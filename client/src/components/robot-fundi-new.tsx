import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAIEventStore } from "@/lib/ai-event-system";

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
    return { x: 63, y: 8 }; // Default position
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
  
  // For double click/tap detection - click counter approach
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preventNextClickRef = useRef(false);
  const wasMinimizedRef = useRef(getStoredMinimizedState()); // Track previous minimized state
  
  // Track if this is the first render to avoid auto-opening immediately after page load
  const isFirstRender = useRef(true);
  
  // Removed emergency click handlers since they were causing auto-opening after dragging
  useEffect(() => {
    console.log("Emergency click handlers disabled - using only standard click handling");
    return () => {};
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    // If we recently detected a double-click, don't start dragging
    if (preventNextClickRef.current) {
      e.stopPropagation();
      return;
    }
    
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
    
    // Handle clicks using our counter approach
    handleTapEvent(e);
    
    // Only set up dragging if we're not handling a double-tap
    if (!preventNextClickRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
    
    // Prevent event propagation
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
      
      // Update the previous state ref
      const previousState = wasMinimizedRef.current;
      wasMinimizedRef.current = isMinimized;
      
      // If we're transitioning from minimized to normal, don't automatically open chat
      if (previousState === true && isMinimized === false) {
        console.log('Fundi restored from minimized state - not opening chat automatically');
        
        // Dispatch an event to prevent chat opening
        if (typeof window !== 'undefined') {
          const preventChatOpenEvent = new CustomEvent('preventFundiChatOpen', {
            detail: { timestamp: Date.now() }
          });
          window.dispatchEvent(preventChatOpenEvent);
        }
      }
    }
  }, [isMinimized]);

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

  // Function to handle tap/click events in a unified way
  const handleTapEvent = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    
    // If we were just dragging, don't process clicks
    if (wasDragged || isDragging) {
      console.log('Click/tap suppressed - detected as part of drag operation');
      return;
    }
    
    // Increment the click count
    clickCountRef.current += 1;
    
    // Clear any existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    // If this is the first click, set a timer to reset the count
    if (clickCountRef.current === 1) {
      console.log("First tap detected, waiting for potential second tap");
      
      // Set a timer to reset after 300ms (standard double-click timeout)
      clickTimerRef.current = setTimeout(() => {
        // If only one click happened in the time window, treat as a single click
        if (clickCountRef.current === 1) {
          console.log("Single tap confirmed - attempting to open chat");
          
          // Only open if not minimized
          if (!isMinimized) {
            // Call the onOpen callback to open the chat
            if (onOpen) {
              // Reset all flags to ensure proper operation
              (window as any).disableClicks = false;
              setWasDragged(false);
              
              onOpen();
              console.log("Opening chat - single tap processed");
              
              // Dispatch positioning event
              if (typeof window !== 'undefined') {
                const openFundiEvent = new CustomEvent('forceFundiOpen', { 
                  detail: { position: { x: position.x, y: position.y } }
                });
                window.dispatchEvent(openFundiEvent);
              }
            }
          } else {
            console.log('Chat opening suppressed - Fundi is minimized');
          }
        }
        
        // Reset flags and click count
        preventNextClickRef.current = false;
        clickCountRef.current = 0;
        clickTimerRef.current = null;
      }, 300);
    } 
    // If this is the second click, handle as a double-click
    else if (clickCountRef.current === 2) {
      console.log(`Double-tap detected! Toggling Fundi minimized state`);
      
      // Prevent drag operations that might be started by the second tap
      preventNextClickRef.current = true;
      
      // Toggle minimize state
      setIsMinimized(prev => !prev);
      
      // Reset click count immediately
      clickCountRef.current = 0;
      
      // Clear timer
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      
      // Reset the prevention flag after a short delay
      setTimeout(() => {
        preventNextClickRef.current = false;
      }, 100);
      
      // Prevent default and stop propagation
      e.preventDefault();
    }
    // If somehow more than two clicks registered, reset
    else {
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
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
      onClick={handleTapEvent}
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
        onClick={handleTapEvent}
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
          onClick={handleTapEvent}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </svg>
    </div>
  );
}