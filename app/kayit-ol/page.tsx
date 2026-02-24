"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, MessageCircle, Mail, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

        if (formData.password.length < 6) {
            setError("Şifreniz en az 6 karakter olmalıdır.");
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
        <div className="min-h-screen bg-[#fbfbfd] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            <div className="mb-8 text-center mt-6">
                <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight mb-2">
                    QRlamenü'ye Katılın
                </h1>
                <p className="text-[15px] font-normal text-slate-500">
                    Dijital platformda yerinizi almak için işletme profilinizi oluşturun.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[440px]"
            >
                <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-200 p-8 md:p-10 mb-8">
                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.form key="form" onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, height: "auto", scale: 1 }}
                                            exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                            className="text-red-500 text-[15px] font-medium text-center pb-2"
                                        >
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div>
                                    <input
                                        type="text" required name="restaurantName" value={formData.restaurantName} onChange={handleChange}
                                        className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ff7a21] focus:ring-1 focus:ring-[#ff7a21] transition-all text-[17px] font-normal outline-none"
                                        placeholder="İşletme Adı"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
                                        className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ff7a21] focus:ring-1 focus:ring-[#ff7a21] transition-all text-[17px] font-normal outline-none"
                                        placeholder="Yetkili Adı Soyadı"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="email" required name="email" value={formData.email} onChange={handleChange}
                                            className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ff7a21] focus:ring-1 focus:ring-[#ff7a21] transition-all text-[17px] font-normal outline-none"
                                            placeholder="E-posta"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="tel" required name="phone" value={formData.phone} onChange={handleChange}
                                            className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 placeholder-slate-400 focus:border-[#ff7a21] focus:ring-1 focus:ring-[#ff7a21] transition-all text-[17px] font-normal outline-none"
                                            placeholder="Telefon"
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required name="password" value={formData.password} onChange={handleChange}
                                        className="block w-full bg-white rounded-xl border border-slate-300 px-4 py-3.5 pr-12 text-slate-900 placeholder-slate-400 focus:border-[#ff7a21] focus:ring-1 focus:ring-[#ff7a21] transition-all text-[17px] font-normal outline-none"
                                        placeholder="Güvenli Parolanız"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit" disabled={loading}
                                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#ff7a21] py-3.5 px-4 text-[17px] font-semibold text-white hover:bg-[#e0681b] active:bg-[#cc5a14] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        {loading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            "Başvuruyu Tamamla"
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                                <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 mb-4">
                                    <Check size={24} className="text-[#ff7a21]" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[19px] font-semibold text-slate-900 mb-2 tracking-tight">Başvurunuz ulaştı!</h3>
                                <p className="text-[15px] text-slate-500 font-medium">
                                    Ekibimiz sizinle iletişime geçecektir.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 flex flex-col items-center gap-4 border-t border-slate-100 pt-6 text-[15px]">
                        <p className="text-slate-600 font-medium">
                            Zaten bir hesabınız var mı? <a href="/login" className="text-[#ff7a21] hover:underline font-semibold">Giriş Yapın</a>
                        </p>
                        <a href="/" className="text-slate-600 hover:text-[#ff7a21] transition-colors font-medium">
                            Ana Sayfaya Dön
                        </a>
                    </div>
                </div>

                {/* Destek / İletişim Bilgileri */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center gap-6 text-[14px] text-slate-500 font-medium">
                        <a href="https://wa.me/905314660550" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors group">
                            <MessageCircle size={18} className="text-slate-400 group-hover:text-[#25D366] transition-colors" /> Destek Hattı
                        </a>
                        <a href="mailto:info@qrlamenu.com" className="flex items-center gap-1.5 hover:text-[#ff7a21] transition-colors group">
                            <Mail size={18} className="text-slate-400 group-hover:text-[#ff7a21] transition-colors" /> info@qrlamenu.com
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
