import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FundiAvatarEnhancedProps {
  speaking?: boolean;
  thinking?: boolean;
  emotion?: 'neutral' | 'happy' | 'curious' | 'surprised' | 'concerned';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  category?: string;
  className?: string;
  interactive?: boolean;
  pulseEffect?: boolean;
  glowEffect?: boolean;
  wink?: boolean;
  rotate?: boolean;
  withShadow?: boolean;
  withBounce?: boolean;
  onInteraction?: () => void;
  onClick?: () => void;
  animationSpeed?: 'slow' | 'normal' | 'fast';
}

export default function FundiAvatarEnhanced(props: FundiAvatarEnhancedProps) {
  const {
    speaking = false,
    thinking = false,
    emotion = 'neutral',
    size = 'md',
    category = 'general',
    className = '',
    interactive = true,
    pulseEffect = true,
    glowEffect = false,
    wink = false,
    rotate = false,
    withShadow = true,
    withBounce = false,
    onInteraction,
    onClick,
    animationSpeed = 'normal',
  } = props;
  const [isWinking, setIsWinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Handle wink animation
  useEffect(() => {
    if (wink && !isWinking) {
      setIsWinking(true);
      const timer = setTimeout(() => {
        setIsWinking(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [wink]);

  // Getting base size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'xs':
        return 'w-8 h-8';
      case 'sm':
        return 'w-12 h-12';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-20 h-20';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-16 h-16';
    }
  };

  // Get animation speed factor
  const getAnimationSpeed = () => {
    switch (animationSpeed) {
      case 'slow':
        return 1.5;
      case 'fast':
        return 0.5;
      default:
        return 1;
    }
  };

  // Category-based colors
  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case 'finance':
        return 'text-green-500';
      case 'career':
        return 'text-blue-500';
      case 'wellness':
        return 'text-purple-500';
      case 'learning':
        return 'text-orange-500';
      case 'emergency':
        return 'text-red-500';
      case 'cooking':
        return 'text-amber-500';
      case 'fitness':
        return 'text-cyan-500';
      default:
        return 'text-indigo-500';
    }
  };

  // Get background color for glow effect
  const getGlowColor = () => {
    switch (category.toLowerCase()) {
      case 'finance':
        return 'bg-green-500/10';
      case 'career':
        return 'bg-blue-500/10';
      case 'wellness':
        return 'bg-purple-500/10';
      case 'learning':
        return 'bg-orange-500/10';
      case 'emergency':
        return 'bg-red-500/10';
      case 'cooking':
        return 'bg-amber-500/10';
      case 'fitness':
        return 'bg-cyan-500/10';
      default:
        return 'bg-indigo-500/10';
    }
  };

  // Get emotion-based facial expressions
  const getFacialExpression = () => {
    // Eyes base - always return an array of two eyes
    let eyes;
    let eyebrows;
    let mouth;

    // Different eye states based on emotion and winking
    if (isWinking) {
      eyes = [
        <circle key="left-eye" cx="10" cy="12" r="1.5" fill="currentColor" />,
        <path key="right-eye" d="M20 12 Q18 10 16 12" stroke="currentColor" strokeWidth="1.5" fill="none" />,
      ];
    } else if (thinking) {
      eyes = [
        <circle key="left-eye" cx="10" cy="12" r="1.5" fill="currentColor" />,
        <circle key="right-eye" cx="18" cy="12" r="1.5" fill="currentColor" />,
      ];
    } else {
      switch (emotion) {
        case 'happy':
          eyes = [
            <path key="left-eye" d="M10 12 Q10 10 8 11" stroke="currentColor" strokeWidth="1.5" fill="none" />,
            <path key="right-eye" d="M18 12 Q18 10 16 11" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          ];
          break;
        case 'surprised':
          eyes = [
            <circle key="left-eye" cx="10" cy="12" r="2" fill="currentColor" />,
            <circle key="right-eye" cx="18" cy="12" r="2" fill="currentColor" />,
          ];
          break;
        case 'concerned':
          eyes = [
            <path key="left-eye" d="M10 12 Q10 14 8 13" stroke="currentColor" strokeWidth="1.5" fill="none" />,
            <path key="right-eye" d="M18 12 Q18 14 16 13" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          ];
          break;
        case 'curious':
          eyes = [
            <circle key="left-eye" cx="10" cy="12" r="1.5" fill="currentColor" />,
            <circle key="right-eye" cx="18" cy="12" r="2" fill="currentColor" />,
          ];
          break;
        default: // neutral
          eyes = [
            <circle key="left-eye" cx="10" cy="12" r="1.5" fill="currentColor" />,
            <circle key="right-eye" cx="18" cy="12" r="1.5" fill="currentColor" />,
          ];
      }
    }

    // Eyebrows based on emotion
    switch (emotion) {
      case 'surprised':
        eyebrows = [
          <path key="left-brow" d="M7 8 Q10 6 13 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          <path key="right-brow" d="M15 8 Q18 6 21 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
        ];
        break;
      case 'concerned':
        eyebrows = [
          <path key="left-brow" d="M7 8 Q10 10 13 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          <path key="right-brow" d="M15 8 Q18 10 21 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
        ];
        break;
      case 'curious':
        eyebrows = [
          <path key="left-brow" d="M7 8 Q10 7 13 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          <path key="right-brow" d="M15 8 Q18 6 21 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
        ];
        break;
      default:
        eyebrows = [
          <path key="left-brow" d="M7 8 Q10 7 13 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
          <path key="right-brow" d="M15 8 Q18 7 21 8" stroke="currentColor" strokeWidth="1.5" fill="none" />,
        ];
    }

    // Mouth based on emotion and speaking
    if (speaking) {
      mouth = <path d="M10 20 Q14 24 18 20 Q14 18 10 20" fill="currentColor" />;
    } else {
      switch (emotion) {
        case 'happy':
          mouth = <path d="M10 20 Q14 24 18 20" stroke="currentColor" strokeWidth="1.5" fill="none" />;
          break;
        case 'surprised':
          mouth = <circle cx="14" cy="20" r="2" fill="currentColor" />;
          break;
        case 'concerned':
          mouth = <path d="M10 20 Q14 18 18 20" stroke="currentColor" strokeWidth="1.5" fill="none" />;
          break;
        case 'curious':
          mouth = <path d="M12 20 L16 20" stroke="currentColor" strokeWidth="1.5" />;
          break;
        default: // neutral
          mouth = <path d="M10 20 Q14 21 18 20" stroke="currentColor" strokeWidth="1.5" fill="none" />;
      }
    }

    return { eyes, eyebrows, mouth };
  };

  const { eyes, eyebrows, mouth } = getFacialExpression();

  // Handle interaction
  const handleClick = () => {
    if (interactive) {
      // Call the onInteraction prop if provided
      if (onInteraction) {
        onInteraction();
      }
      
      // Call the onClick prop if provided
      if (onClick) {
        onClick();
      }
      
      setIsPressed(true);
      setTimeout(() => setIsPressed(false), 200);
    }
  };

  // Animation variants
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2 * getAnimationSpeed(),
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  const bounceVariants = {
    bounce: {
      y: [0, -5, 0],
      transition: {
        duration: 1 * getAnimationSpeed(),
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  const rotateVariants = {
    rotate: {
      rotate: [0, 10, 0, -10, 0],
      transition: {
        duration: 4 * getAnimationSpeed(),
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const thinkingVariants = {
    thinking: {
      y: [0, -2, 0],
      transition: {
        duration: 0.8 * getAnimationSpeed(),
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  // Speaking indicator animation
  const speakingIndicator = speaking && (
    <motion.div 
      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <div className={`flex space-x-0.5 ${size === 'xs' || size === 'sm' ? 'scale-75' : ''}`}>
        <motion.div className={`w-1 h-3 ${getCategoryColor().replace('text', 'bg')} rounded-full`} 
          animate={{ height: [3, 6, 10, 6, 3] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        />
        <motion.div className={`w-1 h-3 ${getCategoryColor().replace('text', 'bg')} rounded-full`} 
          animate={{ height: [8, 4, 10, 4, 8] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div className={`w-1 h-3 ${getCategoryColor().replace('text', 'bg')} rounded-full`} 
          animate={{ height: [5, 10, 3, 10, 5] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        />
      </div>
    </motion.div>
  );

  // Thinking indicator animation
  const thinkingIndicator = thinking && (
    <motion.div 
      className="absolute -top-1 right-0 transform translate-x-1/3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className={`relative ${size === 'xs' ? 'scale-50' : size === 'sm' ? 'scale-75' : ''}`}>
        <motion.div 
          className={`w-2 h-2 rounded-full ${getCategoryColor().replace('text', 'bg')}`}
          animate={thinkingVariants.thinking}
          style={{ position: 'absolute', top: -8, right: 2 }}
        />
        <motion.div 
          className={`w-3 h-3 rounded-full ${getCategoryColor().replace('text', 'bg')}`}
          animate={thinkingVariants.thinking}
          transition={{ delay: 0.1 }}
          style={{ position: 'absolute', top: -14, right: 6 }}
        />
        <motion.div 
          className={`w-4 h-4 rounded-full ${getCategoryColor().replace('text', 'bg')}`}
          animate={thinkingVariants.thinking}
          transition={{ delay: 0.2 }}
          style={{ position: 'absolute', top: -22, right: 10 }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Glow effect */}
      {glowEffect && (
        <div className={cn(
          "absolute inset-0 rounded-full blur-md -z-10",
          getGlowColor(),
          getSizeDimensions()
        )} style={{ transform: 'scale(1.15)' }} />
      )}

      {/* Main avatar container */}
      <motion.div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden relative",
          getCategoryColor(),
          getSizeDimensions(),
          withShadow ? "shadow-lg" : "",
          interactive ? "cursor-pointer hover:filter hover:brightness-110" : "",
          isPressed && interactive ? "scale-95" : "",
          className
        )}
        style={{ 
          backgroundColor: "white",
          border: `2px solid currentColor`,
        }}
        initial={{ scale: 1 }}
        animate={
          pulseEffect && rotate && withBounce
            ? ["pulse", "rotate", "bounce"]
            : pulseEffect && rotate
            ? ["pulse", "rotate"]
            : pulseEffect && withBounce
            ? ["pulse", "bounce"]
            : rotate && withBounce
            ? ["rotate", "bounce"]
            : pulseEffect
            ? "pulse"
            : rotate
            ? "rotate"
            : withBounce
            ? "bounce"
            : undefined
        }
        variants={{
          ...pulseVariants,
          ...rotateVariants,
          ...bounceVariants,
        }}
        onClick={handleClick}
        onMouseEnter={() => interactive && setIsHovered(true)}
        onMouseLeave={() => interactive && setIsHovered(false)}
      >
        {/* SVG face */}
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/4 h-3/4"
        >
          <g>
            {/* Eyebrows */}
            {eyebrows}
            {/* Eyes */}
            {eyes}
            {/* Mouth */}
            {mouth}
          </g>
        </svg>
      </motion.div>

      {/* Speaking animation indicator */}
      <AnimatePresence>
        {speakingIndicator}
      </AnimatePresence>

      {/* Thinking animation indicator */}
      <AnimatePresence>
        {thinkingIndicator}
      </AnimatePresence>
    </div>
  );
}