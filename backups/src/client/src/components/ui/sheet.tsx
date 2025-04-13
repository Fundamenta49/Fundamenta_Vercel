import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  
  // For swipe gesture
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Set up opacity and scale based on swipe direction
  const getOpacity = () => {
    switch (side) {
      case "left": return useTransform(x, [0, -100], [1, 0.5]);
      case "right": return useTransform(x, [0, 100], [1, 0.5]);
      case "top": return useTransform(y, [0, -100], [1, 0.5]);
      case "bottom": return useTransform(y, [0, 100], [1, 0.5]);
      default: return useTransform(x, [0, 100], [1, 0.5]);
    }
  };
  
  const getScale = () => {
    switch (side) {
      case "left": 
      case "right": return useTransform(x, [0, 100], [1, 0.95]);
      case "top":
      case "bottom": return useTransform(y, [0, 100], [1, 0.95]);
      default: return useTransform(x, [0, 100], [1, 0.95]);
    }
  };
  
  const opacity = getOpacity();
  const scale = getScale();
  
  // Configure drag directions based on sheet position
  const getDragDirection = () => {
    switch (side) {
      case "left": return "x";
      case "right": return "x";
      case "top": return "y";
      case "bottom": return "y";
      default: return "x";
    }
  };
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Determine threshold for closing based on side
    let shouldClose = false;
    
    switch (side) {
      case "left":
        shouldClose = info.offset.x < -100;
        break;
      case "right":
        shouldClose = info.offset.x > 100;
        break;
      case "top":
        shouldClose = info.offset.y < -100;
        break;
      case "bottom":
        shouldClose = info.offset.y > 100;
        break;
      default:
        shouldClose = info.offset.x > 100;
    }
    
    // If swiped enough, trigger the close button
    if (shouldClose && isMobile && closeRef.current) {
      closeRef.current.click();
    } else {
      // Otherwise, animate back to original position
      x.set(0);
      y.set(0);
    }
  };
  
  return (
    <SheetPortal>
      <SheetOverlay />
      {isMobile ? (
        <motion.div
          style={{ 
            x,
            y,
            opacity,
            scale,
            position: 'fixed',
            zIndex: 50
          }}
          className={cn(sheetVariants({ side }), className)}
          drag={getDragDirection()}
          dragConstraints={side === "left" || side === "right" ? { left: 0, right: 0 } : { top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {/* Swipe handle indicator */}
          <div className="w-full flex flex-col items-center mb-4">
            <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <p className="text-xs text-gray-400 mt-1">
              {side === "left" ? "Swipe left to close" : 
               side === "right" ? "Swipe right to close" :
               side === "top" ? "Swipe up to close" :
               "Swipe down to close"}
            </p>
          </div>
          
          {children}
          
          {/* Hidden close button for programmatic clicking */}
          <SheetPrimitive.Close 
            ref={closeRef}
            className="sr-only"
          >
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
          
          {/* Visible close button */}
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </motion.div>
      ) : (
        <SheetPrimitive.Content
          ref={ref}
          className={cn(sheetVariants({ side }), className)}
          {...props}
        >
          {children}
          <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      )}
    </SheetPortal>
  );
})
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
