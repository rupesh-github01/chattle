import { NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { Comment } from '@/lib/models/Comment'
import { User } from '@/lib/models/User'

export async function DELETE(request, { params }) {
  try {
    const userId = getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const comment = await Comment.findById(id)

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      )
    }

    const user = await User.findById(userId)

    // Check if user is admin or comment owner
    if (comment.user_id !== userId && !user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await Comment.deleteWithReplies(id)

    return NextResponse.json({ message: 'Comment deleted successfully' })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}