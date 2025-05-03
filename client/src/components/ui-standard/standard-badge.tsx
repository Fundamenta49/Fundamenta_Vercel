import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StandardBadgeProps {
  /** Badge content/text */
  children: React.ReactNode;
  /** Optional icon to display */
  icon?: React.ReactNode;
  /** Badge variant */
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'success';
  /** Badge size */
  size?: 'sm' | 'default' | 'lg';
  /** Optional additional classes */
  className?: string;
  /** Whether badge should be pill-shaped */
  pill?: boolean;
  /** Section theme to apply */
  sectionTheme?: 'financial' | 'wellness' | 'career' | 'emergency' | 'learning';
  /** Whether to use iOS blur effect */
  blurEffect?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * StandardBadge component based on Yoga section design patterns
 * Provides consistent badge styling across the application
 */
export function StandardBadge({
  children,
  icon,
  variant = 'default',
  size = 'default',
  className,
  pill = true,
  sectionTheme = 'wellness',
  blurEffect = false,
  onClick
}: StandardBadgeProps) {
  // Section-specific color maps
  const themeColors = {
    financial: {
      default: 'bg-blue-100 text-blue-800',
      outline: 'border-blue-500 text-blue-800', 
      secondary: 'bg-blue-50 text-blue-700',
      success: 'bg-blue-100 text-blue-800'
    },
    wellness: {
      default: 'bg-green-100 text-green-800',
      outline: 'border-green-500 text-green-800',
      secondary: 'bg-green-50 text-green-700',
      success: 'bg-green-100 text-green-800'
    },
    career: {
      default: 'bg-purple-100 text-purple-800',
      outline: 'border-purple-500 text-purple-800',
      secondary: 'bg-purple-50 text-purple-700',
      success: 'bg-purple-100 text-purple-800'
    },
    emergency: {
      default: 'bg-red-100 text-red-800',
      outline: 'border-red-500 text-red-800',
      secondary: 'bg-red-50 text-red-700',
      success: 'bg-red-100 text-red-800'
    },
    learning: {
      default: 'bg-yellow-100 text-yellow-800',
      outline: 'border-yellow-500 text-yellow-800',
      secondary: 'bg-yellow-50 text-yellow-700',
      success: 'bg-yellow-100 text-yellow-800'
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };
  
  // Get correct themed classes based on variant
  const getThemeClasses = () => {
    if (variant === 'destructive') {
      return 'bg-red-100 text-red-800';
    }
    
    return themeColors[sectionTheme][variant === 'success' ? 'success' : variant];
  };
  
  // Apply blur effect if enabled
  const blurClasses = blurEffect ? 'backdrop-blur-sm bg-opacity-80' : '';
  
  // Apply pill shape if enabled
  const shapeClasses = pill ? 'rounded-full' : 'rounded-md';
  
  return (
    <Badge
      variant={variant === 'outline' ? 'outline' : 'secondary'}
      className={cn(
        getThemeClasses(),
        sizeClasses[size],
        shapeClasses,
        blurClasses,
        'font-medium border-[1px] shadow-sm',
        onClick && 'cursor-pointer hover:opacity-90',
        className
      )}
      onClick={onClick}
    >
      {icon && (
        <span className="mr-1 flex items-center">
          {icon}
        </span>
      )}
      {children}
    </Badge>
  );
}