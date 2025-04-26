import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  
  // For swipe gesture
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0.5]);
  const scale = useTransform(y, [0, 300], [1, 0.8]);
  
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If user swiped down enough, trigger the close button
    if (info.offset.y > 100 && isMobile && closeRef.current) {
      closeRef.current.click();
    } else {
      // Otherwise, animate back to original position
      y.set(0);
    }
  };
  
  return (
    <DialogPortal>
      <DialogOverlay />
      {isMobile ? (
        <motion.div
          style={{ 
            y,
            opacity,
            scale,
            position: 'fixed',
            left: '50%',
            top: '50%',
            zIndex: 50,
            width: '94vw',
            maxWidth: '450px',
            maxHeight: '85vh',
            transform: 'translate(-50%, -50%)',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            borderRadius: '0.85rem',
            display: 'flex',
            flexDirection: 'column'
          }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="rounded-lg border bg-background shadow-lg"
        >
          {/* Swipe handle indicator - Apple-style minimal design */}
          <div className="w-full flex flex-col items-center pt-2.5 pb-1 bg-white sticky top-0 z-20">
            <div className="w-8 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          
          <DialogPrimitive.Content
            ref={ref}
            className={cn(
              "grid w-full gap-3 pt-6 px-4 pb-4 sm:p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-y-auto bg-white flex-grow",
              className
            )}
            style={{ 
              maxHeight: 'calc(88vh - 30px)', 
              backgroundColor: 'white', 
              overscrollBehavior: 'contain',
              borderTopLeftRadius: '0.75rem',
              borderTopRightRadius: '0.75rem'
            }}
            {...props}
          >
            {children}
            
            {/* Hidden close button for programmatic clicking */}
            <DialogPrimitive.Close 
              ref={closeRef}
              className="sr-only"
            >
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
            
            {/* Visible close button - Apple style */}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 opacity-90 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none bg-gray-100 hover:bg-gray-200 shadow-sm">
              <X className="h-3.5 w-3.5 text-gray-700" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </motion.div>
      ) : (
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed z-50 grid gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-xl",
            className
          )}
          style={{
            width: "95vw",
            maxWidth: "900px",
            maxHeight: "85vh",
            overflow: "auto",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-6 top-6 rounded-full p-1.5 opacity-90 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none bg-gray-100 hover:bg-gray-200 shadow-sm">
            <X className="h-4 w-4 text-gray-700" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      )}
    </DialogPortal>
  );
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
