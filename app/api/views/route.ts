import { NextRequest, NextResponse } from 'next/server'
import { incrementViews } from '@/lib/blog-data'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId } = body
    console.log('[views] postId:', postId)

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const post = await incrementViews(postId)
    console.log('[views] result:', post)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ views: post.views })
  } catch (error) {
    console.error('[views] error:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}