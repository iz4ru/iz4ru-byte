'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Eye, Heart } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string | null
  views: number
  likes: number
  likedBy: string[]
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likes, setLikes] = useState<number>(0)
  const [isLiked, setIsLiked] = useState(false)
  const [userId] = useState(() => {
    if (typeof window === 'undefined') return ''
    const stored = localStorage.getItem('userId')
    if (stored) return stored
    const newId = Math.random().toString(36).substring(7)
    localStorage.setItem('userId', newId)
    return newId
  })

  useEffect(() => {
    let didRun = false

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/by-slug/${slug}`)
        if (!response.ok) throw new Error('Post not found')
        const data = await response.json()
        setPost({
          ...data,
          content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content
        })
        setLikes(data.likes)
        setIsLiked(data.likedBy.includes(userId))

        if (!didRun) {
          didRun = true
          const viewedKey = `viewed_${data.id}`
          if (!localStorage.getItem(viewedKey)) {
            localStorage.setItem(viewedKey, 'true')
            await fetch('/api/views', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ postId: data.id }),
            })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (slug && userId) {
      fetchPost()
    }

    return () => { didRun = true }
  }, [slug, userId])

  const handleLike = async () => {
    if (!post || !userId) return

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, userId }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes)
        setIsLiked(data.isLiked)
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-secondary rounded w-3/4"></div>
            <div className="h-6 bg-secondary rounded w-1/2"></div>
            <div className="space-y-2 mt-8">
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded"></div>
              <div className="h-4 bg-secondary rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-destructive">Artikel tidak ditemukan</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <article className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="font-lora text-5xl font-bold text-foreground">{post.title}</h1>
            <div className="flex items-center justify-between flex-wrap gap-4 text-sm text-muted-foreground">
              <div>
                {post.publishedAt &&
                  formatDistanceToNow(new Date(post.publishedAt), {
                    addSuffix: true,
                    locale: idLocale,
                  })}
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {post.views} tayangan
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5" />
                  {likes} suka
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Content */}
          <div className="prose-dark">
            {post.content && (() => {
              const parsed = typeof post.content === 'string' ? JSON.parse(post.content) : post.content
              const tiptapContent = Array.isArray(parsed)
                ? { type: 'doc', content: parsed }
                : parsed
              return <TiptapEditor content={tiptapContent} editable={false} />
            })()}
          </div>

          {/* Actions */}
          <div className="border-t border-border pt-8 flex gap-4">
            <Button
              onClick={handleLike}
              variant={isLiked ? 'default' : 'outline'}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              Suka ({likes})
            </Button>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}