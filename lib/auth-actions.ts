'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signup(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as 'employee' | 'manager';

    // Validation
    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long' };
    }

    const supabase = await createClient();

    // Sign up the user
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ripple-effect-theta.vercel.app'}/auth/confirm`,
            data: {
                full_name: name,
                role: role || 'employee',
            },
        },
    });

    if (error) {
        return {
            error: `[Signup Error] ${error.message}`
        };
    }

    // Redirect to login page after successful signup
    return redirect('/login?signup=success');
}
