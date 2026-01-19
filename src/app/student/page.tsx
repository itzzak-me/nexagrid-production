"use client";

import React, { useState, useEffect, Suspense, useRef, useMemo } from "react";
import dynamic from "next/dynamic"; // 1. LAZY LOADING
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useConfig } from "@/context/ConfigContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Sparkles, CheckCircle2, Flame, X, Send, Award, Activity,
    User, ChevronDown, Loader2, BookOpen, Bot, Bell,
    Wallet, Calendar as CalendarIcon, CalendarPlus, CreditCard,
    Download, ArrowRight, LogOut, FileText, Users, MessageCircle,
    ThumbsUp, HelpCircle, AlertTriangle, Zap, Lock, Clock, GraduationCap,
    Image as ImageIcon, XCircle, Mic, StopCircle
} from "lucide-react";
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from "recharts";
import {
    MOCK_STUDENTS, AI_KNOWLEDGE_BASE, EXAM_DATA, ATTENDANCE_HISTORY, FINANCIAL_DATA, PEER_DOUBTS
} from "@/lib/data";

// --- TYPES ---
type ChatSession = { id: string; query: string; response: string; date: string; role: 'user' | 'ai'; image?: string; isStreaming?: boolean };
type SubjectChats = Record<string, ChatSession[]>;
type Doubt = { id: number; student: string; class: string; query: string; status: string; votes: number; responses: number; time: string; };

declare global {
    interface Window {
        puter: any;
        webkitSpeechRecognition: any;
    }
}

// --- OPTIMIZED SCROLL LOCK ---
const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- MEMOIZED RICH TEXT PARSER ---
const RichText = React.memo(({ content }: { content: string }) => {
    const parts = useMemo(() => content.split(/(```[\s\S]*?```)/g), [content]);
    return (
        <div className="space-y-2 leading-relaxed text-sm">
            {parts.map((part, i) => {
                if (part.startsWith("```")) {
                    return (
                        <pre key={i} className="bg-black/30 p-3 rounded-lg overflow-x-auto text-xs font-mono border border-white/10 text-emerald-400 my-2">
                            {part.replace(/```/g, "").trim()}
                        </pre>
                    );
                }
                return (
                    <div key={i} className="whitespace-pre-wrap">
                        {part.split(/(\*\*.*?\*\*|\n- .*|### .*)/g).map((chunk, j) => {
                            if (chunk.startsWith("**") && chunk.endsWith("**")) {
                                return <strong key={j} className="text-white font-bold">{chunk.slice(2, -2)}</strong>;
                            }
                            if (chunk.startsWith("\n- ")) {
                                return <div key={j} className="flex gap-2 my-1 pl-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" /><span className="text-neutral-300">{chunk.trim().substring(1)}</span></div>;
                            }
                            if (chunk.startsWith("###")) {
                                return <h3 key={j} className="text-lg font-bold text-emerald-400 mt-4 mb-2">{chunk.replace(/###/g, "").trim()}</h3>;
                            }
                            return chunk;
                        })}
                    </div>
                );
            })}
        </div>
    );
});
RichText.displayName = 'RichText';

// --- COMPONENT: TOP NAVIGATION ---
const TopNavigation = ({ onViewChange }: { onViewChange: (view: string) => void }) => {
    const { schoolName } = useConfig();
    const { addToast } = useToast();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const router = useRouter();

    const notifications = useMemo(() => [
        { id: 1, title: "Fee Due", desc: "Physics Module Fee Pending", time: "2h ago", icon: Wallet, color: "text-rose-500 bg-rose-500/10" },
        { id: 2, title: "Assignment", desc: "Chemistry Lab Record", time: "5h ago", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
        { id: 3, title: "System", desc: "Nexa AI v4.0 (Quantum) Live", time: "1d ago", icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" }
    ], []);

    useEffect(() => {
        const close = () => { setIsNotifOpen(false); setIsProfileOpen(false); };
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const handleLogout = () => {
        addToast("Scholar Session Terminated", "info");
        setTimeout(() => router.push('/'), 800);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 z-40 pointer-events-none transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-transparent pointer-events-auto backdrop-blur-sm" />
            <div className="relative z-10 flex items-center gap-4 pointer-events-auto">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20"><Award className="text-white" size={20} /></div>
                <div><span className="font-bold text-sm tracking-tight block text-white">{schoolName}</span><span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Scholar Portal</span></div>
            </div>
            <div className="relative z-10 flex items-center gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] backdrop-blur-md mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-[10px] font-mono font-bold text-neutral-400">ONLINE</span>
                </div>

                <div className="relative">
                    <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} className={`p-3 rounded-full border transition-colors relative ${isNotifOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/10'}`}>
                        <Bell size={18} />
                        {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0A0A]" />}
                    </button>
                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center"><span className="text-xs font-bold text-white">Alerts</span></div>
                                <div className="max-h-64 overflow-y-auto p-2 space-y-1 no-scrollbar">
                                    {notifications.map((n) => (
                                        <div key={n.id} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.color}`}><n.icon size={14} /></div>
                                            <div><p className="text-xs font-bold text-neutral-200 group-hover:text-white">{n.title}</p><p className="text-[10px] text-neutral-500 leading-tight mt-0.5">{n.desc}</p><p className="text-[9px] text-neutral-600 mt-1 font-mono">{n.time}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="relative">
                    <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} className={`w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 border border-white/10 ml-2 transition-transform active:scale-95 ${isProfileOpen ? 'ring-2 ring-white/20' : ''}`} />
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-56 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 backdrop-blur-xl">
                                <div className="px-3 py-2 mb-2 border-b border-white/5"><p className="text-sm font-bold text-white">Rohan Das</p><p className="text-[10px] text-neutral-500 font-mono">ID: ST-2026-01</p></div>
                                <button onClick={() => { onViewChange('profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"><User size={16} /> My Identity</button>
                                <div className="h-px bg-white/5 my-1.5" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-500/10 text-xs font-medium text-rose-500 transition-colors"><LogOut size={16} /> Logout System</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

// --- COMPONENT: PEER FORUM ---
const PeerForum = ({ onClose, doubts, onVote, onPost }: { onClose: () => void, doubts: Doubt[], onVote: (id: number) => void, onPost: (q: string) => void }) => {
    useScrollLock();
    const [newQuestion, setNewQuestion] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const handlePost = () => {
        if (!newQuestion.trim()) return;
        setIsPosting(true);
        setTimeout(() => {
            onPost(newQuestion);
            setNewQuestion("");
            setIsPosting(false);
        }, 800);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Hive Mind Grid</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-2xl mx-auto w-full pb-20 space-y-6">
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/10 shadow-xl">
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><HelpCircle size={16} className="text-amber-500" /> Ask the Hive Mind</h3>
                        <div className="relative">
                            <textarea
                                value={newQuestion}
                                onChange={(e) => setNewQuestion(e.target.value)}
                                placeholder="Type your question here..."
                                className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 pr-12 text-sm focus:border-amber-500 outline-none transition-all placeholder:text-neutral-600 resize-none min-h-[100px]"
                            />
                            <button onClick={handlePost} disabled={isPosting || !newQuestion.trim()} className="absolute bottom-3 right-3 p-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            </button>
                        </div>
                    </div>

                    {doubts.map((doubt) => (
                        <div key={doubt.id} className="p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/[0.05] hover:border-amber-500/30 transition-all duration-300 group shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center text-sm font-bold text-neutral-400 font-mono">{doubt.student.charAt(0)}</div>
                                    <div><p className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors">{doubt.student}</p><p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1"><Clock size={10} /> {doubt.time} • {doubt.class}</p></div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border backdrop-blur-md ${doubt.status === 'teacher_escalated' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : doubt.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                    {doubt.status === 'teacher_escalated' ? <AlertTriangle size={10} /> : <Activity size={10} />}
                                    {doubt.status === 'teacher_escalated' ? 'Escalated' : doubt.status.replace('_', ' ')}
                                </div>
                            </div>
                            <div className="pl-[52px]">
                                <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-medium">"{doubt.query}"</p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-5">
                                    <button onClick={() => onVote(doubt.id)} className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all group/btn active:scale-95"><Zap size={16} className="text-neutral-500 group-hover/btn:text-emerald-500 transition-colors" /><span className="text-xs font-bold text-neutral-400 group-hover/btn:text-white">{doubt.votes} Boosts</span></button>
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-500/20 transition-colors"><MessageCircle size={16} /> <span>{doubt.responses} Solutions</span></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: NEXA AI CHAT ---
const AiChat = ({ onClose, onEscalate }: { onClose: () => void, onEscalate: (q: string) => void }) => {
    useScrollLock();
    const { addToast } = useToast();
    const [activeSubject, setActiveSubject] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<SubjectChats>(AI_KNOWLEDGE_BASE as unknown as SubjectChats);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(scrollToBottom, [history, activeSubject, isStreaming]);

    const handleMic = () => {
        if (!window.webkitSpeechRecognition) { addToast("Voice not supported", "error"); return; }
        if (isListening) { setIsListening(false); return; }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + " " + transcript);
        };
        recognition.start();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAttachedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async (manualInput?: string) => {
        const textToSend = manualInput || input;
        if (!textToSend.trim() && !attachedImage) return;

        const newChat: ChatSession = {
            id: Date.now().toString(),
            query: textToSend,
            response: "",
            date: "Just now",
            role: 'user',
            image: attachedImage || undefined,
            isStreaming: true
        };

        setHistory(prev => ({ ...prev, [activeSubject!]: [...(prev[activeSubject!] || []), newChat] }));
        setInput("");
        setAttachedImage(null);
        setIsStreaming(true);

        try {
            if (typeof window !== 'undefined' && window.puter) {
                const systemPrompt = `ROLE: Nexa AI (Tutor). SUBJECT: ${activeSubject}. FORMAT: Markdown.`;
                const responseStream = await window.puter.ai.chat(`${systemPrompt}\nUser: ${textToSend}`, attachedImage ? attachedImage : { stream: true, model: 'gemini-3-flash-preview' }, attachedImage ? { stream: true, model: 'gemini-3-flash-preview' } : undefined);

                let fullText = "";
                for await (const part of responseStream) {
                    fullText += part?.text || "";
                    setHistory(prev => ({
                        ...prev,
                        [activeSubject!]: prev[activeSubject!].map(c => c.id === newChat.id ? { ...c, response: fullText } : c)
                    }));
                }

                setHistory(prev => ({
                    ...prev,
                    [activeSubject!]: prev[activeSubject!].map(c => c.id === newChat.id ? { ...c, isStreaming: false } : c)
                }));
            } else { throw new Error("Puter Offline"); }
        } catch (error) {
            setHistory(prev => ({
                ...prev,
                [activeSubject!]: prev[activeSubject!].map(c => c.id === newChat.id ? { ...c, response: "Connection Failed.", isStreaming: false } : c)
            }));
        } finally { setIsStreaming(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 z-50 bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] relative">
                        <Sparkles size={24} fill="white" />
                        {isStreaming && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />}
                    </div>
                    <div><h2 className="font-bold text-xl tracking-tight">Nexa AI</h2><p className="text-[10px] text-indigo-400 font-mono tracking-widest uppercase">Quantum Core v4.0</p></div>
                </div>
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto w-full pb-36">
                    {!activeSubject ? (
                        <div className="space-y-6 mt-8">
                            <h3 className="text-xl font-bold text-white text-center mb-8">Select Knowledge Module</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.keys(history).map(s => (
                                    <button key={s} onClick={() => setActiveSubject(s)} className="p-8 border border-white/5 rounded-[2rem] text-left bg-white/[0.02] hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all group duration-300">
                                        <h3 className="font-bold text-xl mb-1">{s}</h3><p className="text-xs text-neutral-500 group-hover:text-white/80 font-mono uppercase tracking-wider">Initialize</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 flex flex-col">
                            {history[activeSubject]?.map((chat) => (
                                <div key={chat.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-end flex-col items-end">
                                        {chat.image && (
                                            <div className="relative group mb-2">
                                                <img src={chat.image} alt="Upload" className="w-48 h-auto rounded-2xl border border-white/10 object-cover shadow-lg" />
                                            </div>
                                        )}
                                        <div className="bg-white text-black px-6 py-4 rounded-[1.5rem] rounded-tr-sm text-sm font-medium max-w-[85%] shadow-lg">{chat.query}</div>
                                    </div>
                                    <div className="flex justify-start items-end gap-3">
                                        <div className="flex-1 bg-white/[0.05] border border-white/5 px-6 py-4 rounded-[1.5rem] rounded-tl-sm text-sm text-neutral-300 max-w-[95%] shadow-sm">
                                            {chat.response ? <RichText content={chat.response} /> : <div className="flex items-center gap-2 text-indigo-400"><Loader2 size={14} className="animate-spin" /><span>Neural Processing...</span></div>}
                                            {chat.role === 'ai' && !chat.isStreaming && (
                                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                                    <span className="text-[10px] text-neutral-500 mr-auto flex items-center gap-1"><Bot size={10} /> AI Tutor</span>
                                                    <button onClick={() => onEscalate(chat.query)} className="text-[10px] font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1 transition-colors"><HelpCircle size={10} /> Not Clear? Ask Peers</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="pb-4 flex justify-center"><button onClick={() => setActiveSubject(null)} className="text-xs text-neutral-500 flex items-center gap-2 hover:text-white transition-colors uppercase tracking-widest font-bold bg-white/5 px-4 py-2 rounded-full"><ArrowRight className="rotate-180" size={12} /> Modules</button></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            {activeSubject && (
                <div className="p-6 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 absolute bottom-0 left-0 right-0">
                    <div className="relative max-w-3xl mx-auto flex flex-col gap-3">
                        {!input && !attachedImage && (
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {["Explain this concept", "Create a Quiz", "Summarize Notes"].map(q => (
                                    <button key={q} onClick={() => handleSend(q)} className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] hover:bg-white/10 transition-colors text-neutral-400 hover:text-white">{q}</button>
                                ))}
                            </div>
                        )}
                        {attachedImage && (
                            <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl w-fit pr-4 animate-in slide-in-from-bottom-2">
                                <img src={attachedImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                                <span className="text-xs text-neutral-300">Image Attached</span>
                                <button onClick={() => setAttachedImage(null)} className="p-1 rounded-full bg-white/10 hover:bg-white/20"><XCircle size={14} /></button>
                            </div>
                        )}
                        <div className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isListening ? "Listening..." : "Ask anything..."} className={`w-full bg-[#111] border ${isListening ? 'border-red-500/50' : 'border-white/10'} rounded-full py-4 pl-12 pr-12 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-700`} disabled={isStreaming} />
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                                <button onClick={() => fileInputRef.current?.click()} className="absolute left-2 top-2 p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"><ImageIcon size={20} /></button>
                                <button onClick={handleMic} className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>{isListening ? <StopCircle size={20} /> : <Mic size={20} />}</button>
                            </div>
                            <button onClick={() => handleSend()} disabled={isStreaming} className="p-4 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed">{isStreaming ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// --- LEAVE REQUEST MODAL ---
const LeaveRequestModal = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setIsLoading(true); setTimeout(() => { addToast("Request Sent", "success"); onClose(); }, 1200); };
    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl"><button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button><span className="font-mono text-xs uppercase tracking-widest text-neutral-500">Form: LR-2026</span><div className="w-8" /></div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto w-full space-y-6 mt-10"><h2 className="text-3xl font-bold mb-8 tracking-tight">Request Absence</h2><div className="grid grid-cols-2 gap-4"><div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">From</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" /></div><div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">To</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors [color-scheme:dark]" /></div></div><div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Reason</label><textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-orange-500 transition-colors resize-none" placeholder="Medical, Family, etc..." /></div><button disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center hover:bg-gray-200 transition-colors active:scale-95">{isLoading ? <Loader2 className="animate-spin" /> : "Submit Request"}</button></form>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: PROFILE & FEES MERGED ---
const StudentProfile = ({ onClose }: { onClose: () => void }) => {
    useScrollLock();
    const student = MOCK_STUDENTS[0];
    const { themeColor } = useConfig();
    const activeColor = `rgb(${themeColor})`;
    const [activeTab, setActiveTab] = useState<'academic' | 'financial'>('academic'); // NEW: Tabs
    const [selectedExam, setSelectedExam] = useState(Object.keys(EXAM_DATA)[0]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { addToast } = useToast();

    // Financial State
    const [isProcessing, setIsProcessing] = useState(false);
    const handlePay = () => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); addToast("Payment Processed Successfully", "success"); }, 2000); };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50"><button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button><span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">Identity Core</span><div className="w-10" /></div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto w-full pb-20">

                    {/* Identity Header */}
                    <div className="flex flex-col items-center text-center mb-8 mt-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-blue-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="w-32 h-32 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative z-10 overflow-hidden"><User size={48} className="text-neutral-400" /></div>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mt-6 mb-1">{student.name}</h1>
                        <p className="font-mono text-sm text-neutral-500 tracking-wider mb-4">ID: {student.id}</p>
                        <div className="flex gap-2 items-center justify-center mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-neutral-300 border border-white/5">Class 10-A</span>
                            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Science Stream</span>
                        </div>

                        {/* Change Password */}
                        <button onClick={() => addToast("Security Check: Enter Old Password", "info")} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all group mb-8">
                            <Lock size={14} className="text-neutral-500 group-hover:text-red-400" />
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-red-400">Change Password</span>
                        </button>

                        {/* NEW: TABS */}
                        <div className="flex bg-white/5 p-1 rounded-2xl w-full max-w-sm">
                            <button onClick={() => setActiveTab('academic')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'academic' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>Academic</button>
                            <button onClick={() => setActiveTab('financial')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'financial' ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}>Financial</button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'academic' ? (
                            <motion.div key="academic" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4"><div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors"><Award className="text-yellow-500 mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]" size={28} /><p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Class Rank</p><h4 className="text-4xl font-black mt-2 tracking-tighter">05</h4></div><div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors"><Activity className="text-emerald-500 mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" size={28} /><p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Attendance</p><h4 className="text-4xl font-black mt-2 text-emerald-400 tracking-tighter">92%</h4></div></div>
                                <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 relative z-10 backdrop-blur-sm"><div className="flex justify-between items-start mb-8"><div><h3 className="text-lg font-bold text-white tracking-tight">Performance Matrix</h3><p className="text-xs text-neutral-500 mt-1 font-mono uppercase tracking-wider">Analytics Engine v2.0</p></div><div className="relative"><button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold transition-all text-neutral-300 hover:text-white">{selectedExam} <ChevronDown size={14} className={`transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`} /></button><AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-full mt-2 w-48 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1">{Object.keys(EXAM_DATA).map(e => (<button key={e} onClick={() => { setSelectedExam(e); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">{e}</button>))}</motion.div>)}</AnimatePresence></div></div><div className="flex flex-col lg:flex-row items-center gap-10"><div className="h-[280px] w-full lg:w-1/2 -ml-4"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="70%" data={EXAM_DATA[selectedExam] || []}><PolarGrid stroke="#333" strokeDasharray="4 4" /><PolarAngleAxis dataKey="subject" tick={{ fill: "#737373", fontSize: 10, fontWeight: "bold", dy: 4 }} /><Radar dataKey="A" stroke={activeColor} strokeWidth={3} fill={activeColor} fillOpacity={0.2} isAnimationActive={true} /></RadarChart></ResponsiveContainer></div><div className="w-full lg:w-1/2 space-y-3">{(EXAM_DATA[selectedExam] || []).map((item) => (<motion.div layoutId={`${selectedExam}-${item.subject}`} key={item.subject} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-all group"><div className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${item.subject === "Physics" ? "bg-blue-500" : item.subject === "Chemistry" ? "bg-emerald-500" : item.subject === "Mathematics" ? "bg-red-500" : "bg-amber-500"} shadow-[0_0_8px_currentColor]`} /><span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">{item.subject}</span></div><div className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-white tabular-nums">{item.A}</span><span className="text-[10px] text-neutral-600 font-mono">/100</span></div></motion.div>))}</div></div></div>
                                <AttendanceCalendar />
                            </motion.div>
                        ) : (
                            <motion.div key="financial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                                {/* Financial Card */}
                                <div className="relative h-64 rounded-[2.5rem] bg-gradient-to-br from-[#0f172a] to-[#000] border border-white/10 p-8 flex flex-col justify-between overflow-hidden group shadow-2xl">
                                    <div className="absolute inset-0 bg-neutral-900 opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div><div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/30 blur-[80px] rounded-full group-hover:bg-emerald-500/40 transition-colors duration-500" /><div className="flex justify-between items-start relative z-10"><div className="flex items-center gap-2"><div className="p-2 bg-emerald-500/20 rounded-lg backdrop-blur-md"><Wallet className="text-emerald-400" size={20} /></div><span className="text-emerald-100/50 font-mono text-[10px] uppercase tracking-widest">Secure Vault</span></div><Activity className="text-emerald-500/50" /></div><div className="relative z-10"><p className="text-emerald-200/60 text-xs font-mono uppercase mb-2 tracking-widest">Total Outstanding</p><h2 className="text-5xl font-medium text-white tracking-tighter">₹{FINANCIAL_DATA.balance.toLocaleString()}</h2></div><div className="flex justify-between items-end relative z-10 border-t border-white/10 pt-4"><div><p className="text-[10px] text-emerald-200/40 uppercase tracking-widest mb-1">Student Identifier</p><p className="font-mono text-emerald-100 text-sm">STU-8821-X</p></div><div className="text-right"><p className="text-[10px] text-emerald-200/40 uppercase tracking-widest mb-1">Valid Thru</p><p className="font-mono text-emerald-100 text-sm">12/28</p></div></div>
                                </div>

                                {/* Pay Button */}
                                <button onClick={handlePay} disabled={isProcessing} className="w-full py-5 bg-white text-black rounded-[1.5rem] font-bold text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                                    {isProcessing ? <Loader2 className="animate-spin" /> : <>Initiate Payment <ArrowRight size={20} /></>}
                                </button>

                                {/* Ledger */}
                                <div>
                                    <h3 className="text-xs font-bold text-neutral-500 mb-6 uppercase tracking-[0.2em] px-2">Ledger History</h3>
                                    <div className="space-y-3">{FINANCIAL_DATA.transactions.map((t) => (<div key={t.id} className="p-5 bg-white/[0.03] border border-white/[0.05] rounded-[1.5rem] flex justify-between items-center hover:bg-white/[0.06] transition-colors group"><div className="flex items-center gap-5"><div className={`p-3 rounded-2xl ${t.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>{t.status === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />}</div><div><p className="font-bold text-sm text-neutral-200 group-hover:text-white transition-colors">{t.method}</p><p className="text-[10px] font-mono text-neutral-500 mt-1">{t.date} • {t.id}</p></div></div><div className="text-right"><p className="font-bold text-white mb-1">₹{t.amount.toLocaleString()}</p><button className="text-[10px] font-bold text-indigo-400 flex items-center gap-1 hover:text-indigo-300 ml-auto transition-colors">RECEIPT <Download size={10} /></button></div></div>))}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};
const SmartBag = () => { const { addToast } = useToast(); const [items, setItems] = useState([{ id: 1, subject: "Physics", item: "H.C. Verma Vol 1", color: "bg-blue-500", checked: false }, { id: 2, subject: "Chemistry", item: "Organic Notes", color: "bg-emerald-500", checked: false }, { id: 3, subject: "Mathematics", item: "R.D. Sharma", color: "bg-red-500", checked: false }, { id: 4, subject: "English", item: "Flamingo Reader", color: "bg-amber-500", checked: false },]); const toggleItem = (id: number) => { setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)); addToast("Pack Status Updated", "info"); }; return (<div className="w-full overflow-x-auto pb-6 pt-2 no-scrollbar"><div className="flex gap-5 min-w-max px-1">{items.map((item) => (<motion.div key={item.id} onClick={() => toggleItem(item.id)} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }} className={`w-44 p-6 rounded-[1.8rem] border border-white/[0.05] bg-white/[0.02] backdrop-blur-sm cursor-pointer transition-all ${item.checked ? "opacity-40 grayscale border-dashed" : "hover:border-white/20 hover:bg-white/[0.05] shadow-lg"}`}><div className={`w-2.5 h-2.5 rounded-full ${item.color} mb-4 shadow-[0_0_12px_currentColor]`} /><h4 className="font-bold text-white text-sm mb-2">{item.subject}</h4><p className="text-[10px] text-neutral-500 font-mono truncate uppercase tracking-wider">{item.item}</p></motion.div>))}</div></div>); };
const AttendanceCalendar = () => { const daysInMonth = 31; const startDayOffset = 3; const getStatusStyles = (day: number) => { const dateStr = `2026-01-${day.toString().padStart(2, '0')}`; const record = ATTENDANCE_HISTORY["2026-01"]?.find(r => r.date === dateStr); if (record?.status === "present") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"; if (record?.status === "holiday") return "bg-blue-500/20 text-blue-400 border-blue-500/30"; if (record?.status === "leave") return "bg-orange-500/20 text-orange-400 border-orange-500/30"; if (record?.status === "absent") return "bg-red-500/20 text-red-400 border-red-500/30"; return "bg-white/[0.02] text-neutral-600 border-white/[0.05] hover:bg-white/[0.05]"; }; return (<div className="mt-8 p-6 bg-white/[0.02] border border-white/[0.05] rounded-[2rem] relative overflow-hidden backdrop-blur-sm"><div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4"><div><h3 className="text-white font-bold text-lg flex items-center gap-2"><div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><CalendarIcon size={18} /></div>Attendance Matrix</h3><p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-2 ml-1">Live Sync • Jan 2026</p></div><div className="flex gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">{[{ l: "Holiday", c: "bg-blue-500" }, { l: "Leave", c: "bg-orange-500" }, { l: "Absent", c: "bg-red-500" }].map(s => (<div key={s.l} className="px-3 py-1.5 rounded-lg flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${s.c} shadow-[0_0_8px_currentColor]`} /><span className="text-[10px] font-bold uppercase text-neutral-400">{s.l}</span></div>))}</div></div><div className="grid grid-cols-7 gap-1 sm:gap-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (<div key={i} className="text-center text-[10px] font-bold text-neutral-600 py-3 uppercase tracking-wider">{d}</div>))}{Array.from({ length: startDayOffset }).map((_, i) => <div key={`off-${i}`} />)}{Array.from({ length: daysInMonth }).map((_, i) => (<motion.div whileHover={{ scale: 1.05 }} key={i} className={`aspect-square rounded-xl flex items-center justify-center text-xs border transition-all cursor-default ${getStatusStyles(i + 1)}`}>{i + 1}</motion.div>))}</div></div>); };

// --- MAIN DASHBOARD CONTENT ---
const DashboardContent = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');
    const { addToast } = useToast();

    // STATE: Lifted Doubts State
    const [peerDoubts, setPeerDoubts] = useState(PEER_DOUBTS);

    // SCROLL FIX: Force body to be scrollable when main dashboard is active
    useEffect(() => {
        document.body.style.overflow = "auto";
    }, []);

    const handleViewChange = (view: string) => {
        router.push(pathname + '?view=' + view);
    };

    // ESCALATION HANDLER (Adds to Hive Mind)
    const handleEscalation = (query: string) => {
        const newDoubt = {
            id: Date.now(),
            student: "Rohan (You)", // Current user
            class: "10th",
            query: query,
            status: "peer_review",
            votes: 0,
            responses: 0,
            time: "Just Now"
        };
        setPeerDoubts(prev => [newDoubt, ...prev]);
        addToast("Doubt Escalated to Hive Mind", "success");
        router.push(pathname + '?view=peer_forum');
    };

    const handlePostDoubt = (query: string) => {
        const newDoubt = {
            id: Date.now(),
            student: "Rohan (You)",
            class: "10th",
            query: query,
            status: "peer_review",
            votes: 0,
            responses: 0,
            time: "Just Now"
        };
        setPeerDoubts(prev => [newDoubt, ...prev]);
        addToast("Question Posted to Hive Mind", "success");
    };

    const handleVote = (id: number) => {
        setPeerDoubts(prev => prev.map(d => d.id === id ? { ...d, votes: d.votes + 1 } : d));
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none transform-gpu" />
            <TopNavigation onViewChange={handleViewChange} />
            <main className="px-6 max-w-6xl mx-auto space-y-10 relative z-10">
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">Welcome back,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Rohan.</span></h1>
                        <div className="flex items-center gap-3"><div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 w-fit"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest">System Optimal</span></div></div>
                    </div>
                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.05] p-2 pr-6 rounded-full backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20"><Flame className="text-orange-500 fill-orange-500" size={24} /></div>
                        <div className="flex flex-col"><span className="text-2xl font-black text-white leading-none">12</span><span className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Day Streak</span></div>
                    </div>
                </section>

                <SmartBag />

                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 1. NEXA AI */}
                    <button onClick={() => router.push(pathname + '?view=genius')} className="md:col-span-2 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-white/10 transition-all group relative overflow-hidden backdrop-blur-sm transform-gpu">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity duration-500"><Sparkles size={120} /></div>
                        <div className="relative z-10">
                            <div className="p-4 bg-white/5 w-fit rounded-2xl mb-8 text-blue-400 ring-1 ring-white/10"><Bot size={28} /></div>
                            <h2 className="text-3xl font-bold mb-3 tracking-tight">Nexa AI Core</h2>
                            <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">Access 24/7 intelligent tutoring and concept breakdown.</p>
                            <div className="mt-8 flex items-center gap-2 text-xs font-bold text-white group-hover:gap-4 transition-all">START SESSION <ArrowRight size={14} /></div>
                        </div>
                    </button>

                    {/* 2. HIVE MIND */}
                    <button onClick={() => router.push(pathname + '?view=peer_forum')} className="md:row-span-2 p-10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.02] to-transparent border border-white/[0.05] text-left hover:border-amber-500/30 transition-all group relative overflow-hidden backdrop-blur-sm transform-gpu">
                        <div className="absolute bottom-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500"><Users size={180} className="text-amber-500" /></div>
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div><div className="p-4 bg-amber-500/10 w-fit rounded-2xl mb-8 text-amber-500 ring-1 ring-amber-500/20"><Users size={28} /></div><h2 className="text-3xl font-bold mb-3 tracking-tight">Hive Mind</h2><p className="text-sm text-neutral-500 leading-relaxed">Community Grid & Peer Resolution.</p></div>
                            <div><p className="text-[9px] uppercase font-bold text-neutral-600 mb-2 tracking-widest">Status</p><div className="flex items-center gap-2 text-amber-400 font-bold text-sm"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> {peerDoubts.length} Active Threads</div></div>
                        </div>
                    </button>

                    {/* 3. REQUEST LEAVE */}
                    <button onClick={() => router.push(pathname + '?view=leave')} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-orange-500/30 transition-all group relative overflow-hidden backdrop-blur-sm transform-gpu">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><ArrowRight className="-rotate-45 text-orange-500" /></div>
                        <div className="p-4 bg-orange-500/10 w-fit rounded-2xl mb-6 text-orange-500 ring-1 ring-orange-500/20"><CalendarPlus size={28} /></div>
                        <h3 className="text-xl font-bold tracking-tight">Request Leave</h3>
                    </button>

                    {/* 4. IDENTITY & FEES (NEW CARD) */}
                    <button onClick={() => router.push(pathname + '?view=profile')} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group relative overflow-hidden backdrop-blur-sm transform-gpu">
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"><ArrowRight className="-rotate-45 text-emerald-500" /></div>
                        <div className="p-4 bg-emerald-500/10 w-fit rounded-2xl mb-6 text-emerald-500 ring-1 ring-emerald-500/20"><User size={28} /></div>
                        <h3 className="text-xl font-bold tracking-tight">My Identity</h3>
                        <p className="text-xs text-neutral-500 mt-2 font-mono uppercase tracking-widest">Fees & Profile</p>
                    </button>
                </section>

                <footer className="pt-20 pb-8 flex flex-col sm:flex-row justify-between items-center gap-6 opacity-30 text-[10px] font-mono uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-8"><div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span>Link Encrypted</span></div><span>Kernel v16.1.1</span></div><span>NexGen OS Total Intelligence</span>
                </footer>
            </main>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => router.push(pathname + '?view=genius')} className="fixed bottom-10 right-8 z-40 w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] border border-indigo-400/30 hover:bg-indigo-500 transition-all group">
                <Sparkles size={28} className="animate-pulse group-hover:rotate-12 transition-transform" />
            </motion.button>

            <AnimatePresence>
                {currentView === 'genius' && <AiChat onClose={() => router.back()} onEscalate={handleEscalation} />}
                {currentView === 'profile' && <StudentProfile onClose={() => router.back()} />}
                {currentView === 'leave' && <LeaveRequestModal onClose={() => router.back()} />}
                {/* Removed FinancialDashboard from root because it's now inside Profile */}
                {currentView === 'peer_forum' && <PeerForum onClose={() => router.back()} doubts={peerDoubts} onVote={handleVote} onPost={handlePostDoubt} />}
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