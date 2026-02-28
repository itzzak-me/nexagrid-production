import { db } from "@/lib/prisma";
import { createClient } from "@/lib/supabase";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminDashboardClientLayer from "./AdminDashboardClientLayer";

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/');

    // 1. Fetch Admin Identity + Institute Stats
    const adminData = await db.user.findUnique({
        where: { id: user.id },
        include: { institute: true }
    });

    if (!adminData || (adminData.role !== 'ADMIN' && adminData.role !== 'SUPERADMIN')) {
        redirect('/');
    }

    const instId = adminData.instituteId;

    // 2. Aggregate Real Stats (Single-Institute Scope)
    const [studentCount, teacherCount, pendingFeeCount] = await Promise.all([
        db.user.count({ where: { instituteId: instId, role: 'STUDENT' } }),
        db.user.count({ where: { instituteId: instId, role: 'TEACHER' } }),
        db.leaveRequest.count({ where: { user: { instituteId: instId }, status: 'PENDING' } })
    ]);

    const stats = {
        totalRevenue: "₹0", // Wire to Transaction table later
        activeStudents: studentCount,
        pendingFees: "₹0",
        serverLoad: "Optimal"
    };

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-amber-500 font-mono text-xs uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</div>}>
            <AdminDashboardClientLayer
                stats={stats}
                admin={adminData}
                instituteId={instId}
            />
        </Suspense>
    );
}