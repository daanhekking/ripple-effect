'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitReflection(questionId: string, answer: string) {
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            error: `[Auth Error] Could not retrieve user session. Details: ${authError?.message || 'No user found'}. Context: submitReflection -> getUser`
        };
    }

    // 2. Find latest reflection session
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: existingReflections, error: fetchError } = await supabase
        .from('reflections')
        .select('id, answers')
        .eq('user_id', user.id)
        .gt('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(1);

    if (fetchError) {
        return {
            error: `[Database Read Error] Failed to fetch existing reflections. Code: ${fetchError.code}. Message: ${fetchError.message}. Context: submitReflection -> select reflections`
        };
    }

    let reflectionId;
    let currentAnswers = {};

    if (existingReflections && existingReflections.length > 0) {
        // Update existing
        reflectionId = existingReflections[0].id;
        currentAnswers = existingReflections[0].answers || {};
    } else {
        // Create new
        const { data: newReflection, error: createError } = await supabase
            .from('reflections')
            .insert({
                user_id: user.id,
                answers: {}
            })
            .select()
            .single();

        if (createError) {
            return {
                error: `[Database Write Error] Failed to create new reflection session. Code: ${createError.code}. Message: ${createError.message}. Context: submitReflection -> insert reflections`
            };
        }
        reflectionId = newReflection.id;
    }

    // 3. Update Answers
    const updatedAnswers = {
        ...currentAnswers,
        [questionId]: answer
    };

    const { error: updateError } = await supabase
        .from('reflections')
        .update({ answers: updatedAnswers })
        .eq('id', reflectionId);

    if (updateError) {
        return {
            error: `[Database Update Error] Failed to save answer. Code: ${updateError.code}. Message: ${updateError.message}. Context: submitReflection -> update answers`
        };
    }

    revalidatePath('/');
    return { success: true };
}
