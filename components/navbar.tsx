'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, ShieldCheck, User as UserIcon, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(e => e.trim()) ?? []

export function Navbar() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email ?? '') : false

  const pathname = usePathname()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
    setOpen(false)
  }

  return (
    <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent hover:text-primary transition-colors"
          onClick={() => setOpen(false)}
        >
          iz4ru.byte
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium text-primary flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-primary/10 transition-colors
                  ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}
                  `}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <Avatar className="w-8 h-8 cursor-default">
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'User'} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col">
                  <span className="text-sm font-medium text-foreground leading-none">
                    {user.user_metadata.full_name ?? user.user_metadata.name ?? 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/login">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-4 space-y-1">
          {loading ? (
            <div className="w-full h-8 bg-secondary rounded animate-pulse" />
          ) : user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-border pb-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || 'User'} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <UserIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-foreground leading-none">
                    {user.user_metadata.full_name ?? user.user_metadata.name ?? 'User'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 truncate">{user.email}</span>
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10 transition-colors
                  ${pathname === '/admin' ? 'bg-primary/10 text-primary' : 'text-primary hover:bg-primary/10'}
                  `}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}