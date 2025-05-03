import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StandardDialogProps {
  /** Dialog title */
  title?: React.ReactNode;
  /** Dialog description text */
  description?: React.ReactNode;
  /** Main content */
  children: React.ReactNode;
  /** Footer content (typically actions/buttons) */
  footer?: React.ReactNode;
  /** Whether the dialog is currently open */
  open?: boolean;
  /** Function called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Element that triggers the dialog */
  trigger?: React.ReactNode;
  /** Maximum width of the dialog */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Whether to show iOS-style blur effect */
  useBlurEffect?: boolean;
  /** Whether the dialog should be closable by clicking outside or escape key */
  closable?: boolean;
  /** Extra CSS classes for the dialog content */
  className?: string;
  /** Extra CSS classes for the header */
  headerClassName?: string;
  /** Extra CSS classes for the content area */
  contentAreaClassName?: string;
  /** Extra CSS classes for the footer */
  footerClassName?: string;
  /** Whether to show the close button in header */
  showCloseButton?: boolean;
  /** Whether to apply fixed positioning for the dialog header */
  fixedHeader?: boolean;
  /** Whether to apply fixed positioning for the dialog footer */
  fixedFooter?: boolean;
  /** Section theme to apply */
  sectionTheme?: 'financial' | 'wellness' | 'career' | 'emergency' | 'learning';
}

/**
 * StandardDialog component based on the Yoga section design patterns
 * Provides consistent dialog styling across the application
 */
export function StandardDialog({
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  trigger,
  maxWidth = 'md',
  useBlurEffect = false,
  closable = true,
  className,
  headerClassName,
  contentAreaClassName,
  footerClassName,
  showCloseButton = true,
  fixedHeader = true,
  fixedFooter = true,
  sectionTheme = 'wellness'
}: StandardDialogProps) {
  // Map maxWidth to Tailwind classes
  const maxWidthMap = {
    xs: 'sm:max-w-xs',
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    full: 'sm:max-w-screen-md'
  };
  
  // Apply section theme colors
  const themeColorMap = {
    financial: 'from-blue-500 via-blue-400 to-blue-300',
    wellness: 'from-green-500 via-green-400 to-green-300',
    career: 'from-purple-500 via-purple-400 to-purple-300',
    emergency: 'from-red-500 via-red-400 to-red-300',
    learning: 'from-yellow-500 via-yellow-400 to-yellow-300'
  };
  
  // Apply backdrop blur effect if enabled
  const blurClass = useBlurEffect ? 'bg-white/95 backdrop-blur-xl' : 'bg-white';
  
  // Apply fixed positioning styles
  const headerPositionClass = fixedHeader ? 'sticky top-0 z-10' : '';
  const footerPositionClass = fixedFooter ? 'sticky bottom-0 z-10' : '';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent 
        className={cn(
          'p-0 rounded-2xl overflow-hidden shadow-lg border-0 max-h-[90vh] flex flex-col',
          maxWidthMap[maxWidth],
          className
        )}
        onInteractOutside={closable ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closable ? undefined : (e) => e.preventDefault()}
      >
        {/* Gradient accent line */}
        <div className={cn('h-1 bg-gradient-to-r', themeColorMap[sectionTheme])} />
        
        {/* Header */}
        {(title || description || showCloseButton) && (
          <DialogHeader 
            className={cn(
              'p-4 sm:p-6 border-b border-gray-100',
              blurClass,
              headerPositionClass,
              headerClassName
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  typeof title === 'string' 
                    ? <DialogTitle className="text-xl font-semibold text-gray-800">{title}</DialogTitle>
                    : title
                )}
                
                {description && (
                  typeof description === 'string' 
                    ? <DialogDescription className="text-sm text-gray-500 mt-1">{description}</DialogDescription>
                    : description
                )}
              </div>
              
              {showCloseButton && (
                <DialogClose className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                  <X className="h-4 w-4" />
                </DialogClose>
              )}
            </div>
          </DialogHeader>
        )}
        
        {/* Main content area with scrolling */}
        <div className={cn(
          'flex-1 overflow-y-auto p-4 sm:p-6',
          contentAreaClassName
        )}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <DialogFooter 
            className={cn(
              'p-4 sm:p-6 border-t border-gray-100',
              blurClass,
              footerPositionClass,
              footerClassName
            )}
          >
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}