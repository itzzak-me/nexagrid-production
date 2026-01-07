"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useConfig } from "@/context/ConfigContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Sparkles, CheckCircle2, Circle, Flame, X, Send, Award, Activity,
    User, ChevronRight, Loader2, ChevronDown, Wifi, ShieldCheck,
    Search, Command, Home, GraduationCap, ArrowRight,
    CalendarPlus, Calendar as CalendarIcon, CreditCard, Download, History, Wallet,
    BookOpen, Bot, Zap, TrendingUp, Clock, Bell, Settings
} from "lucide-react";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";

import {
    MOCK_STUDENTS, AI_KNOWLEDGE_BASE,
    SUBJECT_COLORS, MYSTERIES, EXAM_DATA,
    ATTENDANCE_HISTORY, FINANCIAL_DATA
} from "@/lib/data";

// --- TYPES ---
type ChatSession = { id: string; query: string; response: string; date: string };
type SubjectChats = Record<string, ChatSession[]>;

const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- COMPONENT: ATTENDANCE CALENDAR (PREMIUM GLASS) ---
const AttendanceCalendar = () => {
    const daysInMonth = 31;
    const startDayOffset = 3;

    const getStatusStyles = (day: number) => {
        const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
        const record = ATTENDANCE_HISTORY["2026-01"]?.find(r => r.date === dateStr);

        if (record?.status === "present") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
        if (record?.status === "holiday") return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        if (record?.status === "leave") return "bg-orange-500/20 text-orange-400 border-orange-500/30";
        if (record?.status === "absent") return "bg-red-500/20 text-red-400 border-red-500/30";
        return "bg-white/[0.02] text-neutral-600 border-white/[0.05] hover:bg-white/[0.05]";
    };

    return (
        <div className="mt-8 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] relative overflow-hidden backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><CalendarIcon size={18} /></div>
                        Attendance Matrix
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-2 ml-1">Live Sync • Jan 2026</p>
                </div>
                <div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
                    {[{ l: "Holiday", c: "bg-blue-500" }, { l: "Leave", c: "bg-orange-500" }, { l: "Absent", c: "bg-red-500" }].map(s => (
                        <div key={s.l} className="px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${s.c} shadow-[0_0_8px_currentColor]`} />
                            <span className="text-[10px] font-bold uppercase text-neutral-400">{s.l}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-neutral-600 py-3 uppercase tracking-wider">{d}</div>
                ))}
                {Array.from({ length: startDayOffset }).map((_, i) => <div key={`off-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        key={i}
                        className={`aspect-square rounded-xl flex items-center justify-center text-xs border transition-all cursor-default ${getStatusStyles(i + 1)}`}
                    >
                        {i + 1}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENT: FINANCIAL DASHBOARD (APPLE CARD STYLE) ---
const FinancialDashboard = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const { addToast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => { setIsProcessing(false); addToast("Payment Processed Successfully", "success"); }, 2000);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Financial Kernel</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-lg mx-auto w-full space-y-8">
                {/* Holographic Card */}
                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] to-[#000] border border-white/10 p-8 flex flex-col justify-between overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/30 blur-[80px] rounded-full group-hover:bg-emerald-500/40 transition-colors duration-500" />

                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-md"><Wallet className="text-emerald-400" size={20} /></div>
                            <span className="text-emerald-100/50 font-mono text-[10px] uppercase tracking-widest">Secure Vault</span>
                        </div>
                        <Activity className="text-emerald-500/50" />
                    </div>

                    <div className="relative z-10">
                        <p className="text-emerald-200/60 text-xs font-mono uppercase mb-2 tracking-widest">Total Outstanding</p>
                        <h2 className="text-5xl font-medium text-white tracking-tighter">₹{FINANCIAL_DATA.balance.toLocaleString()}</h2>
                    </div>

                    <div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-4">
                        <div>
                            <p className="text-[10px] text-emerald-200/40 uppercase tracking-widest mb-1">Student Identifier</p>
                            <p className="font-mono text-emerald-100 text-sm">STU-8821-X</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-emerald-200/40 uppercase tracking-widest mb-1">Valid Thru</p>
                            <p className="font-mono text-emerald-100 text-sm">12/28</p>
                        </div>
                    </div>
                </div>

                {/* Quick Pay Action */}
                <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full py-5 bg-white text-black rounded-[1.5rem] font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isProcessing ? <Loader2 className="animate-spin" /> : <>Initiate Payment <ArrowRight size={20} /></>}
                </button>

                {/* Transactions List */}
                <div>
                    <h3 className="text-xs font-bold text-neutral-500 mb-6 uppercase tracking-[0.2em] px-2">Ledger History</h3>
                    <div className="space-y-3">
                        {FINANCIAL_DATA.transactions.map((t) => (
                            <div key={t.id} className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] flex justify-between items-center hover:bg-white/[0.06] transition-colors group">
                                <div className="flex items-center gap-5">
                                    <div className={`p-3 rounded-2xl ${t.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                        {t.status === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">{t.method}</p>
                                        <p className="text-[10px] font-mono text-neutral-500 mt-1">{t.date} • {t.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white mb-1">₹{t.amount.toLocaleString()}</p>
                                    <button className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 ml-auto transition-colors">
                                        RECEIPT <Download size={10} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: ACADEMIC RADAR (PREMIUM SPLIT) ---
const AcademicRadar = () => {
    const { themeColor } = useConfig();
    const activeColor = `rgb(${themeColor})`;
    const [selectedExam, setSelectedExam] = useState("Predicted Final");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 mt-6 relative z-10 backdrop-blur-sm">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Performance Matrix</h3>
                    <p className="text-xs text-neutral-500 mt-1 font-mono uppercase tracking-wider">Analytics Engine v2.0</p>
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold transition-all text-neutral-300 hover:text-white">
                        {selectedExam} <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1">
                                {Object.keys(EXAM_DATA).map(e => (
                                    <button key={e} onClick={() => { setSelectedExam(e); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">{e}</button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-10">
                <div className="h-[280px] w-full lg:w-1/2 -ml-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={EXAM_DATA[selectedExam]}>
                            <PolarGrid stroke="#333" strokeDasharray="4 4" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "#737373", fontSize: 10, fontWeight: "bold", dy: 4 }} />
                            <Radar dataKey="A" stroke={activeColor} strokeWidth={3} fill={activeColor} fillOpacity={0.2} isAnimationActive={true} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full lg:w-1/2 space-y-3">
                    {EXAM_DATA[selectedExam].map((item) => (
                        <motion.div layoutId={`${selectedExam}-${item.subject}`} key={item.subject} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.subject === "Physics" ? "bg-blue-500" : item.subject === "Chemistry" ? "bg-emerald-500" : item.subject === "Mathematics" ? "bg-red-500" : "bg-amber-500"} shadow-[0_0_8px_currentColor]`} />
                                <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">{item.subject}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-bold text-white tabular-nums">{item.A}</span>
                                <span className="text-[10px] text-neutral-600 font-mono">/100</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- COMPONENT: SMART BAG (CARDS) ---
const SmartBag = () => {
    const { addToast } = useToast();
    const [items, setItems] = useState([
        { id: 1, subject: "Physics", item: "H.C. Verma Vol 1", color: "bg-blue-500", checked: false },
        { id: 2, subject: "Chemistry", item: "Organic Notes", color: "bg-emerald-500", checked: false },
        { id: 3, subject: "Mathematics", item: "R.D. Sharma", color: "bg-red-500", checked: false },
        { id: 4, subject: "English", item: "Flamingo Reader", color: "bg-amber-500", checked: false },
    ]);
    const toggleItem = (id: number) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
        addToast("Pack Status Updated", "info");
    };

    return (
        <div className="w-full overflow-x-auto pb-6 pt-2 no-scrollbar">
            <div className="flex gap-5 min-w-max px-1">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-44 p-6 rounded-[1.8rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm cursor-pointer transition-all ${item.checked ? "opacity-40 grayscale border-dashed" : "hover:border-white/20 hover:bg-white/[0.05] shadow-lg"}`}
                    >
                        <div className={`w-2.5 h-2.5 rounded-full ${item.color} mb-4 shadow-[0_0_12px_currentColor]`} />
                        <h4 className="font-bold text-white text-sm mb-2">{item.subject}</h4>
                        <p className="text-[10px] text-neutral-500 font-mono truncate uppercase tracking-wider">{item.item}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --- COMPONENT: PROFILE & LEAVE ---
const StudentProfile = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const student = MOCK_STUDENTS[0];

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">Identity Core</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full pb-20">
                {/* Avatar Section */}
                <div className="flex flex-col items-center text-center mb-12 mt-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="w-32 h-32 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative z-10 overflow-hidden">
                            <User size={48} className="text-neutral-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mt-6 mb-2">{student.name}</h1>
                    <div className="flex gap-2 items-center">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-neutral-300 border border-white/5">Class 10-A</span>
                        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Science Stream</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                        <Award className="text-yellow-500 mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" size={28} />
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Class Rank</p>
                        <h4 className="text-4xl font-black mt-2 tracking-tighter">05</h4>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                        <Activity className="text-emerald-500 mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" size={28} />
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Attendance</p>
                        <h4 className="text-4xl font-black mt-2 text-emerald-400 tracking-tighter">92%</h4>
                    </div>
                </div>

                <AcademicRadar />
                <AttendanceCalendar />
            </div>
        </motion.div>
    );
};

// --- COMPONENT: NEXA AI CHAT (PREMIUM) ---
const AiChat = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<SubjectChats>(AI_KNOWLEDGE_BASE);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim() || !activeSubject) return;
        const newChat: ChatSession = { id: Date.now().toString(), query: input, response: "Analyzing...", date: "Just now" };
        setHistory(prev => ({ ...prev, [activeSubject]: [newChat, ...(prev[activeSubject] || [])] }));
        setInput("");
        setIsTyping(true);
        setTimeout(() => {
            setHistory(prev => ({
                ...prev,
                [activeSubject]: prev[activeSubject].map(c => c.id === newChat.id ? { ...c, response: `Nexa Analysis for ${activeSubject}: Confirmed.` } : c)
            }));
            setIsTyping(false);
        }, 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 bg-[#050505] flex flex-col text-white">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)]"><Sparkles size={24} fill="white" /></div>
                    <div><h2 className="font-bold text-xl tracking-tight">Nexa AI</h2><p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Neural Link Active</p></div>
                </div>
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full">
                {!activeSubject ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {Object.keys(history).map(s => (
                            <button key={s} onClick={() => setActiveSubject(s)} className="p-8 border border-white/5 rounded-[2rem] text-left bg-white/[0.02] hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all group duration-300">
                                <h3 className="font-bold text-xl mb-1">{s}</h3>
                                <p className="text-xs text-neutral-500 group-hover:text-white/80 font-mono uppercase tracking-wider">Initialize Module</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8 pb-32">
                        <button onClick={() => setActiveSubject(null)} className="text-xs text-neutral-500 flex items-center gap-2 hover:text-white transition-colors mb-8 uppercase tracking-widest font-bold"><ArrowRight className="rotate-180" size={12} /> Return to Modules</button>
                        {history[activeSubject]?.map((chat) => (
                            <div key={chat.id} className="space-y-4">
                                <div className="flex justify-end"><div className="bg-white text-black px-6 py-4 rounded-[1.5rem] rounded-tr-sm text-sm font-medium max-w-[85%] shadow-lg">{chat.query}</div></div>
                                <div className="flex justify-start"><div className="bg-white/[0.05] border border-white/5 px-6 py-4 rounded-[1.5rem] rounded-tl-sm text-sm text-neutral-300 max-w-[85%] leading-relaxed">{chat.response}</div></div>
                            </div>
                        ))}
                        {isTyping && <div className="text-xs text-indigo-400 animate-pulse ml-2 flex items-center gap-2 font-mono"><Bot size={14} /> Processing Intelligence...</div>}
                    </div>
                )}
            </div>

            {activeSubject && (
                <div className="p-6 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5">
                    <div className="relative max-w-3xl mx-auto">
                        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Nexa..." className="w-full bg-[#111] border border-white/10 rounded-full py-5 pl-8 pr-16 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-700" />
                        <button onClick={handleSend} className="absolute right-2 top-2 p-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"><Send size={18} /></button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// --- NEW COMPONENT: LEAVE REQUEST MODAL (RESTORED) ---
const LeaveRequestModal = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { addToast("Request Sent", "success"); onClose(); }, 1200); };
    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Form: LR-2026</span>
                <div className="w-8" />
            </div>
            <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto w-full space-y-6 mt-10">
                <h2 className="text-3xl font-bold mb-8 tracking-tight">Request Absence</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">From</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" /></div>
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">To</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Reason</label><textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors resize-none" placeholder="Medical, Family, etc..." /></div>
                <button disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center hover:bg-gray-200 transition-colors active:scale-95">{isLoading ? <Loader2 className="animate-spin" /> : "Submit Request"}</button>
            </form>
        </motion.div>
    );
};

// --- TOP NAV (STICKY GLASS) ---
const TopNavigation = () => {
    const { schoolName } = useConfig();
    return (
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 z-40 pointer-events-none">
            {/* Dynamic Background Blur Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-auto" />

            <div className="relative z-10 flex items-center gap-4 pointer-events-auto">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"><span className="font-black text-black text-sm">N</span></div>
                <div>
                    <span className="font-bold text-sm tracking-tight block text-white">{schoolName}</span>
                    <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">v16.1.1 Stable</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-4 pointer-events-auto">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-[10px] font-mono font-bold text-neutral-400">ONLINE</span>
                </div>
                <button className="p-3 rounded-full bg-white/[0.03] border border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Settings size={18} /></button>
                <button className="p-3 rounded-full bg-white/[0.03] border border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"><Bell size={18} /></button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-700 to-neutral-800 border border-white/10 ml-2" />
            </div>
        </header>
    );
};

// --- LOGIN OVERLAY ---
const LoginOverlay = ({ onLogin }: { onLogin: () => void }) => {
    useScrollLock();
    const [userId, setUserId] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [isLoading, setIsLoading] = useState(false);
    const handleLogin = (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { onLogin(); }, 800); };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 text-white">
            <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-8 tracking-tighter">Student Neural Link</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-emerald-500" placeholder="User ID" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-emerald-500" placeholder="Password" />
                    <button disabled={isLoading} className="w-full bg-green-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">{isLoading ? <Loader2 className="animate-spin" /> : "Login"}</button>
                </form>
            </div>
        </motion.div>
    );
};

// --- MAIN DASHBOARD LAYOUT (BENTO GRID) ---
const DashboardContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* AMBIENT BACKGROUND GLOW */}
            <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            <TopNavigation />

            <main className="px-6 max-w-6xl mx-auto space-y-10 relative z-10">

                {/* HEADER UPGRADE: WELCOME BACK */}
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            Welcome back,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Rohan.</span>
                        </h1>

                        {/* HUD Status Pill */}
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest">System Optimal</span>
                            </div>
                        </div>
                    </div>

                    {/* Streak Widget */}
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] p-2 pr-6 rounded-full backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                            <Flame className="text-orange-500 fill-orange-500" size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white leading-none">12</span>
                            <span className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Day Streak</span>
                        </div>
                    </div>
                </section>

                <SmartBag />

                {/* ULTRA BENTO GRID */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Card 1: Academic (Large) */}
                    <button onClick={() => router.push(pathname + '?view=profile')} className="md:col-span-2 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500"><Activity size={120} /></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-white/5 w-fit rounded-2xl mb-8 text-blue-400 ring-1 ring-white/10"><User size={28} /></div>
                            <h2 className="text-3xl font-bold mb-3 tracking-tight">Academic Core</h2>
                            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">Access performance matrix, attendance logs, and detailed progress reports.</p>
                            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white group-hover:gap-4 transition-all">
                                ACCESS DATA <ArrowRight size={14} />
                            </div>
                        </div>
                    </button>

                    {/* Card 2: Financial (Tall) */}
                    <button onClick={() => router.push(pathname + '?view=financial')} className="md:row-span-2 p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] text-left hover:border-emerald-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500"><Wallet size={180} className="text-emerald-500" /></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <div className="p-4 bg-emerald-500/10 w-fit rounded-2xl mb-8 text-emerald-500 ring-1 ring-emerald-500/20"><CreditCard size={28} /></div>
                                <h2 className="text-3xl font-bold mb-3 tracking-tight">Fee Terminal</h2>
                                <p className="text-sm text-neutral-500 leading-relaxed">Manage payments and receipts.</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-neutral-600 mb-2 tracking-widest">Status</p>
                                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active</div>
                            </div>
                        </div>
                    </button>

                    {/* Card 3: Quick Action (Leave) */}
                    <button onClick={() => router.push(pathname + '?view=leave')} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-orange-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><ArrowRight className="-rotate-45 text-orange-500" /></div>
                        <div className="p-4 bg-orange-500/10 w-fit rounded-2xl mb-6 text-orange-500 ring-1 ring-orange-500/20"><CalendarPlus size={28} /></div>
                        <h3 className="text-xl font-bold tracking-tight">Request Leave</h3>
                    </button>

                    {/* Card 4: Library Placeholder */}
                    <div className="p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.03] text-left opacity-60 cursor-not-allowed border-dashed">
                        <div className="p-4 bg-white/5 w-fit rounded-2xl mb-6 text-neutral-500"><BookOpen size={28} /></div>
                        <h3 className="text-xl font-bold tracking-tight text-neutral-500">Library</h3>
                        <p className="text-[10px] uppercase tracking-widest text-neutral-600 mt-2">Coming Soon</p>
                    </div>

                </section>

                <footer className="pt-20 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-30 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Link Encrypted</span></div>
                        <span>Kernel v16.1.1</span>
                    </div>
                    <span>NexGen OS Total Intelligence</span>
                </footer>
            </main>

            {/* NEXA ORB FAB (PULSING) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(pathname + '?view=genius')}
                className="fixed bottom-10 right-8 z-40 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] border border-indigo-400/30 hover:bg-indigo-500 transition-all group"
            >
                <Sparkles size={28} className="animate-pulse group-hover:rotate-12 transition-transform" />
            </motion.button>

            {/* MODALS */}
            <AnimatePresence>
                {currentView === 'genius' && <AiChat onClose={() => router.back()} />}
                {currentView === 'profile' && <StudentProfile onClose={() => router.back()} />}
                {currentView === 'leave' && <LeaveRequestModal onClose={() => router.back()} />}
                {currentView === 'financial' && <FinancialDashboard onClose={() => router.back()} />}
            </AnimatePresence>
        </div>
    );
};

export default function StudentDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">Initializing Neural Link...</div>}>
            <DashboardContent />
        </Suspense>
    );
}