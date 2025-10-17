import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { Comment } from '@/lib/models/Comment'
import { User } from '@/lib/models/User'

export async function GET(request) {
  try {
    const userId = getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const comments = await Comment.getAll()
    const users = await User.getAll()

    const userMap = {}
    users.forEach(user => {
      userMap[user._id.toString()] = {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar
      }
    })

    const commentsWithUsers = comments.map(comment => ({
      id: comment._id.toString(),
      text: comment.text,
      upvotes: comment.upvotes,
      created_at: comment.created_at,
      parent_id: comment.parent_id,
      user: userMap[comment.user_id] || { name: 'Unknown User' }
    }))

    return NextResponse.json({ comments: commentsWithUsers })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const userId = getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { text, parent_id } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      )
    }

    const commentId = await Comment.create({
      text: text.trim(),
      user_id: userId,
      parent_id: parent_id || null
    })

    const comment = await Comment.findById(commentId)
    const user = await User.findById(userId)

    return NextResponse.json({
      comment: {
        id: comment._id.toString(),
        text: comment.text,
        upvotes: comment.upvotes,
        created_at: comment.created_at,
        parent_id: comment.parent_id,
        user: {
          id: user._id.toString(),
          name: user.name,
          avatar: user.avatar
        }
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}