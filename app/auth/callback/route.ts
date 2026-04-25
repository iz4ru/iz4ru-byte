import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    let next = requestUrl.searchParams.get('next') ?? '/'

    if (!next.startsWith('/')) {
        next = '/'
    }

    if (code) {
        const supabase = await createClient()

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Opsional: Di sini kamu bisa mengecek role user lagi jika perlu
            // Tapi biasanya middleware yang akan menangani proteksi /admin
        }
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
}