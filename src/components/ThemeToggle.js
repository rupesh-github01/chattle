'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={() => {
        console.log('[ThemeToggle] clicked - isDark before toggle:', isDark)
        toggleTheme()
        console.log('[ThemeToggle] clicked - after toggle called')
      }}
      className="relative w-16 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
      aria-label="Toggle dark mode"
    >
      {/* Track gradient overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
      
      {/* Toggle circle */}
      <motion.div
        className="relative w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{
            rotate: isDark ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <span className="text-sm">🌙</span>
          ) : (
            <span className="text-sm">☀️</span>
          )}
        </motion.div>
      </motion.div>
    </button>
  )
}