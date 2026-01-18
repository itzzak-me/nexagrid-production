"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/context/ToastContext";
import { useConfig } from "@/context/ConfigContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
    Users, CheckCircle2, Clock, Calendar,
    ChevronRight, Bell, Atom, Sparkles, Bot,
    FileText, PenTool, Check, X, Shield,
    Megaphone, AlertTriangle, ArrowRight,
    User, Mail, Phone, MapPin, Award, BookOpen, Star, ChevronDown, Edit2, Save,
    LogOut, Lock, Loader2, HelpCircle, MessageCircle, Send, Image as ImageIcon, XCircle
} from "lucide-react";
import { MOCK_CLASS_LIST, PENDING_LEAVES, TEACHER_DIRECTORY, TEACHER_SCHEDULE, PEER_DOUBTS } from "@/lib/data";

// Type definition for Puter.js
declare global {
    interface Window {
        puter: any;
    }
}

const useScrollLock = () => {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);
};

// --- COMPONENT: TOP NAVIGATION ---
const TopNavigation = ({ onViewChange }: { onViewChange: (view: string) => void }) => {
    const { schoolName } = useConfig();
    const router = useRouter();
    const { addToast } = useToast();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        { id: 1, title: "Leave Request", desc: "Kabir Mehta (10-A) applied for sick leave.", time: "10m ago", icon: Calendar, color: "text-orange-500 bg-orange-500/10" },
        { id: 2, title: "Doubt Escalation", desc: "5 unresolved doubts in Physics Hive.", time: "30m ago", icon: HelpCircle, color: "text-amber-500 bg-amber-500/10" },
        { id: 3, title: "Admin Alert", desc: "Submit monthly attendance report.", time: "5h ago", icon: Shield, color: "text-rose-500 bg-rose-500/10" }
    ]);

    useEffect(() => {
        const close = () => { setIsNotifOpen(false); setIsProfileOpen(false); };
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const handleLogout = () => {
        addToast("Secure Session Terminated", "info");
        setTimeout(() => router.push('/'), 800);
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-20 sm:h-24 flex items-center justify-between px-4 sm:px-6 z-40 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent pointer-events-auto" />

            <div className="relative z-10 flex items-center gap-3 sm:gap-4 pointer-events-auto">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Atom className="text-white" size={20} />
                </div>
                <div>
                    <span className="font-bold text-sm tracking-tight block text-white">{schoolName}</span>
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest hidden sm:block">Faculty Access</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 sm:gap-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="relative">
                    <button onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }} className={`p-2.5 sm:p-3 rounded-full border transition-colors relative ${isNotifOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.03] border-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/10'}`}>
                        <Bell size={18} />
                        {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0A0A0A]" />}
                    </button>
                    <AnimatePresence>
                        {isNotifOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-72 sm:w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl">
                                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-xs font-bold text-white">Notifications</span>
                                    {notifications.length > 0 && <button onClick={() => setNotifications([])} className="text-[10px] text-indigo-400 hover:text-indigo-300">Mark all read</button>}
                                </div>
                                <div className="max-h-64 overflow-y-auto p-2 space-y-1 no-scrollbar">
                                    {notifications.length === 0 ? <div className="p-8 text-center text-neutral-600 text-xs">No new alerts</div> : notifications.map((n) => (
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
                    <button onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 ml-1 sm:ml-2 transition-transform active:scale-95 ${isProfileOpen ? 'ring-2 ring-white/20' : ''}`} />
                    <AnimatePresence>
                        {isProfileOpen && (
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-3 w-56 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5 backdrop-blur-xl">
                                <div className="px-3 py-2 mb-2 border-b border-white/5">
                                    <p className="text-sm font-bold text-white">Vikram Singh</p>
                                    <p className="text-[10px] text-neutral-500 font-mono">ID: FAC-8821</p>
                                </div>
                                <button onClick={() => { onViewChange('profile'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"><User size={16} /> My Identity</button>
                                <button onClick={() => { onViewChange('request_leave'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-xs font-medium text-neutral-300 hover:text-white transition-colors"><Calendar size={16} /> Leave History</button>
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

// --- COMPONENT: TEACHER AI CHAT (ENHANCED SYSTEM PROMPT) ---
const TeacherAiChat = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string, image?: string }[]>([
        { role: 'ai', text: "Hello! I am Nexa (Powered by Gemini 3). Upload an image of a physics problem or ask me to draft a quiz. I'm ready to assist." }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [attachedImage, setAttachedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                addToast("Image too large. Limit is 5MB.", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !attachedImage) return;

        const userMsg = input;
        const userImage = attachedImage;
        setMessages(prev => [...prev, { role: 'user', text: userMsg, image: userImage || undefined }]);

        setInput("");
        setAttachedImage(null);
        setIsTyping(true);

        try {
            if (typeof window !== 'undefined' && window.puter) {
                // --- 1. SYSTEM CONTEXT (PERSONA) ---
                const systemContext = `
        ROLE: You are Nexa, an elite Senior Faculty Assistant at 'Scholars Coaching Point'.
        TONE: Professional, Academic, Encouraging, and Precise.
        AUDIENCE: You are speaking to a fellow Teacher. Use appropriate terminology (e.g., 'concept', 'pedagogy', 'derivation').
        
        INSTRUCTIONS:
        1. If the user asks for a quiz, format it clearly with numbered questions.
        2. If the user asks for a solution, provide a step-by-step derivation.
        3. If an IMAGE is provided, your priority is ACCURACY.
           - First, transcribe any text or equations you see in the image to confirm understanding.
           - Identify the core concept (e.g., "This is a projectile motion problem").
           - Solve it methodically.
        4. Do not hallucinate. If the image is blurry, ask for a re-upload.
        `;

                // --- 2. VISION-SPECIFIC INSTRUCTION ---
                const visionInstruction = userImage
                    ? `\n\n[SYSTEM NOTICE: The user has attached an image. Analyze it pixel-by-pixel. Extract all numbers, diagrams, and text before solving. If it's a handwriting, transcribe it first.]`
                    : "";

                const fullPrompt = `${systemContext}${visionInstruction}\n\nUser Query: ${userMsg}`;

                // Call Gemini via Puter.js
                let response;
                if (userImage) {
                    response = await window.puter.ai.chat(fullPrompt, userImage, {
                        model: 'gemini-3-flash-preview',
                        stream: false
                    });
                } else {
                    response = await window.puter.ai.chat(fullPrompt, {
                        model: 'gemini-3-flash-preview',
                        stream: false
                    });
                }

                const aiText = typeof response === 'object' ? response.message?.content || JSON.stringify(response) : response;
                setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', text: "System Error: Neural Uplink Offline (Puter.js not loaded)." }]);
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages(prev => [...prev, { role: 'ai', text: "Error: Connection interrupted. Please try again." }]);
            addToast("AI Connection Failed", "error");
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center"><Sparkles size={16} /></div>
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-indigo-400 block">Nexa AI</span>
                        <span className="text-[9px] text-neutral-500">v3.0 (Vision Enabled)</span>
                    </div>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto pb-40 space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.image && (
                                <div className="relative group">
                                    <img src={msg.image} alt="User Upload" className="w-48 h-auto rounded-xl border border-white/10 mb-2 object-cover shadow-lg shadow-black/50" />
                                    <div className="absolute inset-0 bg-black/20 rounded-xl pointer-events-none group-hover:bg-transparent transition-colors" />
                                </div>
                            )}
                            <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/5 text-neutral-300 rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex items-center gap-3 ml-2">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Bot size={16} className="text-indigo-400 animate-pulse" /></div>
                            <div className="text-xs text-neutral-500 font-mono typing-animation">Analyzing visual data...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-6 bg-[#050505]/80 backdrop-blur-xl border-t border-white/5 absolute bottom-0 left-0 right-0">
                <div className="relative max-w-3xl mx-auto flex flex-col gap-3">
                    {attachedImage && (
                        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl w-fit pr-4 animate-in slide-in-from-bottom-2 fade-in">
                            <img src={attachedImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-xs text-neutral-300 font-medium">Image Attached</span>
                            <button onClick={() => setAttachedImage(null)} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition-colors"><XCircle size={14} /></button>
                        </div>
                    )}

                    <div className="relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={attachedImage ? "Add instructions for this image..." : "Draft a quiz, explain a concept, or upload a problem..."}
                            className="w-full bg-[#111] border border-white/10 rounded-full py-5 pl-14 pr-16 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-600 text-base shadow-inner shadow-black/50"
                            disabled={isTyping}
                        />

                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />

                        <button onClick={() => fileInputRef.current?.click()} className="absolute left-2 top-2 p-3 text-neutral-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-all" title="Upload Image">
                            <ImageIcon size={20} />
                        </button>

                        <button onClick={handleSend} disabled={isTyping || (!input.trim() && !attachedImage)} className="absolute right-2 top-2 p-3 bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ... REST OF THE COMPONENTS (AttendanceRegister, Gradebook, etc.) ...
// These remain unchanged to maintain dashboard functionality. 
// I will include them here to ensure the file is complete and error-free.

// --- COMPONENT: ATTENDANCE REGISTER ---
const AttendanceRegister = ({ onClose, classId, onLog }: { onClose: () => void, classId: string, onLog: (a: string, d: string) => void }) => {
    const { addToast } = useToast();
    const [students, setStudents] = useState(MOCK_CLASS_LIST.filter(student => student.class === classId));

    const toggleStatus = (id: string) => {
        setStudents(prev => prev.map(s => {
            if (s.id !== id) return s;
            const newStatus = s.status === "Present" ? "Absent" : s.status === "Absent" ? "Late" : "Present";
            return { ...s, status: newStatus };
        }));
    };

    const submitRegister = () => {
        addToast(`Attendance Synced: ${students.filter(s => s.status === 'Present').length} Present`, "success");
        onLog("Attendance Marked", `Class ${classId} • ${students.filter(s => s.status === 'Present').length} Present`);
        onClose();
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <div className="text-center">
                    <span className="block font-bold text-sm tracking-tight">Class {classId} Attendance</span>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Physics • Period 1 • {students.length} Students</span>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto pb-24 space-y-3">
                    {students.map((student) => (
                        <div key={student.id} onClick={() => toggleStatus(student.id)} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors active:scale-[0.99]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-400 font-mono">{student.roll}</div>
                                <div><p className="font-bold text-sm text-neutral-200">{student.name}</p><p className="text-[10px] text-neutral-600 font-mono uppercase">{student.id}</p></div>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-bold w-24 text-center transition-colors ${student.status === "Present" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : student.status === "Absent" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-orange-500/10 text-orange-500 border border-orange-500/20"}`}>
                                {student.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 border-t border-white/[0.05] bg-[#050505]/90 backdrop-blur-xl absolute bottom-0 w-full">
                <button onClick={submitRegister} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20">Sync Attendance</button>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: GRADEBOOK ---
const Gradebook = ({ onClose, classId, onLog }: { onClose: () => void, classId: string, onLog: (a: string, d: string) => void }) => {
    const { addToast } = useToast();
    const [students, setStudents] = useState(MOCK_CLASS_LIST.filter(student => student.class === classId));

    const handleScoreChange = (id: string, val: string) => {
        const num = parseInt(val) || 0;
        setStudents(prev => prev.map(s => s.id === id ? { ...s, physics: num > 100 ? 100 : num } : s));
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Unit Test 1 • Physics • {classId}</span>
                <button onClick={() => { addToast("Grades Published", "success"); onLog("Grades Published", `Unit Test 1 • ${classId}`); onClose(); }} className="text-emerald-500 font-bold text-sm">Save</button>
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto pb-20 grid gap-3">
                    {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-neutral-500 w-8">#{student.roll}</span>
                                <p className="font-bold text-sm text-neutral-200">{student.name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" value={student.physics} onChange={(e) => handleScoreChange(student.id, e.target.value)} className="w-16 bg-black border border-white/10 rounded-lg py-2 text-center font-mono text-sm focus:border-indigo-500 outline-none transition-colors text-base" />
                                <span className="text-xs text-neutral-600 font-mono">/100</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: BROADCAST COMPOSER ---
const BroadcastComposer = ({ onClose, classId, onLog }: { onClose: () => void, classId: string, onLog: (a: string, d: string) => void }) => {
    const { addToast } = useToast();
    const [isUrgent, setIsUrgent] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            addToast(`Broadcast Sent to Class ${classId}`, "success");
            onLog("Broadcast Sent", `To Class ${classId}`);
            onClose();
        }, 1200);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Class Broadcast</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <form onSubmit={handleSend} className="p-8 max-w-xl mx-auto mt-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">New Announcement</h2>
                        <p className="text-neutral-500 text-sm">Target: <span className="text-indigo-400 font-mono">Class {classId} (All)</span></p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Priority Level</label>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsUrgent(false)} className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${!isUrgent ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-neutral-500'}`}><Bell size={16} /> Normal</button>
                                <button type="button" onClick={() => setIsUrgent(true)} className={`flex-1 p-4 rounded-xl border flex items-center justify-center gap-2 transition-all ${isUrgent ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'bg-transparent border-white/5 text-neutral-500'}`}><AlertTriangle size={16} /> Urgent</button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Message Content</label>
                            <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="w-full bg-white/5 border border-white/10 rounded-xl p-5 outline-none focus:border-indigo-500 transition-colors resize-none text-sm leading-relaxed text-base" placeholder="Type your announcement here..." />
                        </div>

                        <button disabled={isLoading || !message.trim()} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold flex justify-center hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4">
                            {isLoading ? <Loader2 className="animate-spin" /> : <span className="flex items-center gap-2">Send Broadcast <Megaphone size={16} /></span>}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: STUDENT LEAVE APPROVAL ---
const LeaveInbox = ({ onClose, onLog }: { onClose: () => void, onLog: (a: string, d: string) => void }) => {
    const { addToast } = useToast();
    const [requests, setRequests] = useState(PENDING_LEAVES);

    const handleDecision = (id: number, decision: 'approved' | 'rejected') => {
        setRequests(prev => prev.filter(r => r.id !== id));
        addToast(`Request ${decision === 'approved' ? 'Approved' : 'Rejected'}`, decision === 'approved' ? 'success' : 'error');
        if (decision === 'approved') onLog("Leave Approved", `Student ID: ${id}`);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Student Leave Console</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto pb-20">
                    {requests.length === 0 ? (
                        <div className="text-center mt-20 opacity-50"><Shield size={48} className="mx-auto mb-4" /><p className="text-sm">All student requests processed.</p></div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <div key={req.id} className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-[2rem]">
                                    <div className="flex justify-between items-start mb-4">
                                        <div><h3 className="text-lg font-bold text-white">{req.student}</h3><p className="text-xs text-indigo-400 font-mono mt-1 uppercase tracking-wide">{req.type} Leave • {req.date}</p></div>
                                        <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Pending</span>
                                    </div>
                                    <p className="text-sm text-neutral-400 mb-6 bg-black/20 p-3 rounded-xl border border-white/5">"{req.reason}"</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => handleDecision(req.id, 'rejected')} className="py-3 rounded-xl border border-white/10 hover:bg-white/5 text-neutral-400 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"><X size={14} /> Reject</button>
                                        <button onClick={() => handleDecision(req.id, 'approved')} className="py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500"><Check size={14} /> Approve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: DOUBT RESOLUTION ---
const DoubtResolutionModal = ({ onClose, onLog }: { onClose: () => void, onLog: (a: string, d: string) => void }) => {
    const { addToast } = useToast();
    const [doubts, setDoubts] = useState(PEER_DOUBTS);
    const [activeDoubt, setActiveDoubt] = useState<number | null>(null);
    const [reply, setReply] = useState("");

    const handleResolve = (id: number) => {
        setDoubts(prev => prev.filter(d => d.id !== id));
        setActiveDoubt(null);
        setReply("");
        addToast("Doubt Marked Resolved", "success");
        onLog("Doubt Resolved", `ID: ${id}`);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-amber-500">Doubt Resolution Console</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto pb-20 space-y-4">
                    {doubts.length === 0 ? (
                        <div className="text-center mt-20 opacity-50"><HelpCircle size={48} className="mx-auto mb-4" /><p className="text-sm">No pending doubts.</p></div>
                    ) : doubts.map((doubt) => (
                        <div key={doubt.id} className="p-6 bg-white/[0.03] border border-white/[0.05] rounded-[2rem]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-xs">{doubt.student.charAt(0)}</div>
                                    <div><h3 className="text-sm font-bold text-white">{doubt.student}</h3><p className="text-[10px] text-neutral-500 font-mono">{doubt.class} • {doubt.time}</p></div>
                                </div>
                                <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${doubt.status === 'teacher_escalated' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'}`}>
                                    {doubt.status === 'teacher_escalated' ? 'Escalated' : 'Peer Review'}
                                </div>
                            </div>

                            <p className="text-sm text-white mb-4">"{doubt.query}"</p>

                            {activeDoubt === doubt.id ? (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:border-amber-500 outline-none resize-none text-base" placeholder="Type faculty response..." />
                                    <div className="flex gap-2">
                                        <button onClick={() => handleResolve(doubt.id)} className="flex-1 py-2 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-400">Send & Resolve</button>
                                        <button onClick={() => setActiveDoubt(null)} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                    <span className="text-xs text-neutral-500 flex items-center gap-1"><MessageCircle size={12} /> {doubt.responses} Peer Replies</span>
                                    <button onClick={() => setActiveDoubt(doubt.id)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-amber-500 flex items-center gap-2 transition-colors">
                                        <Send size={12} /> Resolve Now
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: TEACHER LEAVE REQUEST ---
const TeacherLeaveRequestModal = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            addToast("Leave Application Sent to Admin", "success");
            onClose();
        }, 1200);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronRight className="rotate-180" /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Faculty Leave Portal</span>
                <div className="w-10" />
            </div>
            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <form onSubmit={handleSubmit} className="p-8 max-w-lg mx-auto space-y-6 mt-10">
                    <h2 className="text-3xl font-bold mb-8 tracking-tight">Request Time Off</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">From</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition-colors [color-scheme:dark] text-base" /></div>
                        <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">To</label><input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition-colors [color-scheme:dark] text-base" /></div>
                    </div>
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Type</label><select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition-colors text-neutral-300 text-base"><option>Medical Leave</option><option>Casual Leave</option><option>Professional Development</option></select></div>
                    <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Reason</label><textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 outline-none focus:border-indigo-500 transition-colors resize-none text-base" placeholder="Details for the administration..." /></div>
                    <button disabled={isLoading} className="w-full bg-white text-black py-4 rounded-xl font-bold flex justify-center hover:bg-gray-200 transition-colors active:scale-95">{isLoading ? <Loader2 className="animate-spin" /> : "Submit Application"}</button>
                </form>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: TEACHER PROFILE ---
const TeacherProfile = ({ onClose }: { onClose: () => void }) => {
    const { addToast } = useToast();
    const teacherRef = TEACHER_DIRECTORY[0];
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: teacherRef.name,
        subject: teacherRef.subject,
        email: "vikram.singh@nexgen.edu",
        phone: "+91 98765 43210",
        experience: "8 Years",
        qualification: "M.Sc. Physics, B.Ed",
        office: "Block B, Room 204",
        rating: 4.8,
        classes: teacherRef.classes
    });

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            Object.assign(teacherRef, { name: profileData.name });
            setIsLoading(false);
            setIsEditing(false);
            addToast("Identity Core Synced to Database", "success");
        }, 1500);
    };

    return (
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[60] bg-[#050505] flex flex-col text-white h-screen w-full">
            <div className="p-6 border-b border-white/[0.05] flex justify-between items-center bg-[#050505]/90 backdrop-blur-xl sticky top-0 z-50">
                <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-colors"><ChevronDown size={20} /></button>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">Faculty Identity</span>
                <div className="w-10" />
            </div>

            <div className="flex-1 overflow-y-auto h-full w-full no-scrollbar">
                <div className="p-6 max-w-3xl mx-auto w-full pb-20">

                    <div className="flex flex-col items-center text-center mb-8 mt-4">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="w-32 h-32 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center relative z-10 overflow-hidden">
                                <span className="text-4xl font-black text-white">{profileData.name.charAt(0)}</span>
                            </div>
                        </div>

                        {isEditing ? (
                            <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-1 bg-transparent border-b border-white/20 text-center focus:border-indigo-500 outline-none w-full max-w-md transition-colors text-base" />
                        ) : (
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-1">{profileData.name}</h1>
                        )}

                        <p className="font-mono text-sm text-neutral-500 tracking-wider mb-4">ID: {teacherRef.id}</p>

                        <div className="flex gap-2 items-center justify-center mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-neutral-300 border border-white/5">Senior Faculty</span>
                            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">{profileData.subject} Dept</span>
                        </div>

                        <button
                            onClick={() => addToast("Security Check: Enter Old Password", "info")}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all group"
                        >
                            <Lock size={14} className="text-neutral-500 group-hover:text-red-400" />
                            <span className="text-xs font-bold text-neutral-300 group-hover:text-red-400">Change Password</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                        <div className="p-4 sm:p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                            <Award className="text-blue-500 mb-2 sm:mb-3" size={20} />
                            <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Experience</p>
                            <h4 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 tracking-tighter">{profileData.experience}</h4>
                        </div>
                        <div className="p-4 sm:p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                            <BookOpen className="text-emerald-500 mb-2 sm:mb-3" size={20} />
                            <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Classes</p>
                            <h4 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 text-emerald-400 tracking-tighter">{profileData.classes.length}</h4>
                        </div>
                        <div className="p-4 sm:p-5 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] flex flex-col items-center justify-center hover:bg-white/[0.04] transition-colors">
                            <Star className="text-yellow-500 mb-2 sm:mb-3" size={20} />
                            <p className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Rating</p>
                            <h4 className="text-xl sm:text-2xl font-black mt-1 sm:mt-2 text-yellow-500 tracking-tighter">{profileData.rating}</h4>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-6 sm:p-8 space-y-6 relative group">
                        <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Personal Details</h3>
                            <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={isLoading} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isEditing ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'}`}>
                                {isLoading ? <Loader2 className="animate-spin" size={14} /> : isEditing ? <><Save size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Identity</>}
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-neutral-400 shrink-0"><Mail size={20} /></div>
                            <div className="w-full">
                                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Email Address</p>
                                {isEditing ? <input value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-colors text-base" /> : <p className="text-sm text-white font-medium">{profileData.email}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-neutral-400 shrink-0"><Phone size={20} /></div>
                            <div className="w-full">
                                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Phone Number</p>
                                {isEditing ? <input value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-colors text-base" /> : <p className="text-sm text-white font-medium">{profileData.phone}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl text-neutral-400 shrink-0"><MapPin size={20} /></div>
                            <div className="w-full">
                                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Office Location</p>
                                {isEditing ? <input value={profileData.office} onChange={(e) => setProfileData({ ...profileData, office: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-colors text-base" /> : <p className="text-sm text-white font-medium">{profileData.office}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// --- COMPONENT: SCHEDULE LIST ---
const ScheduleWidget = () => {
    const { addToast } = useToast();
    return (
        <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 h-full">
            <div className="flex justify-between items-center mb-8">
                <div><h3 className="text-lg font-bold text-white tracking-tight">Today's Schedule</h3><p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">Jan 05, 2026</p></div>
                <div className="p-2 bg-white/5 rounded-full"><Clock size={18} className="text-neutral-400" /></div>
            </div>
            <div className="space-y-4">
                {TEACHER_SCHEDULE.map((item) => (
                    <div key={item.id} onClick={() => addToast(`Opening Class ${item.class} Details`, "info")} className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] ${item.status === 'live' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/[0.03] opacity-80 hover:opacity-100 hover:bg-white/[0.05]'}`}>
                        <div className={`text-xs font-mono font-bold w-20 ${item.status === 'live' ? 'text-indigo-400' : 'text-neutral-500'}`}>{item.time.split('-')[0]}</div>
                        <div className="flex-1"><h4 className={`text-sm font-bold ${item.status === 'live' ? 'text-white' : 'text-neutral-300'}`}>{item.subject}: {item.topic}</h4><p className="text-[10px] text-neutral-500 flex items-center gap-2 mt-1"><span className="px-2 py-0.5 rounded bg-white/5 text-neutral-400">{item.class}</span><span>• {item.room}</span></p></div>
                        {item.status === 'live' && <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse"><div className="w-1.5 h-1.5 bg-white rounded-full" /> Live</div>}
                        {item.status === 'completed' && <CheckCircle2 size={16} className="text-emerald-500" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- MAIN DASHBOARD CONTENT ---
const TeacherDashboardContent = () => {
    const router = useRouter();
    const { addToast } = useToast();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view');

    const [selectedClass, setSelectedClass] = useState("10-A");
    const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);
    const myClasses = TEACHER_DIRECTORY[0].classes;

    // LIVE ACTIVITY FEED STATE
    const [activityLog, setActivityLog] = useState([
        { id: 1, time: "09:30 AM", action: "Attendance Synced", detail: "Class 10-A • Physics", icon: CheckCircle2, color: "text-emerald-500" },
        { id: 2, time: "Yesterday", action: "Grades Uploaded", detail: "Unit Test 1 Results", icon: FileText, color: "text-blue-500" },
        { id: 3, time: "2 days ago", action: "Leave Approved", detail: "Rohan Das (Medical)", icon: Calendar, color: "text-orange-500" }
    ]);

    const handleLogActivity = (action: string, detail: string) => {
        const newLog = { id: Date.now(), time: "Just Now", action: action, detail: detail, icon: CheckCircle2, color: "text-indigo-500" };
        setActivityLog(prev => [newLog, ...prev]);
    };

    const classStudents = MOCK_CLASS_LIST.filter(s => s.class === selectedClass);
    const presentCount = classStudents.filter(s => s.status === 'Present').length;
    const totalCount = classStudents.length;

    const handleViewChange = (view: string) => {
        router.push(pathname + '?view=' + view);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-24 selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
            <TopNavigation onViewChange={handleViewChange} />

            <main className="px-6 max-w-6xl mx-auto space-y-10 relative z-10">

                {/* HEADER */}
                <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-2">
                    <div className="space-y-4">
                        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">Command Center<span className="text-indigo-500">.</span></h1>
                        <div className="relative inline-block">
                            <button onClick={() => setIsClassMenuOpen(!isClassMenuOpen)} className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-xs font-mono uppercase tracking-widest transition-all group active:scale-95">
                                <span className="text-neutral-400 group-hover:text-white transition-colors">Class {selectedClass}</span><span className="text-neutral-600">|</span><span className="text-indigo-400 font-bold">Physics Dept</span><ChevronDown size={14} className={`text-neutral-500 group-hover:text-white transition-transform duration-300 ${isClassMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isClassMenuOpen && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full left-0 mt-3 w-56 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 p-2 backdrop-blur-xl">
                                        <div className="px-3 py-2 text-[10px] uppercase font-bold text-neutral-500 tracking-widest border-b border-white/5 mb-1">Select Batch</div>
                                        {myClasses.map((cls) => (
                                            <button key={cls} onClick={() => { setSelectedClass(cls); setIsClassMenuOpen(false); }} className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between group ${selectedClass === cls ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}><span>Class {cls}</span>{selectedClass === cls && <CheckCircle2 size={14} />}</button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right"><span className="block text-2xl font-bold text-white leading-none">{presentCount}/{totalCount}</span><span className="text-[9px] font-bold uppercase text-neutral-600 tracking-wider">Attendance</span></div>
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]"><Users size={20} className="text-indigo-400" /></div>
                    </div>
                </section>

                {/* ACTIONS GRID (REORGANIZED) */}
                <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">

                    {/* ROW 1: AI & DOUBTS (Large Cards - col-span-2) */}
                    <button onClick={() => router.push(pathname + '?view=ai_chat')} className="p-5 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all group relative overflow-hidden col-span-2">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><Sparkles size={100} /></div>
                        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                            <div className="p-3 sm:p-4 bg-indigo-500/10 w-fit rounded-2xl text-indigo-400"><Bot size={24} /></div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold mb-1">Nexa AI</h2>
                                <p className="text-xs sm:text-sm text-neutral-500">Lesson planning & student analysis assistant.</p>
                            </div>
                            <div className="ml-auto hidden sm:flex items-center gap-2 text-indigo-400 font-bold text-xs bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                                <Sparkles size={14} /> Active
                            </div>
                        </div>
                    </button>

                    <button onClick={() => router.push(pathname + '?view=doubts')} className="p-5 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-amber-500/30 transition-all group relative overflow-hidden col-span-2">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><HelpCircle size={100} /></div>
                        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
                            <div className="p-3 sm:p-4 bg-amber-500/10 w-fit rounded-2xl text-amber-500"><HelpCircle size={24} /></div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold mb-1">Doubt Console</h2>
                                <p className="text-xs sm:text-sm text-neutral-500">Resolve escalated queries from the Hive Mind.</p>
                            </div>
                            <div className="ml-auto hidden sm:flex items-center gap-2 text-amber-500 font-bold text-xs bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                                <AlertTriangle size={14} /> 3 Pending
                            </div>
                        </div>
                    </button>

                    {/* ROW 2: ADMIN TOOLS (Small Cards - 1col on mobile, 1col on desktop) */}
                    <button onClick={() => router.push(pathname + '?view=attendance')} className="p-5 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={80} /></div>
                        <div className="relative z-10"><div className="p-3 sm:p-4 bg-indigo-500/10 w-fit rounded-2xl mb-4 sm:mb-6 text-indigo-400"><CheckCircle2 size={24} /></div><h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Attendance</h2><p className="text-xs sm:text-sm text-neutral-500">Mark daily register.</p></div>
                    </button>
                    <button onClick={() => router.push(pathname + '?view=gradebook')} className="p-5 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><FileText size={80} /></div>
                        <div className="relative z-10"><div className="p-3 sm:p-4 bg-emerald-500/10 w-fit rounded-2xl mb-4 sm:mb-6 text-emerald-500"><PenTool size={24} /></div><h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Gradebook</h2><p className="text-xs sm:text-sm text-neutral-500">Update scores.</p></div>
                    </button>
                    <button onClick={() => router.push(pathname + '?view=broadcast')} className="p-5 sm:p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.04] hover:border-rose-500/30 transition-all group relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity"><Megaphone size={80} /></div>
                        <div className="relative z-10"><div className="p-3 sm:p-4 bg-rose-500/10 w-fit rounded-2xl mb-4 sm:mb-6 text-rose-500"><Megaphone size={24} /></div><h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Broadcast</h2><p className="text-xs sm:text-sm text-neutral-500">Class announcements.</p></div>
                    </button>
                    <button onClick={() => router.push(pathname + '?view=leaves')} className="p-5 sm:p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.05] text-left hover:border-orange-500/30 transition-all group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4 sm:mb-6"><div className="p-3 sm:p-4 bg-orange-500/10 w-fit rounded-2xl text-orange-500"><Calendar size={24} /></div>{PENDING_LEAVES.length > 0 && <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded-full">{PENDING_LEAVES.length} New</span>}</div>
                        <h2 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Requests</h2><p className="text-xs sm:text-sm text-neutral-500">Student approvals.</p>
                    </button>
                </section>

                {/* BOTTOM SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <div className="lg:col-span-2">
                        <ScheduleWidget />
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-10 h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-[0.2em]">Live Stream</h3>
                            <button onClick={() => addToast("Fetching full history...", "info")} className="text-indigo-400 text-xs font-bold hover:text-white transition-colors">VIEW ALL</button>
                        </div>
                        <div className="space-y-6 border-l border-white/10 ml-2 pl-8 relative">
                            {activityLog.map((item, i) => (
                                <div key={item.id} className="relative">
                                    <div className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[#0A0A0A] border border-white/20 flex items-center justify-center`}><div className="w-2 h-2 rounded-full bg-white/20" /></div>
                                    <p className="text-[10px] font-mono text-neutral-500 mb-1">{item.time}</p>
                                    <h4 className="font-bold text-white text-sm flex items-center gap-2">{item.action} <item.icon size={14} className={item.color} /></h4>
                                    <p className="text-xs text-neutral-400 mt-1">{item.detail}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* MODALS */}
            <AnimatePresence>
                {currentView === 'attendance' && <AttendanceRegister classId={selectedClass} onClose={() => router.back()} onLog={handleLogActivity} />}
                {currentView === 'gradebook' && <Gradebook classId={selectedClass} onClose={() => router.back()} onLog={handleLogActivity} />}
                {currentView === 'leaves' && <LeaveInbox onClose={() => router.back()} onLog={handleLogActivity} />}
                {currentView === 'request_leave' && <TeacherLeaveRequestModal onClose={() => router.back()} />}
                {currentView === 'broadcast' && <BroadcastComposer classId={selectedClass} onClose={() => router.back()} onLog={handleLogActivity} />}
                {currentView === 'profile' && <TeacherProfile onClose={() => router.back()} />}
                {currentView === 'doubts' && <DoubtResolutionModal onClose={() => router.back()} onLog={handleLogActivity} />}
                {currentView === 'ai_chat' && <TeacherAiChat onClose={() => router.back()} />}
            </AnimatePresence>
        </div>
    );
};

export default function TeacherDashboard() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-neutral-500 font-mono text-xs uppercase tracking-widest">Loading Command Center...</div>}>
            <TeacherDashboardContent />
        </Suspense>
    );
}