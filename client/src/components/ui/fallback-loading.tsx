/**
 * A simple loading indicator to replace skeleton cards
 * This is a safer alternative that won't interfere with DOM positioning
 */
import { Loader2 } from 'lucide-react';

interface FallbackLoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function FallbackLoading({ 
  text = 'Loading...',
  size = 'md',
  className = ''
}: FallbackLoadingProps) {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin text-primary mb-2`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}