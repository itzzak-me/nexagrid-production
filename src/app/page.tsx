"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Atom, ArrowRight, Lock, User, Shield,
  Loader2, Zap, CheckCircle2, LayoutGrid
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
// Absolute path bypass - using direct relative import
import { login } from "./auth-actions";

// --- DYNAMIC BACKGROUND SYSTEM ---
const SciFiBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute inset-0"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }}
    />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 blur-[120px] rounded-full mix-blend-screen" />
  </div>
);

export default function LoginPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(0); // 0: Idle, 1: Auth, 2: Success

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Credentials required for uplink", "error");
      return;
    }

    setIsLoading(true);
    setLoginStep(1);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const result = await login(formData);

      if (result?.error) {
        addToast(result.error, "error");
        setLoginStep(0);
        setIsLoading(false);
      } else {
        // Redirect is handled by the Server Action on success
        setLoginStep(2);
        addToast("Identity Verified. Accessing Grid...", "success");
      }
    } catch (err) {
      addToast("Quantum Link Interrupted. Try again.", "error");
      setLoginStep(0);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center relative selection:bg-indigo-500 selection:text-white">
      <SciFiBackground />

      <main className="w-full max-w-md p-6 relative z-10">

        {/* LOGO SECTION */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl"
          >
            <Atom size={32} className="text-white" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-black tracking-tighter mb-1"
          >
            Nexa<span className="text-indigo-500">Grid</span>
          </motion.h1>
          <div className="flex items-center justify-center mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-widest uppercase">Grid Online</span>
            </div>
          </div>
        </div>

        {/* SECURE ACCESS CARD */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/[0.03] border border-white/[0.05] p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Transition Overlays */}
          <AnimatePresence>
            {loginStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-[#050505]/80 flex flex-col items-center justify-center backdrop-blur-sm">
                <Loader2 size={40} className="text-indigo-500 animate-spin mb-4" />
                <p className="text-xs font-mono text-indigo-400 animate-pulse uppercase tracking-widest">Decrypting Identity...</p>
              </motion.div>
            )}
            {loginStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-emerald-500/10 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  <CheckCircle2 size={32} className="text-black" />
                </div>
                <p className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Uplink Established</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Email Access</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexgenos.in"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-neutral-700 font-mono"
                />
                <User size={18} className="absolute left-4 top-4 text-neutral-600" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Passkey</label>
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
              Initialize Uplink <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* SYSTEM TRUST & STATUS PANEL */}
          <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Security Protocol</span>
              <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:border-indigo-500/20 transition-all duration-500">
                <Shield className="text-indigo-400 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Data Layer</p>
                <p className="text-[11px] text-neutral-300 font-mono mt-0.5">AES-256 Encrypted</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:border-amber-500/20 transition-all duration-500">
                <LayoutGrid className="text-amber-400 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Architecture</p>
                <p className="text-[11px] text-neutral-300 font-mono mt-0.5">Multi-Tenant v1.0</p>
              </div>
            </div>

            {/* THE AI COMPLIANCE BLOCK */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Zap size={14} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em]">Neural Link Status</p>
                <p className="text-[10px] text-neutral-400">Nexa AI Core • Engineered via Google Vertex</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BRAND FOOTER */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-[10px] text-neutral-600 font-mono tracking-widest uppercase">Secure Grid Access v1.0</p>
          <p className="text-[10px] font-bold text-neutral-500 tracking-wider uppercase">POWERED BY NEXGEN OPERATING SYSTEMS INDIA</p>
        </div>
      </main>
    </div>
  );
}