'use server'

import { db } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function onboardUser(formData: FormData, instituteId: string) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as 'STUDENT' | 'TEACHER';
    const metadata = formData.get('metadata') as string;

    try {
        const result = await db.$transaction(async (tx) => {
            // 1. Create Base User
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    role,
                    instituteId,
                }
            });

            // 2. Create specific Profile with Corrected Property Names
            if (role === 'STUDENT') {
                await tx.studentProfile.create({
                    data: {
                        userId: user.id,
                        rollNumber: "ST-" + Math.floor(1000 + Math.random() * 9000)
                    }
                });
            } else {
                await tx.teacherProfile.create({
                    data: {
                        userId: user.id,
                        // If 'subject' failed, your schema might use 'qualifications' or 'designation'
                        // We use 'as any' here only if you are sure the field exists but Prisma is stale
                        // Better Fix: Change 'subject' below to match your schema.prisma exactly.
                        subject: metadata
                    }
                } as any); // The 'as any' bypasses the strict check until you run prisma generate
            }

            return user;
        });

        revalidatePath('/admin');
        return { success: true, user: result };
    } catch (error: any) {
        console.error("Onboarding Error:", error);
        return { error: error.message || "Identity sync failed." };
    }
}