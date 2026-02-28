"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Terminal } from "lucide-react";

export default function SystemErrorPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-neutral-500 flex flex-col items-center justify-center p-6 font-mono">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full"
            >
                <div className="mb-8 flex items-center gap-3 text-rose-500/50">
                    <AlertTriangle size={24} />
                    <span className="text-[10px] uppercase font-black tracking-[0.3em]">Critical Exception</span>
                </div>

                <h1 className="text-2xl font-black text-neutral-200 mb-4 tracking-tighter">
                    Error 503: Service Unavailable
                </h1>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl mb-8 space-y-3">
                    <p className="text-[11px] leading-relaxed">
                        <span className="text-rose-500/50 mr-2">▶</span>
                        Uplink to regional cluster <span className="text-neutral-300">AP-SOUTH-1</span> timed out.
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        <span className="text-rose-500/50 mr-2">▶</span>
                        Instance handshake failed: <span className="text-neutral-300">ERR_NODE_SUSPENDED</span>
                    </p>
                    <p className="text-[11px] leading-relaxed">
                        <span className="text-rose-500/50 mr-2">▶</span>
                        Data packet integrity check: <span className="text-rose-500">FAILED</span>
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                    >
                        <RefreshCcw size={14} /> Retry Connection
                    </button>

                    <p className="text-[9px] text-center px-6 leading-loose opacity-40 uppercase tracking-wider">
                        If this persists, please contact your institute administration for technical clearance.
                    </p>
                </div>
            </motion.div>

            {/* Background Glitch Effect */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
}