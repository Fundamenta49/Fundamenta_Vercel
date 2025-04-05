import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FundiAvatarEnhancedProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  speaking?: boolean;
  thinking?: boolean;
  emotion?: string;
  withShadow?: boolean;
  glowEffect?: boolean;
  pulseEffect?: boolean;
  interactive?: boolean;
  onInteraction?: () => void;
}

export default function FundiAvatarEnhanced({
  size = 'md',
  category = 'general',
  speaking = false,
  thinking = false,
  emotion = 'neutral',
  withShadow = false,
  glowEffect = false,
  pulseEffect = false,
  interactive = false,
  onInteraction
}: FundiAvatarEnhancedProps) {
  // Define color based on category
  const getCategoryColor = (cat: string): string => {
    switch(cat) {
      case 'finance': return '#22c55e'; // Green
      case 'career': return '#3b82f6'; // Blue
      case 'wellness': return '#a855f7'; // Purple
      case 'learning': return '#f97316'; // Orange
      case 'emergency': return '#ef4444'; // Red
      case 'cooking': return '#f59e0b'; // Amber
      case 'fitness': return '#ec4899'; // Pink
      default: return '#6366f1'; // Indigo (default)
    }
  };
  
  const color = getCategoryColor(category);
  
  // Avatar size classes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  // Get mouth path based on emotion and speaking state
  const getMouthPath = () => {
    if (speaking) {
      return "M35,65 Q50,75 65,65"; // Speaking mouth
    }
    
    switch(emotion) {
      case 'happy': return "M35,70 Q50,80 65,70"; // Happy smile
      case 'excited': return "M30,70 Q50,85 70,70"; // Big smile
      case 'sad': return "M35,65 Q50,55 65,65"; // Sad mouth
      case 'surprised': return "M40,70 Q50,78 60,70"; // O mouth
      case 'confused': return "M35,68 L55,68 L65,65"; // Confused zigzag
      case 'curious': return "M35,68 Q50,72 65,68"; // Slight smile
      default: return "M35,68 Q50,72 65,68"; // Neutral slight smile
    }
  };
  
  // Get eye shapes based on emotion
  const getEyeShapes = () => {
    switch(emotion) {
      case 'happy':
      case 'excited':
        return (
          <>
            <circle cx="35" cy="40" r="7" fill={color} />
            <circle cx="65" cy="40" r="7" fill={color} />
          </>
        );
      case 'sad':
        return (
          <>
            <ellipse cx="35" cy="40" rx="7" ry="5" fill={color} />
            <ellipse cx="65" cy="40" rx="7" ry="5" fill={color} />
            <line x1="28" y1="35" x2="40" y2="38" stroke={color} strokeWidth="2" />
            <line x1="58" y1="38" x2="70" y2="35" stroke={color} strokeWidth="2" />
          </>
        );
      case 'surprised':
        return (
          <>
            <circle cx="35" cy="40" r="10" fill={color} strokeWidth="2" />
            <circle cx="65" cy="40" r="10" fill={color} strokeWidth="2" />
            <circle cx="35" cy="40" r="5" fill="white" />
            <circle cx="65" cy="40" r="5" fill="white" />
          </>
        );
      case 'confused':
        return (
          <>
            <ellipse cx="35" cy="40" rx="8" ry="7" fill={color} />
            <ellipse cx="65" cy="40" rx="5" ry="7" fill={color} />
            <line x1="60" y1="30" x2="70" y2="33" stroke={color} strokeWidth="2" />
          </>
        );
      case 'curious':
        return (
          <>
            <ellipse cx="35" cy="40" rx="7" ry="8" fill={color} />
            <ellipse cx="65" cy="40" rx="7" ry="8" fill={color} />
            <circle cx="37" cy="38" r="2" fill="white" />
            <circle cx="67" cy="38" r="2" fill="white" />
          </>
        );
      default:
        return (
          <>
            <circle cx="35" cy="40" r="8" fill={color} />
            <circle cx="65" cy="40" r="8" fill={color} />
          </>
        );
    }
  };
  
  // Thinking animation
  const ThinkingBubbles = () => (
    <>
      <circle cx="75" cy="30" r="3" fill={color} opacity="0.7" className="animate-pulse" style={{ animationDelay: '0s' }} />
      <circle cx="85" cy="25" r="4" fill={color} opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <circle cx="95" cy="20" r="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
    </>
  );
  
  // Function to handle click if interactive
  const handleClick = () => {
    if (interactive && onInteraction) {
      onInteraction();
    }
  };
  
  return (
    <div 
      className={cn(
        sizeClasses[size],
        interactive && "cursor-pointer transition-transform hover:scale-105 active:scale-95",
        pulseEffect && "animate-pulse"
      )}
      onClick={interactive ? handleClick : undefined}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Base circle with optional shadow and glow */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="#f8fafc" 
          className={cn(
            glowEffect && `animate-glow-${category}`,
            withShadow && "drop-shadow-lg"
          )}
          filter={withShadow ? "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))" : undefined}
          strokeWidth={glowEffect ? "2" : "0"}
          stroke={glowEffect ? color : undefined}
        />
        
        {/* Eyes - dynamic based on emotion */}
        {getEyeShapes()}
        
        {/* Mouth - dynamic based on emotion and speaking */}
        <path d={getMouthPath()} stroke={color} strokeWidth="4" fill="none" />
        
        {/* Thinking bubbles if thinking */}
        {thinking && <ThinkingBubbles />}
      </svg>
    </div>
  );
}
