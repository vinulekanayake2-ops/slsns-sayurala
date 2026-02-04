"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/app/actions";
import {
    Compass, Wrench, Zap, Anchor, Radio, Crosshair,
    Package, Users, ShieldAlert, Ship, LogOut
} from "lucide-react";
import ModuleCard from "@/components/ModuleCard";
import { motion } from "framer-motion";

const MODULES = [
    { id: "navigation", name: "Navigation", icon: Compass },
    { id: "marine-engineering", name: "Marine Engineering", icon: Wrench },
    { id: "electrical-engineering", name: "Electrical Engineering", icon: Zap },
    { id: "seamanship", name: "Seamanship", icon: Anchor },
    { id: "communication", name: "Communication", icon: Radio },
    { id: "gunnery", name: "Gunnery", icon: Crosshair },
    { id: "logistics", name: "Logistics", icon: Package },
    { id: "divisional-duties", name: "Divisional Duties", icon: Users },
    { id: "nbcd", name: "NBCD", icon: ShieldAlert }, // NBCD = Nuclear Biological Chemical Defence
    { id: "myship", name: "General", icon: Ship },
];

export default function ModulesPage() {
    const router = useRouter();

    const handleModuleSelect = (moduleId: string) => {
        // Navigate to quiz start page or direct to quiz
        router.push(`/quiz/${moduleId}`);
    };

    const handleLogout = async () => {
        localStorage.removeItem("user");
        await logoutUser();
        router.push("/");
    };

    return (
        <main className="min-h-screen p-8 bg-navy-900 text-steel-100 relative overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-navy-800/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col items-center justify-center space-y-3 py-10 relative">
                    <button
                        onClick={handleLogout}
                        className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-all text-sm font-bold uppercase tracking-wider"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl font-bold text-gold-500 font-heading tracking-widest text-center"
                    >
                        SLNS SAYURALA
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-steel-200 uppercase tracking-widest text-sm"
                    >
                        Select a training module to begin
                    </motion.p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                    {MODULES.map((module, index) => (
                        <ModuleCard
                            key={module.id}
                            id={module.id}
                            name={module.name}
                            icon={module.icon}
                            index={index}
                            onClick={() => handleModuleSelect(module.id)}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
