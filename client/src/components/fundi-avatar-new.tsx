import { cn } from "@/lib/utils";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FundiAvatar({ speaking = false, size = "md" }: FundiAvatarProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size]
    )}>
      <div className={cn(
        "absolute inset-0 rounded-full bg-primary flex items-center justify-center",
        speaking ? "animate-pulse" : ""
      )}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Main robot body */}
          <rect x="30" y="25" width="40" height="35" rx="10" fill="#f5f5f5" />
          
          {/* Robot head/antenna */}
          <rect x="48" y="15" width="4" height="10" rx="2" fill="#e0e0e0" />
          
          {/* Display screen */}
          <rect x="35" y="27" width="30" height="8" rx="3" fill="#7dd3fc" opacity="0.6" />
          
          {/* Ears */}
          <rect x="25" y="30" width="5" height="10" rx="2" fill="#e0e0e0" />
          <rect x="70" y="30" width="5" height="10" rx="2" fill="#e0e0e0" />
          
          {/* Center light */}
          <circle cx="50" cy="52" r="4" fill="#38bdf8" opacity={speaking ? "0.9" : "0.6"} />
          
          {/* Eyes background */}
          <rect x="35" y="37" width="30" height="8" rx="4" fill="#0f172a" />
          
          {/* Eyes */}
          <circle cx="42" cy="41" r="2.5" fill="#38bdf8" opacity="0.8" />
          <circle cx="58" cy="41" r="2.5" fill="#38bdf8" opacity="0.8" />
          
          {/* Arms */}
          <path
            d="M30,45 C22,50 22,55 25,60" 
            fill="none"
            stroke="#f5f5f5"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M70,45 C78,50 78,55 75,60"
            fill="none"
            stroke="#f5f5f5"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}