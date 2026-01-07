"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, GraduationCap, Shield, ChevronRight,
  Loader2, Zap, Globe, Lock
} from "lucide-react";
import { useConfig } from "@/context/ConfigContext";

export default function Gateway() {
  const router = useRouter();
  const { schoolName } = useConfig();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const portals = [
    {
      id: "student",
      role: "Student",
      label: "Scholar Access",
      desc: "Academic Core & Analytics",
      icon: User,
      color: "group-hover:text-blue-400",
      bg: "group-hover:bg-blue-500/10",
      border: "group-hover:border-blue-500/50",
      path: "/student"
    },
    {
      id: "teacher",
      role: "Teacher",
      label: "Faculty Command",
      desc: "Class Control & Gradebook",
      icon: GraduationCap,
      color: "group-hover:text-indigo-400",
      bg: "group-hover:bg-indigo-500/10",
      border: "group-hover:border-indigo-500/50",
      path: "/teacher"
    },
    {
      id: "admin",
      role: "Admin",
      label: "Institution Admin",
      desc: "Financials & Oversight",
      icon: Shield,
      color: "group-hover:text-amber-400",
      bg: "group-hover:bg-amber-500/10",
      border: "group-hover:border-amber-500/50",
      path: "/admin"
    }
  ];

  const handleLogin = (roleId: string, path: string) => {
    setLoadingRole(roleId);
    // Simulate secure handshake delay
    setTimeout(() => {
      router.push(path);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-500 selection:text-black">

      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* HEADER */}
      <div className="text-center mb-16 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <span className="font-black text-black text-xl">N</span>
          </div>
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4">
          NexGen <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">OS</span>
        </h1>
        <p className="text-sm font-mono text-neutral-500 uppercase tracking-[0.3em]">
          Total Intelligence Engine v16.1.1
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Systems Online</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Globe size={12} className="text-neutral-500" />
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Mumbai Server</span>
          </div>
        </div>
      </div>

      {/* LOGIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl relative z-10">
        {portals.map((portal) => (
          <button
            key={portal.id}
            onClick={() => handleLogin(portal.id, portal.path)}
            disabled={loadingRole !== null}
            className={`group relative h-80 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04] ${loadingRole === portal.id ? 'opacity-90 scale-[0.98]' : ''} ${portal.border}`}
          >
            {/* Hover Glow */}
            <div className={`absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${portal.id === 'student' ? 'from-blue-500/10' : portal.id === 'teacher' ? 'from-indigo-500/10' : 'from-amber-500/10'} to-transparent`} />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 bg-white/5 ${portal.bg} ${portal.color}`}>
                  {loadingRole === portal.id ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <portal.icon size={28} />
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{portal.role}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-1">{portal.label}</p>
                <p className="text-sm text-neutral-400 leading-relaxed">{portal.desc}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 group-hover:text-white transition-colors uppercase tracking-widest">
                Initialize <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="mt-20 text-[10px] font-mono text-neutral-600 uppercase tracking-[0.2em] flex gap-8">
        <span className="flex items-center gap-2"><Lock size={10} /> End-to-End Encrypted</span>
        <span>Build 2026.01.05</span>
      </footer>

    </div>
  );
}