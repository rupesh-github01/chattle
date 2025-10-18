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
      <div className="group relative">
        {/* Subtle gradient glow on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 rounded-2xl blur transition-all duration-500"></div>
        
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 group-hover:border-purple-200/50 transition-all duration-300 shadow-sm group-hover:shadow-md">
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-sm opacity-50"></div>
                <img
                  src={comment.user?.avatar || 'https://i.pravatar.cc/150?u=default'}
                  alt={comment.user?.name}
                  className="relative w-10 h-10 rounded-full ring-2 ring-white"
                />
              </div>
              <div>
                <p className="font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
                className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 font-medium transition-all"
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                upvoted 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/30' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 border border-gray-200'
              }`}
            >
              <span className="text-base">{upvoted ? '▲' : '△'}</span>
              <span className="font-medium">{comment.upvotes}</span>
            </button>

            <button
              onClick={() => setIsReplying(!isReplying)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 hover:from-blue-100 hover:to-purple-100 border border-blue-200/30 transition-all duration-300 hover:shadow-sm"
            >
              Reply
            </button>

            {canDelete && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-red-50 to-pink-50 text-gray-700 hover:from-red-100 hover:to-pink-100 border border-red-200/30 transition-all duration-300 hover:shadow-sm hover:text-red-600"
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
                className="mt-4 pt-4 border-t border-gradient-to-r from-transparent via-purple-200/30 to-transparent"
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