"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck } from "lucide-react";
import { BRAND_CONFIG } from "@/lib/branding"; // <--- IMPORT THE BRANDING CONFIG

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

        if (hasSeenSplash) {
            document.body.style.overflow = "auto";
            return;
        }

        setIsVisible(true);
        document.body.style.overflow = "hidden";
        sessionStorage.setItem("hasSeenSplash", "true");

        const lockScroll = () => { document.body.style.overflow = "hidden"; };
        window.addEventListener('scroll', lockScroll);

        const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden";
            window.removeEventListener('scroll', lockScroll);
        }, 2800); // Slightly increased for impact

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="fixed inset-0 z-[9999] bg-[#020202] flex flex-col items-center justify-center overscroll-none touch-none"
                onTouchMove={(e) => e.preventDefault()}
            >
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center relative z-10"
                >
                    {/* Logo Icon - Use BRAND_CONFIG if you want to swap the icon later */}
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.3)] mb-8 border border-white/10">
                        <Zap size={40} className="text-white fill-white" />
                    </div>

                    {/* Dynamic App Name from Branding File */}
                    <h1 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase">
                        {BRAND_CONFIG.shortName} <span className="text-indigo-500">OS</span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.4em]">
                            Initializing Neural Link
                        </p>
                    </div>
                </motion.div>

                {/* Industrial Bottom Loader */}
                <div className="absolute bottom-20 w-40 space-y-4">
                    <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2.2, ease: "circIn" }}
                        />
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest flex items-center gap-1">
                            <ShieldCheck size={8} /> Secure
                        </span>
                        <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest">
                            {BRAND_CONFIG.version || "v1.0.0"}
                        </span>
                    </div>
                </div>

                {/* Legal / Parent Company Tag */}
                <div className="absolute bottom-8">
                    <p className="text-[8px] font-bold text-neutral-800 uppercase tracking-[0.2em]">
                        Powered by {BRAND_CONFIG.parentCompany}
                    </p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}