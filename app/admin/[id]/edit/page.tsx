'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string | object
}

export default function EditPost() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    slug: string
    excerpt: string
    content: string | object
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`)
        if (!response.ok) throw new Error('Post not found')
        const post: Post = await response.json()
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: typeof post.content === 'string' ? post.content : post.content,
        })
      } catch (err) {
        console.error('Error fetching post:', err)
        alert('Gagal memuat artikel')
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [postId, router])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({ ...prev, title }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: typeof formData.content === 'string'
            ? (formData.content ? JSON.parse(formData.content) : [])
            : formData.content,
        }),
      })

      if (response.ok) {
        alert('Artikel berhasil disimpan')
        router.push('/admin')
      } else {
        alert('Gagal menyimpan artikel')
      }
    } catch (err) {
      console.error('Error updating post:', err)
      alert('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground">Memuat artikel...</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-lora text-foreground mb-2">Edit Artikel</h1>
        <p className="text-muted-foreground">Ubah konten artikel Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Judul</label>
          <Input
            placeholder="Judul artikel..."
            value={formData.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Slug</label>
          <Input
            placeholder="slug-artikel"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            required
          />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ringkasan</label>
          <Textarea
            placeholder="Ringkasan singkat artikel..."
            value={formData.excerpt}
            onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
            rows={3}
            required
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Konten</label>
          <TiptapEditor
            content={formData.content}
            onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  )
}
