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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-full blur-xl opacity-30 dark:opacity-20"></div>
          <div className="relative animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 dark:border-t-blue-400 dark:border-r-purple-400 dark:border-b-pink-400"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="relative group"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 dark:from-pink-600/5 dark:via-purple-600/5 dark:to-blue-600/5 blur-2xl group-hover:blur-xl transition-all duration-700"></div>
      
      <div className="relative bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-pink-500/10 dark:shadow-pink-900/20 p-8 md:p-10 border border-white/50 dark:border-slate-700/50 hover:border-pink-300/50 dark:hover:border-pink-700/50 transition-all duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gradient relative">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent"></div>
          
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Comments
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {comments.length} {comments.length === 1 ? 'conversation' : 'conversations'}
            </p>
          </div>
          
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        {/* Comment Form */}
        <div className="mb-8">
          <CommentForm
            onCommentAdded={handleCommentAdded}
            parentId={null}
          />
        </div>

        {/* Comments List */}
        <div className="space-y-6">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950/50 dark:via-purple-950/50 dark:to-pink-950/50 mb-4">
                  <span className="text-4xl"></span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  )
}