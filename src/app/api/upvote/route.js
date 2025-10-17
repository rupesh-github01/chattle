import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { Comment } from '@/lib/models/Comment'

export async function POST(request) {
  try {
    const userId = getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { comment_id, increment } = await request.json()

    if (!comment_id || (increment !== 1 && increment !== -1)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    await Comment.updateUpvotes(comment_id, increment)
    const comment = await Comment.findById(comment_id)

    return NextResponse.json({
      upvotes: comment.upvotes
    })
  } catch (error) {
    console.error('Upvote error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}