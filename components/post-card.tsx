'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale/id'
import { Eye, Heart, MessageCircle } from 'lucide-react'

interface PostCardProps {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string | null
  views: number
  likes: number
  commentCount: number
}

export function PostCard({ id, title, slug, excerpt, publishedAt, views, likes, commentCount }: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group border border-border rounded-lg p-6 mb-6 hover:bg-secondary/50 transition-colors cursor-pointer">
        <h2 className="font-lora text-2xl font-bold text-foreground group-hover:text-accent transition-colors mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm mb-3">
          {publishedAt &&
            formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: idLocale })}
        </p>
        <p className="text-foreground/80 text-sm lg:text-base line-clamp-3 mb-4">{excerpt}</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {views} tayangan
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {likes} suka
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {commentCount} komentar
          </span>
        </div>
      </article>
    </Link>
  )
}