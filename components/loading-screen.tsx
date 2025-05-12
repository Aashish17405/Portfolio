"use client"

import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-950/90 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center px-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            repeatType: "loop",
          }}
          className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 border-4 border-t-blue-600 border-r-blue-400 border-b-blue-200 border-l-transparent rounded-full"
        />
        
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.6, 1, 0.6],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut"
          }}
          className="text-2xl font-bold text-white"
        >
          Loading..
          <motion.span
            animate={{ opacity: [0, 1] }}
            transition={{ 
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse"
            }}
          >
            ..
          </motion.span>
        </motion.h2>
      </motion.div>
    </div>
  )
}