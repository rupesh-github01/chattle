'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SortDropdown({ sortBy, setSortBy }) {
  const [isOpen, setIsOpen] = useState(false)

  const options = [
    { value: 'newest', label: 'Newest First', icon: '' },
    { value: 'oldest', label: 'Oldest First', icon: '' },
    { value: 'most_upvoted', label: 'Most Upvoted', icon: '' },
    { value: 'most_replies', label: 'Most Replies', icon: '' }
  ]

  const currentOption = options.find(opt => opt.value === sortBy)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 rounded-xl transition-all duration-300 border border-purple-200/30 dark:border-purple-700/30 shadow-sm hover:shadow-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 dark:group-hover:from-purple-600/10 dark:group-hover:to-pink-600/10 rounded-xl transition-all duration-300"></div>
        
        <span className="relative text-lg">{currentOption?.icon}</span>
        <span className="relative text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentOption?.label}
        </span>
        <svg
          className={`relative w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-56 z-20"
            >
              {/* Gradient glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-600 dark:via-pink-600 dark:to-blue-600 rounded-2xl blur opacity-20 dark:opacity-15"></div>
              
              <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
                {options.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setIsOpen(false)
                    }}
                    className={`group w-full text-left px-5 py-3.5 transition-all duration-300 flex items-center gap-3 ${
                      sortBy === option.value 
                        ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-l-4 border-purple-500 dark:border-purple-400' 
                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50/30 dark:hover:from-slate-700/50 dark:hover:to-purple-950/30'
                    } ${index !== options.length - 1 ? 'border-b border-gray-100 dark:border-slate-700' : ''}`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className={`text-sm font-medium transition-all ${
                      sortBy === option.value 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                    }`}>
                      {option.label}
                    </span>
                    {sortBy === option.value && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto text-purple-600 dark:text-purple-400"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}