export function buildCommentTree(comments) {
  const commentMap = {}
  const rootComments = []

  // Create a map of all comments
  comments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] }
  })

  // Build the tree structure
  comments.forEach(comment => {
    if (comment.parent_id === null) {
      rootComments.push(commentMap[comment.id])
    } else if (commentMap[comment.parent_id]) {
      commentMap[comment.parent_id].replies.push(commentMap[comment.id])
    }
  })

  return rootComments
}

export function sortComments(comments, sortBy) {
  const sorted = [...comments]

  switch (sortBy) {
    case 'newest':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'most_upvoted':
      sorted.sort((a, b) => b.upvotes - a.upvotes)
      break
    case 'most_replies':
      sorted.sort((a, b) => {
        const aReplies = countReplies(a)
        const bReplies = countReplies(b)
        return bReplies - aReplies
      })
      break
  }

  // Recursively sort replies
  sorted.forEach(comment => {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = sortComments(comment.replies, sortBy)
    }
  })

  return sorted
}

function countReplies(comment) {
  if (!comment.replies || comment.replies.length === 0) {
    return 0
  }
  
  let count = comment.replies.length
  comment.replies.forEach(reply => {
    count += countReplies(reply)
  })
  
  return count
}