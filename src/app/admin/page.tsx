"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useConfig } from "@/context/ConfigContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
// FIXED: Added 'CreditCard' to imports
import {
    Shield, Users, TrendingUp, DollarSign, Activity,
    Settings, Bell, Search, ChevronDown, Download,
    UserPlus, FileText, AlertCircle, CheckCircle2,
    BarChart3, PieChart, ArrowUpRight, Lock, CreditCard
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { ADMIN_STATS, REVENUE_DATA, CRM_LEADS, SYSTEM_LOGS } from "@/lib/data";

const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- COMPONENT: ADMIN TOP NAV ---
const AdminTopNav = () => {
    const { schoolName } = useConfig();
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-50">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Shield className="text-amber-500" size={20} />
                </div>
                <div>
                    <span className="font-bold text-sm text-white tracking-wide block">{schoolName}</span>
                    <span className="text-[10px] font-mono text-amber-500/80 uppercase tracking-widest">Master Control</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-500">SYSTEM SECURE</span>
                </div>
                <button className="p-2.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"><Search size={18} /></button>
                <button className="p-2.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020202]" />
                </button>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-white/10 ml-2" />
            </div>
        </header>
    );
};

// --- COMPONENT: STATS CARD ---
const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${color.bg} ${color.text}`}>
                <Icon size={22} />
            </div>
            {trend && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <ArrowUpRight size={10} /> {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{title}</p>
        {sub && <p className="text-[10px] text-neutral-600 mt-2 font-mono">{sub}</p>}
    </motion.div>
);

// --- COMPONENT: REVENUE CHART ---
const RevenueChart = () => {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-lg font-bold text-white">Financial Overview</h3>
                    <p className="text-xs text-neutral-500 font-mono uppercase tracking-wider">Revenue vs Targets</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold hover:bg-white/10 transition-colors">
                    <Download size={14} /> Export Report
                </button>
            </div>

            <div className="h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={REVENUE_DATA}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '12px' }}
                            itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- COMPONENT: QUICK ACTIONS ---
const QuickActions = () => {
    const { addToast } = useToast();
    return (
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => addToast("User Creation Modal Opening...", "info")} className="p-6 rounded-[2rem] bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-left group">
                <UserPlus size={28} className="mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg">Add User</h4>
                <p className="text-xs text-indigo-200 mt-1">Student or Staff</p>
            </button>
            <button onClick={() => addToast("Report Generation Started", "success")} className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all text-left text-white group">
                <FileText size={28} className="mb-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg">Reports</h4>
                <p className="text-xs text-neutral-500 mt-1">Audit & Finance</p>
            </button>
        </div>
    );
};

// --- COMPONENT: SYSTEM LOGS ---
const SystemLogs = () => {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Log</h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-4">
                {SYSTEM_LOGS.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/[0.03]">
                        <div className={`p-2 rounded-lg ${log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {log.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white">{log.msg}</p>
                            <p className="text-[10px] font-mono text-neutral-600 mt-0.5">{log.time}</p>
                        </div>
                    </div>
                ))}
                {/* Mocking extra logs for visual density */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/[0.03]">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Lock size={14} /></div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-white">Admin Login</p>
                        <p className="text-[10px] font-mono text-neutral-600 mt-0.5">09:42 AM • 192.168.1.4</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: CRM LEADS ---
const CRMWidget = () => {
    return (
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest">Admissions CRM</h3>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md">LIVE</span>
            </div>
            <div className="space-y-4">
                {CRM_LEADS.map((lead) => (
                    <div key={lead.id} className="flex justify-between items-center group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-white group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                {lead.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{lead.name}</p>
                                <p className="text-[10px] text-neutral-500 font-mono">{lead.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-white">{lead.value}</p>
                            <p className="text-[9px] text-amber-500 uppercase font-bold">{lead.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/10 transition-colors uppercase tracking-widest">
                View Pipeline
            </button>
        </div>
    );
};

// --- MAIN LAYOUT ---
const AdminDashboard = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-24 pb-10 selection:bg-amber-500 selection:text-black overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-[500px] bg-amber-500/5 blur-[150px] pointer-events-none" />
            <AdminTopNav />

            <main className="px-6 max-w-[1600px] mx-auto space-y-6 relative z-10">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Revenue"
                        value={ADMIN_STATS.totalRevenue}
                        icon={DollarSign}
                        color={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }}
                        trend="12%"
                    />
                    <StatCard
                        title="Active Students"
                        value={ADMIN_STATS.activeStudents}
                        icon={Users}
                        color={{ bg: "bg-blue-500/10", text: "text-blue-500" }}
                        trend="5%"
                    />
                    <StatCard
                        title="Pending Fees"
                        value={ADMIN_STATS.pendingFees}
                        icon={AlertCircle}
                        color={{ bg: "bg-rose-500/10", text: "text-rose-500" }}
                        sub="32 Accounts Overdue"
                    />
                    <StatCard
                        title="System Load"
                        value={ADMIN_STATS.serverLoad}
                        icon={Activity}
                        color={{ bg: "bg-amber-500/10", text: "text-amber-500" }}
                        sub="Optimal Performance"
                    />
                </div>

                {/* MAIN VISUALIZATION ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[420px]">
                    <div className="lg:col-span-2 h-full">
                        <RevenueChart />
                    </div>
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex-1">
                            <QuickActions />
                        </div>
                        <div className="flex-1">
                            <CRMWidget />
                        </div>
                    </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Recent Transactions</h3>
                            <button className="text-xs text-neutral-500 hover:text-white transition-colors">VIEW ALL</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] uppercase text-neutral-500 tracking-widest font-bold">
                                        <th className="pb-4 pl-2">ID</th>
                                        <th className="pb-4">Date</th>
                                        <th className="pb-4">Method</th>
                                        <th className="pb-4 text-right pr-2">Amount</th>
                                        <th className="pb-4 text-right pr-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {[1, 2, 3].map((_, i) => (
                                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-none">
                                            <td className="py-4 pl-2 font-mono text-neutral-400 group-hover:text-white">TXN-882{i}</td>
                                            <td className="py-4 text-neutral-300">Jan 0{i + 1}, 2026</td>
                                            <td className="py-4"><span className="flex items-center gap-2"><CreditCard size={14} className="text-neutral-500" /> UPI</span></td>
                                            <td className="py-4 text-right font-bold text-white">₹45,000</td>
                                            <td className="py-4 text-right pr-2"><span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Success</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="h-full">
                        <SystemLogs />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-amber-500 font-mono text-xs uppercase tracking-widest">Establishing Secure Uplink...</div>}>
            <AdminDashboard />
        </Suspense>
    );
}