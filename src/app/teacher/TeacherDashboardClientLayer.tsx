"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Users, CheckCircle2, Calendar as CalendarIcon,
    ChevronRight, Bell, Atom, Sparkles, Bot,
    FileText, PenTool, Check, X, Shield,
    Megaphone, AlertTriangle,
    User, Mail, Phone, MapPin, Award, BookOpen, Star, ChevronDown, Edit2, Save,
    LogOut, Lock, Loader2, HelpCircle, MessageCircle, Send, Image as ImageIcon, XCircle, Mic, StopCircle
} from "lucide-react";
import { askAi } from "../actions";
import { markAttendance, publishGrades, processLeave } from "./actions";

// --- TYPES ---
type ChatSession = { id: string; query: string; response: string; role: 'user' | 'ai'; image?: string; isStreaming?: boolean };

// --- HELPERS ---
const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

const RichText = React.memo(({ content }: { content: string }) => {
    const parts = useMemo(() => content.split(/(```[\s\S]*?```)/g), [content]);
    return (
        <div className="space-y-2 leading-relaxed text-sm">
            {parts.map((part, i) => {
                if (part.startsWith("```")) {
                    return (
                        <pre key={i} className="bg-black/30 p-3 rounded-lg overflow-x-auto text-xs font-mono border border-white/10 text-amber-400 my-2">
                            {part.replace(/```/g, "").trim()}
                        </pre>
                    );
                }
                return <div key={i} className="whitespace-pre-wrap">{part}</div>;
            })}
        </div>
    );
});
RichText.displayName = 'RichText';

// --- ATTENDANCE MODAL ---
const AttendanceRegister = ({ onClose, batch, teacherId, onLog }: any) => {
    const { addToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    // Initialize student list from DB batch students
    const [students, setStudents] = useState(batch.batch.students.map((s: any) => ({
        id: s.student.userId,
        name: s.student.user.name,
        roll: s.student.rollNumber,
        status: "PRESENT"
    })));

    const toggleStatus = (id: string) => {
        setStudents((prev: any) => prev.map((s: any) => {
            if (s.id !== id) return s;
            const next = s.status === "PRESENT" ? "ABSENT" : s.status === "ABSENT" ? "LATE" : "PRESENT";
            return { ...s, status: next };
        }));
    };

    const submit = async () => {
        setIsSaving(true);
        const result = await markAttendance(batch.batchId, students.map((s: any) => ({ studentId: s.id, status: s.status })), teacherId);
        if (result.success) {
            addToast("Attendance Synced to Cloud", "success");
            onLog("Attendance Marked", `Batch: ${batch.batch.name}`);
            onClose();
        } else {
            addToast("Sync Failed", "error");
        }
        setIsSaving(false);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5"><ChevronRight className="rotate-180" /></button>
                <div className="text-center">
                    <span className="block font-bold text-sm">Attendance: {batch.batch.name}</span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{batch.subject} • {students.length} Students</span>
                </div>
                <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {students.map((s: any) => (
                    <div key={s.id} onClick={() => toggleStatus(s.id)} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-mono">#{s.roll}</div>
                            <p className="font-bold text-sm">{s.name}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black w-24 text-center ${s.status === 'PRESENT' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                            {s.status}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-6 border-t border-white/5 bg-[#050505]">
                <button onClick={submit} disabled={isSaving} className="w-full py-4 bg-indigo-600 rounded-2xl font-bold flex justify-center">
                    {isSaving ? <Loader2 className="animate-spin" /> : "Authorize & Sync"}
                </button>
            </div>
        </motion.div>
    );
};

// --- LEAVE INBOX ---
const LeaveInbox = ({ onClose, leaves, onLog }: any) => {
    const { addToast } = useToast();
    const handleDecision = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        await processLeave(id, status);
        addToast(`Leave ${status}`, status === 'APPROVED' ? "success" : "error");
        onLog("Leave Processed", `ID: ${id.slice(0, 5)}`);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-widest">Leave Console</span>
                <div className="w-10" />
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
                {leaves.length === 0 ? <p className="text-center opacity-30 mt-20">No pending requests.</p> : leaves.map((req: any) => (
                    <div key={req.id} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
                        <h3 className="font-bold">{req.user.name}</h3>
                        <p className="text-[10px] text-indigo-400 font-mono mb-4 uppercase">{req.type} • {new Date(req.startDate).toLocaleDateString()}</p>
                        <p className="text-sm text-neutral-400 mb-6 italic">"{req.reason}"</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleDecision(req.id, 'REJECTED')} className="py-3 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest">Reject</button>
                            <button onClick={() => handleDecision(req.id, 'APPROVED')} className="py-3 rounded-xl bg-indigo-600 text-xs font-bold uppercase tracking-widest">Approve</button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- MAIN CLIENT COMPONENT ---
export default function TeacherDashboardClientLayer({ profile, batches, leaves }: any) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { addToast } = useToast();

    const currentView = searchParams.get('view');
    const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.batchId);
    const activeBatch = batches.find((b: any) => b.batchId === selectedBatchId);

    const [activityLog, setActivityLog] = useState([
        { id: 1, time: "System", action: "Handshake Complete", detail: "Faculty Link Active", icon: Shield, color: "text-cyan-500" }
    ]);

    const handleLog = (action: string, detail: string) => {
        setActivityLog(prev => [{ id: Date.now(), time: "Just Now", action, detail, icon: CheckCircle2, color: "text-indigo-500" }, ...prev]);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 relative overflow-x-hidden">
            {/* Ambient Background */}
            <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* TOP NAVIGATION */}
            <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-8 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center"><Atom className="text-white" size={20} /></div>
                    <div><span className="font-black text-sm tracking-tight block">NexaGrid Faculty</span><span className="text-[9px] font-mono text-indigo-400 uppercase tracking-[0.2em]">Live Interface</span></div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">{profile.name}</span>
                    </div>
                    <button onClick={() => router.push('/')} className="p-2.5 rounded-full hover:bg-rose-500/10 text-neutral-500 hover:text-rose-500 transition-colors"><LogOut size={18} /></button>
                </div>
            </header>

            <main className="px-8 max-w-7xl mx-auto space-y-10 relative z-10">

                {/* BATCH SELECTOR & HEADER */}
                <section className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-tighter">Command Center<span className="text-indigo-500">.</span></h1>
                        <div className="flex gap-2">
                            {batches.map((b: any) => (
                                <button key={b.batchId} onClick={() => setSelectedBatchId(b.batchId)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedBatchId === b.batchId ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-neutral-500 hover:bg-white/10'}`}>
                                    {b.batch.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ACTION CARDS */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    <button onClick={() => router.push(pathname + '?view=attendance')} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left group hover:border-indigo-500/30 transition-all">
                        <div className="p-4 bg-indigo-500/10 w-fit rounded-2xl mb-6 text-indigo-400 group-hover:scale-110 transition-transform"><CheckCircle2 size={24} /></div>
                        <h2 className="text-xl font-bold mb-1">Attendance</h2>
                        <p className="text-xs text-neutral-500">Mark daily student register.</p>
                    </button>

                    <button onClick={() => router.push(pathname + '?view=gradebook')} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left group hover:border-emerald-500/30 transition-all">
                        <div className="p-4 bg-emerald-500/10 w-fit rounded-2xl mb-6 text-emerald-500 group-hover:scale-110 transition-transform"><PenTool size={24} /></div>
                        <h2 className="text-xl font-bold mb-1">Gradebook</h2>
                        <p className="text-xs text-neutral-500">Update scores for {activeBatch?.subject}.</p>
                    </button>

                    <button onClick={() => router.push(pathname + '?view=leaves')} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 text-left group hover:border-orange-500/30 transition-all relative">
                        {leaves.length > 0 && <span className="absolute top-8 right-8 bg-orange-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full">{leaves.length} NEW</span>}
                        <div className="p-4 bg-orange-500/10 w-fit rounded-2xl mb-6 text-orange-500 group-hover:scale-110 transition-transform"><CalendarIcon size={24} /></div>
                        <h2 className="text-xl font-bold mb-1">Leaves</h2>
                        <p className="text-xs text-neutral-500">Approve student requests.</p>
                    </button>

                    <button onClick={() => router.push(pathname + '?view=ai_assistant')} className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 text-left group transition-all">
                        <div className="p-4 bg-indigo-500/20 w-fit rounded-2xl mb-6 text-indigo-400 animate-pulse"><Bot size={24} /></div>
                        <h2 className="text-xl font-bold mb-1">Nexa AI</h2>
                        <p className="text-xs text-neutral-400">Ask for lesson plans or help.</p>
                    </button>
                </section>

                {/* LIVE ACTIVITY STREAM */}
                <section className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10">
                    <h3 className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] mb-8">Live Terminal</h3>
                    <div className="space-y-6 border-l border-white/5 ml-2 pl-8 relative">
                        {activityLog.map((item: any) => (
                            <div key={item.id} className="relative">
                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                                </div>
                                <p className="text-[9px] font-mono text-neutral-600 mb-1">{item.time}</p>
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">{item.action} <item.icon size={12} className={item.color} /></h4>
                                <p className="text-xs text-neutral-500 mt-0.5">{item.detail}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* MODAL LAYER */}
            <AnimatePresence>
                {currentView === 'attendance' && activeBatch && (
                    <AttendanceRegister
                        batch={activeBatch}
                        teacherId={profile.id}
                        onClose={() => router.back()}
                        onLog={handleLog}
                    />
                )}
                {currentView === 'leaves' && (
                    <LeaveInbox
                        leaves={leaves}
                        onClose={() => router.back()}
                        onLog={handleLog}
                    />
                )}
                {/* AI & Gradebook modals would follow the same pattern... */}
            </AnimatePresence>
        </div>
    );
}