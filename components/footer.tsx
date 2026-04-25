// components/footer.tsx
'use client'

import Link from 'next/link'
import { Github, Instagram, Shield, Scale } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* LOGO BRAND - Sama seperti di Navbar */}
        <div className="mb-6 flex md:justify-start justify-center">
          <Link
            href="/"
            className="font-mono font-bold text-xl text-accent hover:text-primary transition-colors inline-flex items-center"
          >
            iz4ru.byte
          </Link>
        </div>

        {/* Bagian Atas: Copyright & Social Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} iz4ru.byte. Semua hak cipta terlindungi.
          </p>
          
          {/* Social Media dengan Ikon Lucide */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/tria.mr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5 text-sm"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
            <a
              href="https://github.com/iz4ru"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-1.5 text-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-4" />

        {/* Bagian Bawah: Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p className="text-center sm:text-left">
            iz4ru.byte • written and maintained by iz4ru
          </p>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/privacy-policy" 
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Privacy Policy
            </Link>
            <Link 
              href="/terms-of-service" 
              className="hover:text-accent transition-colors flex items-center gap-1"
            >
              <Scale className="w-3 h-3" />
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}