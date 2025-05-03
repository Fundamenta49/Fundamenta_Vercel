import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  /** Current search value */
  value: string;
  /** Function called when search value changes */
  onChange: (value: string) => void;
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Whether to use iOS-style blur effect */
  useBlurEffect?: boolean;
  /** Whether to use a rounded pill shape */
  rounded?: 'default' | 'pill' | 'subtle';
  /** Extra CSS classes to apply */
  className?: string;
  /** Optional section color theme */
  sectionTheme?: 'financial' | 'wellness' | 'career' | 'emergency' | 'learning';
  /** Whether to show a clear button */
  showClearButton?: boolean;
}

/**
 * StandardizedSearchBar component with consistent styling
 * Based on the Yoga section's search implementation
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  useBlurEffect = false,
  rounded = 'pill',
  className,
  sectionTheme = 'wellness',
  showClearButton = true
}: SearchBarProps) {
  // Define theme colors for focus state
  const themeColorMap = {
    financial: 'focus:ring-blue-200 focus:border-blue-300',
    wellness: 'focus:ring-green-200 focus:border-green-300',
    career: 'focus:ring-purple-200 focus:border-purple-300', 
    emergency: 'focus:ring-red-200 focus:border-red-300',
    learning: 'focus:ring-yellow-200 focus:border-yellow-300'
  };
  
  // Define border radius based on style
  const roundedMap = {
    default: 'rounded-md',
    pill: 'rounded-full',
    subtle: 'rounded-lg'
  };
  
  // Apply backdrop blur effect if enabled
  const blurClass = useBlurEffect ? 'bg-white/80 backdrop-blur-sm' : '';
  
  // Handle clear button click
  const handleClear = () => {
    onChange('');
  };
  
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'pl-9', 
          value && showClearButton ? 'pr-9' : 'pr-4',
          'border border-gray-200 h-10 text-sm shadow-sm',
          roundedMap[rounded],
          themeColorMap[sectionTheme],
          blurClass
        )}
      />
      
      {value && showClearButton && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3 text-gray-500" />
        </button>
      )}
    </div>
  );
}