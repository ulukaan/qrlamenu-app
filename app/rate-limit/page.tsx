"use client";
import React from "react";
import { motion } from "framer-motion";
import { Timer, AlertCircle, RefreshCw, Home, MessageCircle } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TrustLogos from "@/components/TrustLogos";

export default function RateLimitPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fafafa] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-orange-100 selection:text-orange-900">

            {/* Ultra Premium Background Elements (Mesh Gradient) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-slate-200/40 blur-[130px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-100/30 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] left-[25%] w-[15%] h-[15%] rounded-full bg-orange-50 blur-[90px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[520px] relative z-10 text-center"
            >
                {/* Icon Container */}
                <div className="relative mb-8 inline-block">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="w-24 h-24 bg-white rounded-[32px] shadow-2xl shadow-orange-500/10 flex items-center justify-center border border-white relative z-10"
                    >
                        <Timer className="text-orange-600 w-12 h-12" strokeWidth={1.5} />
                    </motion.div>

                    {/* Ring animations */}
                    <div className="absolute -inset-4 bg-orange-100/30 rounded-full blur-2xl animate-pulse -z-10" />
                    <motion.div
                        animate={{
                            rotate: 360
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute inset-0 border-2 border-dashed border-orange-200/50 rounded-full -m-6"
                    />
                </div>

                {/* Main Content Card with Glassmorphism */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-white p-10 md:p-14 mb-10 relative overflow-hidden">
                    {/* Subtle internal decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full blur-3xl -mr-16 -mt-16" />

                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                        稍微 <span className="text-orange-600">Mola</span> Verelim mi?
                    </h1>

                    <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100/50 flex items-start gap-4 mb-8 text-left">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <AlertCircle className="text-orange-500 w-5 h-5" />
                        </div>
                        <p className="text-[15px] text-slate-600 font-medium leading-relaxed">
                            Sistem güvenliğiniz için kısa süreli bir koruma devreye girdi. Çok fazla işlem denendiği için sistem sizi 1 dakika dinlenmeye davet ediyor.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="group w-full h-[64px] flex justify-center items-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all overflow-hidden relative"
                        >
                            <span className="flex items-center gap-2.5 relative z-10">
                                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                                Sayfayı Yenile
                            </span>
                        </button>

                        <a
                            href="/"
                            className="w-full h-[64px] flex justify-center items-center rounded-2xl bg-white border border-slate-200 text-lg font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
                        >
                            <span className="flex items-center gap-2.5">
                                <Home size={20} />
                                Ana Sayfaya Dön
                            </span>
                        </a>
                    </div>
                </div>

                {/* Secure Trust Badges & Contact */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center justify-center gap-8 text-[14px] font-bold">
                        <a href="https://wa.me/905314660550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-all">
                            <MessageCircle size={18} /> Destek Alın
                        </a>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-slate-300 uppercase tracking-[0.2em] text-[10px]">Güvenlik Kalkanı Aktif</span>
                    </div>
                </div>
            </motion.div>

            <div className="mt-auto py-8 relative z-10">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.4em] text-center">
                    MESA Cloud Infrastructure — © {new Date().getFullYear()}
                </p>
            </div>

            <WhatsAppWidget />
            <TrustLogos />
        </div>
    );
}
