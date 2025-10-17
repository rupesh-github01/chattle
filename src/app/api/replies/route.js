import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { Comment } from '@/lib/models/Comment'
import { User } from '@/lib/models/User'

export async function POST(request) {
  try {
    const userId = getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text, parent_id } = await request.json()

    if (!text || !parent_id) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const replyId = await Comment.create({
      text: text.trim(),
      user_id: userId,
      parent_id,
    })

    const reply = await Comment.findById(replyId)
    const user = await User.findById(userId)

    return NextResponse.json({
      reply: {
        id: reply._id.toString(),
        text: reply.text,
        upvotes: reply.upvotes,
        created_at: reply.created_at,
        parent_id: reply.parent_id,
        user: {
          id: user._id.toString(),
          name: user.name,
          avatar: user.avatar,
        },
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Create reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')

    if (!parentId) {
      return NextResponse.json({ error: 'parent_id is required' }, { status: 400 })
    }

    const replies = await Comment.findByParentId(parentId)
    const users = await User.getAll()

    const userMap = {}
    users.forEach((user) => {
      userMap[user._id.toString()] = {
        id: user._id.toString(),
        name: user.name,
        avatar: user.avatar,
      }
    })

    const formattedReplies = replies.map((reply) => ({
      id: reply._id.toString(),
      text: reply.text,
      upvotes: reply.upvotes,
      created_at: reply.created_at,
      parent_id: reply.parent_id,
      user: userMap[reply.user_id] || { name: 'Unknown User' },
    }))

    return NextResponse.json({ replies: formattedReplies })
  } catch (error) {
    console.error('Get replies error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
