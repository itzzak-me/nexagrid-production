'use server'

import { db } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitLeaveRequest(formData: FormData, userId: string) {
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const reason = formData.get('reason') as string;
    const type = formData.get('type') as string;

    try {
        await db.leaveRequest.create({
            data: {
                userId,
                startDate,
                endDate,
                reason,
                type,
                status: 'PENDING'
            }
        });
        revalidatePath('/student');
        return { success: true };
    } catch (error) {
        return { error: "Leave request failed." };
    }
}

export async function postDoubt(query: string, userId: string, instituteId: string) {
    try {
        // If 'doubt' is wrong, try 'Doubts' or check your schema.prisma model name
        await (db as any).doubt.create({
            data: {
                query,
                studentId: userId,
                instituteId,
                status: 'PEER_REVIEW'
            }
        });
        revalidatePath('/student');
        return { success: true };
    } catch (error) {
        return { error: "Hive Mind uplink failed." };
    }
}