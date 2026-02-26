"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Atom, ArrowRight, Lock, User, Shield,
  ChevronRight, Loader2, Zap, LayoutGrid, CheckCircle2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// --- BACKGROUND COMPONENT ---
const SciFiBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Grid Layer */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}
    />

    {/* Glowing Orbs */}
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full mix-blend-screen" />
  </div>
);

// --- LOGIN PAGE COMPONENT ---
export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(0); // 0: Idle, 1: Authenticating, 2: Success

  // DEMO CREDENTIALS SHORTCUTS
  const demoUsers = [
    { role: "Student", id: "ST-003", pass: "nexgen", color: "from-blue-500 to-indigo-600", icon: User },
    { role: "Faculty", id: "TR-PHY-01", pass: "nexgen", color: "from-emerald-500 to-teal-600", icon: Zap },
    { role: "Admin", id: "ADM-001", pass: "nexgen", color: "from-amber-500 to-orange-600", icon: Shield },
  ];

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId || !password) {
      addToast("Please enter credentials", "error");
      return;
    }

    setIsLoading(true);
    setLoginStep(1);

    // Simulate Network Delay
    await new Promise(r => setTimeout(r, 1500));

    // ROUTING LOGIC
    let targetRoute = "";
    if (userId.startsWith("ST")) targetRoute = "/student";
    else if (userId.startsWith("TR") || userId.startsWith("FAC")) targetRoute = "/teacher";
    else if (userId.startsWith("ADM")) targetRoute = "/admin";
    else {
      addToast("Invalid Identity Protocol", "error");
      setIsLoading(false);
      setLoginStep(0);
      return;
    }

    setLoginStep(2);
    addToast("Identity Verified. Establishing Uplink...", "success");

    setTimeout(() => {
      router.push(targetRoute);
    }, 1000);
  };

  const fillDemo = (u: any) => {
    setUserId(u.id);
    setPassword(u.pass);
    addToast(`${u.role} Credentials Auto-filled`, "info");
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative selection:bg-indigo-500 selection:text-white">
      <SciFiBackground />

      <main className="w-full max-w-md p-6 relative z-10">

        {/* LOGO & HEADER */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl"
          >
            <Atom size={32} className="text-white" />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tighter mb-1"
          >
            Nexa<span className="text-indigo-500">Grid</span>
          </motion.h1>

          {/* Aesthetic Brand Status Badge instead of a Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mt-3"
          >
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase">Grid Online</span>
            </div>
          </motion.div>
        </div>

        {/* LOGIN CARD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/[0.05] p-8 rounded-[2rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Loading Overlay */}
          <AnimatePresence>
            {loginStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-[#050505]/80 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-indigo-400 animate-pulse">VERIFYING BIOMETRICS...</p>
              </motion.div>
            )}
            {loginStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-emerald-500/10 flex flex-col items-center justify-center backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 size={32} className="text-black" />
                </div>
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Access Granted</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">User Identity</label>
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.toUpperCase())}
                  placeholder="ID (e.g., ST-003, TR-PHY-01)"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 font-mono tracking-wide"
                />
                <User size={18} className="absolute left-4 top-4 text-neutral-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Secure Passkey</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-neutral-700"
                />
                <Lock size={18} className="absolute left-4 top-4 text-neutral-600" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Initialize Session <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Access Grid */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[10px] text-neutral-600 text-center uppercase tracking-widest mb-4">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-3">
              {demoUsers.map((u) => (
                <button
                  key={u.role}
                  onClick={() => fillDemo(u)}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all group active:scale-95"
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center shadow-lg`}>
                    <u.icon size={14} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">
            Secure Connection • 256-Bit Encryption
          </p>
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">
            POWERED BY NEXGEN OPERATING SYSTEMS INDIA
          </p>
        </div>
      </main>
    </div>
  );
}