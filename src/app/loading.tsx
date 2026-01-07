import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

            {/* Logo Pulse */}
            <div className="relative mb-8">
                <div className="w-16 h-16 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center animate-pulse">
                    {/* If you added the logo image, use <Image /> here too, otherwise this is the placeholder */}
                    <div className="w-8 h-8 bg-white rounded-md" />
                </div>
            </div>

            {/* Loading Text */}
            <div className="flex items-center gap-3 text-white">
                <Loader2 className="animate-spin text-indigo-500" size={20} />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                    Initializing Core...
                </span>
            </div>
        </div>
    );
}