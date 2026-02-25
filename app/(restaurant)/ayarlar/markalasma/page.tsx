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
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

const THEMES = [
    {
        id: 'LITE',
        name: 'Lite',
        desc: 'Hızlı, sade ve temiz. Metne odaklanır.',
        icon: '⚡',
        preview: 'bg-white',
        accent: '#ea580c',
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
    const [primaryColor, setPrimaryColor] = useState('#ea580c');
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
                    setPrimaryColor(s.primaryColor || s.restaurantColor || '#ea580c');
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
                <Loader2 className="animate-spin text-orange-600" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Standard Header Area */}
            <div className="bg-white border-b border-slate-100 py-4 px-6 lg:px-8 relative z-30 shadow-sm w-full">
                <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start md:items-center gap-4 md:gap-6">
                        <MobileMenuToggle />
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                <ChevronRight size={8} className="text-gray-300" />
                                <span className="text-slate-900">MARKALAŞMA</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center shadow-lg">
                                    <Palette size={24} className="text-white" strokeWidth={2} />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">MARKALAŞMA & TEMA</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">GÖRSEL KİMLİK</span>
                                        <div className="h-0.5 w-0.5 bg-gray-300 rounded-full" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">AYARLAR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-md text-[10px] font-black text-gray-500 hover:border-slate-900 hover:text-gray-900 shadow-sm transition-all group w-fit uppercase tracking-widest">
                            VAZGEÇ
                        </Link>
                    </div>
                    <ProfileDropdown />
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-8 flex-1 w-full mx-auto flex">
                <form onSubmit={handleSubmit} className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-8 py-5 rounded-md shadow-2xl flex items-center gap-4 border-2 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                                {notification.type === 'success' ? <CheckCircle2 size={24} strokeWidth={3} /> : <AlertCircle size={24} strokeWidth={3} />}
                                <span className="text-sm font-black tracking-tight">{notification.message.toUpperCase()}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* LEFT COLUMN: Theme Selection */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-2 rounded-md shadow-lg">
                                        <Monitor size={18} strokeWidth={3} />
                                    </div>
                                    <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">GÖRÜNÜM TEMASI</h2>
                                </div>
                                <span className="bg-orange-50 text-[#ea580c] text-[9px] font-black px-3 py-1.5 rounded-md border border-orange-100 uppercase tracking-widest">
                                    {THEMES.length} SEÇENEK
                                </span>
                            </div>

                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {THEMES.map(t => (
                                    <button key={t.id} type="button" onClick={() => setSelectedTheme(t.id)}
                                        className={`relative group rounded-md overflow-hidden border-2 transition-all duration-300 text-left ${selectedTheme === t.id ? 'border-[#ea580c] shadow-lg scale-[1.02]' : 'border-slate-100 grayscale hover:grayscale-0 hover:border-slate-300'}`}>

                                        {/* Visual Preview */}
                                        <div className={`h-40 ${t.preview} flex flex-col items-center justify-center relative overflow-hidden group-hover:grayscale-0 transition-all`}>
                                            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${t.accent}, transparent)` }} />
                                            <span className="text-5xl drop-shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-125">{t.icon}</span>

                                            {/* Theme Badge */}
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md border" style={{ backgroundColor: `${t.accent}10`, color: t.accent, borderColor: `${t.accent}20` }}>
                                                    {t.badge}
                                                </span>
                                            </div>

                                            {/* Selected Indicator */}
                                            {selectedTheme === t.id && (
                                                <div className="absolute top-4 right-4 bg-[#ea580c] text-white p-1.5 rounded-md shadow-lg">
                                                    <CheckCircle2 size={14} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-6 bg-white space-y-2">
                                            <div className="font-black text-sm text-gray-900 tracking-tight flex items-center justify-between">
                                                {t.name.toUpperCase()}
                                                {selectedTheme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold leading-relaxed tracking-wide uppercase">
                                                {t.desc}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="px-8 pb-8">
                                <div className="p-4 bg-orange-50 rounded-md border border-orange-100 flex items-center gap-4">
                                    <div className="p-2 bg-white rounded-md shadow-sm">
                                        <Code size={16} className="text-[#ea580c]" strokeWidth={3} />
                                    </div>
                                    <p className="text-[9px] font-black text-orange-900 uppercase tracking-widest leading-relaxed">
                                        URL'NİZE <span className="underline">?theme=MODERN</span> EKLEYEREK TÜM TEMALARI TEST EDEBİLİRSİNİZ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Styling & Pixels */}
                    <div className="lg:col-span-4 space-y-10">
                        {/* Visual Identity */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                                <div className="bg-slate-900 text-white p-2 rounded-md shadow-lg">
                                    <Palette size={18} strokeWidth={3} />
                                </div>
                                <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">KİMLİK</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">TEMA ANA RENGİ</label>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-md border border-slate-200 group hover:border-slate-900 transition-all">
                                        <div onClick={() => colorInputRef.current?.click()} style={{ backgroundColor: primaryColor }} className="w-12 h-12 rounded-md shadow-lg cursor-pointer border-2 border-white transition-transform active:scale-95" />
                                        <div className="flex-1">
                                            <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="hidden" />
                                            <input type="text" value={primaryColor.toUpperCase()} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full bg-transparent border-none text-base font-black text-gray-900 outline-none uppercase tracking-widest" />
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">HEX KODU</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking codes */}
                        <div className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center gap-4 bg-slate-50">
                                <div className="bg-blue-600 text-white p-2 rounded-md shadow-lg">
                                    <Zap size={18} strokeWidth={3} />
                                </div>
                                <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">TAKİP & ANALİZ</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Facebook size={12} className="text-[#1877F2]" strokeWidth={3} /> FACEBOOK PIXEL ID
                                    </label>
                                    <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="0000000000" className="w-full bg-slate-50 border border-slate-200 rounded-md px-6 py-4 text-[11px] font-black text-slate-900 outline-none focus:border-blue-500 transition-all placeholder:text-slate-300" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Globe size={12} className="text-orange-600" strokeWidth={3} /> ANALYTICS ID (GA4)
                                    </label>
                                    <input type="text" value={gaTrackingId} onChange={(e) => setGaTrackingId(e.target.value)} placeholder="G-XXXXXXXXXX" className="w-full bg-slate-50 border border-slate-200 rounded-md px-6 py-4 text-[11px] font-black text-slate-900 outline-none focus:border-orange-600 transition-all placeholder:text-slate-300" />
                                </div>
                                <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                                    <p className="text-[9px] font-black text-blue-900 uppercase tracking-widest leading-relaxed">
                                        TAKİP KODLARI MENÜ SAYFANIZA OTOMATİK ENTEGRE OLUR.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-slate-900 rounded-md p-8 shadow-2xl shadow-slate-400/20 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-white text-lg font-black tracking-tight uppercase">KAYDETMEYE HAZIR MISINIZ?</h3>
                                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                    TÜM MÜŞTERİ MENÜLERİ ANINDA GÜNCELLENECEKTİR.
                                </p>
                            </div>
                            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-4 py-6 bg-[#ea580c] text-white rounded-md text-[11px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50">
                                {loading ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : <Save size={20} strokeWidth={3} />}
                                {loading ? 'GÜNCELLENİYOR' : 'AYARLARI YAYINLA'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
