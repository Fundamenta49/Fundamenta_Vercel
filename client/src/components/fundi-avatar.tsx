import { motion } from "framer-motion";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FundiAvatar({ speaking = false, size = "md" }: FundiAvatarProps) {
  const sizes = {
    sm: "w-8 h-10",
    md: "w-12 h-14",
    lg: "w-16 h-20"
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      {/* Main robot head - white egg shape with gradient */}
      <motion.div
        className="absolute inset-0 rounded-[60%] bg-gradient-to-b from-white to-gray-50 shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Eyes container - positioned for egg shape */}
        <div className="absolute top-1/3 left-0 right-0 flex justify-center space-x-3">
          {/* Left eye */}
          <motion.div
            className="w-3 h-3 rounded-full bg-blue-400"
            animate={{
              scale: speaking ? [1, 1.2, 1] : 1,
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              boxShadow: "0 0 15px #60A5FA"
            }}
          />
          {/* Right eye */}
          <motion.div
            className="w-3 h-3 rounded-full bg-blue-400"
            animate={{
              scale: speaking ? [1, 1.2, 1] : 1,
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
            style={{
              boxShadow: "0 0 15px #60A5FA"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}