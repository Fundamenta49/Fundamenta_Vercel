import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

interface RobotFundiEnhancedProps {
  speaking?: boolean;
  thinking?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  glowIntensity?: "low" | "medium" | "high";
  pulsing?: boolean;
  interactive?: boolean;
  category?: string;
}

export default function RobotFundiEnhanced({ 
  speaking = false, 
  thinking = false, 
  size = "lg", 
  glowIntensity = "high",
  pulsing = true,
  interactive = true,
  category: propCategory,
}: RobotFundiEnhancedProps) {
  const [location] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [eyeBlink, setEyeBlink] = useState(false);
  
  // Determine category based on current URL path if not provided as prop
  const getCategoryFromPath = () => {
    if (location.includes('/finance')) return 'finance';
    if (location.includes('/career')) return 'career';
    if (location.includes('/wellness')) return 'wellness';
    if (location.includes('/learning')) return 'learning';
    if (location.includes('/emergency')) return 'emergency';
    if (location.includes('/cooking')) return 'cooking';
    if (location.includes('/fitness') || location.includes('/active')) return 'fitness';
    if (location.includes('/fundi-showcase')) return 'showcase';
    return 'general';
  };

  const category = propCategory || getCategoryFromPath();
  
  // Define glow colors based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'finance': return '#22c55e'; // Green
      case 'career': return '#3b82f6'; // Blue
      case 'wellness': return '#a855f7'; // Purple
      case 'learning': return '#f97316'; // Orange
      case 'emergency': return '#ef4444'; // Red
      case 'cooking': return '#f59e0b'; // Amber
      case 'fitness': return '#ec4899'; // Pink
      case 'showcase': return '#8b5cf6'; // Violet
      default: return '#38bdf8'; // Sky blue
    }
  };
  
  const glowColor = getCategoryColor(category);
  
  // Glow intensity settings - increased for better visibility
  const glowIntensitySettings = {
    low: 30,
    medium: 50, 
    high: 80
  };
  
  const glowSize = glowIntensitySettings[glowIntensity];
  
  // Size variants - increased all sizes
  const sizeVariants = {
    xs: "w-20 h-20",
    sm: "w-28 h-28", 
    md: "w-36 h-36",
    lg: "w-48 h-48",
    xl: "w-64 h-64"
  };

  // Random eye blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setEyeBlink(true);
        setTimeout(() => setEyeBlink(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(blinkInterval);
  }, []);
  
  // Click animation effect
  const handleClick = () => {
    if (!interactive) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center relative",
        sizeVariants[size],
        interactive && "cursor-pointer"
      )}
      onMouseEnter={() => interactive && setIsHovered(true)}
      onMouseLeave={() => interactive && setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Radiating Glow Effect */}
      <motion.div
        className="absolute rounded-full z-0"
        style={{ 
          backgroundColor: glowColor,
          opacity: 0.6,
          width: '120%',
          height: '120%',
        }}
        animate={{
          scale: pulsing ? [1, 1.3, 1] : 1,
          opacity: pulsing ? [0.6, 0.8, 0.6] : 0.6,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={false}
      />
      
      {/* Outer Glow */}
      <motion.div
        className="absolute rounded-full z-0"
        style={{ 
          backgroundColor: glowColor,
          width: '100%',
          height: '100%',
          filter: `blur(${glowSize}px)`,
          opacity: isHovered || thinking || speaking ? 0.8 : 0.6,
        }}
        animate={{
          scale: (speaking || thinking) ? [1, 1.1, 1] : isHovered ? 1.1 : 1,
        }}
        transition={{
          duration: thinking ? 1.5 : speaking ? 0.8 : 0.3,
          repeat: (speaking || thinking) ? Infinity : 0,
          ease: "easeInOut"
        }}
        initial={false}
      />
      
      {/* Robot SVG */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: isClicked ? [1, 0.9, 1] : 1,
          rotate: isClicked ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
        initial={false}
      >
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Head */}
          <rect x="60" y="40" width="80" height="70" rx="20" fill="#e6e6e6" />
          
          {/* Face screen */}
          <rect x="70" y="60" width="60" height="30" rx="10" fill="#222" />
          
          {/* Eyes */}
          <motion.ellipse 
            cx="85" 
            cy="75" 
            rx="10" 
            ry={eyeBlink ? "1" : "6"} 
            fill={glowColor} 
            animate={{
              opacity: speaking ? [1, 0.7, 1] : 1,
              scale: thinking ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: speaking ? 0.8 : thinking ? 1.5 : 0.3,
              repeat: (speaking || thinking) ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          <motion.ellipse 
            cx="115" 
            cy="75" 
            rx="10" 
            ry={eyeBlink ? "1" : "6"} 
            fill={glowColor}
            animate={{
              opacity: speaking ? [1, 0.7, 1] : 1,
              scale: thinking ? [1, 1.1, 1] : 1
            }}
            transition={{
              duration: speaking ? 0.8 : thinking ? 1.5 : 0.3,
              repeat: (speaking || thinking) ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          {/* Antenna */}
          <rect x="90" y="30" width="20" height="10" rx="5" fill={glowColor} opacity="0.8" />
          <rect x="95" y="15" width="10" height="15" rx="5" fill="#e6e6e6" />
          
          <motion.circle 
            cx="100" 
            cy="15" 
            r="5"
            fill={glowColor}
            animate={{
              opacity: (speaking || thinking) ? [1, 0.6, 1] : 0.8
            }}
            transition={{
              duration: 1,
              repeat: (speaking || thinking) ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Ears */}
          <rect x="50" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
          <rect x="140" y="60" width="10" height="20" rx="5" fill="#d4d4d4" />
          
          {/* Body */}
          <path d="M70,110 C70,140 70,160 100,160 C130,160 130,140 130,110 Z" fill="#f5f5f5" />
          
          {/* Chest light */}
          <motion.circle 
            cx="100" 
            cy="130" 
            r="10" 
            fill={glowColor}
            animate={{
              opacity: speaking ? [0.9, 0.5, 0.9] : thinking ? [0.6, 0.9, 0.6] : 0.7,
              scale: speaking ? [1, 1.1, 1] : thinking ? [1, 1.2, 1] : 1
            }}
            transition={{
              duration: speaking ? 0.8 : 1.5,
              repeat: (speaking || thinking) ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Arms */}
          <motion.path 
            d="M70,115 C50,125 50,140 60,150" 
            fill="none" 
            stroke="#e6e6e6" 
            strokeWidth="10" 
            strokeLinecap="round"
            animate={{
              d: speaking ? "M70,115 C50,125 45,135 55,155" : "M70,115 C50,125 50,140 60,150"
            }}
            transition={{
              duration: 1.5,
              repeat: speaking ? Infinity : 0,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          <motion.path 
            d="M130,115 C150,125 150,140 140,150" 
            fill="none" 
            stroke="#e6e6e6" 
            strokeWidth="10" 
            strokeLinecap="round"
            animate={{
              d: speaking ? "M130,115 C150,125 155,135 145,155" : "M130,115 C150,125 150,140 140,150"
            }}
            transition={{
              duration: 1.5,
              repeat: speaking ? Infinity : 0,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}