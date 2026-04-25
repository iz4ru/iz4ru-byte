import { NextRequest, NextResponse } from 'next/server'
import { toggleLike } from '@/lib/blog-data'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId } = body

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const post = await toggleLike(postId, user.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const isLiked = post.likedBy.includes(user.id)

    return NextResponse.json({
      likes: post.likes,
      isLiked,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
