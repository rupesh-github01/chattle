'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Comment from './Comment'
import CommentForm from './CommentForm'
import SortDropdown from './SortDropdown'
import { buildCommentTree, sortComments } from '@/utils/commentTree'

export default function CommentSection({ user }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    fetchComments()
  }, [])

  const fetchComments = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1]

      const response = await fetch('/api/comments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment])
  }

  const handleCommentDeleted = (commentId) => {
    const deleteCommentAndReplies = (id) => {
      return comments.filter(comment => {
        if (comment.id === id) return false
        if (comment.parent_id === id) return false
        return true
      })
    }
    setComments(deleteCommentAndReplies(commentId))
  }

  const handleUpvote = async (commentId, currentUpvotes) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, upvotes: currentUpvotes }
        : comment
    ))
  }

  const commentTree = buildCommentTree(comments)
  const sortedComments = sortComments(commentTree, sortBy)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800">
          Comments ({comments.length})
        </h3>
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* Comment Form */}
      <CommentForm
        onCommentAdded={handleCommentAdded}
        parentId={null}
      />

      {/* Comments List */}
      <div className="mt-8 space-y-6">
        <AnimatePresence>
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                user={user}
                onCommentAdded={handleCommentAdded}
                onCommentDeleted={handleCommentDeleted}
                onUpvote={handleUpvote}
              />
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-8"
            >
              No comments yet. Be the first to share your thoughts!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}