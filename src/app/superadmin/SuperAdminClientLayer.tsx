"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Globe, Power, Building, Database, Users, DollarSign,
    Plus, Search, LogOut, ShieldCheck, Cpu, HardDrive,
    Activity, X, Loader2, ArrowUpRight
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { toggleInstituteStatus, createTenant } from "./actions";

export default function SuperAdminClientLayer({ initialInstitutes, stats }: any) {
    const { addToast } = useToast();
    const [search, setSearch] = useState("");
    const [selectedInst, setSelectedInst] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    const filteredInstitutes = initialInstitutes.filter((inst: any) =>
        inst.name.toLowerCase().includes(search.toLowerCase()) ||
        inst.domain.toLowerCase().includes(search.toLowerCase())
    );

    const handleOnboarding = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);
        const result = await createTenant(formData);

        if (result.success) {
            addToast("New Neural Node Provisioned", "success");
            setShowOnboarding(false);
        } else {
            addToast(result.error || "Provisioning Error", "error");
        }
        setIsUpdating(false);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-cyan-500 selection:text-black font-sans">
            {/* Ambient Background Engine */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[1000px] h-[1000px] bg-cyan-600/5 blur-[180px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[10%] w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full" />
            </div>

            {/* TOP NAVIGATION BAR */}
            <header className="fixed top-0 left-0 right-0 h-24 border-b border-white/5 bg-[#020202]/60 backdrop-blur-2xl z-50 flex items-center justify-between px-8">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                        <div className="w-full h-full bg-[#020202] rounded-[15px] flex items-center justify-center">
                            <Cpu size={24} className="text-cyan-400" />
                        </div>
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">NexGen OS • Ops</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                            <span className="text-[10px] text-cyan-500 font-mono tracking-[0.3em] uppercase">Core Sync: Active</span>
                        </div>
                    </div>
                </div>

                <button onClick={() => window.location.href = '/'} className="group flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all">
                    <span className="text-[10px] font-bold text-neutral-500 group-hover:text-rose-500 transition-colors">TERMINATE SESSION</span>
                    <LogOut size={16} className="text-neutral-600 group-hover:text-rose-500" />
                </button>
            </header>

            <main className="pt-32 pb-20 px-8 max-w-[1600px] mx-auto relative z-10 space-y-10">

                {/* GLOBAL COMMAND STATS */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Revenue Flux", val: stats.totalMrr, sub: "Live MRR Index", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/5" },
                        { label: "Neural Nodes", val: stats.activeClients, sub: "Active Tenants", icon: Building, color: "text-cyan-400", bg: "bg-cyan-500/5" },
                        { label: "Entity Count", val: stats.totalUsers, sub: "Total Identities", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/5" },
                        { label: "Cluster Load", val: "99.9%", sub: "Uptime Protocol", icon: Activity, color: "text-amber-400", bg: "bg-amber-500/5" },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${s.color}`}><s.icon size={80} /></div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">{s.label}</p>
                            <h3 className={`text-4xl font-black tracking-tighter ${s.color}`}>{s.val}</h3>
                            <div className="flex items-center gap-2 mt-4 text-[10px] text-neutral-600 font-mono">
                                <div className={`w-1 h-1 rounded-full ${s.color.replace('text', 'bg')}`} /> {s.sub}
                            </div>
                        </motion.div>
                    ))}
                </section>

                {/* INFRASTRUCTURE TABLE */}
                <section className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-sm">
                    <div className="p-10 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Infrastructure Management</h2>
                            <p className="text-sm text-neutral-500 mt-1">Global monitoring of onboarded educational clusters.</p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-4 top-3.5 text-neutral-600" size={18} />
                                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter by name or domain..." className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:border-cyan-500/50 outline-none transition-all" />
                            </div>
                            <button onClick={() => setShowOnboarding(true)} className="flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-400 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <Plus size={18} /> New Node
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase text-neutral-500 font-black tracking-[0.2em] bg-white/[0.02]">
                                    <th className="py-6 pl-10">Client Identity</th>
                                    <th className="py-6">Network Health</th>
                                    <th className="py-6">User Load</th>
                                    <th className="py-6">Status</th>
                                    <th className="py-6 pr-10 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {filteredInstitutes.map((inst: any) => (
                                    <tr key={inst.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-8 pl-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-neutral-500 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                                                    <Building size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base text-white">{inst.name}</p>
                                                    <p className="text-[10px] text-cyan-500 font-mono mt-0.5 tracking-wider uppercase">{inst.domain}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                    <div className="w-3/4 h-full bg-cyan-500/40" />
                                                </div>
                                                <span className="text-[10px] font-mono text-neutral-500">Nominal</span>
                                            </div>
                                        </td>
                                        <td className="py-8 font-mono text-sm text-neutral-400">{inst._count.users} Units</td>
                                        <td className="py-8">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${inst.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                <div className={`w-1 h-1 rounded-full ${inst.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                                {inst.status}
                                            </div>
                                        </td>
                                        <td className="py-8 pr-10 text-right">
                                            <button onClick={() => setSelectedInst(inst)} className={`p-3 rounded-xl transition-all ${inst.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-black shadow-lg shadow-rose-500/10' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black shadow-lg shadow-emerald-500/10'}`}>
                                                <Power size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* ONBOARDING MODAL */}
            <AnimatePresence>
                {showOnboarding && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOnboarding(false)} className="absolute inset-0 bg-[#020202]/90 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#0A0A0A] border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight">New Node</h2>
                                    <p className="text-neutral-500 text-sm mt-1 uppercase tracking-widest font-mono text-[10px]">Onboarding Protocol 4.2</p>
                                </div>
                                <button onClick={() => setShowOnboarding(false)} className="p-3 rounded-full hover:bg-white/5 transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleOnboarding} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Institute Name</label>
                                    <input required name="name" placeholder="e.g. Scholars Academy" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-cyan-500 transition-all text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Assigned Domain</label>
                                    <input required name="domain" placeholder="e.g. scholars.nexagrid.in" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-cyan-500 transition-all text-sm font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">Primary Admin Email</label>
                                    <input required type="email" name="adminEmail" placeholder="admin@domain.com" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 outline-none focus:border-cyan-500 transition-all text-sm font-mono" />
                                </div>
                                <button disabled={isUpdating} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-3">
                                    {isUpdating ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} /> Authorize Infrastructure</>}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* REUSE KILL SWITCH MODAL LOGIC HERE WITH HIGH-TECH UI... */}
        </div>
    );
}