'use client'

import { useState, useRef, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'
import { Loader2, ShieldAlert, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Aurora from '@/components/aurora'

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const nextPath = searchParams.get('next') || '/'

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('next', nextPath)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl.toString() },
      })
      if (error) throw error
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Terjadi kesalahan saat login.')
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border shadow-lg backdrop-blur-md bg-background/80 z-20">
      <CardHeader className="space-y-1 text-center">
        <h1 className="text-3xl font-bold font-mono text-accent my-6">iz4ru.byte</h1>
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-accent/5 p-6">
            <ShieldAlert className="h-10 w-10 text-accent" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold font-lora">Masuk Akun</CardTitle>
        <CardDescription className="max-w-2xl">
          Silakan login untuk berinteraksi dengan blog iz4ru.byte
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <Button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className="w-full flex items-center justify-center gap-3 py-6 text-base hover:bg-secondary/50 transition-colors"
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Menghubungkan...</>
          ) : (
            <><FcGoogle className="h-5 w-5" />Lanjutkan dengan Google</>
          )}
        </Button>
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
        </div>
        <div className="flex justify-center my-6">
          <Link href="/" className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Kembali ke Beranda
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 bg-background overflow-hidden">
      <Aurora
        className="z-0"
        colorStops={["#b2ff4d", "#4db2ff", "#7db336"]}
        blend={0.5}
        amplitude={1.0}
        speed={1}
      />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-sm z-10" />
      <Suspense fallback={
        <Card className="w-full max-w-md border-border shadow-lg backdrop-blur-md bg-background/80 z-20">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      }>
        <LoginContent />
      </Suspense>
    </div>
  )
}