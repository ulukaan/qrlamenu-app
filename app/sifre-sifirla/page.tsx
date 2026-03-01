"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Check, KeyRound, ChevronLeft, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PASSWORD_POLICY_DESC } from "@/lib/password-policy";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login?success=PasswordReset"), 2000);
            } else {
                setError(data.error || "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } catch {
            setError("Bağlantı hatası. Lütfen tekrar deneyin.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="w-full max-w-[440px] relative z-10">
                <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-xl border border-white p-8 md:p-12 text-center">
                    <p className="text-slate-600 font-medium mb-4">Geçersiz veya eksik bağlantı. Şifre sıfırlama talebini e-postanızdaki link ile yapın.</p>
                    <Link href="/sifremi-unuttum" className="text-orange-600 font-bold hover:underline">Şifremi unuttum</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[440px] relative z-10">
            <div className="bg-white/80 backdrop-blur-3xl rounded-[32px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.12)] border border-white p-8 md:p-12 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {!success ? (
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm font-semibold text-center p-3 rounded-2xl border border-red-100 flex items-center justify-center gap-2">
                                    {error}
                                </div>
                            )}
                            <p className="text-[12px] text-slate-500 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                {PASSWORD_POLICY_DESC}
                            </p>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Yeni şifre</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full bg-white/60 rounded-2xl border border-slate-200 pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-300 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                        placeholder="En az 8 karakter"
                                        minLength={8}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Yeni şifre (tekrar)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full bg-white/60 rounded-2xl border border-slate-200 pl-12 pr-4 py-4 text-slate-900 placeholder:text-slate-300 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 outline-none font-medium"
                                        placeholder="Aynı şifreyi tekrar girin"
                                        minLength={8}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[56px] flex justify-center items-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-lg font-bold text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? <Loader2 size={24} className="animate-spin" /> : "Şifreyi Güncelle"}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-4"
                        >
                            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-green-50 border border-green-100 mb-4">
                                <Check size={32} className="text-green-600" strokeWidth={3} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Şifreniz güncellendi</h3>
                            <p className="text-slate-500 text-sm">Giriş sayfasına yönlendiriliyorsunuz...</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 font-semibold text-sm">
                        <ChevronLeft size={18} /> Girişe dön
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[#fafafa] flex flex-col items-center justify-center py-12 px-4 selection:bg-orange-100 selection:text-orange-900">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-slate-100/40 blur-[130px]" />
                <div className="absolute bottom-[0%] right-[-5%] w-[45%] h-[45%] rounded-full bg-orange-100/30 blur-[130px] animate-pulse" />
            </div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mb-8 text-center"
            >
                <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-slate-100/50 flex items-center justify-center mb-6 mx-auto">
                    <KeyRound className="text-orange-600 w-9 h-9" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">Yeni şifre belirleyin</h1>
                <p className="text-[16px] font-medium text-slate-500 max-w-sm mx-auto">E-postanızdaki link ile bu sayfaya geldiniz. Yeni şifrenizi girin.</p>
            </motion.div>
            <Suspense fallback={<div className="w-full max-w-[440px] h-64 bg-white/50 rounded-3xl animate-pulse" />}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
