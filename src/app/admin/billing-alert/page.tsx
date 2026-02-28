"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, CreditCard, MessageSquare, ArrowRight } from "lucide-react";

export default function BillingAlertPage() {
    return (
        <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-6">
            {/* Ambient Red Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-lg w-full bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl relative z-10"
            >
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8">
                    <ShieldAlert className="text-rose-500" size={32} />
                </div>

                <h1 className="text-3xl font-black tracking-tight mb-2">Service Restricted</h1>
                <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
                    The NexaGrid license for this institute has been temporarily deactivated due to a pending billing cycle or administrative hold.
                    <span className="block mt-2 font-bold text-rose-400">Student and Faculty access is currently offline.</span>
                </p>

                <div className="space-y-3 mb-10">
                    <button className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-neutral-200 transition-all active:scale-95">
                        <CreditCard size={18} /> Settle Outstanding Fees
                    </button>

                    <button className="w-full py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center justify-center gap-3">
                        <MessageSquare size={18} /> Contact NexGen OS Support
                    </button>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                    <span>Incident Ref: NX-882-SUS</span>
                    <span className="flex items-center gap-2">Protocol: 403 <ArrowRight size={10} /></span>
                </div>
            </motion.div>
        </div>
    );
}