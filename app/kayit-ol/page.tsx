"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, MessageCircle, Mail, Eye, EyeOff, User, Store, Phone, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TrustLogos from "@/components/TrustLogos";

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        restaurantName: "",
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!formData.email.includes("@") || formData.phone.length < 10) {
            setError("Geçerli bir telefon numarası ve e-posta adresi girin.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Şifre en az 8 karakter olmalı, büyük harf, küçük harf ve rakam içermelidir.");
            return;
        }
        if (!/[A-Z]/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            setError("Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (res.ok) {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1500);
                } else {
                    setError(data.error || "Kayıt işlemi başarısız.");
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
            <div className="absolute inset-0 z-0 text-orange-200">
                <div className="absolute top-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-100/40 blur-[130px] animate-pulse" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-orange-50/40 blur-[130px] animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute top-[30%] left-[20%] w-[15%] h-[15%] rounded-full bg-white blur-[80px]" />
            </div>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 mb-8 text-center flex flex-col items-center"
            >
                <div className="w-14 h-14 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center mb-6">
                    <Sparkles className="text-orange-500 w-8 h-8" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
                    QRlamenü'ye Katılın
                </h1>
                <p className="text-[16px] font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Dijital platformda yerinizi almak için işletme profilinizi bugün oluşturun.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="w-full max-w-[480px] relative z-10"
            >
                {/* Registration Card with Glassmorphism */}
                <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] border border-white p-8 md:p-12 mb-10 relative overflow-hidden group">

                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="space-y-5 relative z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0.5, filter: 'blur(10px)' }}
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

                                <div className="space-y-4">
                                    <div className="group relative">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">İşletme Adı</label>
                                        <div className="relative">
                                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={18} strokeWidth={1.5} />
                                            <input
                                                type="text" required name="restaurantName" value={formData.restaurantName} onChange={handleChange}
                                                className="block w-full bg-white/60 rounded-2xl border border-slate-200/60 pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-[16px] outline-none font-medium shadow-sm"
                                                placeholder="İşletmenizin Marka Adı"
                                            />
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">Yetkili Adı</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={18} strokeWidth={1.5} />
                                            <input
                                                type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
                                                className="block w-full bg-white/60 rounded-2xl border border-slate-200/60 pl-12 pr-4 py-3.5 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-[16px] outline-none font-medium shadow-sm"
                                                placeholder="Adınız ve Soyadınız"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="group relative">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">E-Posta</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={18} strokeWidth={1.5} />
                                                <input
                                                    type="email" required name="email" value={formData.email} onChange={handleChange}
                                                    className="block w-full bg-white/60 rounded-2xl border border-slate-200/60 pl-11 pr-4 py-3.5 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-[15px] outline-none font-medium shadow-sm"
                                                    placeholder="E-posta"
                                                />
                                            </div>
                                        </div>
                                        <div className="group relative">
                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">Telefon</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-orange-600 transition-colors" size={18} strokeWidth={1.5} />
                                                <input
                                                    type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                                                    className="block w-full bg-white/60 rounded-2xl border border-slate-200/60 pl-11 pr-4 py-3.5 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-[15px] outline-none font-medium shadow-sm"
                                                    placeholder="05XX XXX XX"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="group relative">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1 mb-1.5 block group-focus-within:text-orange-600 transition-colors">Güvenli Parola</label>
                                        <p className="text-[11px] text-slate-400 mb-1">En az 8 karakter, büyük harf, küçük harf ve rakam</p>
                                        <div className="relative">
                                            <input
                                                type={showPass ? "text" : "password"}
                                                required
                                                minLength={8}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="block w-full bg-white/60 rounded-2xl border border-slate-200/60 px-4 py-3.5 pr-12 text-slate-900 placeholder:text-slate-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-[16px] outline-none font-medium shadow-sm"
                                                placeholder="En az 8 karakter"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPass(!showPass)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-600 transition-colors"
                                            >
                                                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit" disabled={loading}
                                        className="group w-full relative h-[60px] flex justify-center items-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {loading ? (
                                            <Loader2 size={24} className="animate-spin text-white/90" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Başvuruyu Tamamla <ChevronRight size={20} />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8 relative z-10"
                            >
                                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-3xl bg-orange-50 border border-orange-100 shadow-sm mb-6">
                                    <Check size={40} className="text-orange-600" strokeWidth={3} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Başvurunuz Alındı!</h3>
                                <p className="text-[16px] text-slate-500 font-medium leading-relaxed max-w-[280px] mx-auto">
                                    Ekibimiz en kısa sürede sizinle iletişime geçecektir.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-10 flex flex-col items-center gap-6 border-t border-slate-50 pt-8 relative z-10">
                        <p className="text-slate-400 font-semibold text-[15px]">
                            Zaten bir hesabınız var mı? <a href="/login" className="text-orange-600 hover:text-orange-700 transition-colors font-bold underline decoration-orange-200 underline-offset-4">Giriş Yapın</a>
                        </p>
                        <a href="/" className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm tracking-wide uppercase">
                            ← Ana Sayfaya Dön
                        </a>
                    </div>
                </div>

                {/* Secure Trust Badges & Contact */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="flex items-center justify-center gap-6 text-[14px] font-bold">
                        <a href="https://wa.me/905314660550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-all">
                            <MessageCircle size={18} className="text-slate-300" /> WhatsApp Destek
                        </a>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <a href="mailto:info@qrlamenu.com" className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-all">
                            <Mail size={18} className="text-slate-300" /> info@qrlamenu.com
                        </a>
                    </div>
                </div>
            </motion.div>

            <div className="mt-auto py-8 relative z-10 italic">
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-[0.3em] text-center">
                    Geleceğin Restoran Deneyimi — © {new Date().getFullYear()}
                </p>
            </div>

            <WhatsAppWidget />
            <TrustLogos />
        </div>
    );
}
