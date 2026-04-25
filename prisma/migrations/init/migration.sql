-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable Posts
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

-- CreateTable Comments
CREATE TABLE "comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "postId" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" UUID,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- create view comments_with_user
CREATE VIEW comments_with_user AS
SELECT
  c.id,
  c."postId",
  c."userId",
  c."parentId",
  c.content,
  c."createdAt",
  u.raw_user_meta_data->>'full_name' as "userName",
  u.raw_user_meta_data->>'avatar_url' as "userAvatar",
  u.email as "userEmail"
FROM comments c
JOIN auth.users u ON c."userId" = u.id;

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");
CREATE INDEX "comments_postId_idx" ON "comments"("postId");
CREATE INDEX "comments_parentId_idx" ON "comments"("parentId");

-- Foreign Keys
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE CASCADE;

ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES auth.users("id") ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- CreateRole
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO authenticated;
GRANT SELECT ON public.comments TO anon;
GRANT ALL ON public.comments TO authenticated;
GRANT SELECT ON comments_with_user TO anon;
GRANT SELECT ON comments_with_user TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

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

-- authenticated bisa baca semua comments
CREATE POLICY "anon_read_comments" ON public.comments
FOR SELECT TO anon
USING (true);

CREATE POLICY "authenticated_insert_comment" ON public.comments
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = "userId");

CREATE POLICY "authenticated_delete_own_comment" ON public.comments
FOR DELETE TO authenticated
USING (auth.uid() = "userId");