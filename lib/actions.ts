'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('token') as string; // We treat "token" as password
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const remember = formData.get('remember') === 'on';
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const supabase = await createClient();

    // Debug: Log Supabase configuration (masked) to help diagnose 'fetch failed'
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    console.log(`[Login Debug] Attempting login to: ${url?.substring(0, 8)}... (${url?.length} chars)`);
    if (!url || url.includes('your-project-url')) {
        return { error: 'Configuration Error: NEXT_PUBLIC_SUPABASE_URL is not set correctly in .env.local' };
    }

    // Attempt login
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Return structured error for prompt debugging
        return {
            error: `[Login Error] Failed to sign in. Code: ${error.status || 'Unknown'}. Message: ${error.message}. Context: login -> signInWithPassword`
        };
    }

    // If "Remember Me" is checked, we don't need to do anything special with supabase-ssr 
    // because sessions are cookie-based by default.
    // But we could adjust cookie expiry if needed (advanced).

    return redirect('/');
}
