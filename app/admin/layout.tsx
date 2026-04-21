'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="font-mono font-bold text-lg text-accent">
            Admin Panel
          </Link>
          <div className="flex gap-6">
            <Link
              href="/admin"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/create"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Buat Artikel
            </Link>
            <Link
              href="/"
              className="text-foreground hover:text-accent transition-colors text-sm font-medium"
            >
              Kembali ke Blog
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}
