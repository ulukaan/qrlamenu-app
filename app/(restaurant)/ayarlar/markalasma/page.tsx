"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Palette,
    Link as LinkIcon,
    Facebook,
    Globe,
    Save,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Copy,
    ExternalLink,
    Instagram,
    Code,
    Monitor,
    Zap,
    PenTool,
    Activity,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = [
    {
        id: 'LITE',
        name: 'Lite',
        desc: 'Hızlı, sade ve temiz. Metne odaklanır.',
        icon: '⚡',
        preview: 'bg-white',
        accent: '#ff7a21',
        badge: 'Klasik'
    },
    {
        id: 'CLASSIC',
        name: 'Classic',
        desc: 'Kurumsal ve görsel. Grid kartlar ile zengin sunum.',
        icon: '🏛️',
        preview: 'bg-slate-50',
        accent: '#2c3e50',
        badge: 'Kurumsal'
    },
    {
        id: 'MODERN',
        name: 'Modern',
        desc: 'Koyu mod + animasyonlar. Ultra-premium deneyim.',
        icon: '🌑',
        preview: 'bg-slate-900',
        accent: '#6366f1',
        badge: 'Popüler'
    },
    {
        id: 'SIGNATURE',
        name: 'Signature',
        desc: 'Modern cafeler için. Geniş beyaz alanlar ve güçlü tipografi.',
        icon: '✒️',
        preview: 'bg-white',
        accent: '#1a1a1b',
        badge: 'Yeni ✨'
    },
    {
        id: 'LUXURY',
        name: 'Luxury',
        desc: 'Fine-dining için. Siyah-altın palet, sinematik geçişler.',
        icon: '👑',
        preview: 'bg-black',
        accent: '#d4af37',
        badge: 'Premium ✨'
    },
    {
        id: 'FASTFOOD',
        name: 'Fast-Food',
        desc: 'Canlı renkler ve büyük görseller. Hızlı seçim odaklı.',
        icon: '🍟',
        preview: 'bg-red-50',
        accent: '#e11d48',
        badge: 'Yeni ✨'
    },
];

export default function BrandingPage() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [primaryColor, setPrimaryColor] = useState('#ff7a21');
    const [selectedTheme, setSelectedTheme] = useState('LITE');
    const [fbPixelId, setFbPixelId] = useState('');
    const [gaTrackingId, setGaTrackingId] = useState('');
    const [customDomain, setCustomDomain] = useState('');
    const [tenantSlug, setTenantSlug] = useState('');
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    setPrimaryColor(s.primaryColor || s.restaurantColor || '#ff7a21');
                    setSelectedTheme(data.theme || 'LITE');
                    setFbPixelId(s.fbPixelId || '');
                    setGaTrackingId(s.gaTrackingId || '');
                    setCustomDomain(data.customDomain || '');
                    setTenantSlug(data.slug || '');
                }
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setPageLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);
        try {
            const res = await fetch('/api/restaurant/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    primaryColor,
                    theme: selectedTheme,
                    fbPixelId,
                    gaTrackingId,
                })
            });
            if (res.ok) {
                setNotification({ type: 'success', message: 'Markalaşma ayarları başarıyla kaydedildi!' });
            } else {
                setNotification({ type: 'error', message: 'Ayarlar kaydedilemedi.' });
            }
        } catch (err) {
            setNotification({ type: 'error', message: 'Bağlantı hatası.' });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-orange-500" size={40} />
            </div>
        );
    }

    return (
        <div className="p-0 bg-[#f8fafc] min-h-screen">
            <div className="p-8 md:p-12 lg:p-16">
                <div className="max-w-6xl mx-auto space-y-10">

                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b-2 border-gray-100">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">MARKALAŞMA & TEMA</h1>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">MENÜNÜZÜ KİMLİĞİNİZE GÖRE ÖZELLEŞTİRİN</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-500 hover:border-gray-900 hover:text-gray-900 shadow-sm transition-all group w-fit">
                            <div className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-gray-900 transition-colors" />
                            VAZGEÇ
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Notification Toast */}
                        <AnimatePresence>
                            {notification && (
                                <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-[28px] shadow-2xl flex items-center gap-4 border-2 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                                    {notification.type === 'success' ? <CheckCircle2 size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                                    <span className="text-sm font-black tracking-tight">{notification.message.toUpperCase()}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* LEFT COLUMN: Theme Selection */}
                        <div className="lg:col-span-8 space-y-10">
                            <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                                <div className="p-10 border-b-2 border-gray-50 flex items-center justify-between bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                            <Monitor size={20} strokeWidth={3} />
                                        </div>
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">GÖRÜNÜM TEMASI</h2>
                                    </div>
                                    <span className="bg-orange-50 text-[#ff7a21] text-[10px] font-black px-4 py-2 rounded-xl border border-orange-100 uppercase tracking-widest">
                                        {THEMES.length} SEÇENEK
                                    </span>
                                </div>

                                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {THEMES.map(t => (
                                        <button key={t.id} type="button" onClick={() => setSelectedTheme(t.id)}
                                            className={`relative group rounded-[32px] overflow-hidden border-4 transition-all duration-500 text-left ${selectedTheme === t.id ? 'border-[#ff7a21] shadow-2xl shadow-orange-500/10 scale-[1.02]' : 'border-gray-50 grayscale hover:grayscale-0 hover:border-gray-200 hover:scale-[1.01]'}`}>

                                            {/* Visual Preview */}
                                            <div className={`h-40 ${t.preview} flex flex-col items-center justify-center relative overflow-hidden group-hover:grayscale-0 transition-all`}>
                                                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${t.accent}, transparent)` }} />
                                                <span className="text-5xl drop-shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-125">{t.icon}</span>

                                                {/* Theme Badge */}
                                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border-2" style={{ backgroundColor: `${t.accent}10`, color: t.accent, borderColor: `${t.accent}20` }}>
                                                        {t.badge}
                                                    </span>
                                                </div>

                                                {/* Selected Indicator */}
                                                {selectedTheme === t.id && (
                                                    <div className="absolute top-4 right-4 bg-[#ff7a21] text-white p-2 rounded-xl shadow-lg animate-in zoom-in duration-300">
                                                        <CheckCircle2 size={16} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info Area */}
                                            <div className="p-6 bg-white space-y-2">
                                                <div className="font-black text-sm text-gray-900 tracking-tight flex items-center justify-between">
                                                    {t.name.toUpperCase()}
                                                    {selectedTheme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-[#ff7a21]" />}
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold leading-relaxed tracking-wide uppercase">
                                                    {t.desc}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <div className="px-10 pb-10">
                                    <div className="p-6 bg-orange-50 rounded-[24px] border border-orange-100/50 flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <Code size={18} className="text-[#ff7a21]" strokeWidth={3} />
                                        </div>
                                        <p className="text-[10px] font-black text-orange-900/60 uppercase tracking-widest leading-relaxed italic">
                                            "URL'NİZE <span className="text-orange-950">?theme=MODERN</span> EKLEYEREK TÜM TEMALARI ANINDA TEST EDEBİLİRSİNİZ."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Styling & Pixels */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Visual Identity */}
                            <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                                <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4 bg-gray-50/20">
                                    <div className="bg-gray-900 text-white p-3 rounded-2xl shadow-lg">
                                        <Palette size={20} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">KİMLİK</h2>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">TEMA ANA RENGİ</label>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[28px] border-2 border-gray-100/50 group hover:border-[#ff7a21] transition-all">
                                            <div onClick={() => colorInputRef.current?.click()} style={{ backgroundColor: primaryColor }} className="w-16 h-16 rounded-[20px] shadow-lg cursor-pointer border-4 border-white transition-transform active:scale-90" />
                                            <div className="flex-1">
                                                <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="hidden" />
                                                <input type="text" value={primaryColor.toUpperCase()} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full bg-transparent border-none text-lg font-black text-gray-900 outline-none uppercase tracking-tighter" />
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">HEX KODU</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed italic text-center px-4">
                                        BUTONLAR, İKONLAR VE ÖNE ÇIKAN TÜM ALANLAR BU RENGİ KULLANIR.
                                    </p>
                                </div>
                            </div>

                            {/* Tracking codes */}
                            <div className="bg-white rounded-[40px] shadow-sm border-2 border-gray-50 overflow-hidden">
                                <div className="p-8 border-b-2 border-gray-50 flex items-center gap-4 bg-gray-50/20">
                                    <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
                                        <Zap size={20} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">TAKİP & ANALİZ</h2>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <Facebook size={12} className="text-[#1877F2]" strokeWidth={3} /> FACEBOOK PIXEL ID
                                        </label>
                                        <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="0000000000" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[24px] px-8 py-5 text-xs font-black text-gray-900 outline-none focus:border-blue-500 transition-all placeholder:text-gray-200" />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                            <Globe size={12} className="text-orange-500" strokeWidth={3} /> ANALYTICS ID (GA4)
                                        </label>
                                        <input type="text" value={gaTrackingId} onChange={(e) => setGaTrackingId(e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full bg-gray-50 border-2 border-gray-100 rounded-[24px] px-8 py-5 text-xs font-black text-gray-900 outline-none focus:border-orange-500 transition-all placeholder:text-gray-200" />
                                    </div>
                                    <div className="p-6 bg-blue-50/50 rounded-[24px] border border-blue-100/50">
                                        <p className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest leading-loose">
                                            TAKİP KODLARI MENÜ SAYFANIZA OTOMATİK ENTEGRE OLUR. DÖNÜŞÜMLERİ PANELİNİZDEN TAKİP EDEBİLİRSİNİZ.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Card */}
                            <div className="bg-gray-900 rounded-[40px] p-10 shadow-2xl shadow-gray-400/20 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-xl font-black tracking-tight">KAYDETMEYE HAZIR MISINIZ?</h3>
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                        DEĞİŞİKLİKLER KAYDEDİLDİĞİ ANDA TÜM MÜŞTERİ MENÜLERİ GÜNCELLENECEKTİR.
                                    </p>
                                </div>
                                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-4 py-8 bg-[#ff7a21] text-white rounded-[32px] text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50">
                                    {loading ? <Loader2 className="animate-spin" size={24} strokeWidth={3} /> : <Save size={24} strokeWidth={3} />}
                                    {loading ? 'GÜNCELLENİYOR' : 'AYARLARI YAYINLA'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
