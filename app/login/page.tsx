"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QrCode, Eye, EyeOff, Loader2, MessageCircle, Mail, User } from "lucide-react";
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
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            <div className="mb-8 text-center flex flex-col items-center">
                <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
                    QRlamenü'ye Giriş Yapın
                </h1>
                <p className="text-[15px] font-normal text-slate-500">
                    Devam etmek için hesap bilgilerinizi girin.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[420px]"
            >
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 p-8 md:p-10 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div className="space-y-4">
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

                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition-all text-[17px] font-normal outline-none pr-12"
                                    placeholder="Parola"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                                    onClick={() => setShowPass(!showPass)}
                                >
                                    {showPass ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                id="login-btn"
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#ea580c] py-3.5 px-4 text-[17px] font-semibold text-white hover:bg-[#e0681b] active:bg-[#cc5a14] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {loading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    "Giriş Yap"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4 text-[15px]">
                        <a href="/sifremi-unuttum" className="text-slate-600 hover:text-[#ea580c] transition-colors font-medium">
                            Parolanızı mı unuttunuz?
                        </a>
                        <div className="h-[1px] w-full bg-slate-100"></div>
                        <p className="text-slate-600 font-medium">
                            Hesabınız yok mu?{" "}
                            <a href="/kayit-ol" className="text-[#ea580c] hover:underline font-semibold">
                                Yeni Hesap Oluşturun
                            </a>
                        </p>
                    </div>
                </div>

                {/* Destek / İletişim Bilgileri */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center gap-6 text-[14px] text-slate-500 font-medium">
                        <a href="https://wa.me/905314660550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors group">
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

            <WhatsAppWidget />
            <TrustLogos />
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#fbfbfd] flex items-center justify-center">
                <Loader2 size={28} className="text-slate-400 animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
