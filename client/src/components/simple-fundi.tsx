
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

  const color = customColor || categoryColors[category] || categoryColors.general
  
  const containerStyles = cn(
    sizes[size],
    "relative flex items-center justify-center",
    style === "floating" && "hover:translate-y-[-2px] transition-transform",
    className
  )

  const radiantEffect = style === "radiant" && {
    boxShadow: `0 0 20px ${color}`,
    animation: "pulse 2s infinite"
  }

  return (
    <motion.div 
      className={containerStyles}
      animate={speaking ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 0.3, repeat: speaking ? Infinity : 0 }}
      style={{
        ...radiantEffect
      }}
    >
      <div className="relative w-full h-full">
        <div 
          className="absolute inset-0 rounded-full opacity-20"
          style={{ 
            background: color,
            filter: "blur(10px)",
            transform: "scale(1.2)"
          }} 
        />
        <div 
          className="relative w-full h-full rounded-full bg-white"
          style={{
            border: `2px solid ${color}`
          }}
        >
          {/* Robot face elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <div className="w-3 h-3 rounded-full bg-blue-400" />
              </div>
              <div 
                className="w-4 h-1 mt-2 rounded-full"
                style={{ background: color }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
