'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { PostCard } from './post-card'
import { createClient } from '@/lib/supabase/client'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string | null
  views: number
  likes: number
}

const supabase = createClient()

const fetcher = async (_key: string): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, publishedAt, views, likes')
    .eq('isPublished', true)
    .order('publishedAt', { ascending: false })

  if (error) throw error
  return (data || []).map((post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt + 'Z' : null,
  })) as Post[]
}

export function PostList() {
  const { data: posts, isLoading, error } = useSWR<Post[], Error>('posts', fetcher)

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-secondary rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-secondary rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Gagal memuat artikel</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada artikel yang dipublikasikan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}