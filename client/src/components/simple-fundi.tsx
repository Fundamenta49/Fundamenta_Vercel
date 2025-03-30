
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SimpleFundiProps {
  speaking?: boolean
  size?: "sm" | "md" | "lg"
  category?: string
  style?: "minimal" | "floating" | "radiant"
  customColor?: string
  className?: string
}

export default function SimpleFundi({ 
  speaking = false, 
  category = 'general',
  size = "md",
  style = "floating",
  customColor,
  className
}: SimpleFundiProps) {
  
  const categoryColors: Record<string, string> = {
    finance: '#22c55e',
    career: '#3b82f6',
    wellness: '#a855f7',
    learning: '#f97316',
    emergency: '#ef4444',
    cooking: '#f59e0b',
    fitness: '#06b6d4',
    general: '#6366f1',
  }
  
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24"
  }

  const color = customColor || categoryColors[category] || categoryColors.general;

  const containerStyles = cn(
    sizes[size],
    "relative flex items-center justify-center",
    style === "floating" && "hover:translate-y-[-2px] transition-transform",
    className
  );

  return (
    <motion.div 
      className={containerStyles}
      animate={speaking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3, repeat: speaking ? Infinity : 0 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-full h-full">
        {/* Background glow */}
        <div 
          className="absolute inset-0 rounded-full opacity-20"
          style={{ 
            background: `radial-gradient(circle at center, ${color}, transparent)`,
            filter: style === "radiant" ? "blur(8px)" : "blur(4px)",
            transform: "scale(1.2)"
          }} 
        />
        
        {/* Main circle */}
        <div 
          className="relative w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center"
          style={{
            border: `2px solid ${color}`,
            background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)"
          }}
        >
          {/* Face container */}
          <div className="w-3/4 h-3/4 relative">
            {/* Eyes */}
            <div className="absolute top-1/3 w-full flex justify-between px-1">
              <motion.div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
                animate={speaking ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: speaking ? Infinity : 0 }}
              />
              <motion.div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color }}
                animate={speaking ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5, repeat: speaking ? Infinity : 0, delay: 0.1 }}
              />
            </div>
            
            {/* Smile */}
            <div 
              className="absolute bottom-1/3 w-full flex justify-center"
              style={{ transform: "translateY(2px)" }}
            >
              <div 
                className="w-4 h-0.5 rounded-full"
                style={{ 
                  background: color,
                  transform: "rotate(-5deg)"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
