import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { PostList } from '@/components/post-list'
import { Typewriter } from '@/components/typewriter'

export const metadata: Metadata = {
  title: 'Beranda - iz4ru.byte',
  description: 'Blog pribadi dengan artikel tentang teknologi dan pengembangan web',
  openGraph: {
    title: 'iz4ru.byte',
    description: 'Blog pribadi dengan artikel tentang teknologi dan pengembangan web',
    url: 'https://iz4ru.byte',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 align-middle text-center lg:text-start">
          <Typewriter />
          <p className="text-sm lg:text-base text-muted-foreground">
            Selamat datang di blog pribadiku!
          </p>
        </div>

        <PostList />
      </main>
      <Footer />
    </div>
  )
}
