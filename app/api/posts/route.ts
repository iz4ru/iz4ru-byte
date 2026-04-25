import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost, getAllPostsAdmin } from '@/lib/blog-data'
import { getUserClient } from '@/lib/supabase/client-helper'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin') === 'true'

    if (admin) {
      const { user } = await getUserClient()

      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const posts = await getAllPostsAdmin()
      return NextResponse.json(posts)
    }

    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content } = body
    const { user } = await getUserClient()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await createPost({ title, slug, excerpt, content })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
