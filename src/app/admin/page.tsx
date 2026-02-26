"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useConfig } from "@/context/ConfigContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Shield, Users, TrendingUp, DollarSign, Activity,
    Bell, Search, ChevronDown, Download,
    UserPlus, FileText, AlertCircle, CheckCircle2,
    BarChart3, PieChart, ArrowUpRight, Lock, CreditCard,
    ChevronRight, X, User, Save, Loader2, RefreshCw, Server,
    LogOut, Moon, Sun, Laptop, Zap, Eye, Calendar, Copy, Key,
    Banknote, Wallet, Filter, Send, GraduationCap, Star, BookOpen, ThumbsUp
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";
import { ADMIN_STATS, REVENUE_DATA, CRM_LEADS, SYSTEM_LOGS, MOCK_CLASS_LIST, TEACHER_DIRECTORY } from "@/lib/data";

// --- LAZY LOAD COMPONENTS ---
const LoadingSpinner = () => <div className="flex h-full w-full items-center justify-center text-amber-500"><Loader2 className="animate-spin" /></div>;

// --- SCROLL LOCK HOOK ---
const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- COMPONENT: ADMIN TOP NAV ---
const AdminTopNav = ({ onViewChange }: { onViewChange: (view: string) => void }) => {
    const { schoolName } = useConfig();
    const router = useRouter();
    const { addToast } = useToast();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        const close = () => { setIsNotifOpen(false); setIsProfileOpen(false); };
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const handleLogout = () => {
        addToast("Admin Session Terminated", "info");
        setTimeout(() => router.push('/'), 800);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-20 sm:h-24 flex items-center justify-between px-4 sm:px-6 z-40 pointer-events-none transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-auto backdrop-blur-sm" />

            <div className="relative z-10 flex items-center gap-3 sm:gap-4 pointer-events-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Shield className="text-black" size={20} />
                </div>
                <div>
                    <span className="font-bold text-sm tracking-tight block text-white">{schoolName}</span>
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest hidden sm:block">Director Console</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 sm:gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>

                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-500">SECURE UPLINK</span>
                </div>

                <div className="relative">
                    <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} className={`p-2.5 sm:p-3 rounded-full border transition-colors relative ${isNotifOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/10'}`}>
                        <Bell size={18} />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0A0A]" />
                    </button>
                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-72 sm:w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center"><span className="text-xs font-bold text-white">System Alerts</span></div>
                                <div className="max-h-64 overflow-y-auto p-2 space-y-1 no-scrollbar">
                                    <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                        <p className="text-xs font-bold text-rose-400">Payment Gateway Latency</p>
                                        <p className="text-[10px] text-neutral-500 mt-0.5">UPI processing time &gt; 2s.</p>
                                    </div>
                                    <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                        <p className="text-xs font-bold text-emerald-400">Daily Backup Synced</p>
                                        <p className="text-[10px] text-neutral-500 mt-0.5">Student records secure.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="relative">
                    <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 border border-white/10 ml-1 sm:ml-2 transition-transform active:scale-95 ${isProfileOpen ? 'ring-2 ring-white/20' : ''}`} />
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-56 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 backdrop-blur-xl">
                                <div className="px-3 py-2 mb-2 border-b border-white/5">
                                    <p className="text-sm font-bold text-white">Director</p>
                                    <p className="text-[10px] text-neutral-500 font-mono">Admin Level 1</p>
                                </div>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-xs font-medium text-rose-500 transition-colors"><LogOut size={16} /> Secure Logout</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

// --- COMPONENT: PAYROLL MANAGER ---
const PayrollManager = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [payrollData, setPayrollData] = useState(
        TEACHER_DIRECTORY.map(t => ({
            ...t,
            paidStatus: Math.random() > 0.5 ? 'Paid' : 'Pending',
            lastPaid: Math.random() > 0.5 ? 'Jan 01, 2026' : 'Dec 01, 2025'
        }))
    );

    const totalLiability = payrollData.reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const totalPaid = payrollData.filter(t => t.paidStatus === 'Paid').reduce((acc, curr) => acc + (curr.salary || 0), 0);
    const totalPending = totalLiability - totalPaid;

    const handlePay = (id: string) => {
        setPayrollData(prev => prev.map(t => t.id === id ? { ...t, paidStatus: 'Paid', lastPaid: 'Today' } : t));
        addToast("Salary Disbursed Successfully", "success");
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-500">Payroll System</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar p-6 sm:p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Total Monthly Cost</p>
                            <p className="text-2xl font-bold text-white mt-1">₹{(totalLiability / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest">Disbursed</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">₹{(totalPaid / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                            <p className="text-[10px] uppercase font-bold text-rose-500 tracking-widest">Pending</p>
                            <p className="text-2xl font-bold text-rose-400 mt-1">₹{(totalPending / 1000).toFixed(0)}k</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Faculty Payroll • Jan 2026</h3>
                        {payrollData.map((t) => (
                            <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:bg-white/[0.04] transition-all">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm">{t.name.charAt(0)}</div>
                                    <div>
                                        <h4 className="font-bold text-white">{t.name}</h4>
                                        <p className="text-xs text-neutral-500">{t.subject} • {t.status}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <p className="text-[10px] text-neutral-500 uppercase font-bold">Salary</p>
                                        <p className="text-sm font-bold text-white">₹{t.salary?.toLocaleString()}</p>
                                    </div>

                                    {t.paidStatus === 'Paid' ? (
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold">
                                            <CheckCircle2 size={14} /> Paid
                                        </div>
                                    ) : (
                                        <button onClick={() => handlePay(t.id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-white text-xs font-bold transition-all">
                                            Release Payment
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: FEE MANAGER ---
const FeeManager = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [pendingList, setPendingList] = useState([
        { id: "ST-092", name: "Vikram Malhotra", class: "Batch C (JEE)", amount: 35000, due: "Crash Course Fee" },
        { id: "ST-104", name: "Sanya Kapoor", class: "Batch A (10th)", amount: 2500, due: "Jan Installment" },
        { id: "ST-088", name: "Rahul Singh", class: "Batch D (NEET)", amount: 5000, due: "Dec & Jan Pending" },
    ]);

    const handleMarkPaid = (id: string, method: string) => {
        setPendingList(prev => prev.filter(s => s.id !== id));
        addToast(`₹${pendingList.find(s => s.id === id)?.amount.toLocaleString()} received via ${method}`, "success");
    };

    const handleRemind = (name: string) => {
        addToast(`WhatsApp Reminder Sent to ${name}`, "info");
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Fee Operations</span>
                <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar p-6 sm:p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="flex justify-between items-end mb-4">
                        <div><h2 className="text-2xl font-bold">Pending Dues</h2><p className="text-sm text-neutral-500">Action required for {pendingList.length} accounts</p></div>
                        <div className="bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 text-amber-500 font-mono text-sm font-bold">Total: ₹{(pendingList.reduce((acc, curr) => acc + curr.amount, 0) / 1000).toFixed(1)}k</div>
                    </div>

                    {pendingList.length === 0 ? (
                        <div className="text-center py-20 opacity-50"><CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-500" /><p>All accounts are settled.</p></div>
                    ) : pendingList.map((item) => (
                        <div key={item.id} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-amber-500/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-400">{item.name.charAt(0)}</div>
                                <div>
                                    <h3 className="font-bold text-white">{item.name}</h3>
                                    <p className="text-xs text-neutral-500 font-mono">{item.id} • {item.class}</p>
                                    <p className="text-[10px] text-rose-500 mt-1 font-bold uppercase">{item.due}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="text-right flex-1 sm:flex-none">
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Amount</p>
                                    <p className="text-xl font-bold text-white">₹{item.amount.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRemind(item.name)} className="p-3 bg-white/5 hover:bg-rose-500/20 hover:text-rose-500 rounded-xl border border-white/10 transition-colors" title="Send WhatsApp Reminder"><Send size={20} /></button>
                                    <button onClick={() => handleMarkPaid(item.id, 'Cash')} className="p-3 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-500 rounded-xl border border-white/10 transition-colors" title="Mark Paid via Cash"><Banknote size={20} /></button>
                                    <button onClick={() => handleMarkPaid(item.id, 'UPI')} className="p-3 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-500 rounded-xl border border-white/10 transition-colors" title="Mark Paid via UPI"><Zap size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: FACULTY DIRECTORY & RATINGS ---
const FacultyDirectory = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

    // Inject Mock Ratings into Data
    const facultyData = useMemo(() => TEACHER_DIRECTORY.map((t, i) => ({
        ...t,
        rating: [4.8, 4.9, 4.7, 4.6][i % 4],
        reviews: [124, 98, 56, 210][i % 4],
        tags: [["Concept Clarity", "Friendly"], ["Strict", "Deep Knowledge"], ["Fun Learning", "Practical"], ["Exam Oriented", "Fast Paced"]][i % 4],
        syllabus: [85, 70, 92, 60][i % 4]
    })), []);

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Faculty Intelligence</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 sm:p-8 max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6">Staff Performance</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {facultyData.map((teacher) => (
                            <div key={teacher.id} onClick={() => setSelectedTeacher(teacher)} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-indigo-500/30 cursor-pointer transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20">{teacher.name.charAt(0)}</div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{teacher.name}</h3>
                                        <p className="text-xs text-neutral-400">{teacher.subject} • {teacher.qualifications.split(',')[0]}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 py-3 border-y border-white/5">
                                    <div className="flex items-center gap-1.5 text-yellow-500">
                                        <Star size={16} fill="currentColor" />
                                        <span className="font-bold text-sm">{teacher.rating}</span>
                                    </div>
                                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">{teacher.reviews} Student Reviews</span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {teacher.tags.map(tag => (
                                        <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-neutral-300">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TEACHER DETAIL MODAL */}
            <AnimatePresence>
                {selectedTeacher && (
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[70] bg-[#0A0A0A] flex flex-col">
                        <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#0A0A0A]/95 backdrop-blur-xl">
                            <button onClick={() => setSelectedTeacher(null)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"><ChevronRight className="rotate-180" size={20} /> Back</button>
                            <span className="font-bold text-sm">Faculty Profile</span>
                            <div className="w-10" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 max-w-3xl mx-auto w-full space-y-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-bold mb-4 shadow-2xl shadow-indigo-500/30">{selectedTeacher.name.charAt(0)}</div>
                                <h2 className="text-4xl font-black tracking-tight">{selectedTeacher.name}</h2>
                                <p className="text-indigo-400 font-medium mt-1">{selectedTeacher.subject} Dept</p>
                                <p className="text-xs text-neutral-500 font-mono mt-2">{selectedTeacher.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                                    <div className="flex justify-center mb-2 text-yellow-500"><Star fill="currentColor" size={24} /></div>
                                    <p className="text-3xl font-black text-white">{selectedTeacher.rating}</p>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Student Satisfaction</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 text-center">
                                    <div className="flex justify-center mb-2 text-emerald-500"><BookOpen size={24} /></div>
                                    <p className="text-3xl font-black text-white">{selectedTeacher.syllabus}%</p>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Syllabus Completion</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                                <h3 className="font-bold text-lg mb-4 text-white">Batches Assigned</h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedTeacher.classes.map((cls: string) => (
                                        <span key={cls} className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold">{cls}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                                <h3 className="font-bold text-lg mb-4 text-white">Anonymous Student Feedback</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-sm text-neutral-300 italic">"Sir explains concepts very clearly, especially Rotational Dynamics. Best physics teacher!"</p>
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500 font-mono"><ThumbsUp size={12} /> 12 Upvotes • Batch C (JEE)</div>
                                    </div>
                                    <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                        <p className="text-sm text-neutral-300 italic">"Classes sometimes extend beyond time, but the notes provided are excellent."</p>
                                        <div className="mt-2 flex items-center gap-2 text-[10px] text-neutral-500 font-mono"><ThumbsUp size={12} /> 5 Upvotes • Batch A (10th)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- COMPONENT: STUDENT DIRECTORY ---
const StudentDirectory = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const filteredStudents = useMemo(() => MOCK_CLASS_LIST.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Student Database</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 sm:p-8 max-w-4xl mx-auto">
                    {/* Search */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-4 text-neutral-500" size={20} />
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name or ID..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-base focus:border-amber-500 outline-none transition-colors" />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredStudents.map((student) => (
                            <div key={student.id} onClick={() => setSelectedStudent(student)} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] cursor-pointer transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">{student.name.charAt(0)}</div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${student.status === 'Present' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{student.status}</span>
                                </div>
                                <h3 className="font-bold text-white text-lg">{student.name}</h3>
                                <p className="text-xs text-neutral-500 font-mono mb-4">{student.id}</p>
                                <div className="flex items-center gap-2 text-xs text-neutral-400 border-t border-white/5 pt-3">
                                    <span className="font-bold text-white">{student.class}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NESTED MODAL: DETAIL VIEW */}
            <AnimatePresence>
                {selectedStudent && (
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[70] bg-[#0A0A0A] flex flex-col">
                        <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
                            <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"><ChevronRight className="rotate-180" size={20} /> Back</button>
                            <span className="font-bold text-sm">Student Profile</span>
                            <div className="w-10" />
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full space-y-8">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold mx-auto mb-4">{selectedStudent.name.charAt(0)}</div>
                                <h2 className="text-3xl font-bold">{selectedStudent.name}</h2>
                                <p className="text-neutral-500 font-mono mt-1">{selectedStudent.id}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-white/5 text-center">
                                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Attendance</p>
                                    <p className="text-2xl font-bold text-emerald-500 mt-1">92%</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 text-center">
                                    <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Performance</p>
                                    <p className="text-2xl font-bold text-indigo-500 mt-1">Top 10%</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold mb-4">Fee Status</h3>
                                <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-neutral-400">Total Annual Fee</span>
                                        <span className="font-bold">₹30,000</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-neutral-400">Paid Amount</span>
                                        <span className="font-bold text-emerald-500">₹22,500</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }} />
                                    </div>
                                    <p className="text-right text-xs text-neutral-500">75% Collected</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- COMPONENT: STATS CARD ---
const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <motion.div whileHover={{ y: -4 }} className="p-5 sm:p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className={`p-2.5 sm:p-3 rounded-2xl ${color.bg} ${color.text}`}><Icon size={20} className="sm:w-[22px] sm:h-[22px]" /></div>
            {trend && <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full"><ArrowUpRight size={10} /> {trend}</span>}
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
        <p className="text-[10px] sm:text-xs text-neutral-500 font-medium uppercase tracking-wider">{title}</p>
        {sub && <p className="text-[9px] sm:text-[10px] text-neutral-600 mt-2 font-mono">{sub}</p>}
    </motion.div>
);

// --- COMPONENT: USER MANAGEMENT MODAL ---
const UserManagementModal = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'student' | 'staff'>('student');
    const [createdUser, setCreatedUser] = useState<{ id: string, pass: string, name: string, role: string } | null>(null);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const newId = activeTab === 'student' ? `ST-${randomId}` : `TR-${randomId}`;
        const newPass = `SCP@${Math.floor(100 + Math.random() * 900)}`;

        setCreatedUser({
            id: newId,
            pass: newPass,
            name: "New User",
            role: activeTab === 'student' ? "Student" : "Faculty"
        });

        addToast(`${activeTab === 'student' ? 'Student' : 'Staff'} Profile Created`, "success");
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        addToast("Copied to Clipboard", "info");
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">User Management Console</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 sm:p-8 max-w-lg mx-auto space-y-8 mt-4 pb-20">
                    {!createdUser ? (
                        <>
                            <div className="flex bg-white/5 p-1 rounded-2xl w-full">
                                <button onClick={() => setActiveTab('student')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'student' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>Student</button>
                                <button onClick={() => setActiveTab('staff')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'staff' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>Faculty</button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <h2 className="text-2xl font-bold tracking-tight">Onboard New {activeTab === 'student' ? 'Student' : 'Faculty'}</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Full Name</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-base" placeholder="Enter full legal name" /></div>
                                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Email Address</label><input type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-base" placeholder="official@scholars.in" /></div>

                                    {activeTab === 'student' ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Batch</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-base" placeholder="e.g. Batch A (10th)" /></div>
                                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Roll No</label><input required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-base" placeholder="001" /></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Department</label><select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-amber-500 transition-colors text-neutral-300 text-base"><option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option></select></div>
                                    )}
                                </div>
                                <button className="w-full py-4 bg-amber-500 text-black rounded-xl font-bold hover:bg-amber-400 transition-all active:scale-95 mt-4">Create Profile</button>
                            </form>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 text-center space-y-6">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                                <CheckCircle2 className="text-emerald-500" size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Profile Created</h2>
                                <p className="text-sm text-neutral-400 mt-1">Credentials generated successfully.</p>
                            </div>

                            <div className="space-y-3 bg-black/40 p-6 rounded-2xl border border-white/5 text-left">
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">User ID</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-lg text-amber-400">{createdUser.id}</span>
                                        <button onClick={() => copyToClipboard(createdUser.id)}><Copy size={14} className="text-neutral-500 hover:text-white" /></button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div>
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-1">Temporary Password</p>
                                    <div className="flex justify-between items-center">
                                        <span className="font-mono text-lg text-white">{createdUser.pass}</span>
                                        <button onClick={() => copyToClipboard(createdUser.pass)}><Copy size={14} className="text-neutral-500 hover:text-white" /></button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setCreatedUser(null)} className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold hover:bg-white/10">Add Another</button>
                                <button onClick={onClose} className="flex-1 py-3 bg-amber-500 text-black rounded-xl text-sm font-bold hover:bg-amber-400">Done</button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: REPORTS MODAL ---
const ReportsModal = ({ onClose }: { onClose: () => void }) => {
    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Data Vault</span>
                <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {['Financial Audit', 'Attendance Logs', 'System Health', 'User Activity'].map((report, i) => (
                        <div key={i} className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:border-amber-500/30 transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-neutral-400 group-hover:text-white transition-colors"><FileText size={24} /></div>
                                <Download size={18} className="text-neutral-600 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <h3 className="font-bold text-lg mb-1">{report}</h3>
                            <p className="text-xs text-neutral-500">Last generated: 2 hours ago</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: REVENUE CHART (UPGRADED) ---
const RevenueChart = () => {
    const [filter, setFilter] = useState('6M');

    // Logic to process the raw 'Lakhs' data
    const getFilteredData = () => {
        let data = [];
        if (filter === '1Y') {
            // Full Year
            data = REVENUE_DATA;
        } else if (filter === '6M') {
            // Last 6 months
            data = REVENUE_DATA.slice(-6);
        } else {
            // 1M -> Fake Weekly Breakdown of current month (Jan 6.2L)
            // We assume 4 weeks adding up roughly to 6.2
            return [
                { month: 'Week 1', revenue: 2.5, pending: 0.5 }, // Start of month rush
                { month: 'Week 2', revenue: 1.8, pending: 0.8 },
                { month: 'Week 3', revenue: 1.0, pending: 0.4 },
                { month: 'Week 4', revenue: 0.9, pending: 0.2 },
            ];
        }

        // Process monthly data: Assume pending is ~15-20% of revenue for visualization
        return data.map(d => ({
            month: d.month,
            revenue: d.revenue, // already in Lakhs
            pending: parseFloat((d.revenue * 0.15).toFixed(2)) // 15% pending logic
        }));
    };

    const chartData = getFilteredData();
    const currentTotal = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
    const currentPending = chartData.reduce((acc, curr) => acc + (curr.pending || 0), 0);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            // Multiply by 1,00,000 to show actual rupees
            const collectedVal = payload[0].value * 100000;
            const pendingVal = payload[1].value * 100000;

            return (
                <div className="bg-[#0A0A0A] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-xs font-mono text-neutral-500 mb-2 uppercase tracking-wider">{label} Stats</p>
                    <div className="space-y-1">
                        <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Collected: ₹{collectedVal.toLocaleString()}
                        </div>
                        <div className="text-sm font-bold text-amber-400 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            Pending: ₹{pendingVal.toLocaleString()}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom Y-Axis formatter (e.g., 2.5 -> ₹2.5L)
    const formatYAxis = (tickItem: number) => {
        return `₹${tickItem}L`;
    };

    return (
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] h-full relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 relative z-10 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Financial Overview
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20">+15% YoY</span>
                    </h3>
                    <div className="flex gap-4 mt-2">
                        <p className="text-xs text-neutral-500 font-mono"><span className="text-emerald-400">●</span> ₹{currentTotal.toFixed(2)}L Collected</p>
                        <p className="text-xs text-neutral-500 font-mono"><span className="text-amber-400">●</span> ₹{currentPending.toFixed(2)}L Pending</p>
                    </div>
                </div>

                {/* Time Filter */}
                <div className="flex bg-white/5 p-1 rounded-xl">
                    {['1M', '6M', '1Y'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${filter === f ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>{f}</button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full min-h-[250px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.4} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickFormatter={formatYAxis} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                        <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" strokeWidth={3} fill="url(#colorCollected)" animationDuration={1000} />
                        <Area type="monotone" dataKey="pending" stackId="2" stroke="#F59E0B" strokeWidth={3} fill="url(#colorPending)" animationDuration={1000} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// --- COMPONENT: SYSTEM LOGS ---
const SystemLogs = () => {
    return (
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Security Log</h3>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-4">
                {SYSTEM_LOGS.map((log) => (
                    <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/[0.03]">
                        <div className={`p-2 rounded-lg ${log.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{log.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}</div>
                        <div className="flex-1"><p className="text-xs font-bold text-white">{log.msg}</p><p className="text-[10px] font-mono text-neutral-600 mt-0.5">{log.time}</p></div>
                    </div>
                ))}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/[0.03]">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Lock size={14} /></div>
                    <div className="flex-1"><p className="text-xs font-bold text-white">Admin Login</p><p className="text-[10px] font-mono text-neutral-600 mt-0.5">09:42 AM • 192.168.1.4</p></div>
                </div>
            </div>
        </div>
    );
};

// --- MAIN LAYOUT ---
const AdminDashboardContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');
    const { addToast } = useToast();

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const handleViewChange = (view: string) => {
        router.push(pathname + '?view=' + view);
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-24 pb-10 selection:bg-amber-500 selection:text-black overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-[500px] bg-amber-500/5 blur-[150px] pointer-events-none transform-gpu" />
            <AdminTopNav onViewChange={handleViewChange} />

            <main className="px-4 sm:px-6 max-w-[1600px] mx-auto space-y-6 relative z-10">

                {/* STATS GRID */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Total Revenue" value={ADMIN_STATS.totalRevenue} icon={DollarSign} color={{ bg: "bg-emerald-500/10", text: "text-emerald-500" }} trend="12%" />
                    <StatCard title="Active Students" value={ADMIN_STATS.activeStudents} icon={Users} color={{ bg: "bg-blue-500/10", text: "text-blue-500" }} trend="5%" />
                    <StatCard title="Pending Fees" value={ADMIN_STATS.pendingFees} icon={AlertCircle} color={{ bg: "bg-rose-500/10", text: "text-rose-500" }} sub="32 Accounts Overdue" />
                    <StatCard title="System Load" value={ADMIN_STATS.serverLoad} icon={Activity} color={{ bg: "bg-amber-500/10", text: "text-amber-500" }} sub="Optimal Performance" />
                </div>

                {/* MAIN VISUALIZATION ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-auto lg:h-[420px]"><RevenueChart /></div>
                    <div className="h-full flex flex-col gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <button onClick={() => handleViewChange('add_user')} className="p-5 rounded-[2rem] bg-indigo-600 text-white hover:bg-indigo-500 transition-all text-left group flex flex-col justify-center">
                                <UserPlus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm sm:text-base">Add User</h4>
                                <p className="text-[10px] text-indigo-200 mt-1">Student or Staff</p>
                            </button>
                            <button onClick={() => handleViewChange('faculty')} className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all text-left text-white group flex flex-col justify-center">
                                <GraduationCap size={24} className="mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm sm:text-base">Faculty</h4>
                                <p className="text-[10px] text-neutral-500 mt-1">Staff Directory</p>
                            </button>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <button onClick={() => handleViewChange('fees')} className="p-5 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-left group flex flex-col justify-center text-amber-500">
                                <Wallet size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm sm:text-base">Fee Manager</h4>
                                <p className="text-[10px] opacity-70 mt-1">Process Dues</p>
                            </button>
                            <button onClick={() => handleViewChange('students')} className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all text-left text-white group flex flex-col justify-center">
                                <Users size={24} className="mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-sm sm:text-base">Students</h4>
                                <p className="text-[10px] text-neutral-500 mt-1">Full Directory</p>
                            </button>
                        </div>

                        <button onClick={() => handleViewChange('payroll')} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] transition-all text-left text-white group w-full">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Banknote size={18} /></div>
                            <div><h4 className="font-bold text-xs">Payroll System</h4><p className="text-[10px] text-neutral-500">Staff Salaries</p></div>
                            <ChevronRight size={16} className="ml-auto text-neutral-600 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white">Recent Transactions</h3><button onClick={() => handleViewChange('fees')} className="text-xs text-neutral-500 hover:text-white transition-colors">VIEW ALL</button></div>
                        <div className="overflow-x-auto no-scrollbar">
                            <table className="w-full text-left min-w-[500px]">
                                <thead><tr className="border-b border-white/5 text-[10px] uppercase text-neutral-500 tracking-widest font-bold"><th className="pb-4 pl-2">ID</th><th className="pb-4">Date</th><th className="pb-4">Method</th><th className="pb-4 text-right pr-2">Amount</th><th className="pb-4 text-right pr-2">Status</th></tr></thead>
                                <tbody className="text-sm">
                                    {[1, 2, 3].map((_, i) => (<tr key={i} className="group hover:bg-white/[0.02] transition-colors border-b border-white/[0.02] last:border-none"><td className="py-4 pl-2 font-mono text-neutral-400 group-hover:text-white">TXN-882{i}</td><td className="py-4 text-neutral-300">Jan 0{i + 1}, 2026</td><td className="py-4"><span className="flex items-center gap-2"><CreditCard size={14} className="text-neutral-500" /> UPI</span></td><td className="py-4 text-right font-bold text-white">₹15,000</td><td className="py-4 text-right pr-2"><span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Success</span></td></tr>))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="h-full"><SystemLogs /></div>
                </div>

                {/* --- BRANDED FOOTER --- */}
                <footer className="pt-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-mono uppercase tracking-[0.2em] mt-10 border-t border-white/5">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Link Encrypted</span>
                        </div>
                        <span>NexaGrid Director v1.0</span>
                    </div>
                    <span className="font-bold text-neutral-500 tracking-wider">POWERED BY NEXGEN OPERATING SYSTEMS INDIA</span>
                </footer>
            </main>

            {/* MODALS */}
            {isMounted && (
                <AnimatePresence>
                    {currentView === 'add_user' && <UserManagementModal onClose={() => router.back()} />}
                    {currentView === 'reports' && <ReportsModal onClose={() => router.back()} />}
                    {currentView === 'fees' && <FeeManager onClose={() => router.back()} />}
                    {currentView === 'students' && <StudentDirectory onClose={() => router.back()} />}
                    {currentView === 'faculty' && <FacultyDirectory onClose={() => router.back()} />}
                    {currentView === 'payroll' && <PayrollManager onClose={() => router.back()} />}
                </AnimatePresence>
            )}
        </div>
    );
};

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#020202] flex items-center justify-center text-amber-500 font-mono text-xs uppercase tracking-widest">Establishing Secure Uplink...</div>}>
            <AdminDashboardContent />
        </Suspense>
    );
}