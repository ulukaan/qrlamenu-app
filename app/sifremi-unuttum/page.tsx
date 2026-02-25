"use client";
import { useState } from "react";
import { Loader2, Check, MessageCircle, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            <div className="mb-8 text-center">
                <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
                    Parolanızı Sıfırlayın
                </h1>
                <p className="text-[15px] font-normal text-slate-500 max-w-sm mx-auto">
                    Kayıtlı e-posta adresinizi girin, sıfırlama bağlantısını anında gönderelim.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px]"
            >
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 p-8 md:p-10 mb-8">
                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.form key="form" onSubmit={handleSubmit} className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            className="text-red-500 text-[15px] font-medium text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all text-[17px] font-normal outline-none"
                                        placeholder="Kurumsal E-posta"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#ea580c] py-3.5 px-4 text-[17px] font-semibold text-white hover:bg-[#e0681b] active:bg-[#cc5a14] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {loading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            "Bağlantı Gönder"
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 mb-4 border border-slate-100">
                                    <Check size={24} className="text-[#ea580c]" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[19px] font-semibold text-slate-900 mb-2 tracking-tight">E-posta gönderildi</h3>
                                <p className="text-[15px] text-slate-500 font-medium">
                                    Şifre sıfırlama bağlantısı {email} adresinize iletildi.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-col items-center border-t border-slate-100 pt-6 text-[15px]">
                        <a href="/login" className="text-slate-600 hover:text-[#ea580c] transition-colors font-medium">
                            Giriş Ekranına Dön
                        </a>
                    </div>
                </div>

                {/* Destek / İletişim Bilgileri */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center gap-6 text-[14px] text-slate-500 font-medium">
                        <a href="https://wa.me/905300000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors group">
                            <MessageCircle size={18} className="text-slate-400 group-hover:text-[#25D366] transition-colors" /> Destek Hattı
                        </a>
                        <a href="mailto:info@qrlamenu.com" className="flex items-center gap-1.5 hover:text-[#ea580c] transition-colors group">
                            <Mail size={18} className="text-slate-400 group-hover:text-[#ea580c] transition-colors" /> info@qrlamenu.com
                        </a>
                    </div>
                    <p className="text-[12px] text-slate-400 font-medium mt-6">
                        Telif Hakkı © {new Date().getFullYear()} QRlamenü. Tüm hakları saklıdır.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
