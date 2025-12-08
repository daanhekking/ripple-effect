import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const code = searchParams.get('code')
    const next = searchParams.get('next') || '/'

    const supabase = await createClient()

    // Handle PKCE flow (default Supabase email confirmation)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(new URL('/?confirmed=true', request.url))
        }
    }

    // Handle legacy token hash flow (for custom email templates)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        })

        if (!error) {
            return NextResponse.redirect(new URL('/?confirmed=true', request.url))
        }
    }

    // Redirect to login with error if confirmation fails or no valid parameters
    return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url))
}
