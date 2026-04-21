// prisma/seed.js
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding...')

  const postsData = [
    {
      id: "1",
      title: "Selamat Datang di Blog Saya",
      slug: "selamat-datang-di-blog-saya",
      excerpt: "Pengenalan tentang blog pribadi iz4ru.byte...",
      content: JSON.parse('[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Selamat Datang\"}]}]'), 
      isPublished: true,
      publishedAt: new Date("2024-04-15T10:00:00Z"),
      views: 15,
      likes: 0,
    },
    {
      id: "2",
      title: "Memulai dengan Next.js 15",
      slug: "memulai-dengan-nextjs-15",
      excerpt: "Panduan lengkap untuk memulai proyek Next.js 15...",
      content: JSON.parse('[{\"type\":\"heading\",\"attrs\":{\"level\":1},\"content\":[{\"type\":\"text\",\"text\":\"Memulai dengan Next.js 15\"}]}]'),
      isPublished: true,
      publishedAt: new Date("2024-04-10T15:30:00Z"),
      views: 1,
      likes: 0,
    }
  ]

  for (const post of postsData) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
    console.log(`✅ Created post with slug: ${post.slug}`)
  }

  console.log('🎉 Seeding finished.')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })