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
import { LoadingScreen } from '@/components/ui/loading-screen';

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
        return <LoadingScreen message="MARKALAŞMA AYARLARI YÜKLENİYOR" />;
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Standard Header Area */}
            <div className="bg-white border-b border-slate-200 py-5 px-6 relative z-30">
                <div className="w-full mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6">
                            <MobileMenuToggle />
                            <div className="space-y-4">
                                {/* Breadcrumbs */}
                                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                    <ChevronRight size={8} className="text-slate-300" />
                                    <span className="text-slate-900 uppercase">MARKALAŞMA</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-3 rounded-[6px] shadow-sm">
                                        <Palette size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase leading-none">MARKALAŞMA & TEMA</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">GÖRSEL KİMLİK</span>
                                            <div className="h-0.5 w-0.5 bg-slate-300 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px]">AYARLAR</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/dashboard"
                                className="h-9 flex items-center justify-center px-6 bg-white border border-slate-200 rounded-[6px] text-[10px] font-bold text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all uppercase tracking-widest shadow-sm active:scale-95"
                            >
                                VAZGEÇ
                            </Link>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 lg:p-6 flex-1 w-full mx-auto">
                <form onSubmit={handleSubmit} className="w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Notification Toast */}
                    <AnimatePresence>
                        {notification && (
                            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-[6px] shadow-xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {notification.type === 'success' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertCircle size={18} strokeWidth={2.5} />}
                                <span className="text-[11px] font-bold tracking-widest uppercase">{notification.message}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* LEFT COLUMN: Theme Selection */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                        <Monitor size={16} strokeWidth={2.5} />
                                    </div>
                                    <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">GÖRÜNÜM TEMASI</h2>
                                </div>
                                <span className="bg-orange-100/50 text-[#ff6e01] text-[9px] font-bold px-2.5 py-1 rounded-[4px] border border-orange-100 uppercase tracking-widest">
                                    {THEMES.length} SEÇENEK
                                </span>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {THEMES.map(t => (
                                    <button key={t.id} type="button" onClick={() => setSelectedTheme(t.id)}
                                        className={`relative group rounded-[6px] overflow-hidden border transition-all duration-300 text-left ${selectedTheme === t.id ? 'border-[#ff6e01] ring-1 ring-[#ff6e01] shadow-md' : 'border-slate-100 hover:border-slate-300 shadow-sm'}`}>

                                        {/* Visual Preview */}
                                        <div className={`h-32 ${t.preview} flex flex-col items-center justify-center relative overflow-hidden transition-all`}>
                                            <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${t.accent}, transparent)` }} />
                                            <span className="text-4xl drop-shadow-md relative z-10">{t.icon}</span>

                                            {/* Theme Badge */}
                                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[4px] border" style={{ backgroundColor: `${t.accent}10`, color: t.accent, borderColor: `${t.accent}20` }}>
                                                    {t.badge}
                                                </span>
                                            </div>

                                            {/* Selected Indicator */}
                                            {selectedTheme === t.id && (
                                                <div className="absolute top-3 right-3 bg-[#ff6e01] text-white p-1 rounded-full shadow-sm">
                                                    <CheckCircle2 size={12} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-4 bg-white space-y-1">
                                            <div className="font-bold text-[13px] text-slate-900 tracking-tight uppercase flex items-center justify-between">
                                                {t.name}
                                                {selectedTheme === t.id && <div className="w-1.5 h-1.5 rounded-full bg-[#ff6e01]" />}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium leading-tight tracking-tight uppercase">
                                                {t.desc}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="px-6 pb-6">
                                <div className="p-3.5 bg-slate-50 rounded-[4px] border border-slate-100 flex items-center gap-3">
                                    <div className="p-1.5 bg-white rounded-[4px] shadow-sm border border-slate-100 text-[#ff6e01]">
                                        <Code size={14} strokeWidth={2.5} />
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                                        URL'NİZE <span className="text-slate-900 underline">?theme=MODERN</span> EKLEYEREK TÜM TEMALARI TEST EDEBİLİRSİNİZ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Styling & Pixels */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Visual Identity */}
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <Palette size={16} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">KİMLİK</h2>
                            </div>
                            <div className="p-5 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">TEMA ANA RENGİ</label>
                                    <div className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-[6px] border border-slate-200 group hover:border-slate-400 transition-all">
                                        <div onClick={() => colorInputRef.current?.click()} style={{ backgroundColor: primaryColor }} className="w-10 h-10 rounded-[6px] shadow-sm cursor-pointer border-2 border-white transition-transform active:scale-95" />
                                        <div className="flex-1">
                                            <input ref={colorInputRef} type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="hidden" />
                                            <input type="text" value={primaryColor.toUpperCase()} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full bg-transparent border-none text-[13px] font-bold text-slate-900 outline-none uppercase tracking-widest" />
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block leading-none">HEX KODU</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tracking codes */}
                        <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                                <div className="bg-[#1877F2] text-white p-2 rounded-[4px]">
                                    <Facebook size={16} strokeWidth={2.5} />
                                </div>
                                <h2 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">TAKİP & ANALİZ</h2>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        FACEBOOK PIXEL ID
                                    </label>
                                    <input type="text" value={fbPixelId} onChange={(e) => setFbPixelId(e.target.value)} placeholder="0000000000" className="h-10 w-full bg-slate-50/50 border border-slate-200 rounded-[6px] px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 uppercase tracking-widest" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        ANALYTICS ID (GA4)
                                    </label>
                                    <input type="text" value={gaTrackingId} onChange={(e) => setGaTrackingId(e.target.value)} placeholder="G-XXXXXXXXXX" className="h-10 w-full bg-slate-50/50 border border-slate-200 rounded-[6px] px-4 text-[11px] font-bold text-slate-900 outline-none focus:border-slate-900 transition-all placeholder:text-slate-300 uppercase tracking-widest" />
                                </div>
                                <div className="p-3 bg-blue-50/50 rounded-[4px] border border-blue-100">
                                    <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-relaxed">
                                        TAKİP KODLARI MENÜ SAYFANIZA OTOMATİK ENTEGRE OLUR.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Card */}
                        <div className="bg-slate-900 rounded-[6px] p-6 shadow-lg shadow-slate-200 space-y-5">
                            <div className="space-y-1">
                                <h3 className="text-white text-lg font-bold tracking-tight uppercase leading-none">KAYDETMEYE HAZIR MISINIZ?</h3>
                                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                                    TÜM MÜŞTERİ MENÜLERİ ANINDA GÜNCELLENECEKTİR.
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 h-12 bg-[#ff6e01] text-white rounded-[6px] text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} strokeWidth={2.5} /> : <Save size={18} strokeWidth={2.5} />}
                                {loading ? 'GÜNCELLENİYOR' : 'AYARLARI YAYINLA'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
