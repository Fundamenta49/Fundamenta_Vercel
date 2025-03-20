import { motion } from "framer-motion";

interface FundiAvatarProps {
  speaking?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function FundiAvatar({ speaking = false, size = "md" }: FundiAvatarProps) {
  const sizes = {
    sm: "w-10 h-12",
    md: "w-16 h-20",
    lg: "w-24 h-28"
  };

  const eyeSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-4 h-4",
    lg: "w-6 h-6"
  };

  return (
    <div className={`relative ${sizes[size]}`}>
      {/* Main body - smooth, pure white oval */}
      <motion.div
        className="absolute inset-0 bg-white rounded-[70%] shadow-lg"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F8F9FA 100%)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Eyes container - positioned higher in the face */}
        <div className="absolute top-[40%] left-0 right-0 flex justify-center space-x-4">
          {/* Left eye */}
          <motion.div
            className={`${eyeSizes[size]} rounded-full bg-blue-400`}
            style={{
              background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
              boxShadow: "0 0 20px 5px rgba(96, 165, 250, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.5)"
            }}
            animate={{
              scale: speaking ? [1, 1.1, 1] : 1,
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {/* Right eye */}
          <motion.div
            className={`${eyeSizes[size]} rounded-full bg-blue-400`}
            style={{
              background: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)",
              boxShadow: "0 0 20px 5px rgba(96, 165, 250, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.5)"
            }}
            animate={{
              scale: speaking ? [1, 1.1, 1] : 1,
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}