"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
    id: string;
    name: string;
    icon: LucideIcon;
    onClick: () => void;
    index: number;
}

export default function ModuleCard({ id, name, icon: Icon, onClick, index }: ModuleCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
            whileHover={{
                scale: 1.02,
                y: -2,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative flex flex-col items-center justify-center p-6 h-48 bg-navy-800 border border-navy-600 hover:border-gold-500 rounded-sm cursor-pointer overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg"
        >
            {/* Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900 opacity-100" />

            {/* Hover Highlight (Subtle) */}
            <div className="absolute inset-0 bg-gold-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <motion.div
                className="z-10 p-4 mb-3 rounded-sm bg-navy-900 border border-navy-700 group-hover:border-gold-500/50 transition-all duration-300"
            >
                <Icon className="w-8 h-8 text-steel-200 group-hover:text-gold-500 transition-colors" />
            </motion.div>

            <h3 className="z-10 text-center text-sm font-bold text-steel-100 group-hover:text-white tracking-widest font-heading uppercase">
                {name}
            </h3>

            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-hover:bg-gold-500 transition-colors duration-300" />
        </motion.div>
    );
}
