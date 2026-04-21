'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TiptapEditor } from '@/components/tiptap-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function CreatePost() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData((prev) => ({
      ...prev,
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          content: typeof formData.content === 'string'
            ? (formData.content ? JSON.parse(formData.content) : [])
            : formData.content,
        }),
      })

      if (response.ok) {
        const post = await response.json()
        router.push(`/admin/${post.id}/edit`)
      } else {
        alert('Gagal membuat artikel')
      }
    } catch (err) {
      console.error('Error creating post:', err)
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-lora text-foreground mb-2">Buat Artikel Baru</h1>
        <p className="text-muted-foreground">Tulis dan publikasikan artikel baru Anda</p>
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
          <p className="text-xs text-muted-foreground">
            URL yang ramah untuk artikel (akan otomatis dibuat dari judul)
          </p>
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
          <Button type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Artikel'}
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
