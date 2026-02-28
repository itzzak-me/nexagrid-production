import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";
import TeacherDashboardClientLayer from "./TeacherDashboardClientLayer";
import { redirect } from "next/navigation";

export default async function TeacherDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/');

    // 1. Fetch Teacher Profile + Batches
    const profile = await db.user.findUnique({
        where: { id: user.id },
        include: {
            teacherProfile: {
                include: {
                    batches: {
                        include: {
                            batch: {
                                include: {
                                    students: { include: { student: { include: { user: true } } } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!profile || !profile.teacherProfile) {
        return <div className="p-20 text-white font-mono text-xs uppercase">Handshake Failed: Not a Faculty Node.</div>;
    }

    // 2. Fetch Real Pending Leaves for this teacher's students
    const batchIds = profile.teacherProfile.batches.map(b => b.batchId);
    const pendingLeaves = await db.leaveRequest.findMany({
        where: {
            status: 'PENDING',
            user: {
                studentProfile: {
                    batches: { some: { batchId: { in: batchIds } } }
                }
            }
        },
        include: { user: true }
    });

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">Synchronizing Faculty Uplink...</div>}>
            <TeacherDashboardClientLayer
                profile={profile}
                batches={profile.teacherProfile.batches}
                leaves={pendingLeaves}
            />
        </Suspense>
    );
}