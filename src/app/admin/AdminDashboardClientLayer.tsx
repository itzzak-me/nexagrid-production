"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Shield, Users, DollarSign, Activity,
    Bell, Search, ChevronDown, Download,
    UserPlus, FileText, AlertCircle, CheckCircle2,
    ArrowUpRight, Lock, CreditCard,
    ChevronRight, X, User, Save, Loader2,
    LogOut, Zap, Eye, Calendar, Copy,
    Banknote, Wallet, GraduationCap, Star, BookOpen, ThumbsUp
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { onboardUser } from "./actions"; // Import the Server Action

// --- STAT CARD COMPONENT ---
const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <motion.div whileHover={{ y: -4 }} className="p-5 sm:p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${color.bg} ${color.text}`}><Icon size={20} /></div>
            {trend && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full"><ArrowUpRight size={10} /> {trend}</span>}
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
        <p className="text-[10px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">{title}</p>
        {sub && <p className="text-[9px] sm:text-[10px] text-neutral-600 mt-2 font-mono">{sub}</p>}
    </motion.div>
);

// --- USER ONBOARDING MODAL ---
const UserManagementModal = ({ onClose, instituteId }: { onClose: () => void, instituteId: string }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
    const [isLoading, setIsLoading] = useState(false);
    const [createdUser, setCreatedUser] = useState<any>(null);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('role', activeTab);

        // Metadata is 'Batch' for students or 'Department' for teachers
        const metadata = formData.get('metadata') as string;

        const result = await onboardUser(formData, instituteId);
        if (result.success) {
            addToast(`${activeTab} identity synchronized`, "success");
            setCreatedUser({
                id: result.user.id,
                name: result.user.name,
                pass: "NexGen@123", // Default temp pass
                role: activeTab
            });
        } else {
            addToast(result.error || "Uplink Error", "error");
        }
        setIsLoading(false);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-widest text-amber-500">Identity Provisioning</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-lg mx-auto py-10">
                    {!createdUser ? (
                        <>
                            <div className="flex bg-white/5 p-1 rounded-2xl mb-10">
                                <button onClick={() => setActiveTab('STUDENT')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'STUDENT' ? 'bg-white text-black' : 'text-neutral-500'}`}>Student</button>
                                <button onClick={() => setActiveTab('TEACHER')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'TEACHER' ? 'bg-white text-black' : 'text-neutral-500'}`}>Faculty</button>
                            </div>
                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest ml-1">Legal Name</label>
                                    <input required name="name" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-amber-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest ml-1">Email Protocol</label>
                                    <input required type="email" name="email" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-amber-500 transition-all font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-neutral-500 tracking-widest ml-1">{activeTab === 'STUDENT' ? 'Primary Batch' : 'Department'}</label>
                                    <input required name="metadata" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-amber-500 transition-all" />
                                </div>
                                <button disabled={isLoading} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all active:scale-95 disabled:opacity-50">
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Authorize Identity"}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 text-center">
                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-black mb-2">Uplink Success</h2>
                            <p className="text-neutral-500 text-sm mb-8 italic">Identity established for {createdUser.name}</p>
                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-left mb-8 font-mono">
                                <p className="text-[10px] text-neutral-600 uppercase mb-4 tracking-widest">Access Credentials</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-neutral-400">ID:</span>
                                    <span className="text-amber-500 text-sm">{createdUser.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-neutral-400">PASS:</span>
                                    <span className="text-white text-sm">{createdUser.pass}</span>
                                </div>
                            </div>
                            <button onClick={() => setCreatedUser(null)} className="w-full py-4 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all">Onboard Another</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN CLIENT LAYER ---
export default function AdminDashboardClientLayer({ stats, admin, instituteId }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const currentView = searchParams.get('view');

    const handleLogout = () => {
        addToast("Director Session Terminated", "info");
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-28 pb-24 selection:bg-amber-500 overflow-x-hidden">
            <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none" />

            {/* TOP NAVIGATION */}
            <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-8 z-50 bg-[#020202]/60 backdrop-blur-2xl border-b border-white/5">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        <Shield className="text-black" size={24} />
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-widest uppercase">{admin.institute.name}</h1>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] text-neutral-500 font-mono tracking-[0.2em] uppercase">Director Command Core</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] text-neutral-400">ID: {admin.email}</div>
                    <button onClick={handleLogout} className="p-3 rounded-full hover:bg-rose-500/10 text-neutral-500 hover:text-rose-500 transition-colors"><LogOut size={20} /></button>
                </div>
            </header>

            <main className="px-8 max-w-[1600px] mx-auto space-y-10 relative z-10">

                {/* GLOBAL STATS */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Revenue Index" value={stats.totalRevenue} icon={DollarSign} color={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }} trend="Live" />
                    <StatCard title="Total Students" value={stats.activeStudents} icon={Users} color={{ bg: "bg-blue-500/10", text: "text-blue-500" }} sub="Identity Managed" />
                    <StatCard title="Pending Holds" value={stats.pendingFees} icon={AlertCircle} color={{ bg: "bg-rose-500/10", text: "text-rose-500" }} sub="Awaiting Clearance" />
                    <StatCard title="System Node" value={stats.serverLoad} icon={Activity} color={{ bg: "bg-amber-500/10", text: "text-amber-500" }} sub="Uptime 100%" />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* INFRASTRUCTURE CONTROLS */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => router.push(pathname + '?view=add_user')} className="p-8 rounded-[2.5rem] bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-left flex flex-col justify-between group h-64 shadow-xl shadow-indigo-900/20">
                                <UserPlus size={32} className="group-hover:scale-110 transition-transform" />
                                <div>
                                    <h4 className="font-black text-xl tracking-tight">Onboard User</h4>
                                    <p className="text-[10px] uppercase font-bold text-indigo-200 mt-2 tracking-widest">Identity Protocol</p>
                                </div>
                            </button>
                            <button onClick={() => router.push(pathname + '?view=fees')} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all text-left flex flex-col justify-between group h-64">
                                <Wallet size={32} className="text-amber-500 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h4 className="font-black text-xl tracking-tight text-white">Fee Manager</h4>
                                    <p className="text-[10px] uppercase font-bold text-neutral-500 mt-2 tracking-widest">Financial Hub</p>
                                </div>
                            </button>
                        </div>
                        <button onClick={() => router.push(pathname + '?view=faculty')} className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><GraduationCap size={20} /></div>
                                <span className="font-bold">Faculty Directory</span>
                            </div>
                            <ChevronRight size={20} className="text-neutral-600" />
                        </button>
                    </div>

                    {/* RECENT ACTIVITY LOGS */}
                    <div className="lg:col-span-2 bg-white/[0.01] border border-white/5 rounded-[3rem] p-10">
                        <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-8">System Telemetry</h3>
                        <div className="space-y-6 border-l border-white/5 ml-2 pl-8 relative">
                            {[
                                { t: "09:42 AM", m: "Admin Handshake Established", i: Shield, c: "text-emerald-500" },
                                { t: "08:15 AM", m: "Cloud Database Backup Synced", i: FileText, c: "text-blue-500" }
                            ].map((log, i) => (
                                <div key={i} className="relative">
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#020202] border border-white/10 flex items-center justify-center"><div className="w-1 h-1 rounded-full bg-neutral-600" /></div>
                                    <p className="text-[9px] font-mono text-neutral-600 mb-1">{log.t}</p>
                                    <p className="text-sm font-bold text-neutral-300 flex items-center gap-2">{log.m} <log.i size={12} className={log.c} /></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BRANDED FOOTER */}
                <footer className="pt-20 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-mono uppercase tracking-[0.2em] border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Link Encrypted • 256-bit</span>
                    </div>
                    <span className="font-bold text-neutral-500">POWERED BY NEXGEN OPERATING SYSTEMS INDIA</span>
                </footer>
            </main>

            {/* MODAL LAYER */}
            <AnimatePresence>
                {currentView === 'add_user' && <UserManagementModal instituteId={instituteId} onClose={() => router.back()} />}
                {/* Other modals would be connected here similarly */}
            </AnimatePresence>
        </div>
    );
}