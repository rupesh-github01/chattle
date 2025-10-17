'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'

export default function CommentForm({ onCommentAdded, parentId, onCancel }) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      className="space-y-3"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
        className="input-field min-h-[100px] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !text.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Comment')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  )
}