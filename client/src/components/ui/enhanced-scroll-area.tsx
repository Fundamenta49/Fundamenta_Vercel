import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const EnhancedScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => {
  // Use refs to add touch event handling
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const internalRootRef = React.useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  
  // Check if content is scrollable (to show visual indicators)
  React.useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainerRef.current;
      if (container) {
        // Check if content is taller than container
        const hasScroll = container.scrollHeight > container.clientHeight;
        setIsScrollable(hasScroll);
      }
    };
    
    // Initial check
    checkScrollable();
    
    // Also check after window resize or content changes
    window.addEventListener('resize', checkScrollable);
    const resizeObserver = new ResizeObserver(checkScrollable);
    
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', checkScrollable);
      resizeObserver.disconnect();
    };
  }, []);

  // Enhanced touch handling for better mobile scrolling
  React.useEffect(() => {
    const viewport = viewportRef.current;
    const container = scrollContainerRef.current;
    
    if (!viewport || !container) return;
    
    // Prevent scroll propagation to the parent
    const handleTouchStart = (e: TouchEvent) => {
      e.stopPropagation();
    };
    
    // Handle scrolling momentum
    const handleTouchMove = (e: TouchEvent) => {
      if (container.scrollHeight > container.clientHeight) {
        e.stopPropagation();
      }
    };
    
    // Improve scroll responsiveness
    viewport.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewport.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Add wheel event handling for better desktop scrolling
    const handleWheel = (e: WheelEvent) => {
      if (container.scrollHeight > container.clientHeight) {
        e.stopPropagation();
      }
    };
    
    viewport.addEventListener('wheel', handleWheel, { passive: true });
    
    return () => {
      viewport.removeEventListener('touchstart', handleTouchStart);
      viewport.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport 
        ref={viewportRef}
        className="h-full w-full rounded-[inherit]"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth'
        }}
      >
        <div 
          ref={scrollContainerRef}
          className={cn(
            "dialog-scroll-container",
            isScrollable && "is-scrollable"
          )}
        >
          {children}
        </div>
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
})
EnhancedScrollArea.displayName = "EnhancedScrollArea"

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { EnhancedScrollArea, ScrollBar }