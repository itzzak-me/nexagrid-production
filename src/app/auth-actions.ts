'use server';

import { createClient } from '../lib/supabase';
import { db } from '../lib/prisma';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: "Access Denied: Invalid Credentials" };

    // 1. Fetch User + Institute Status
    const user = await db.user.findUnique({
        where: { id: data.user.id },
        include: { institute: true }
    });

    if (!user) return { error: "Identity protocol failure." };

    // 2. THE KILL SWITCH LOGIC
    if (user.institute.status === 'SUSPENDED') {
        // If it's the ADMIN, send them to a restricted billing page
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
            redirect('/admin/billing-alert');
        }

        // For Students/Teachers, show a generic "Server Error"
        // We redirect them to a page that looks like a technical crash
        redirect('/system-error');
    }

    // 3. PROCEED TO DASHBOARDS
    if (user.role === 'SUPERADMIN') redirect('/superadmin');
    if (user.role === 'ADMIN') redirect('/admin');
    if (user.role === 'TEACHER') redirect('/teacher');
    redirect('/student');
}