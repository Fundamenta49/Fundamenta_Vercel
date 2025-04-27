/**
 * Jungle Path Animation Definitions
 * Custom animations for the jungle theme elements
 */

export const JUNGLE_ANIMATIONS = {
  // Keyframe animations for tailwind css
  keyframes: {
    // Subtle sway animation for flora elements
    floraMovement: {
      '0%': { transform: 'rotate(0deg)' },
      '25%': { transform: 'rotate(1deg)' },
      '75%': { transform: 'rotate(-1deg)' },
      '100%': { transform: 'rotate(0deg)' }
    },
    // Shimmer effect for special elements
    shimmer: {
      '0%': { opacity: '1' },
      '50%': { opacity: '0.7' },
      '100%': { opacity: '1' }
    },
    // Pop effect for unlocking achievements
    unlockPop: {
      '0%': { transform: 'scale(0.8)', opacity: '0.5' },
      '50%': { transform: 'scale(1.1)', opacity: '1' },
      '100%': { transform: 'scale(1)', opacity: '1' }
    },
    // Path reveal animation
    pathReveal: {
      '0%': { strokeDashoffset: '1000' },
      '100%': { strokeDashoffset: '0' }
    },
    // Celebration effect for rank-up
    celebrate: {
      '0%': { transform: 'translateY(0)' },
      '25%': { transform: 'translateY(-10px)' },
      '50%': { transform: 'translateY(0)' },
      '75%': { transform: 'translateY(-5px)' },
      '100%': { transform: 'translateY(0)' }
    }
  },
  // Animation directives
  animation: {
    flora: 'floraMovement 4s ease-in-out infinite',
    shimmer: 'shimmer 2s ease-in-out infinite',
    unlockPop: 'unlockPop 0.5s ease-out forwards',
    pathReveal: 'pathReveal 1.5s ease-out forwards',
    celebrate: 'celebrate 1s ease-in-out'
  },
  // CSS animations for direct application
  cssAnimations: {
    flora: {
      animation: 'floraMovement 4s ease-in-out infinite'
    },
    shimmer: {
      animation: 'shimmer 2s ease-in-out infinite'
    },
    unlockPop: {
      animation: 'unlockPop 0.5s ease-out forwards'
    },
    pathReveal: {
      animation: 'pathReveal 1.5s ease-out forwards',
      strokeDasharray: '1000',
      strokeDashoffset: '1000'
    },
    celebrate: {
      animation: 'celebrate 1s ease-in-out'
    }
  }
};

// Tailwind plugin compatible export for animation
export const jungleAnimationsConfig = {
  keyframes: JUNGLE_ANIMATIONS.keyframes,
  animation: JUNGLE_ANIMATIONS.animation
};