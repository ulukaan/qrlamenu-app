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
    Sparkles,
    Crown,
    Flame,
    PenTool
} from 'lucide-react';
import Link from 'next/link';

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
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {notification && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                    {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Markalaşma & Pixel</h1>
                        <p className="text-slate-500">Müşteri menünüzü markanıza göre özelleştirin.</p>
                    </div>
                    <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium">
                        Geri Dön
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Theme Selector */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <Monitor className="text-purple-500" size={24} />
                            <h2 className="text-lg font-bold text-slate-900">Menü Teması</h2>
                            <span className="ml-auto text-xs font-black text-purple-500 bg-purple-50 px-3 py-1 rounded-full">6 Tema</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {THEMES.map(t => (
                                <button
                                    key={t.id}
                                    type="button"
                                    onClick={() => setSelectedTheme(t.id)}
                                    className={`relative group rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left ${selectedTheme === t.id
                                            ? 'border-orange-500 scale-[1.02] shadow-xl shadow-orange-500/20'
                                            : 'border-slate-100 hover:border-slate-300 hover:scale-[1.01]'
                                        }`}
                                >
                                    {/* Preview area */}
                                    <div className={`h-24 ${t.preview} flex items-center justify-center text-4xl relative overflow-hidden`}>
                                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.accent}15, ${t.accent}35)` }} />
                                        <span className="relative z-10 drop-shadow-sm">{t.icon}</span>
                                        {selectedTheme === t.id && (
                                            <div className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-white" />
                                            </div>
                                        )}
                                        <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: `${t.accent}20`, color: t.accent }}>{t.badge}</span>
                                    </div>
                                    {/* Info area */}
                                    <div className="p-3 bg-white">
                                        <div className="font-black text-sm text-slate-900 mb-0.5" style={{ color: selectedTheme === t.id ? t.accent : undefined }}>{t.name}</div>
                                        <p className="text-[10px] text-slate-400 font-medium leading-snug">{t.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-slate-400">
                            Seçilen tema anında tüm müşterilerinizin menü sayfasında aktif olur. Tema URL üzerinden de test edebilirsiniz: <span className="font-mono">/r/{tenantSlug}?theme=MODERN</span>
                        </p>
                    </div>

                    {/* Visual Branding Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <Palette className="text-orange-500" size={24} />
                            <h2 className="text-lg font-bold text-slate-900">Görsel Kimlik</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tema Ana Rengi</label>
                                <div className="flex items-center gap-4">
                                    <div
                                        onClick={() => colorInputRef.current?.click()}
                                        className="w-12 h-12 rounded-xl cursor-pointer border-4 border-slate-100 shadow-sm transition-transform active:scale-95"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <input
                                        ref={colorInputRef}
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="hidden"
                                    />
                                    <input
                                        type="text"
                                        value={primaryColor.toUpperCase()}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-mono outline-none focus:border-orange-500 transition-colors"
                                    />
                                    <p className="text-xs text-slate-400">Butonlar, ikonlar ve öne çıkan alanlar bu rengi kullanacaktır.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tracking & Pixels Section */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                            <Code className="text-blue-500" size={24} />
                            <h2 className="text-lg font-bold text-slate-900">Pixel & Takip Kodları</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Facebook size={16} className="text-[#1877F2]" /> Facebook Pixel ID
                                </label>
                                <input
                                    type="text"
                                    value={fbPixelId}
                                    onChange={(e) => setFbPixelId(e.target.value)}
                                    placeholder="Örn: 123456789012345"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                    <Globe size={16} className="text-orange-500" /> Google Analytics ID (GA4)
                                </label>
                                <input
                                    type="text"
                                    value={gaTrackingId}
                                    onChange={(e) => setGaTrackingId(e.target.value)}
                                    placeholder="Örn: G-XXXXXXXXXX"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                />
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
                            Bu kodlar menü sayfanıza otomatik olarak entegre edilecektir. Dönüşüm takibi için herhangi bir ek kod eklemenize gerek yoktur.
                        </p>
                    </div>

                    {/* Custom Domain Section (Informational for now) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 opacity-80">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
                            <div className="flex items-center gap-3">
                                <LinkIcon className="text-slate-500" size={24} />
                                <h2 className="text-lg font-bold text-slate-900">Özel Alan Adı (CName)</h2>
                            </div>
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Plan Üstü</span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-sm text-slate-600 mb-4">
                                    Menünüzü `menu.{customDomain || 'restoran-adiniz.com'}` gibi kendi web sitenizin altında çalıştırabilirsiniz.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CName Hedefi</label>
                                        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono">
                                            <span>app.qrlamenu.com</span>
                                            <button type="button" className="text-slate-400 hover:text-slate-900"><Copy size={14} /></button>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Durum</label>
                                        <div className="text-xs font-bold text-amber-500 mt-2">Desteğe başvurun</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
