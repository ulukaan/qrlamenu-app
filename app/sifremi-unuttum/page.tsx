"use client";
import { useState } from "react";
import { Loader2, Check, MessageCircle, Mail, KeyRound, ChevronLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TrustLogos from "@/components/TrustLogos";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.includes("@")) {
            setError("Geçerli bir e-posta adresi girin.");
            return;
        }

        setLoading(true);
        // Simüle edilmiş API isteği - arka planda gerçek logic ile bağlanabilir
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fafafa] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-orange-100 selection:text-orange-900">

            {/* Ultra Premium Background Elements (Mesh Gradient) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-slate-100/40 blur-[130px]" />
                <div className="absolute bottom-[0%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-100/30 blur-[130px] animate-pulse" />
                <div className="absolute top-[40%] left-[-10%] w-[25%] h-[25%] rounded-full bg-orange-50/40 blur-[100px]" />
            </div>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mb-8 text-center flex flex-col items-center"
            >
                <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-slate-100/50 flex items-center justify-center mb-6">
                    <KeyRound className="text-orange-600 w-9 h-9" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                    Parolanızı Sıfırlayın
                </h1>
                <p className="text-[16px] font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Kayıtlı e-posta adresinizi girin, güvenli sıfırlama bağlantısını anında gönderelim.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Reset Card with Glassmorphism */}
                <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-white p-8 md:p-12 mb-10 relative overflow-hidden group">

                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="space-y-6 relative z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <AnimatePresence mode="wait">
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="bg-red-50/50 text-red-600 text-[14px] font-semibold text-center p-3.5 rounded-2xl border border-red-100 flex items-center justify-center gap-2 mb-4"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="group relative">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-orange-600 transition-colors pointer-events-none">E-Posta Adresiniz</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={20} strokeWidth={1.5} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full bg-white/60 rounded-2xl border border-slate-200 pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-base outline-none font-medium shadow-sm"
                                            placeholder="ornek@isletme.com"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group w-full relative h-[60px] flex justify-center items-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {loading ? (
                                            <Loader2 size={24} className="animate-spin text-white/90" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Bağlantı Gönder <ArrowRight size={20} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-6 relative z-10"
                            >
                                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-3xl bg-green-50 border border-green-100/50 shadow-sm mb-6">
                                    <Check size={40} className="text-green-600" strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Bağlantı Gönderildi</h3>
                                <p className="text-[16px] text-slate-500 font-medium leading-relaxed">
                                    Sıfırlama bağlantısı <span className="text-slate-900 font-bold">{email}</span> adresinize iletildi.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 flex flex-col items-center border-t border-slate-50 pt-8 relative z-10">
                        <a href="/login" className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all font-bold text-sm tracking-wide uppercase group">
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            Giriş Ekranına Dön
                        </a>
                    </div>
                </div>

                {/* Footer Security / Support */}
                <div className="flex flex-col items-center space-y-5">
                    <div className="flex items-center justify-center gap-6 text-[14px] font-bold">
                        <a href="https://wa.me/905300000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-all">
                            <MessageCircle size={18} className="text-slate-300" /> WhatsApp
                        </a>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <a href="mailto:info@qrlamenu.com" className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all">
                            <Mail size={18} className="text-slate-300" /> Destek
                        </a>
                    </div>
                </div>
            </motion.div>

            <div className="mt-auto py-8 relative z-10">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.4em] text-center">
                    Güvenli Erişim — © {new Date().getFullYear()} QRlamenü
                </p>
            </div>

            <WhatsAppWidget />
            <TrustLogos />
        </div>
    );
}
