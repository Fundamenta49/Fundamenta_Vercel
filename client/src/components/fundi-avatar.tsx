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

  return (
    <div className={`relative ${sizes[size]}`}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG Robot based on the provided image */}
        <svg 
          viewBox="0 0 100 110" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          {/* Shadow effect */}
          <motion.ellipse 
            cx="50" 
            cy="100" 
            rx="25" 
            ry="7" 
            fill="rgba(0,0,0,0.1)" 
            animate={{ 
              rx: speaking ? [25, 27, 25] : 25 
            }}
            transition={{
              duration: 1.5,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          />

          {/* Body */}
          <motion.g
            animate={{ 
              y: speaking ? [0, -1, 0] : 0 
            }}
            transition={{
              duration: 1.5,
              repeat: speaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            {/* Main robot body */}
            <path 
              d="M30,45 C30,65 30,75 50,80 C70,75 70,65 70,45 L60,40 L40,40 L30,45" 
              fill="#f5f5f5" 
              stroke="#e0e0e0" 
              strokeWidth="1"
            />

            {/* Robot head */}
            <rect x="30" y="15" width="40" height="30" rx="10" fill="#f5f5f5" stroke="#e0e0e0" strokeWidth="1" />
            
            {/* Head screen */}
            <rect x="35" y="18" width="30" height="10" rx="3" fill="#7dd3fc" opacity="0.6" />
            
            {/* Ear left */}
            <rect x="25" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
            
            {/* Ear right */}
            <rect x="70" y="25" width="5" height="10" rx="2" fill="#e0e0e0" />
            
            {/* Center chest light */}
            <motion.circle 
              cx="50" 
              cy="55" 
              r="5" 
              fill="#38bdf8"
              initial={{ opacity: 0.6 }}
              animate={speaking ? {
                opacity: [0.6, 1, 0.6],
                r: [5, 5.5, 5]
              } : {
                opacity: 0.6,
                r: 5
              }}
              transition={{
                duration: 1,
                repeat: speaking ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* Eyes background */}
            <rect x="35" y="30" width="30" height="10" rx="5" fill="#0f172a" />
            
            {/* Left eye */}
            <motion.ellipse 
              cx="42" 
              cy="35" 
              rx="3" 
              ry="2.5" 
              fill="#38bdf8"
              initial={{ opacity: 0.8 }}
              animate={speaking ? {
                opacity: [0.7, 1, 0.7],
                rx: [3, 3.5, 3],
                ry: [2.5, 3, 2.5]
              } : {
                opacity: 0.8
              }}
              transition={{
                duration: 0.8,
                repeat: speaking ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
            
            {/* Right eye */}
            <motion.ellipse 
              cx="58" 
              cy="35" 
              rx="3" 
              ry="2.5" 
              fill="#38bdf8"
              initial={{ opacity: 0.8 }}
              animate={speaking ? {
                opacity: [0.7, 1, 0.7],
                rx: [3, 3.5, 3],
                ry: [2.5, 3, 2.5]
              } : {
                opacity: 0.8
              }}
              transition={{
                duration: 0.8,
                repeat: speaking ? Infinity : 0,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            
            {/* Left arm */}
            <path 
              d="M30,50 C20,55 20,60 25,65" 
              fill="none" 
              stroke="#f5f5f5" 
              strokeWidth="7" 
              strokeLinecap="round" 
            />
            
            {/* Right arm */}
            <path 
              d="M70,50 C80,55 80,60 75,65" 
              fill="none" 
              stroke="#f5f5f5" 
              strokeWidth="7" 
              strokeLinecap="round" 
            />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}