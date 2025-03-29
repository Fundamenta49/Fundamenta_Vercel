// Remove framer-motion imports and use basic CSS animations
import { cn } from "@/lib/utils";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FundiAvatar({ speaking = false, size = "md" }: FundiAvatarProps) {
  // Define sizes for the avatar container
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center",
        sizes[size]
      )}
    >
      <div className="w-full h-full relative">
        {/* SVG Robot with fixed positioning */}
        <svg 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
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
          <circle 
            cx="50" 
            cy="55" 
            r="5" 
            fill="#38bdf8"
            className={speaking ? "animate-pulse" : ""}
            opacity="0.6"
          />
          
          {/* Eyes background */}
          <rect x="35" y="30" width="30" height="10" rx="5" fill="#0f172a" />
          
          {/* Left eye */}
          <ellipse 
            cx="42" 
            cy="35" 
            rx="3" 
            ry="2.5" 
            fill="#38bdf8"
            className={speaking ? "animate-pulse" : ""}
            opacity="0.8"
          />
          
          {/* Right eye */}
          <ellipse 
            cx="58" 
            cy="35" 
            rx="3" 
            ry="2.5" 
            fill="#38bdf8"
            className={speaking ? "animate-pulse" : ""}
            opacity="0.8"
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
        </svg>
      </div>
    </div>
  );
}