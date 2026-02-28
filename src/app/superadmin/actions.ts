'use server'

import { db } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTenant(formData: FormData) {
    const name = formData.get('name') as string;
    const domain = formData.get('domain') as string;
    const adminEmail = formData.get('adminEmail') as string;

    try {
        const result = await db.$transaction(async (tx) => {
            // 1. Create the Institute
            const inst = await tx.institute.create({
                data: { name, domain, status: 'ACTIVE' }
            });

            // 2. Create a default "General" batch for the new institute
            await tx.batch.create({
                data: {
                    name: "Main Batch",
                    instituteId: inst.id,
                    stream: "General"
                }
            });

            // 3. Create the Institute Admin User
            await tx.user.create({
                data: {
                    email: adminEmail,
                    name: `${name} Admin`,
                    role: 'ADMIN',
                    instituteId: inst.id
                }
            });

            return inst;
        });

        revalidatePath('/superadmin');
        return { success: true, id: result.id };
    } catch (error: any) {
        console.error(error);
        return { error: error.message || "Failed to provision new tenant." };
    }
}

// Keep your existing toggleInstituteStatus function here too...
export async function toggleInstituteStatus(id: string, currentStatus: string) {
    try {
        const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        await db.institute.update({
            where: { id },
            data: { status: newStatus as any },
        });
        revalidatePath('/superadmin');
        return { success: true };
    } catch (error) {
        return { error: "Infrastructure update failed." };
    }
}