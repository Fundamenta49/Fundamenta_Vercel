import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

export interface StandardCardProps {
  /** Title for the card */
  title?: React.ReactNode;
  /** Description text to display below the title */
  description?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
  /** Main content for the card */
  children: React.ReactNode;
  /** Optional right-aligned element in header */
  headerRight?: React.ReactNode;
  /** Extra CSS classes to apply to the card */
  className?: string;
  /** Extra CSS classes for the card header */
  headerClassName?: string;
  /** Extra CSS classes for the card content */
  contentClassName?: string;
  /** Extra CSS classes for the card footer */
  footerClassName?: string;
  /** Which section theme to use (affects gradient colors) */
  sectionTheme?: 'financial' | 'wellness' | 'career' | 'emergency' | 'learning';
  /** Whether to show the gradient accent bar at the top */
  showGradient?: boolean;
  /** Whether to use backdrop blur effect (iOS style) */
  useBackdropBlur?: boolean;
  /** Card elevation (shadow size) */
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  /** Whether to make the entire card clickable */
  onClick?: () => void;
}

/**
 * StandardCard component based on the Yoga section design patterns
 * Provides consistent card styling across the application
 */
export function StandardCard({
  title,
  description,
  children,
  footer,
  headerRight,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  sectionTheme = 'wellness',
  showGradient = true,
  useBackdropBlur = false,
  elevation = 'sm',
  onClick
}: StandardCardProps) {
  // Define theme-based gradient colors
  const gradientMap = {
    financial: 'from-blue-500 via-blue-400 to-blue-300',
    wellness: 'from-green-500 via-green-400 to-green-300',
    career: 'from-purple-500 via-purple-400 to-purple-300',
    emergency: 'from-red-500 via-red-400 to-red-300',
    learning: 'from-yellow-500 via-yellow-400 to-yellow-300'
  };
  
  // Define shadow classes based on elevation
  const shadowMap = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };
  
  // Set backdrop blur effect if enabled
  const backdropClass = useBackdropBlur ? 'bg-white/90 backdrop-blur-xl' : 'bg-white';
  
  return (
    <Card 
      className={cn(
        'border-0 rounded-2xl overflow-hidden', 
        shadowMap[elevation],
        onClick ? 'cursor-pointer transition-all duration-200 hover:translate-y-[-2px]' : '',
        className
      )}
      onClick={onClick}
    >
      {/* Optional gradient accent bar */}
      {showGradient && (
        <div className={cn('h-1.5 bg-gradient-to-r', gradientMap[sectionTheme])} />
      )}
      
      {/* Card header (if title or description are provided) */}
      {(title || description) && (
        <CardHeader className={cn(
          'p-4 sm:p-6 border-b border-gray-100', 
          backdropClass,
          headerClassName
        )}>
          <div className="flex items-center justify-between">
            <div>
              {title && (
                typeof title === 'string' 
                  ? <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
                  : title
              )}
              
              {description && (
                typeof description === 'string' 
                  ? <CardDescription className="text-sm text-gray-500 mt-1">{description}</CardDescription>
                  : description
              )}
            </div>
            
            {headerRight && (
              <div>{headerRight}</div>
            )}
          </div>
        </CardHeader>
      )}
      
      {/* Card content */}
      <CardContent className={cn(
        'p-4 sm:p-6 bg-gray-50',
        contentClassName
      )}>
        {children}
      </CardContent>
      
      {/* Optional footer */}
      {footer && (
        <CardFooter className={cn(
          'p-4 sm:p-6 border-t border-gray-100 bg-white',
          footerClassName
        )}>
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}