'use server'

import { db } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// --- MARK ATTENDANCE ---
export async function markAttendance(batchId: string, studentData: { studentId: string, status: any }[], teacherId: string) {
    try {
        const date = new Date();
        date.setHours(0, 0, 0, 0); // Normalize to date only

        // 1. Fetch the Institute ID once before the loop
        const batch = await db.batch.findUnique({
            where: { id: batchId },
            select: { instituteId: true }
        });

        if (!batch) throw new Error("Batch not found.");

        // 2. Run the transaction with prepared queries
        await db.$transaction(
            studentData.map((s) =>
                db.attendance.upsert({
                    where: {
                        studentId_batchId_date: { studentId: s.studentId, batchId, date }
                    },
                    update: { status: s.status },
                    create: {
                        studentId: s.studentId,
                        batchId,
                        date,
                        status: s.status,
                        recordedBy: teacherId,
                        instituteId: batch.instituteId
                    }
                })
            )
        );

        revalidatePath('/teacher');
        return { success: true };
    } catch (error) {
        console.error("Attendance Sync Error:", error);
        return { error: "Failed to sync attendance with NexaGrid Core." };
    }
}

// --- PUBLISH GRADES ---
export async function publishGrades(examName: string, batchId: string, scores: { studentId: string, subject: string, marks: number }[]) {
    try {
        const exam = await db.exam.create({
            data: { name: examName, date: new Date(), batchId }
        });

        await db.examScore.createMany({
            data: scores.map(s => ({
                examId: exam.id,
                studentId: s.studentId,
                subject: s.subject,
                marksObtained: s.marks,
                maxMarks: 100
            }))
        });

        revalidatePath('/teacher');
        return { success: true };
    } catch (error) {
        return { error: "Gradebook synchronization failed." };
    }
}

// --- PROCESS STUDENT LEAVE ---
export async function processLeave(leaveId: string, status: 'APPROVED' | 'REJECTED') {
    try {
        await db.leaveRequest.update({
            where: { id: leaveId },
            data: { status }
        });
        revalidatePath('/teacher');
        return { success: true };
    } catch (error) {
        return { error: "Failed to process leave request." };
    }
}