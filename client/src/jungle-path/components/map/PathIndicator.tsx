import React from 'react';
import { JUNGLE_THEME } from '../../styles/theme';
import { JUNGLE_ANIMATIONS } from '../../styles/animations';

interface PathIndicatorProps {
  from: { x: number, y: number };
  to: { x: number, y: number };
  isUnlocked: boolean;
  isActive?: boolean;
  strokeWidth?: number;
  className?: string;
}

/**
 * SVG path component that shows connections between zones on the jungle map
 */
const PathIndicator: React.FC<PathIndicatorProps> = ({
  from,
  to,
  isUnlocked,
  isActive = false,
  strokeWidth = 3,
  className = ''
}) => {
  // Calculate a slightly curved path between points
  const generateCurvedPath = () => {
    // Calculate midpoint
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    
    // Add some curve by moving the midpoint perpendicular to the line
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate perpendicular offset (make it relative to path length)
    const curveFactor = 0.2; // Higher values = more curve
    const offset = length * curveFactor;
    
    // Perpendicular vector
    const perpX = -dy / length;
    const perpY = dx / length;
    
    // Control point
    const cx = mx + perpX * offset;
    const cy = my + perpY * offset;
    
    return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  };
  
  const pathClass = isUnlocked 
    ? JUNGLE_THEME.mapStyles.paths.unlocked
    : JUNGLE_THEME.mapStyles.paths.locked;
  
  // Add animation for active paths
  const animationClass = isActive && isUnlocked
    ? 'path-reveal'
    : '';
  
  return (
    <path
      d={generateCurvedPath()}
      className={`transition-all duration-300 ${pathClass} ${animationClass} ${className}`}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      style={isActive && isUnlocked ? JUNGLE_ANIMATIONS.cssAnimations.pathReveal : undefined}
    />
  );
};

export default PathIndicator;