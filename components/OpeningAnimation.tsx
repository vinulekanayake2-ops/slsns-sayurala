"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

export default function OpeningAnimation({ children }: { children: React.ReactNode }) {
    const [showCurtain, setShowCurtain] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCurtain(false);
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    // Common Content Component to ensure perfect duplication
    const CurtainContent = () => (
        <div className="flex flex-col items-center justify-center p-10 h-screen w-screen">
            <div className="relative w-40 h-40 mb-8 drop-shadow-2xl">
                <NextImage
                    src="/logo.png"
                    alt="SLNS Logo"
                    fill
                    className="object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                    priority
                />
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-gold-400 to-gold-600 font-heading uppercase drop-shadow-sm whitespace-nowrap">
                SLNS <span className="text-white">Sayurala</span>
            </h1>
            <div className="mt-4 flex items-center gap-4">
                <div className="h-[1px] w-24 bg-gold-500/50" />
                <p className="text-gold-200/80 tracking-[0.5em] text-xs font-semibold uppercase">Official Training Portal</p>
                <div className="h-[1px] w-24 bg-gold-500/50" />
            </div>
        </div>
    );

    // Common Background Component for split effect
    const CurtainBackground = () => (
        <div className="absolute inset-0 w-screen h-screen z-0">
            <NextImage
                src="/ship2.png"
                alt="Background"
                fill
                className="object-cover opacity-40 mix-blend-overlay"
                priority
            />
            <div className="absolute inset-0 bg-navy-950/80" />
        </div>
    );

    return (
        <div className="relative min-h-screen overflow-hidden">
            <AnimatePresence>
                {showCurtain && (
                    <div className="fixed inset-0 z-50 flex pointer-events-none">
                        {/* Left Curtain Panel */}
                        <motion.div
                            className="relative h-full w-1/2 bg-navy-950 border-r border-gold-600/30 overflow-hidden z-20"
                            initial={{ x: 0 }}
                            exit={{ x: "-100%", transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }}
                        >
                            {/* Split Background - Left Half */}
                            <div className="absolute top-0 left-0 w-[100vw] h-full flex items-center justify-center">
                                <CurtainBackground />
                            </div>

                            {/* Inner Container: Width 200% (screen width), Aligned to Left edge of this 50% container to show LEFT half */}
                            <div className="absolute top-0 left-0 w-[100vw] h-full flex items-center justify-center z-10">
                                <CurtainContent />
                            </div>

                            {/* Gradient Overlay for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 to-transparent opacity-50 z-20" />
                        </motion.div>

                        {/* Right Curtain Panel */}
                        <motion.div
                            className="relative h-full w-1/2 bg-navy-950 border-l border-gold-600/30 overflow-hidden z-20"
                            initial={{ x: 0 }}
                            exit={{ x: "100%", transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 } }}
                        >
                            {/* Split Background - Right Half */}
                            <div className="absolute top-0 right-0 w-[100vw] h-full flex items-center justify-center">
                                <CurtainBackground />
                            </div>

                            {/* Inner Container: Width 200% (screen width), Aligned to Right edge of this 50% container to show RIGHT half */}
                            <div className="absolute top-0 right-0 w-[100vw] h-full flex items-center justify-center z-10">
                                <CurtainContent />
                            </div>

                            {/* Gradient Overlay for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-l from-navy-900 to-transparent opacity-50 z-20" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content Reveal */}
            <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: showCurtain ? 0 : 1, scale: showCurtain ? 0.95 : 1 }}
                transition={{ duration: 1., delay: 0.8 }}
            >
                {children}
            </motion.div>
        </div>
    );
}
