import React from 'react';
import { Progress } from './progress';

interface MiniProgressChartProps {
  percentage: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * A compact progress chart component that displays a percentage
 * 
 * @param percentage The percentage value (0-100)
 * @param label Optional label text to display
 * @param size Size variant (sm, md, lg)
 * @param showLabel Whether to show the percentage label
 * @param className Optional additional CSS classes
 */
export function MiniProgressChart({
  percentage,
  label,
  size = 'md',
  showLabel = true,
  className = ""
}: MiniProgressChartProps) {
  // Input validation and normalization
  const validatedPercentage = (() => {
    if (typeof percentage !== 'number' || isNaN(percentage)) {
      console.warn("MiniProgressChart received invalid percentage:", percentage);
      return 0;
    }
    // Clamp between 0-100
    return Math.max(0, Math.min(100, percentage));
  })();
  
  // Determine height based on size
  const heightClass = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }[size] || 'h-2';
  
  // Format the display label
  const displayLabel = label || `${Math.round(validatedPercentage)}%`;
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (validatedPercentage < 25) return 'bg-red-500';
    if (validatedPercentage < 50) return 'bg-orange-500';
    if (validatedPercentage < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Progress 
        value={validatedPercentage} 
        className={`flex-1 ${heightClass}`}
        indicatorClassName={getColorClass()}
        aria-label={`${validatedPercentage}% complete`}
      />
      {showLabel && (
        <span className="text-xs font-medium whitespace-nowrap">
          {displayLabel}
        </span>
      )}
    </div>
  );
}