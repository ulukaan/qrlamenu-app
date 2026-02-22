"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Mail, Send, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const VerificationBanner = () => {
    const [user, setUser] = React.useState<{ name: string; email: string; emailVerified?: string | null } | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState<{ type: 'success' | 'error', text: string } | null>(null);

    React.useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data?.user) {
                    setUser({
                        name: data.user.name || 'Restoran Müdürü',
                        email: data.user.email,
                        emailVerified: data.user.emailVerified
                    });
                }
            })
            .catch(console.error);
    }, []);

    const handleSendVerification = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await fetch('/api/auth/send-verification', { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Doğrulama bağlantısı e-posta adresinize gönderildi.' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Bir hata oluştu.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'İstek başarısız oldu.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.emailVerified) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="w-full bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 overflow-hidden"
        >
            <div className="max-w-[1600px] mx-auto px-6 py-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                            <AlertCircle size={22} className="animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm md:text-base text-gray-800 font-medium">
                                Hoşgeldiniz <span className="text-orange-600 font-bold">{user.name}</span>, E-mailiniz <span className="underline decoration-orange-200">{user.email}</span> lütfen doğrulayın.
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                (Email&apos;i görmüyor musunuz? Spam klasörünü kontrol edin)
                            </p>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.open('https://mail.google.com', '_blank')}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                        >
                            <Mail size={16} />
                            E-postayı kontrol et
                        </button>

                        <button
                            onClick={handleSendVerification}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50 text-gray-700 hover:text-orange-600 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Email&apos;i yeniden gönder
                        </button>
                    </div>
                </div>

                {/* Status Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-red-50 text-red-700 border border-red-100'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default VerificationBanner;
