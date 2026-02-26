"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QrCode, Eye, EyeOff, Loader2, MessageCircle, Mail, ShieldCheck, ChevronRight } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TrustLogos from "@/components/TrustLogos";
import { motion, AnimatePresence } from "framer-motion";

function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (res.ok) {
                    router.push(data.user?.role === "SUPER_ADMIN" ? "/super-admin" : redirect);
                } else {
                    setError(data.error || "Girdiğiniz e-posta veya parola yanlış.");
                }
            } else {
                setError(`Sunucu hatası. Lütfen daha sonra tekrar deneyin.`);
            }
        } catch (err: any) {
            setError(`Bağlantı hatası: Sunucuya ulaşılamıyor.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fafafa] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-orange-100 selection:text-orange-900">

            {/* Ultra Premium Background Elements (Mesh Gradient) */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/50 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-50/50 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-slate-100/50 blur-[100px]" />
            </div>

            {/* Header / Logo Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mb-8 text-center flex flex-col items-center"
            >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-orange-500/10 flex items-center justify-center mb-6 border border-slate-100/50">
                    <QrCode className="text-orange-600 w-10 h-10" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                    QRlamenü'ye Giriş Yapın
                </h1>
                <p className="text-[16px] font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
                    İşletmenizin dijital kalbine erişmek için bilgilerinizi girin.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Login Card with Glassmorphism */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-[28px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white p-8 md:p-11 mb-10 overflow-hidden relative group">

                    {/* Subtle internal glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50/50 text-red-600 text-[14px] font-semibold text-center p-3 rounded-xl border border-red-100 flex items-center justify-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <div className="group relative">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">E-Posta Adresi</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} strokeWidth={1.5} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full bg-white/50 rounded-2xl border border-slate-200/60 pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-base outline-none font-medium shadow-sm active:scale-[0.99]"
                                        placeholder="ornek@isletme.com"
                                    />
                                </div>
                            </div>

                            <div className="group relative">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">Parola</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors">
                                        <ShieldCheck size={20} strokeWidth={1.5} />
                                    </div>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full bg-white/50 rounded-2xl border border-slate-200/60 pl-12 pr-12 py-4 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-base outline-none font-medium shadow-sm active:scale-[0.99]"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onMouseEnter={() => setShowPass(true)}
                                        onMouseLeave={() => setShowPass(false)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-300 hover:text-orange-600 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                id="login-btn"
                                type="submit"
                                disabled={loading}
                                className="group w-full relative h-[60px] flex justify-center items-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {loading ? (
                                    <Loader2 size={24} className="animate-spin text-white/90" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sisteme Giriş Yap <ChevronRight size={20} />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-10 flex flex-col items-center gap-5 relative z-10">
                        <a href="/sifremi-unuttum" className="text-slate-400 hover:text-orange-600 transition-all font-semibold text-[14px] flex items-center gap-1.5 group">
                            <span className="w-0 group-hover:w-1 h-[1px] bg-orange-600 transition-all" />
                            Parolanızı mı unuttunuz?
                        </a>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
                        <p className="text-slate-500 font-semibold text-[15px]">
                            Henüz bize katılmadınız mı?{" "}
                            <a href="/kayit-ol" className="text-orange-600 hover:text-orange-700 transition-colors font-bold underline decoration-orange-200 underline-offset-4 decoration-2">
                                Yeni Hesap Oluşturun
                            </a>
                        </p>
                    </div>
                </div>

                {/* Secure Trust Badges & Contact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center space-y-6"
                >
                    <div className="flex items-center justify-center gap-8 text-[14px] font-bold">
                        <a href="https://wa.me/905314660550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-500 transition-all transform hover:scale-105">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                                <MessageCircle size={18} />
                            </div>
                            Destek
                        </a>
                        <div className="w-px h-4 bg-slate-200" />
                        <a href="mailto:info@qrlamenu.com" className="flex items-center gap-2 text-slate-400 hover:text-orange-500 transition-all transform hover:scale-105">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                                <Mail size={18} />
                            </div>
                            E-Posta
                        </a>
                    </div>
                </motion.div>
            </motion.div>

            <div className="mt-auto py-8 relative z-10">
                <p className="text-[12px] text-slate-300 font-bold uppercase tracking-widest text-center">
                    Güçlü Altyapı — Estetik Deneyim — © {new Date().getFullYear()}
                </p>
            </div>

            <WhatsAppWidget />
            <TrustLogos />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-orange-500 animate-spin opacity-20" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Yükleniyor</span>
                </div>
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
