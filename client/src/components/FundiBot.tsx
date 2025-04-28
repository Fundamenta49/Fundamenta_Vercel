import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FundiBotProps {
  className?: string;
}

export function FundiBot({ className = '' }: FundiBotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`flex flex-col items-center justify-center relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fundi Avatar */}
      <motion.div 
        className="relative w-48 h-48 flex items-center justify-center"
        animate={{ 
          y: isHovered ? -5 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 15,
          duration: 0.5
        }}
      >
        {/* Glow behind robot */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-cyan-100 opacity-30 blur-xl z-0"
          animate={{ 
            scale: isHovered ? 1.2 : 1,
            opacity: isHovered ? 0.4 : 0.3,
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* SVG robot */}
        <svg
          className="w-full h-full z-10"
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head */}
          <path d="M90 120 C90 80 210 80 210 120 L210 155 C210 195 90 195 90 155 Z" fill="#f9f9f9" stroke="#e0e0e0" strokeWidth="2" />
          
          {/* Face Plate */}
          <path d="M115 120 C115 110 185 110 185 120 L185 150 C185 170 115 170 115 150 Z" fill="#303030" />
          
          {/* Eyes */}
          <motion.ellipse 
            cx="135" 
            cy="135" 
            rx="12" 
            ry="10" 
            fill="#00bfff"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            style={{ filter: 'drop-shadow(0 0 3px #00bfff)' }}
          />
          <motion.ellipse 
            cx="165" 
            cy="135" 
            rx="12" 
            ry="10" 
            fill="#00bfff"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            style={{ filter: 'drop-shadow(0 0 3px #00bfff)' }}
          />
          
          {/* Smile */}
          <path d="M138 155 Q150 165 162 155" stroke="#00bfff" strokeWidth="3" strokeLinecap="round" />
          
          {/* Arms */}
          <motion.g
            animate={{ x: isHovered ? -2 : 0, y: isHovered ? 2 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <line x1="90" y1="140" x2="50" y2="140" stroke="#f9f9f9" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="140" r="5" fill="#f9f9f9" />
          </motion.g>
          
          <motion.g
            animate={{ 
              rotate: isHovered ? -10 : 0,
            }}
            style={{ transformOrigin: '210px 140px' }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <line x1="210" y1="140" x2="250" y2="140" stroke="#f9f9f9" strokeWidth="4" strokeLinecap="round" />
            <circle cx="250" cy="140" r="5" fill="#f9f9f9" />
          </motion.g>
          
          {/* Body */}
          <path d="M110 195 C110 230 190 230 190 195 L190 155 C190 155 110 155 110 155 Z" fill="#f9f9f9" stroke="#e0e0e0" strokeWidth="2" />
          
          {/* Center Button */}
          <motion.circle 
            cx="150" 
            cy="195" 
            r="15" 
            fill="#00bfff" 
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
            style={{ filter: 'drop-shadow(0 0 4px #00bfff)' }}
          />
          <circle cx="150" cy="195" r="8" fill="#f9f9f9" />
        </svg>
      </motion.div>

      {/* Hover glow effect at bottom */}
      <motion.div 
        className="absolute bottom-0 w-32 h-4 rounded-full bg-cyan-200 opacity-60 blur-lg"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2
        }}
      />
      
      {/* Optional info text */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="mt-4 text-center text-sm text-cyan-600 font-medium"
          >
            Fundi AI Assistant
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}