'use client'

import Link from 'next/link'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, PenSquare, ArrowLeft, User as UserIcon, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/create', label: 'Buat Artikel', icon: PenSquare },
    { href: '/', label: 'Kembali ke Blog', icon: ArrowLeft },
]

export function AdminNavbar() {
    const { user, loading } = useUser()
    const router = useRouter()
    const supabase = createClient()
    const [open, setOpen] = useState(false)

    const pathname = usePathname()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
        setOpen(false)
    }

    return (
        <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between">

                {/* Logo + desktop nav */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="font-mono font-bold text-lg text-accent hover:text-primary transition-colors"
                    >
                        iz4ru.byte
                    </Link>
                    <div className="hidden sm:flex items-center gap-1">
                        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${isActive
                                            ? 'bg-secondary text-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Desktop user */}
                <div className="hidden sm:flex items-center gap-4">
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
                    ) : user ? (
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
                    ) : null}
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
                    {/* Nav links */}
                    {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        )
                    })}

                    {/* User info + logout */}
                    {user && (
                        <div className="pt-3 mt-2 border-t border-border space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2">
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
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}