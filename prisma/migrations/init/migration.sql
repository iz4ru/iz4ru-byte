-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" JSONB,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "likedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- CreateRole
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Drop policy lama yang terlalu terbuka
DROP POLICY IF EXISTS "anon_select" ON public.posts;
DROP POLICY IF EXISTS "authenticated_select" ON public.posts;

-- anon hanya bisa baca yang sudah published
CREATE POLICY "anon_select_published" ON public.posts
FOR SELECT TO anon
USING ("isPublished" = true);

-- authenticated bisa baca semua (termasuk draft, untuk admin)
CREATE POLICY "authenticated_select_all" ON public.posts
FOR SELECT TO authenticated
USING (true);

-- authenticated bisa update likes & likedBy
CREATE POLICY "authenticated_update_likes" ON public.posts
FOR UPDATE TO authenticated
USING (true)
WITH CHECK (true);

-- authenticated bisa insert, update, delete (untuk admin)
CREATE POLICY "authenticated_insert" ON public.posts
FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "authenticated_update" ON public.posts
FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete" ON public.posts
FOR DELETE TO authenticated
USING (true);