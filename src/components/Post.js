'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Post() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl group-hover:blur-xl transition-all duration-700"></div>
      
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 overflow-hidden border border-white/50 hover:border-purple-300/50 transition-all duration-500">
        {/* Post Image with gradient overlay */}
        <div className="relative h-96 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 overflow-hidden">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center text-white p-8">
              <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold mb-4 drop-shadow-lg"
              >
                Welcome to Chattle
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl opacity-95 drop-shadow-md"
              >
                A modern nested commenting system
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 h-1 w-24 mx-auto bg-white/70 rounded-full"
              ></motion.div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Building Better Conversations
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-4 leading-relaxed">
              This is a demonstration of a fully functional nested commenting system. 
              The interface supports unlimited nesting levels, allowing for rich, 
              threaded discussions that maintain context and clarity.
            </p>
            <p className="mb-4 leading-relaxed">
              Key features include:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"></span>
                <span>Nested replies with visual hierarchy</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></span>
                <span>Upvote system to highlight valuable contributions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 flex-shrink-0"></span>
                <span>Collapsible comment threads for better readability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0"></span>
                <span>Responsive design that works on all devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-block mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex-shrink-0"></span>
                <span>Admin privileges for content moderation</span>
              </li>
            </ul>
            <p className="leading-relaxed">
              Share your thoughts in the comments section below!
            </p>
          </div>

          {/* Post Meta */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-gradient relative">
            {/* Gradient border effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 ring-2 ring-white ring-offset-2">
                <span className="text-white font-bold text-sm">IT</span>
              </div>
              <div>
                <p className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Inter IIT Team
                </p>
                <p className="text-sm text-gray-500">October 17, 2025</p>
              </div>
            </div>
            
            <div className="flex gap-4 text-sm">
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-purple-200/30 shadow-sm hover:shadow-md transition-all duration-300">
                📖 5 min read
              </span>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-gray-700 border border-pink-200/30 shadow-sm hover:shadow-md transition-all duration-300">
                💬 Discussion
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}