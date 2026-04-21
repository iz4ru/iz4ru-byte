'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  views: number
  likes: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AdminDashboard() {
  const { data: posts, isLoading, error, mutate } = useSWR<Post[]>('/api/posts?admin=true', fetcher)

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus artikel ini?')) return

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      if (response.ok) {
        mutate()
      }
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          published: !published,
          publishedAt: !published ? new Date().toISOString() : null,
        }),
      })
      if (response.ok) {
        mutate()
      }
    } catch (err) {
      console.error('Failed to update post:', err)
    }
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Memuat artikel...</p>
  }

  if (error) {
    return <p className="text-destructive">Gagal memuat artikel</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-lora text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Kelola artikel blog Anda</p>
        </div>
        <Link href="/admin/create">
          <Button>Buat Artikel Baru</Button>
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Belum ada artikel</p>
          <Link href="/admin/create">
            <Button>Buat Artikel Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Judul</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Statistik</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground">{post.slug}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        post.published
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {post.published ? 'Dipublikasi' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-muted-foreground">
                    {post.views} tayangan · {post.likes} suka
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <Link href={`/admin/${post.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={post.published ? 'outline' : 'default'}
                      onClick={() => handleTogglePublish(post.id, post.published)}
                    >
                      {post.published ? 'Buka' : 'Publikasi'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(post.id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
