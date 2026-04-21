import { NextRequest, NextResponse } from 'next/server'
import { toggleLike } from '@/lib/blog-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, userId } = body

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 })
    }

    const post = await toggleLike(postId, userId)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const isLiked = post.likedBy.includes(userId)
    return NextResponse.json({ likes: post.likes, isLiked })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
