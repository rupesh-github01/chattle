'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import CommentForm from './CommentForm'
import Cookies from 'js-cookie'

export default function Comment({ 
  comment, 
  user, 
  onCommentAdded, 
  onCommentDeleted,
  onUpvote,
  depth = 0 
}) {
  const [isReplying, setIsReplying] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [upvoted, setUpvoted] = useState(false)

  const handleReply = (newComment) => {
    onCommentAdded(newComment)
    setIsReplying(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment and all its replies?')) {
      return
    }

    try {
      const token = Cookies.get('token')
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        onCommentDeleted(comment.id)
      } else {
        alert('Failed to delete comment')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete comment')
    }
  }

  const handleUpvote = async () => {
    try {
      const token = Cookies.get('token')
      const increment = upvoted ? -1 : 1
      
      const response = await fetch('/api/upvote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment_id: comment.id,
          increment
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUpvoted(!upvoted)
        onUpvote(comment.id, data.upvotes)
      }
    } catch (error) {
      console.error('Upvote error:', error)
    }
  }

  const canDelete = user?.isAdmin || user?.id === comment.user?.id

  const replyCount = comment.replies ? comment.replies.length : 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={depth > 0 ? 'comment-indent' : ''}
    >
      <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={comment.user?.avatar || 'https://i.pravatar.cc/150?u=default'}
              alt={comment.user?.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">
                {comment.user?.name || 'Unknown User'}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Collapse Button */}
          {replyCount > 0 && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {isCollapsed ? `Show ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}` : 'Collapse'}
            </button>
          )}
        </div>

        {/* Comment Text */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {comment.text}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1 transition-colors ${
              upvoted 
                ? 'text-primary-600 font-semibold' 
                : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <span>{upvoted ? '▲' : '△'}</span>
            <span>{comment.upvotes}</span>
          </button>

          <button
            onClick={() => setIsReplying(!isReplying)}
            className="text-gray-500 hover:text-primary-600 transition-colors"
          >
            Reply
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>

        {/* Reply Form */}
        <AnimatePresence>
          {isReplying && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <CommentForm
                onCommentAdded={handleReply}
                parentId={comment.id}
                onCancel={() => setIsReplying(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nested Replies */}
      <AnimatePresence>
        {!isCollapsed && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-4"
          >
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                user={user}
                onCommentAdded={onCommentAdded}
                onCommentDeleted={onCommentDeleted}
                onUpvote={onUpvote}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}