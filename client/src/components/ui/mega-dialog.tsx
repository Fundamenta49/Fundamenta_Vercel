import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const MegaDialog = DialogPrimitive.Root

const MegaDialogTrigger = DialogPrimitive.Trigger

const MegaDialogPortal = DialogPrimitive.Portal

const MegaDialogClose = DialogPrimitive.Close

const MegaDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
MegaDialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const MegaDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <MegaDialogPortal>
    <MegaDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-background p-0 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "w-screen h-screen max-w-full min-w-full max-h-full min-h-full overflow-hidden",
        className
      )}
      style={{
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        border: 'none',
        borderRadius: 0
      }}
      {...props}
    >
      {children}
      <MegaDialogClose className="absolute right-4 top-4 rounded-full p-2 opacity-100 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-[999] bg-pink-200 hover:bg-pink-300 border border-pink-300 shadow-md" 
      onClick={() => {
        console.log('MegaDialog close button clicked');
      }}
      style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <X className="h-5 w-5 text-pink-600" />
        <span className="sr-only">Close</span>
      </MegaDialogClose>
    </DialogPrimitive.Content>
  </MegaDialogPortal>
))
MegaDialogContent.displayName = DialogPrimitive.Content.displayName

const MegaDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b sticky top-0 bg-background z-10",
      className
    )}
    {...props}
  />
)
MegaDialogHeader.displayName = "MegaDialogHeader"

const MegaDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 border-t sticky bottom-0 bg-background z-10",
      className
    )}
    {...props}
  />
)
MegaDialogFooter.displayName = "MegaDialogFooter"

const MegaDialogTitle = React.forwardRef<
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
MegaDialogTitle.displayName = DialogPrimitive.Title.displayName

const MegaDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
MegaDialogDescription.displayName = DialogPrimitive.Description.displayName

const MegaDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "p-6 pt-0 overflow-y-auto",
      className
    )}
    style={{ height: 'calc(100vh - 130px)' }}
    {...props}
  />
)
MegaDialogBody.displayName = "MegaDialogBody"

export {
  MegaDialog,
  MegaDialogPortal,
  MegaDialogOverlay,
  MegaDialogClose,
  MegaDialogTrigger,
  MegaDialogContent,
  MegaDialogHeader,
  MegaDialogFooter,
  MegaDialogTitle,
  MegaDialogDescription,
  MegaDialogBody,
}