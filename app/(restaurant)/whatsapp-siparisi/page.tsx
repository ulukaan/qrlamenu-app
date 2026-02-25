"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, MessageSquare, Send, Save, Copy, Variable, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function WhatsAppSiparisi() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const [formData, setFormData] = useState({
        quickorder_enable: '0',
        whatsapp_number: '',
        whatsapp_message: 'Yeni Sipariş: (#{ORDER_ID})\n\n{ORDER_DETAILS}\n\nToplam Fiyat: *{ORDER_TOTAL}*\n\n*Müşteri Bilgileri*\n{CUSTOMER_DETAILS}\n\n-----------------------------\nSipariş için teşekkürler.'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    setFormData(prev => ({
                        ...prev,
                        quickorder_enable: s.whatsappOrderEnabled ? '1' : '0',
                        whatsapp_number: s.whatsappNumber || '',
                        whatsapp_message: s.whatsappMessage || prev.whatsapp_message
                    }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setPageLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotification({ type: 'success', message: 'Kısa kod kopyalandı!' });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);

        try {
            const body = {
                whatsappOrderEnabled: formData.quickorder_enable === '1',
                whatsappNumber: formData.whatsapp_number,
                whatsappMessage: formData.whatsapp_message
            };

            const res = await fetch('/api/restaurant/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setNotification({ type: 'success', message: 'WhatsApp sipariş ayarları başarıyla kaydedildi!' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setNotification({ type: 'error', message: data.error || 'Bir hata oluştu.' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Bağlantı hatası.' });
        } finally {
            setLoading(false);
            setTimeout(() => setNotification(null), 3000);
        }
    };

    if (pageLoading) return <LoadingScreen message="AYARLAR HAZIRLANIYOR" />;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Standard Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 relative z-30 w-full">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                    <ChevronRight size={8} className="text-slate-300" />
                                    <span className="text-slate-900 uppercase">WHATSAPP SİPARİŞİ</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">WHATSAPP AYARLARI</h1>
                                    <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px]">SİPARİŞ ENTEGRASYONU</span>
                                </div>
                            </div>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-6 w-full mx-auto space-y-6">
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            className={`p-4 border-l-4 rounded-[6px] flex items-center gap-3 overflow-hidden shadow-sm ${notification.type === 'success'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-red-50 border-red-500 text-red-800'
                                }`}
                        >
                            <Info size={16} />
                            <p className="text-[11px] font-bold uppercase tracking-widest">{notification.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                            <Send size={15} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">ENTEGRASYON YAPILANDIRMASI</h3>
                                    </div>
                                    <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-100">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                        CANLI
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Enable/Disable */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">SİPARİŞ DURUMU</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, quickorder_enable: '1' }))}
                                                className={`py-5 border transition-all flex flex-col items-center gap-2 rounded-[6px] ${formData.quickorder_enable === '1'
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className="text-[11px] font-bold tracking-[0.1em] uppercase">AKTİF</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${formData.quickorder_enable === '1' ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(p => ({ ...p, quickorder_enable: '0' }))}
                                                className={`py-5 border transition-all flex flex-col items-center gap-2 rounded-[6px] ${formData.quickorder_enable === '0'
                                                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <span className="text-[11px] font-bold tracking-[0.1em] uppercase">PASİF</span>
                                                <div className={`w-1.5 h-1.5 rounded-full ${formData.quickorder_enable === '0' ? 'bg-red-400' : 'bg-slate-300'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WHATSAPP NUMARASI</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-900 transition-colors">
                                                <MessageSquare size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                name="whatsapp_number"
                                                value={formData.whatsapp_number}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 py-3.5 pl-12 pr-4 rounded-[6px] text-xs font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-slate-900 focus:ring-0 outline-none transition-all"
                                                placeholder="+905XXXXXXXXX"
                                            />
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">ÜLKE KODU İLE BİRLİKTE GİRİNİZ (ÖR: +90)</p>
                                    </div>

                                    {/* Message Template */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">OTOMATİK MESAJ TASLAĞI</label>
                                        <textarea
                                            name="whatsapp_message"
                                            value={formData.whatsapp_message}
                                            onChange={handleChange}
                                            className="w-full h-56 bg-white border border-slate-200 p-5 rounded-[6px] text-[11px] font-medium text-slate-700 placeholder:text-slate-300 focus:border-slate-900 focus:ring-0 outline-none transition-all leading-relaxed shadow-inner"
                                            placeholder="Mesaj taslağını buraya girin..."
                                        />
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">MÜŞTERİYE HAZIRLANACAK WHATSAPP MESAJI</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-slate-900 text-white flex items-center justify-center gap-3 py-4 rounded-[6px] text-[11px] font-bold tracking-widest hover:bg-slate-800 transition-all group disabled:opacity-50 shadow-md active:scale-[0.98] uppercase"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                                        ) : (
                                            <>
                                                <Save size={16} className="group-hover:translate-y-[-1px] transition-transform" />
                                                DEĞİŞİKLİKLERİ KAYDET
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </form>
                    </div>

                    {/* Sidebar / Reference Tags */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                                <Variable size={15} className="text-slate-900" />
                                <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">DİNAMİK KODLAR</h3>
                            </div>
                            <div className="p-4 space-y-2">
                                {[
                                    { code: '{ORDER_ID}', desc: 'SİPARİŞ NUMARASI' },
                                    { code: '{ORDER_DETAILS}', desc: 'SİPARİŞ İÇERİĞİ' },
                                    { code: '{CUSTOMER_DETAILS}', desc: 'MÜŞTERİ BİLGİLERİ' },
                                    { code: '{ORDER_TYPE}', desc: 'TESLİMAT TÜRÜ' },
                                    { code: '{ORDER_TOTAL}', desc: 'TOPLAM TUTAR' }
                                ].map((item, idx) => (
                                    <div key={idx} className="group flex flex-col gap-1.5 p-3 bg-slate-50 border border-slate-100 hover:border-slate-900 hover:bg-white transition-all cursor-pointer rounded-[4px] shadow-sm active:scale-[0.98]" onClick={() => handleCopy(item.code)}>
                                        <div className="flex items-center justify-between">
                                            <code className="text-[10px] font-bold text-slate-900 font-mono tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded-[2px]">{item.code}</code>
                                            <Copy size={12} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                                        </div>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.desc}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-emerald-50 border-t border-emerald-100">
                                <p className="text-[9px] font-bold text-emerald-800 leading-normal uppercase tracking-tight">KODLARA TIKLAYARAK KOPYALAYABİLİR VE MESAJ TASLAĞINIZA EKLEYEBİLİRSİNİZ.</p>
                            </div>
                        </motion.div>

                        <div className="group bg-slate-900 p-6 text-white space-y-4 rounded-[6px] shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Info size={48} />
                            </div>
                            <h4 className="text-[11px] font-bold tracking-widest uppercase text-slate-400 relative z-10">İPUCU</h4>
                            <p className="text-[10px] font-medium leading-relaxed text-slate-300 uppercase relative z-10">
                                WHATSAPP SİPARİŞİ AKTİF EDİLDİĞİNDE, MÜŞTERİLERİNİZ SEPETİNİ ONAYLADIKTAN SONRA DOĞRUDAN BELİRTTİĞİNİZ WHATSAPP NUMARASINA YÖNLENDİRİLECEKTİR.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] border-t border-slate-100 mt-10">
                {new Date().getFullYear()} QRlamenü — TÜM HAKLARI SAKLIDIR
            </div>
        </div>
    );
}
