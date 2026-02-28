import { db } from "@/lib/prisma";
import { Suspense } from "react";
import SuperAdminClientLayer from "./SuperAdminClientLayer";

export default async function SuperAdminPage() {
    // 1. Fetch Real Data from Prisma
    const institutes = await db.institute.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { users: true }
            }
        }
    });

    // 2. Aggregate Real Stats
    const totalUsers = institutes.reduce((acc, inst) => acc + inst._count.users, 0);
    const activeTenants = institutes.filter(i => i.status === 'ACTIVE').length;

    const stats = {
        totalMrr: "₹" + (institutes.length * 25000).toLocaleString(), // Mocking MRR calc for now
        activeClients: activeTenants,
        totalUsers: totalUsers,
        dbLoad: "Optimal"
    };

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-cyan-500 font-mono text-xs uppercase tracking-widest">Accessing Secure Vault...</div>}>
            <SuperAdminClientLayer initialInstitutes={institutes} stats={stats} />
        </Suspense>
    );
}