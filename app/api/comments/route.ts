import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('comments_with_user')
      .select('*')
      .eq('postId', postId)
      .order('createdAt', { ascending: true })

    if (error) throw error

    const comments = (data || []).map((row: any) => ({
      id: row.id,
      content: row.content,
      parentId: row.parentId,
      createdAt: row.createdAt,
      userId: row.userId,
      isAdmin: adminEmails.includes(row.userEmail ?? ''),
      isAuthor: adminEmails.includes(row.userEmail ?? ''),
      user: {
        id: row.userId,
        name: row.userName,
        avatar: row.userAvatar,
      }
    }))

    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { postId, content, parentId } = body

    if (!postId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        postId,
        userId: user.id,
        content,
        parentId: parentId || null,
      })
      .select('*')
      .single()

    if (error) throw error

    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? '').split(',').map(e => e.trim()).filter(Boolean)
    const isAdmin = adminEmails.includes(user.email ?? '')

    return NextResponse.json({
        id: data.id,
        content: data.content,
        parentId: data.parentId,
        createdAt: data.createdAt,
        userId: data.userId,
        isAdmin,
        isAuthor: isAdmin,
        user: {
            id: user.id,
            name: user.user_metadata?.full_name ?? null,
            avatar: user.user_metadata?.avatar_url ?? null,
        }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}