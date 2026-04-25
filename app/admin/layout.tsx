'use client'

import { ReactNode } from 'react'
import { AdminNavbar } from '@/components/admin-navbar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
    </div>
  )
}
