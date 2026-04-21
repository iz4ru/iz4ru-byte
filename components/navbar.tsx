import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="font-mono font-bold text-lg text-accent hover:text-primary transition-colors">
          iz4ru.byte
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-foreground hover:text-accent transition-colors text-sm font-medium"
          >
            Beranda
          </Link>
          <Link
            href="/admin"
            className="text-foreground hover:text-accent transition-colors text-sm font-medium"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
