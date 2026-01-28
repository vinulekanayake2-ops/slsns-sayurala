"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Lock } from "lucide-react";
import Image from "next/image";
import { loginAdmin } from "@/app/actions";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate network delay for professional feel (optional, but keep for UX consistency)
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === "admin" && password === "admin") {
            // Call server action to set cookie
            try {
                await loginAdmin();
                router.push("/admin/dashboard");
            } catch (err) {
                console.error("Login action failed", err);
                setError("System Error: Could not establish session");
                setLoading(false);
            }
        } else {
            setError("Access Denied: Invalid Credentials");
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-navy-900 relative">

            {/* Background Decor - consistent with main login */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ship.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-40 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/30" />
            </div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#112240_1px,transparent_1px),linear-gradient(to_bottom,#112240_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

            <motion.div
                className="z-10 w-full max-w-[400px] bg-navy-800 border border-navy-600 shadow-2xl rounded-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header Section */}
                <div className="bg-navy-950 p-8 pb-6 text-center border-b border-navy-700 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-900 via-gold-600 to-navy-900" />
                    <div className="flex justify-center mb-4">
                        <div className="relative w-20 h-20">
                            <Image
                                src="/logo.png"
                                alt="Admin Portal Logo"
                                fill
                                className="object-contain drop-shadow-md"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-heading tracking-widest uppercase mb-1">
                        Admin Portal
                    </h1>
                    <p className="text-gold-500/80 text-xs tracking-[0.2em] uppercase font-medium">
                        System Configuration
                    </p>
                </div>

                {/* Form Section */}
                <div className="p-8 pt-6 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-steel-200 uppercase tracking-wider">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-600/50 group-focus-within:bg-gold-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2.5 bg-navy-900 border border-navy-600 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all rounded-sm font-mono text-sm"
                                    placeholder="ENTER USERNAME"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-steel-200 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-600/50 group-focus-within:bg-gold-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-8 pr-4 py-2.5 bg-navy-900 border border-navy-600 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all rounded-sm font-mono text-sm"
                                    placeholder="ENTER PASSWORD"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-red-400 text-xs text-center font-medium bg-red-900/10 py-2 rounded border border-red-900/30 flex items-center justify-center gap-2"
                            >
                                <ShieldAlert className="w-3 h-3" />
                                <error>
                                    {error}
                                </error>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-4 bg-navy-700 hover:bg-gold-600 hover:text-navy-950 text-gold-500 font-bold rounded-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-gold-600/30 hover:border-gold-600"
                        >
                            {loading ? "Authenticating..." : "Establish Session"}
                            {!loading && <Lock className="w-4 h-4 opacity-80" />}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 bg-navy-950/50 border-t border-navy-700 text-center">
                    <p className="text-[10px] text-navy-500 uppercase tracking-wider font-semibold">
                        Restricted Access Area
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
