'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Trash2, Reply, X } from 'lucide-react'

interface CommentUser {
  id: string
  name: string | null
  avatar: string | null
}

interface Comment {
  id: string
  content: string
  parentId: string | null
  createdAt: string
  userId: string
  isAdmin: boolean
  isAuthor: boolean
  user: CommentUser
}

interface CommentSectionProps {
  postId: string
}

function Avatar({ user }: { user: CommentUser }) {
  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.name ?? 'User'}
      className="w-8 h-8 rounded-full object-cover shrink-0"
    />
  ) : (
    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-muted-foreground">
        {user.name?.charAt(0).toUpperCase() ?? '?'}
      </span>
    </div>
  )
}

function Badge({ type }: { type: 'admin' | 'author' }) {
  return (
    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
      type === 'admin'
        ? 'bg-primary/10 text-primary'
        : 'bg-accent/10 text-accent'
    }`}>
      {type === 'admin' ? 'Admin' : 'Penulis'}
    </span>
  )
}

function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = 'Tulis komentar...',
  autoFocus = false,
}: {
  postId: string
  parentId?: string
  onSubmit: (comment: Comment) => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: content.trim(), parentId }),
      })

      if (response.status === 401) {
        alert('Login dulu untuk berkomentar!')
        return
      }

      if (!response.ok) throw new Error('Failed to post comment')

      const comment = await response.json()
      onSubmit(comment)
      setContent('')
    } catch (err) {
      console.error('Failed to post comment:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={3}
        className="w-full text-sm bg-secondary/30 border border-border rounded-lg px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 resize-y transition-all"
      />
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" size="sm" variant="outline" onClick={onCancel} className="gap-1.5">
            <X className="w-3.5 h-3.5" />
            Batal
          </Button>
        )}
        <Button type="submit" size="sm" disabled={loading || !content.trim()}>
          {loading ? 'Mengirim...' : 'Kirim'}
        </Button>
      </div>
    </form>
  )
}

function CommentItem({
  comment,
  replies,
  currentUserId,
  postId,
  onDelete,
  onReplySubmit,
}: {
  comment: Comment
  replies: Comment[]
  currentUserId: string | null
  postId: string
  onDelete: (id: string, parentId: string | null) => void
  onReplySubmit: (reply: Comment) => void
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const handleDelete = async (id: string, parentId: string | null) => {
    if (!confirm('Hapus komentar ini?')) return
    try {
      const response = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (response.ok) onDelete(id, parentId)
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  return (
    <div className="space-y-3">
      {/* Main comment */}
      <div className="flex gap-3">
        <Avatar user={comment.user} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                    {comment.user.name ?? 'Pengguna'}
                    </span>
                    {comment.isAdmin && <Badge type="admin" />}
                    {comment.isAuthor && !comment.isAdmin && <Badge type="author" />}
                </div>
                <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt + 'Z'), {
                    addSuffix: true,
                    locale: idLocale,
                    })}
                </span>
            </div>
          </div>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            {currentUserId && (
              <button
                onClick={() => setShowReplyForm(v => !v)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                Balas
              </button>
            )}
            {currentUserId === comment.userId && (
              <button
                onClick={() => handleDelete(comment.id, comment.parentId)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reply form */}
      {showReplyForm && (
        <div className="ml-11">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            placeholder={`Balas ke ${comment.user.name ?? 'pengguna'}...`}
            autoFocus
            onSubmit={(reply) => {
              onReplySubmit(reply)
              setShowReplyForm(false)
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-11 space-y-3 border-l border-border/50 pl-4">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-3">
              <Avatar user={reply.user} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-medium text-foreground">
                            {reply.user.name ?? 'Pengguna'}
                            </span>
                            {reply.isAdmin && <Badge type="admin" />}
                            {reply.isAuthor && !reply.isAdmin && <Badge type="author" />}
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.createdAt + 'Z'), {
                            addSuffix: true,
                            locale: idLocale,
                            })}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-foreground/80 mt-1 leading-relaxed whitespace-pre-wrap break-words">
                  {reply.content}
                </p>
                {currentUserId === reply.userId && (
                  <button
                    onClick={() => handleDelete(reply.id, reply.parentId)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors mt-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUserId(user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${postId}`)
        if (!response.ok) throw new Error('Failed to fetch comments')
        const data = await response.json()
        setComments(data)
      } catch (err) {
        console.error('Failed to fetch comments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  const handleNewComment = (comment: Comment) => {
    setComments(prev => [...prev, comment])
  }

  const handleDelete = (id: string, parentId: string | null) => {
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const topLevel = comments.filter(c => !c.parentId)
  const replies = comments.filter(c => c.parentId)

  return (
    <div className="space-y-8">
      <div className="border-t border-border/60 pt-8">
        <h2 className="text-lg font-semibold font-lora text-foreground mb-6">
          Komentar ({comments.length})
        </h2>

        {/* Form komentar baru */}
        {currentUserId ? (
          <div className="mb-8">
            <CommentForm
              postId={postId}
              onSubmit={handleNewComment}
            />
          </div>
        ) : (
          <div className="mb-8 p-4 rounded-lg bg-secondary/30 border border-border text-sm text-muted-foreground text-center">
            <button
              onClick={() => {
                const supabase = createClient()
                supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: { redirectTo: `${window.location.origin}/auth/callback` },
                })
              }}
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Login dengan Google
            </button>
            {' '}untuk berkomentar
          </div>
        )}

        {/* List komentar */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-secondary rounded w-1/4" />
                  <div className="h-4 bg-secondary rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : topLevel.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          <div className="space-y-6">
            {topLevel.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                replies={replies.filter(r => r.parentId === comment.id)}
                currentUserId={currentUserId}
                postId={postId}
                onDelete={handleDelete}
                onReplySubmit={handleNewComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}