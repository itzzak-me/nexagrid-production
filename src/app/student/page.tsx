import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import StudentDashboardClientLayer from "./StudentDashboardClientLayer";

export default async function StudentDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/');

    // 1. Fetch Student Identity with corrected Prisma naming
    const studentData = await db.user.findUnique({
        where: { id: user.id },
        include: {
            studentProfile: { // Ensure this exists in your User model in schema.prisma
                include: {
                    batches: { include: { batch: true } },
                    attendances: { orderBy: { date: 'desc' }, take: 31 }, // Changed from 'attendance'
                    examScores: { include: { exam: true } }
                }
            }
        }
    }) as any; // Temporary 'as any' to bypass the profile check while you update schema

    if (!studentData?.studentProfile) {
        return <div className="p-20 text-white font-mono text-xs uppercase">Handshake Failed: Identity Not Found.</div>;
    }

    // 2. Fetch Global Doubts (Check if your table is 'doubt' or 'Doubts')
    // If 'db.doubt' fails, try 'db.doubts' or 'db.Doubt'
    const peerDoubts = await (db as any).doubt.findMany({
        where: { instituteId: studentData.instituteId },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">Establishing Neural Link...</div>}>
            <StudentDashboardClientLayer
                student={studentData}
                initialDoubts={peerDoubts}
            />
        </Suspense>
    );
}