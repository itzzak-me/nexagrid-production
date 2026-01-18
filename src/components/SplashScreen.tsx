"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // 1. Force Lock immediately
        document.body.style.overflow = "hidden";

        // 2. Ensure it STAYS hidden even if React re-renders in Dev mode
        const lockScroll = () => {
            document.body.style.overflow = "hidden";
        };
        window.addEventListener('scroll', lockScroll);

        const timer = setTimeout(() => {
            setIsVisible(false);

            // 3. ONLY Unlock after the animation is actually done
            document.body.style.overflow = "auto";
            document.body.style.overflowX = "hidden"; // Keep X hidden
            window.removeEventListener('scroll', lockScroll);
        }, 2500);

        return () => {
            clearTimeout(timer);
            // DO NOT UNLOCK HERE in Dev Mode context
            // We rely on the natural lifecycle or the specific timeout completion
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overscroll-none touch-none" // touch-none prevents mobile scrolling
                    onTouchMove={(e) => e.preventDefault()} // Hard block for mobile touch
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        {/* Logo Icon */}
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.4)] mb-6">
                            <Zap size={48} className="text-white fill-white" />
                        </div>

                        {/* App Name */}
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">NexGen OS</h1>
                        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">Total Intelligence</p>
                    </motion.div>

                    {/* Bottom Loader */}
                    <div className="absolute bottom-12 w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}