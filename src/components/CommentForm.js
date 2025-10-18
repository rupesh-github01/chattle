'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

export default function CommentForm({ onCommentAdded, parentId, onCancel }) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!text.trim()) return

    setIsSubmitting(true)

    try {
      const token = Cookies.get('token')
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: text.trim(),
          parent_id: parentId
        })
      })

      if (response.ok) {
        const data = await response.json()
        onCommentAdded(data.comment)
        setText('')
        if (onCancel) onCancel()
      } else {
        alert('Failed to post comment')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="relative group">
        {/* Gradient border effect */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-2xl blur opacity-20 ${isFocused ? 'opacity-40 dark:opacity-30' : 'group-hover:opacity-30 dark:group-hover:opacity-25'} transition-all duration-500`}></div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={parentId ? "Write a thoughtful reply..." : "Share your thoughts..."}
          className="relative w-full min-h-[120px] px-5 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:border-transparent resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 shadow-sm"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="relative px-6 py-2.5 rounded-xl font-medium text-white overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 transition-all duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          <span className="relative flex items-center gap-2">
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </>
            ) : (
              <>
                {parentId ? 'Reply' : 'Comment'}
              </>
            )}
          </span>
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-medium bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-700 dark:to-slate-600 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 hover:from-gray-200 hover:to-gray-100 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 hover:shadow-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  )
}