'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Post() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
    >
      {/* Post Image */}
      <div className="relative h-96 bg-gradient-to-br from-primary-400 to-primary-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to CommentHub
            </h1>
            <p className="text-xl opacity-90">
              A modern nested commenting system
            </p>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Building Better Conversations
        </h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-4">
            This is a demonstration of a fully functional nested commenting system. 
            The interface supports unlimited nesting levels, allowing for rich, 
            threaded discussions that maintain context and clarity.
          </p>
          <p className="mb-4">
            Key features include:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Nested replies with visual hierarchy</li>
            <li>Upvote system to highlight valuable contributions</li>
            <li>Collapsible comment threads for better readability</li>
            <li>Responsive design that works on all devices</li>
            <li>Admin privileges for content moderation</li>
          </ul>
          <p>
            Share your thoughts in the comments section below!
          </p>
        </div>

        {/* Post Meta */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold">IH</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Inter IIT Team</p>
              <p className="text-sm text-gray-500">October 17, 2025</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>📖 5 min read</span>
            <span>💬 Discussion</span>
          </div>
        </div>
      </div>
    </motion.article>
  )
}