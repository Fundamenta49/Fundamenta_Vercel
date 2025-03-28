import { motion } from "framer-motion";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FundiAvatar({ speaking = false, size = "md" }: FundiAvatarProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-20 h-20"
  };

  const eyeSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-3.5 h-3.5"
  };

  const accentSizes = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3"
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      {/* Main robot head - geometric shape */}
      <motion.div
        className="absolute inset-0 rounded-md overflow-hidden shadow-md bg-white"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top accent stripe */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[15%]"
          style={{ backgroundColor: "#FF3B77" }}
        />
        
        {/* Subtle circuit pattern */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-5" 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10,30 L90,30" stroke="#000" strokeWidth="0.5" />
          <path d="M10,50 L90,50" stroke="#000" strokeWidth="0.5" />
          <path d="M10,70 L90,70" stroke="#000" strokeWidth="0.5" />
          <path d="M30,10 L30,90" stroke="#000" strokeWidth="0.5" />
          <path d="M50,10 L50,90" stroke="#000" strokeWidth="0.5" />
          <path d="M70,10 L70,90" stroke="#000" strokeWidth="0.5" />
          <circle cx="30" cy="30" r="3" fill="#000" />
          <circle cx="70" cy="30" r="3" fill="#000" />
          <circle cx="30" cy="70" r="3" fill="#000" />
          <circle cx="70" cy="70" r="3" fill="#000" />
          <circle cx="50" cy="50" r="5" fill="#000" />
        </svg>

        {/* Eyes container with subtle shadow */}
        <div className="absolute top-[40%] left-0 right-0 flex justify-center items-center space-x-2 drop-shadow-sm">
          {/* Left eye with pulsing animation when speaking */}
          <motion.div
            className={`${eyeSizes[size]} rounded-full bg-primary`}
            animate={speaking ? {
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            } : {
              scale: 1,
              opacity: 0.9
            }}
            transition={{
              duration: 0.6,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          {/* Right eye with slightly offset pulsing */}
          <motion.div
            className={`${eyeSizes[size]} rounded-full bg-primary`}
            animate={speaking ? {
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            } : {
              scale: 1,
              opacity: 0.9
            }}
            transition={{
              duration: 0.6,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </div>
        
        {/* Status indicators/mouth that animate when speaking */}
        <div className="absolute bottom-[25%] left-0 right-0 flex justify-center items-center space-x-1">
          <motion.div
            className={`${accentSizes[size]} rounded-full bg-primary`}
            animate={speaking ? {
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1, 0.8]
            } : {
              opacity: 0.4,
              scale: 0.8
            }}
            transition={{
              duration: 0.4,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className={`${accentSizes[size]} rounded-full bg-primary`}
            animate={speaking ? {
              opacity: [0.3, 0.9, 0.3],
              scale: [0.8, 1.1, 0.8]
            } : {
              opacity: 0.4,
              scale: 0.8
            }}
            transition={{
              duration: 0.4,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.1
            }}
          />
          
          <motion.div
            className={`${accentSizes[size]} rounded-full bg-primary`}
            animate={speaking ? {
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1, 0.8]
            } : {
              opacity: 0.4,
              scale: 0.8
            }}
            transition={{
              duration: 0.4,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}