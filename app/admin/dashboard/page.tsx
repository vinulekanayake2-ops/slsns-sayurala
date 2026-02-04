"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BarChart2, Activity, Search, LogOut, Clock, X, FileText, CheckCircle, Trash2 } from "lucide-react";
import { getAdminDashboardData, deleteUser, deleteAttempt } from "@/app/actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Mock Data / Types
interface User {
    id: string;
    officialId: string;
    name: string;
    status: string;
    liveProgress?: {
        module: string;
        current: number;
        total: number;
        percentage: number;
    };
    history: {
        id: string;
        module: string;
        score: number;
        total: number;
        startedAt: string;
        completedAt: string;
        duration: string;
    }[];
}

interface Attempt {
    id: string;
    user: string;
    module: string;
    score: number;
    total: number;
    date: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"users" | "history" | "live">("live");
    const [users, setUsers] = useState<User[]>([]);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const router = useRouter();

    // Real-time Updates (Polling)
    useEffect(() => {
        const fetchData = async () => {
            const result = await getAdminDashboardData();
            if (result.success) {
                // @ts-ignore
                setUsers(result.users);
                // @ts-ignore
                setAttempts(result.attempts);
            }
        };

        fetchData(); // Initial call
        const interval = setInterval(fetchData, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        router.push("/admin/login");
    };

    const handleDeleteUser = async (userId: string, userName: string) => {
        if (confirm(`Are you sure you want to delete user "${userName}"? This will also delete all their exam results.`)) {
            const res = await deleteUser(userId);
            if (res.success) {
                setUsers(users.filter(u => u.id !== userId));
                // Also remove from attempts if locally present, though next fetch will clean it
                setAttempts(attempts.filter(a => a.user !== userName)); // Note: Attempt has user name/officialId, but we might need more robust linking if real-time update needed
                // Ideally refresh data
                const result = await getAdminDashboardData();
                if (result.success) {
                    // @ts-ignore
                    setUsers(result.users);
                    // @ts-ignore
                    setAttempts(result.attempts);
                }
            } else {
                alert("Failed to delete user");
            }
        }
    };

    const handleDeleteAttempt = async (attemptId: string) => {
        if (confirm("Are you sure you want to delete this result?")) {
            const res = await deleteAttempt(attemptId);
            if (res.success) {
                setAttempts(attempts.filter(a => a.id !== attemptId));
            } else {
                alert("Failed to delete result");
            }
        }
    };

    return (
        <main className="min-h-screen bg-navy-900 text-steel-100 relative overflow-hidden flex flex-col">

            {/* Background Decor - Consistent with Login */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/ship.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                {/* Stronger overlay for readability of data */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-950/90 to-navy-900/90" />
            </div>

            {/* User Details Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedUser(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-navy-800 border border-gold-600/30 rounded-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-navy-600 flex justify-between items-start bg-navy-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-white font-heading tracking-wide flex items-center gap-3">
                                        <Users className="w-6 h-6 text-gold-500" />
                                        {selectedUser.name}
                                    </h2>
                                    <p className="text-gold-500/80 font-mono mt-1 text-sm tracking-widest">OFFICIAL ID: {selectedUser.officialId}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="p-2 hover:bg-navy-700 rounded-full text-steel-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                <h3 className="text-sm font-bold text-steel-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gold-500" />
                                    Performance History
                                </h3>

                                {selectedUser.history && selectedUser.history.length > 0 ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-navy-900/50 text-xs text-steel-400 uppercase tracking-wider border-b border-navy-700">
                                                <th className="p-4 font-semibold">Module</th>
                                                <th className="p-4 font-semibold">Result</th>
                                                <th className="p-4 font-semibold">Started</th>
                                                <th className="p-4 font-semibold">Completed</th>
                                                <th className="p-4 font-semibold text-right">Duration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-navy-700/30 text-sm">
                                            {selectedUser.history.map((attempt) => (
                                                <tr key={attempt.id} className="hover:bg-navy-700/20 transition-colors">
                                                    <td className="p-4 text-steel-100 font-medium">{attempt.module}</td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded border ${(attempt.score / attempt.total) >= 0.5
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                            : "bg-red-500/10 border-red-500/20 text-red-400"
                                                            }`}>
                                                            <span className="font-bold">{attempt.score}</span>
                                                            <span className="text-xs opacity-70">/ {attempt.total}</span>
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-steel-400 font-mono text-xs">{attempt.startedAt}</td>
                                                    <td className="p-4 text-steel-400 font-mono text-xs">{attempt.completedAt}</td>
                                                    <td className="p-4 text-right font-mono text-gold-400/80 flex items-center justify-end gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        {attempt.duration}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-12 text-center border border-dashed border-navy-600 rounded-lg bg-navy-900/20">
                                        <p className="text-steel-500 italic">No assessment history found for this officer.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#112240_1px,transparent_1px),linear-gradient(to_bottom,#112240_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none z-0" />

            {/* Top Navigation Bar */}
            <header className="relative z-20 bg-navy-950/80 backdrop-blur-md border-b border-navy-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12">
                            <Image
                                src="/logo.png"
                                alt="SLNS Logo"
                                fill
                                className="object-contain drop-shadow-md"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white font-heading tracking-wider">COMMAND DASHBOARD</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-8 bg-gold-600/50" />
                                <p className="text-gold-500/80 text-[10px] uppercase tracking-[0.2em] font-medium">Official Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="px-3 py-1.5 bg-navy-900/50 rounded-full border border-navy-700 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] uppercase font-bold text-steel-300 tracking-wider">System Online</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Sidebar Navigation */}
                <nav className="lg:col-span-3 space-y-3">
                    <div className="bg-navy-800/50 backdrop-blur-sm border border-navy-600/50 rounded-lg p-4 shadow-xl">
                        <p className="text-xs font-semibold text-steel-400 uppercase tracking-widest mb-4 pl-2">Modules</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => setActiveTab("live")}
                                className={`w-full flex items-center gap-3 p-3 rounded-md transition-all border ${activeTab === "live"
                                    ? "bg-navy-700 border-gold-600/50 text-gold-400 shadow-md"
                                    : "bg-transparent border-transparent hover:bg-navy-700/50 text-steel-300 hover:text-white"
                                    }`}
                            >
                                <Activity className="w-4 h-4 animate-pulse" />
                                <span className="text-sm font-bold tracking-wide">Live Monitor</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`w-full flex items-center gap-3 p-3 rounded-md transition-all border ${activeTab === "users"
                                    ? "bg-navy-700 border-gold-600/50 text-gold-400 shadow-md"
                                    : "bg-transparent border-transparent hover:bg-navy-700/50 text-steel-300 hover:text-white"
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-bold tracking-wide">Personnel Status</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`w-full flex items-center gap-3 p-3 rounded-md transition-all border ${activeTab === "history"
                                    ? "bg-navy-700 border-gold-600/50 text-gold-400 shadow-md"
                                    : "bg-transparent border-transparent hover:bg-navy-700/50 text-steel-300 hover:text-white"
                                    }`}
                            >
                                <BarChart2 className="w-4 h-4" />
                                <span className="text-sm font-bold tracking-wide">Assessment Logs</span>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Content Area */}
                <section className="lg:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-navy-800/80 backdrop-blur-md border border-navy-600/50 rounded-lg overflow-hidden shadow-2xl"
                    >
                        {/* Tab Header */}
                        <div className="px-6 py-4 border-b border-navy-700/50 flex justify-between items-center bg-navy-900/30">
                            <h2 className="text-lg font-bold text-white tracking-wide uppercase flex items-center gap-2">
                                {activeTab === "live" && <><Activity className="w-5 h-5 text-gold-500" /> Live Operations</>}
                                {activeTab === "users" && <><Users className="w-5 h-5 text-gold-500" /> Personnel Database</>}
                                {activeTab === "history" && <><BarChart2 className="w-5 h-5 text-gold-500" /> Assessment History</>}
                            </h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 w-4 h-4 text-navy-400" />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    className="pl-10 pr-4 py-2 bg-navy-950/50 border border-navy-700 rounded-full text-xs text-steel-100 placeholder-navy-400 focus:outline-none focus:border-gold-600/50 transition-colors w-64"
                                />
                            </div>
                        </div>

                        {activeTab === "live" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {users.filter(u => u.liveProgress).length === 0 ? (
                                        <div className="col-span-full p-12 text-center text-steel-500 italic border border-dashed border-navy-700 rounded-lg">
                                            No ongoing assessments at this moment.
                                        </div>
                                    ) : (
                                        users.filter(u => u.liveProgress).map(user => (
                                            <div key={user.id} className="bg-navy-900/50 border border-navy-700 rounded-xl p-6 shadow-lg relative overflow-hidden group hover:border-gold-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">{user.name}</h3>
                                                        <p className="text-gold-500 font-mono text-xs">{user.officialId}</p>
                                                    </div>
                                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase animate-pulse">
                                                        Active
                                                    </span>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <div className="flex justify-between text-xs text-steel-400 mb-1">
                                                            <span>Module</span>
                                                            <span className="text-white font-medium">{user.liveProgress?.module}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-steel-400 mb-1">
                                                            <span>Progress</span>
                                                            <span className="text-gold-400 font-mono">{user.liveProgress?.current} / {user.liveProgress?.total}</span>
                                                        </div>
                                                    </div>

                                                    <div className="h-2 bg-navy-950 rounded-full overflow-hidden border border-navy-800">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.3)] transition-all duration-1000 ease-out"
                                                            style={{ width: `${user.liveProgress?.percentage}%` }}
                                                        />
                                                    </div>

                                                    <div className="pt-2 border-t border-navy-800 flex justify-between items-center">
                                                        <span className="text-[10px] text-steel-500">Started just now</span>
                                                        <span className="text-xl font-bold text-white">{user.liveProgress?.percentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "users" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-navy-900/50 text-xs uppercase tracking-wider text-steel-400 font-semibold border-b border-navy-700">
                                            <th className="px-6 py-4">Official No</th>
                                            <th className="px-6 py-4">Name & Rank</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-700/30">
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-steel-500 text-sm">
                                                    No active personnel found.
                                                </td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id} className="group hover:bg-navy-700/20 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-gold-400 text-sm">{user.officialId}</td>
                                                    <td className="px-6 py-4 text-steel-100 font-medium text-sm">{user.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${user.status.includes("In Quiz")
                                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                            : user.status === "Active"
                                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                                : "bg-navy-900 text-steel-500 border-navy-700"
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status.includes("In Quiz") ? "bg-blue-400 animate-pulse" :
                                                                user.status === "Active" ? "bg-emerald-400" : "bg-steel-500"
                                                                }`}></span>
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedUser(user)}
                                                            className="text-[10px] font-bold text-gold-500/80 hover:text-gold-400 uppercase tracking-wider border border-gold-600/30 hover:border-gold-500 px-3 py-1 rounded-sm transition-all"
                                                        >
                                                            Details
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "history" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-navy-900/50 text-xs uppercase tracking-wider text-steel-400 font-semibold border-b border-navy-700">
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Module</th>
                                            <th className="px-6 py-4 text-center">Score</th>
                                            <th className="px-6 py-4 text-right">Result</th>
                                            <th className="px-6 py-4 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-700/30">
                                        {attempts.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-steel-500 text-sm">
                                                    No assessment history available.
                                                </td>
                                            </tr>
                                        ) : (
                                            attempts.map((attempt) => (
                                                <tr key={attempt.id} className="hover:bg-navy-700/20 transition-colors">
                                                    <td className="px-6 py-4 text-steel-400 text-xs font-mono">{attempt.date}</td>
                                                    <td className="px-6 py-4 text-gold-400 font-mono text-sm">{attempt.user}</td>
                                                    <td className="px-6 py-4 text-steel-100 text-sm">{attempt.module}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-white font-bold">{attempt.score}</span>
                                                        <span className="text-steel-600 text-xs"> / {attempt.total}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-mono font-bold text-sm ${(attempt.score / attempt.total) >= 0.5 ? "text-emerald-400" : "text-red-400"
                                                            }`}>
                                                            {Math.round((attempt.score / attempt.total) * 100)}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteAttempt(attempt.id)}
                                                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                                            title="Delete Result"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
