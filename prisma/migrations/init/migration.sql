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
GRANT ALL ON public.posts TO anon;

--CreatePolicy
CREATE POLICY "Allow public read" ON public.posts FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public update" ON public.posts FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public insert" ON public.posts FOR INSERT TO anon WITH CHECK (true);