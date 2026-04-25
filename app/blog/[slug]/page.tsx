'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Eye, Heart, MessageCircle } from 'lucide-react'
import { CommentSection } from '@/components/comment-section'

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
  commentCount?: number
}

export default function BlogPost() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likes, setLikes] = useState<number>(0)
  const [commentCount, setCommentCount] = useState<number>(0)
  const [isLiked, setIsLiked] = useState(false)
  const [authUserId, setAuthUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUserId(user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    if (!slug) return
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/by-slug/${slug}`)
        if (!response.ok) throw new Error('Post not found')
        const data = await response.json()
        setPost({
          ...data,
          publishedAt: data.publishedAt ? data.publishedAt + 'Z' : null,
          content: typeof data.content === 'string' ? JSON.parse(data.content) : data.content
        })
        setLikes(data.likes)
        setIsLiked(authUserId ? data.likedBy.includes(authUserId) : false)
        setCommentCount(data.commentCount || 0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug, authUserId])

  useEffect(() => {
    if (!slug) return
    const incrementViewOnce = async () => {
      const response = await fetch(`/api/posts/by-slug/${slug}`)
      if (!response.ok) return
      const data = await response.json()
      const viewedKey = `viewed_${data.id}`
      if (localStorage.getItem(viewedKey)) return
      localStorage.setItem(viewedKey, 'true')
      await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: data.id }),
      })
    }
    incrementViewOnce()
  }, [slug])

  const router = useRouter()

  const handleLike = async () => {
    if (!post) return
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id }),
      })
      if (response.status === 401) {
        alert('Login dulu untuk menyukai artikel ini!')
        router.push('/login')
        return
      }
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
        <main className="flex-1 max-w-2xl lg:max-w-5xl mx-auto w-full px-8 sm:px-8 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-secondary rounded-lg w-3/4"></div>
            <div className="h-5 bg-secondary rounded w-1/3"></div>
            <div className="space-y-3 mt-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 bg-secondary rounded ${i === 5 ? 'w-2/3' : 'w-full'}`}></div>
              ))}
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
        <main className="flex-1 max-w-2xl lg:max-w-5xl mx-auto w-full px-8 sm:px-8 py-16">
          <p className="text-destructive">Artikel tidak ditemukan</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full py-16">
        <div className="max-w-2xl lg:max-w-5xl mx-auto px-8 sm:px-8">
          <article className="space-y-10">
            <header className="space-y-6">
              <h1 className="font-lora text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <time className="text-sm text-muted-foreground">
                  {post.publishedAt &&
                    formatDistanceToNow(new Date(post.publishedAt), {
                      addSuffix: true,
                      locale: idLocale,
                    })}
                </time>
                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {post.views} tayangan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4" />
                    {likes} suka
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    {commentCount} komentar
                  </span>
                </div>
              </div>
              <div className="border-t border-border/60" />
            </header>

            <div>
              {post.content && (() => {
                const parsed = typeof post.content === 'string' ? JSON.parse(post.content) : post.content
                const tiptapContent = Array.isArray(parsed)
                  ? { type: 'doc', content: parsed }
                  : parsed
                return <TiptapEditor content={tiptapContent} editable={false} />
              })()}
            </div>

            <div className="border-t border-border/60 pt-8 flex gap-4">
              <Button
                onClick={handleLike}
                variant={isLiked ? 'default' : 'outline'}
                className="gap-2"
              >
                <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked && authUserId ? 'fill-current scale-110' : ''}`} />
                Suka ({likes})
              </Button>
              {!authUserId && (
                <p className="text-xs text-muted-foreground self-center">
                  <button onClick={() => router.push('/login')} className="underline underline-offset-2 hover:text-foreground transition-colors mr-1">
                    Login
                  </button>
                  untuk menyukai artikel ini
                </p>
              )}
            </div>

            {/* Comments */}
            <CommentSection postId={post.id} />

          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}