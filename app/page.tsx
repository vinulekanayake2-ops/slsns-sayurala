"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Anchor } from "lucide-react";
import { loginUser } from "./actions";
import Image from "next/image";

export default function Home() {
  const [officialId, setOfficialId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginUser(officialId, name);
      if (result.success) {
        // Backup in localStorage for client-side easy access
        localStorage.setItem("user", JSON.stringify({ officialId, name, id: result.userId }));
        router.push("/modules");
      } else {
        console.error(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.error("Login failed", err);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-navy-900 relative">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ship.png"
          alt="SLNS Sayurala Ship"
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        {/* Lighter Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-navy-900/30" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-steel-DEFAULT/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-navy-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-gold-600/5 rounded-full blur-[80px]"></div>
      </div>
      <motion.div
        className="z-10 w-full max-w-[400px] bg-navy-800 border border-navy-600 shadow-2xl rounded-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.5 }}
      >
        {/* Header Section */}
        <div className="bg-navy-950 p-8 pb-6 text-center border-b border-navy-700 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-900 via-gold-600 to-navy-900" />
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <Image
                src="/logo.png"
                alt="SLNS Sayurala Logo"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-heading tracking-widest uppercase mb-1">
            SLNS Sayurala
          </h1>
          <p className="text-gold-500/80 text-xs tracking-[0.2em] uppercase font-medium">
            Training Portal
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8 pt-6 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="officialId" className="block text-xs font-semibold text-steel-200 uppercase tracking-wider">
                Official No
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-600/50 group-focus-within:bg-gold-500 transition-colors" />
                </div>
                <input
                  id="officialId"
                  type="text"
                  required
                  value={officialId}
                  onChange={(e) => setOfficialId(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-navy-900 border border-navy-600 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all rounded-sm font-mono text-sm"
                  placeholder="ENTER NO"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs font-semibold text-steel-200 uppercase tracking-wider">
                Name & Rank
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-600/50 group-focus-within:bg-gold-500 transition-colors" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-navy-900 border border-navy-600 text-white placeholder-navy-500 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all rounded-sm font-sans text-sm"
                  placeholder="NAME"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gold-600 hover:bg-gold-500 text-navy-950 font-bold rounded-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-transparent hover:border-gold-400"
            >
              {loading ? "Verifying..." : "Access System"}
              {!loading && <ShieldCheck className="w-4 h-4 opacity-80" />}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-navy-950/50 border-t border-navy-700 text-center">
          <p className="text-[10px] text-navy-500 uppercase tracking-wider font-semibold">
            Authorized Use Only
          </p>
        </div>
      </motion.div>
    </main >
  );
}
