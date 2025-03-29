import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FullScreenDialog = DialogPrimitive.Root;

const FullScreenDialogTrigger = DialogPrimitive.Trigger;

const FullScreenDialogPortal = DialogPrimitive.Portal;

const FullScreenDialogClose = DialogPrimitive.Close;

const FullScreenDialogOverlay = React.forwardRef<
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
));
FullScreenDialogOverlay.displayName = "FullScreenDialogOverlay";

interface FullScreenDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  themeColor?: string;
}

const FullScreenDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  FullScreenDialogContentProps
>(({ className, themeColor = "#3b82f6", children, ...props }, ref) => (
  <FullScreenDialogPortal>
    <FullScreenDialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 w-full h-full overflow-auto bg-white dark:bg-gray-950 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 md:inset-4 md:rounded-xl",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close 
        className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        style={{ backgroundColor: `${themeColor}20` }}
      >
        <X className="h-6 w-6" style={{ color: themeColor }} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </FullScreenDialogPortal>
));
FullScreenDialogContent.displayName = "FullScreenDialogContent";

const FullScreenDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sticky top-0 z-10 bg-white dark:bg-gray-950 pt-6 px-6 pb-4 flex flex-col gap-1.5 border-b",
      className
    )}
    {...props}
  />
);
FullScreenDialogHeader.displayName = "FullScreenDialogHeader";

const FullScreenDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "sticky bottom-0 z-10 bg-white dark:bg-gray-950 px-6 py-4 flex justify-between items-center border-t",
      className
    )}
    {...props}
  />
);
FullScreenDialogFooter.displayName = "FullScreenDialogFooter";

const FullScreenDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
FullScreenDialogTitle.displayName = "FullScreenDialogTitle";

const FullScreenDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
FullScreenDialogDescription.displayName = "FullScreenDialogDescription";

const FullScreenDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("px-6 py-4", className)}
    {...props}
  />
);
FullScreenDialogBody.displayName = "FullScreenDialogBody";

export {
  FullScreenDialog,
  FullScreenDialogPortal,
  FullScreenDialogOverlay,
  FullScreenDialogClose,
  FullScreenDialogTrigger,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  FullScreenDialogFooter,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
};