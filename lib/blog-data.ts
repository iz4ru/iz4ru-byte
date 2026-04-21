import { createClient } from '@/lib/supabase/server'

interface PostContent {
  type: string
  content?: PostContent[]
  text?: string
  marks?: Array<{ type: string }>
  level?: number
  attrs?: Record<string, unknown>
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: PostContent[]
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  views: number
  likes: number
  likedBy: string[]
}

export interface CreatePostInput {
  title: string
  slug: string
  excerpt: string
  content: PostContent[]
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  published?: boolean
  publishedAt?: string | null
}

function mapPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: row.excerpt as string,
    content: row.content as PostContent[],
    published: row.isPublished as boolean,
    publishedAt: row.publishedAt as string | null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
    views: row.views as number,
    likes: row.likes as number,
    likedBy: (row.likedBy as string[]) || [],
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('isPublished', true)
    .order('publishedAt', { ascending: false })

  if (error) throw error
  return (data || []).map(mapPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('isPublished', true)
    .single()

  if (error) return null
  return mapPost(data)
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return mapPost(data)
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('posts')
    .insert({
      id: crypto.randomUUID(),
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      isPublished: false,
      publishedAt: null,
      views: 0,
      likes: 0,
      likedBy: [],
      createdAt: now,
      updatedAt: now,
    })
    .select()
    .single()

  if (error) throw error
  return mapPost(data)
}

export async function updatePost(id: string, input: UpdatePostInput): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .update({
      ...(input.title && { title: input.title }),
      ...(input.slug && { slug: input.slug }),
      ...(input.excerpt && { excerpt: input.excerpt }),
      ...(input.content && { content: input.content }),
      ...(input.published !== undefined && { isPublished: input.published }),
      ...(input.publishedAt !== undefined && { publishedAt: input.publishedAt }),
      updatedAt: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return null
  return mapPost(data)
}

export async function deletePost(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  return !error
}

export async function incrementViews(postId: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('posts')
    .select('views')
    .eq('id', postId)
    .single()

  if (fetchError || !current) return null

  const { data, error } = await supabase
    .from('posts')
    .update({ views: current.views + 1, updatedAt: new Date().toISOString() })
    .eq('id', postId)
    .select()
    .single()

  if (error) return null
  return mapPost(data)
}

export async function toggleLike(postId: string, userId: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('posts')
    .select('likes, likedBy')
    .eq('id', postId)
    .single()

  if (fetchError || !current) return null

  const likedBy: string[] = current.likedBy || []
  const alreadyLiked = likedBy.includes(userId)

  const newLikedBy = alreadyLiked
    ? likedBy.filter((id) => id !== userId)
    : [...likedBy, userId]

  const { data, error } = await supabase
    .from('posts')
    .update({
      likes: alreadyLiked ? current.likes - 1 : current.likes + 1,
      likedBy: newLikedBy,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single()

  if (error) return null
  return mapPost(data)
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('createdAt', { ascending: false })

  if (error) throw error
  return (data || []).map(mapPost)
}