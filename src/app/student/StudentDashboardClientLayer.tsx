"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Sparkles, CheckCircle2, Flame, User, Bot, Bell, Award,
    Wallet, Calendar as CalendarIcon, CalendarPlus,
    ArrowRight, LogOut, FileText, Users, Zap, HelpCircle,
    Clock, Loader2, Lock, ChevronDown, X
} from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { askAi } from "../actions";
import { submitLeaveRequest, postDoubt } from "./actions"; // New Server Actions

// --- SUB-COMPONENT: LEAVE MODAL ---
const LeaveRequestModal = ({ onClose, studentId }: { onClose: () => void, studentId: string }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const result = await submitLeaveRequest(formData, studentId);

        if (result.success) {
            addToast("Leave Request Transmitted", "success");
            onClose();
        } else {
            addToast(result.error || "Uplink Error", "error");
        }
        setIsLoading(false);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Form: LR-2026</span>
                <div className="w-8" />
            </div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto w-full space-y-6 mt-10">
                    <h2 className="text-3xl font-bold mb-8 tracking-tight">Request Absence</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">From</label>
                            <input required name="startDate" type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">To</label>
                            <input required name="endDate" type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Reason</label>
                        <textarea required name="reason" rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors resize-none" placeholder="Medical, Family, etc..." />
                    </div>
                    <button disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50">
                        {isLoading ? <Loader2 className="animate-spin" /> : "Submit Request"}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

// --- MAIN DASHBOARD CONTENT ---
export default function StudentDashboardClientLayer({ student, initialDoubts }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { addToast } = useToast();
    const currentView = searchParams.get('view');

    // Attendance Data Mapping
    const attendanceStats = useMemo(() => {
        const records = student.studentProfile.attendance;
        const total = records.length || 1;
        const present = records.filter((r: any) => r.status === 'PRESENT').length;
        return {
            percentage: Math.round((present / total) * 100),
            streak: 12
        };
    }, [student]);

    // Exam Data Mapping for Radar Chart
    const performanceData = useMemo(() => {
        return student.studentProfile.examScores.map((s: any) => ({
            subject: s.subject,
            A: s.marksObtained,
            fullMark: s.maxMarks
        }));
    }, [student]);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 selection:bg-indigo-500 overflow-x-hidden">
            <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            <main className="px-6 max-w-6xl mx-auto space-y-10 relative z-10">
                {/* WELCOME SECTION */}
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            Welcome,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                                {student.name.split(' ')[0]}.
                            </span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] p-2 pr-6 rounded-full backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Flame className="text-orange-500 fill-orange-500" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black">{attendanceStats.streak}</span>
                            <span className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Day Streak</span>
                        </div>
                    </div>
                </section>

                {/* CORE ACTION GRID */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <button onClick={() => router.push(pathname + '?view=genius')} className="md:col-span-2 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><Sparkles size={120} /></div>
                        <div className="p-4 bg-white/5 w-fit rounded-2xl mb-8 text-blue-400 ring-1 ring-white/10"><Bot size={28} /></div>
                        <h2 className="text-3xl font-bold mb-3 tracking-tight">Nexa AI Core</h2>
                        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">Personalized tutoring for your {student.studentProfile.batches[0]?.batch.name} module.</p>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white group-hover:gap-4 transition-all uppercase tracking-widest">Start Neural Session <ArrowRight size={14} /></div>
                    </button>

                    <button onClick={() => router.push(pathname + '?view=leave')} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-orange-500/30 transition-all group relative overflow-hidden transform-gpu">
                        <div className="p-4 bg-orange-500/10 w-fit rounded-2xl mb-8 text-orange-500 ring-1 ring-orange-500/20"><CalendarPlus size={28} /></div>
                        <h3 className="text-xl font-bold tracking-tight">Request Leave</h3>
                        <p className="text-xs text-neutral-500 mt-2 font-mono uppercase tracking-widest">LR-2026 Protocol</p>
                    </button>
                </section>

                {/* PERFORMANCE ANALYTICS */}
                <section className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="h-[350px] w-full lg:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#666", fontSize: 10, fontWeight: "bold" }} />
                                    <Radar name="Performance" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full lg:w-1/2 space-y-4">
                            <h3 className="text-xl font-bold mb-6">Subject Proficiency Index</h3>
                            {performanceData.map((s: any) => (
                                <div key={s.subject} className="flex justify-between items-center p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <span className="text-sm font-bold text-neutral-400">{s.subject}</span>
                                    <span className="text-lg font-black text-white">{s.A}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BRANDED FOOTER */}
                <footer className="pt-20 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>NexaGrid Scholar v1.0 • India</span>
                    </div>
                    <span className="font-bold text-neutral-500">POWERED BY NEXGEN OPERATING SYSTEMS INDIA</span>
                </footer>
            </main>

            {/* AI BUTTON */}
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => router.push(pathname + '?view=genius')} className="fixed bottom-10 right-8 z-40 w-16 h-16 rounded-full bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.5)] flex items-center justify-center border border-indigo-400/30">
                <Sparkles size={28} className="text-white animate-pulse" />
            </motion.button>

            {/* MODALS */}
            <AnimatePresence>
                {currentView === 'leave' && <LeaveRequestModal studentId={student.id} onClose={() => router.back()} />}
                {/* Add other modals (AiChat, PeerForum) similarly here */}
            </AnimatePresence>
        </div>
    );
}