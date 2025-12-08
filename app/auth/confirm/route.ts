import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const next = searchParams.get('next') || '/'

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        })

        if (!error) {
            // Redirect to home page after successful confirmation
            return NextResponse.redirect(new URL('/?confirmed=true', request.url))
        }
    }

    // Redirect to login with error if confirmation fails
    return NextResponse.redirect(new URL('/login?error=confirmation_failed', request.url))
}
