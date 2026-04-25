'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { PostCard } from './post-card'
import { SearchBar } from './search-bar'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string | null
  views: number
  likes: number
}

const fetcher = async (_key: string): Promise<Post[]> => {
  console.log('Fetching posts...')
  const res = await fetch('/api/posts')
  console.log('Response status:', res.status)
  if (!res.ok) {
    const err = await res.json()
    console.error('Error response:', err)
    throw new Error(err.error || 'Failed to fetch posts')
  }
  const posts = await res.json()
  console.log('Posts fetched:', posts.length)
  return posts.map((post: Post) => ({
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt + 'Z' : null,
  }))
}

export function PostList() {
  const [query, setQuery] = useState('')
  const { data: posts, isLoading, error } = useSWR<Post[], Error>('posts', fetcher)

  const handleSearch = useCallback((q: string) => {
    setQuery(q)
  }, [])

  const filtered = posts?.filter(post => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q)
    )
  })

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
      <SearchBar onSearch={handleSearch} />

      {filtered?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {query ? `Tidak ada artikel untuk "${query}"` : 'Belum ada artikel yang dipublikasikan'}
          </p>
        </div>
      ) : (
        filtered?.map((post) => (
          <PostCard key={post.id} {...post} />
        ))
      )}
    </div>
  )
}