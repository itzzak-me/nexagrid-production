"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Globe, Server, ShieldAlert, Power, Building, Database,
    Activity, Users, DollarSign, Plus, Search, ChevronRight,
    CheckCircle2, XCircle, AlertTriangle, Lock, LogOut, Download
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// --- MOCK GLOBAL DATA (To be replaced by Prisma) ---
const GLOBAL_STATS = {
    totalMrr: "₹85,000",
    activeClients: 3,
    totalUsers: 925,
    dbLoad: "12%"
};

const MOCK_INSTITUTES = [
    { id: "INS-001", name: "Scholars Coaching Point", domain: "scholars.nexagrid.in", mrr: 25000, users: 55, status: "Active", storage: "150 MB" },
    { id: "INS-002", name: "Allen Academy Group", domain: "allen.nexagrid.in", mrr: 45000, users: 850, status: "Active", storage: "1.2 GB" },
    { id: "INS-003", name: "Apex Classes", domain: "apex.nexagrid.in", mrr: 15000, users: 20, status: "Suspended", storage: "45 MB" },
];

// --- SCROLL LOCK ---
const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- STAT CARD ---
const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all flex items-center justify-between">
        <div>
            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mb-1">{title}</p>
            <h3 className={`text-3xl font-black tracking-tight ${color.text}`}>{value}</h3>
            <p className="text-[10px] text-neutral-600 mt-2 font-mono">{sub}</p>
        </div>
        <div className={`p-4 rounded-2xl ${color.bg} ${color.text}`}>
            <Icon size={24} />
        </div>
    </div>
);

// --- KILL SWITCH MODAL ---
const KillSwitchModal = ({ institute, onClose, onConfirm }: { institute: any, onClose: () => void, onConfirm: () => void }) => {
    useScrollLock();
    const isActive = institute.status === "Active";

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-[#020202]/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] max-w-md w-full shadow-2xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${isActive ? 'bg-rose-500' : 'bg-emerald-500'}`} />

                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isActive ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                    <Power size={32} />
                </div>

                <h2 className="text-2xl font-bold mb-2">
                    {isActive ? "Suspend Institute?" : "Reactivate Institute?"}
                </h2>
                <p className="text-sm text-neutral-400 mb-6">
                    {isActive
                        ? `Are you sure you want to suspend ${institute.name}? All student and faculty logins will be immediately blocked.`
                        : `This will restore full access to ${institute.name}.`}
                </p>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-neutral-300 font-bold hover:bg-white/5 transition-colors">Cancel</button>
                    <button onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-bold text-black transition-colors ${isActive ? 'bg-rose-500 hover:bg-rose-400' : 'bg-emerald-500 hover:bg-emerald-400'}`}>
                        {isActive ? "Confirm Suspension" : "Activate"}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- MAIN CONTENT ---
const SuperAdminContent = () => {
    const { addToast } = useToast();
    const router = useRouter();
    const [institutes, setInstitutes] = useState(MOCK_INSTITUTES);
    const [search, setSearch] = useState("");
    const [selectedInst, setSelectedInst] = useState<any>(null);

    const handleToggleStatus = () => {
        setInstitutes(prev => prev.map(inst => {
            if (inst.id === selectedInst.id) {
                const newStatus = inst.status === "Active" ? "Suspended" : "Active";
                addToast(`${inst.name} is now ${newStatus}`, newStatus === "Active" ? "success" : "error");
                return { ...inst, status: newStatus };
            }
            return inst;
        }));
        setSelectedInst(null);
    };

    const filteredInstitutes = institutes.filter(inst => inst.name.toLowerCase().includes(search.toLowerCase()) || inst.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500 selection:text-black">
            {/* Global Background Glow */}
            <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none transform-gpu" />

            {/* TOP NAV */}
            <header className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-[#020202]/80 backdrop-blur-md z-50 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-cyan-500 text-black flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm tracking-widest uppercase">NexGen OS Ops</h1>
                        <p className="text-[9px] text-cyan-500 font-mono tracking-[0.3em]">God Mode Enabled</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-300">All Systems Nominal</span>
                    </div>
                    <button onClick={() => { addToast("Logging out of God Mode", "info"); router.push('/'); }} className="p-2.5 rounded-full hover:bg-rose-500/10 hover:text-rose-500 text-neutral-500 transition-colors">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto relative z-10 space-y-8">

                {/* GLOBAL STATS */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total MRR" value={GLOBAL_STATS.totalMrr} sub="Monthly Recurring Revenue" icon={DollarSign} color={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }} />
                    <StatCard title="Active Tenants" value={GLOBAL_STATS.activeClients} sub="Paying Institutes" icon={Building} color={{ bg: "bg-cyan-500/10", text: "text-cyan-500" }} />
                    <StatCard title="Global Users" value={GLOBAL_STATS.totalUsers} sub="Students & Teachers" icon={Users} color={{ bg: "bg-indigo-500/10", text: "text-indigo-500" }} />
                    <StatCard title="DB Storage Load" value={GLOBAL_STATS.dbLoad} sub="Supabase Cluster AP-South-1" icon={Database} color={{ bg: "bg-amber-500/10", text: "text-amber-500" }} />
                </section>

                {/* TENANT MANAGEMENT */}
                <section className="bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-xl font-bold">Client Network</h2>
                            <p className="text-xs text-neutral-500 mt-1">Manage infrastructure for all onboarded institutes.</p>
                        </div>
                        <div className="flex gap-4 w-full sm:w-auto">
                            <div className="relative flex-1 sm:w-64">
                                <Search className="absolute left-3 top-2.5 text-neutral-500" size={16} />
                                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tenants..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:border-cyan-500 outline-none transition-colors" />
                            </div>
                            <button className="flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-cyan-400 transition-colors shrink-0">
                                <Plus size={16} /> New Tenant
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5 text-[10px] uppercase text-neutral-500 tracking-widest font-bold">
                                    <th className="pb-4 pl-4">Institute Name & Domain</th>
                                    <th className="pb-4">Users</th>
                                    <th className="pb-4">MRR</th>
                                    <th className="pb-4">DB Storage</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right pr-4">Kill Switch</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredInstitutes.map((inst) => (
                                    <tr key={inst.id} className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-none">
                                        <td className="py-4 pl-4">
                                            <p className="font-bold text-white flex items-center gap-2">{inst.name}</p>
                                            <p className="text-[10px] text-cyan-500 font-mono mt-0.5">{inst.domain}</p>
                                        </td>
                                        <td className="py-4 text-neutral-300 font-mono">{inst.users}</td>
                                        <td className="py-4 text-emerald-400 font-mono font-bold">₹{inst.mrr.toLocaleString()}</td>
                                        <td className="py-4 text-neutral-400 font-mono text-xs">{inst.storage}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${inst.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                {inst.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <button
                                                onClick={() => setSelectedInst(inst)}
                                                className={`p-2 rounded-xl transition-all ${inst.status === 'Active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-black' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black'}`}
                                                title={inst.status === 'Active' ? 'Suspend Institute' : 'Reactivate'}
                                            >
                                                <Power size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

            </main>

            <AnimatePresence>
                {selectedInst && <KillSwitchModal institute={selectedInst} onClose={() => setSelectedInst(null)} onConfirm={handleToggleStatus} />}
            </AnimatePresence>

        </div>
    );
};

export default function SuperAdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-cyan-500 font-mono text-xs uppercase tracking-widest">Initializing God Mode...</div>}>
            <SuperAdminContent />
        </Suspense>
    );
}