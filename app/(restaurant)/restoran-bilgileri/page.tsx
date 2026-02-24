"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    FolderPlus,
    Instagram,
    Facebook,
    Globe,
    MessageCircle,
    Image as ImageIcon,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Save,
    Upload,
    ExternalLink,
    Palette,
    Lock,
    Store,
    Activity,
    Smartphone,
    Briefcase,
    Settings2,
    ShoppingBag,
    DollarSign,
    LayoutGrid,
    Target,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    Edit,
    Package,
    GripVertical
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function RestoranBilgileri() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('LITE');

    const AVAILABLE_THEMES = [
        { key: 'LITE', name: 'Lite Tema', desc: 'Sade ve hızlı liste görünümü', color: '#ff7a21', icon: '📋' },
        { key: 'CLASSIC', name: 'Klasik Tema', desc: 'Geleneksel grid menü', color: '#2c3e50', icon: '🍽️' },
        { key: 'MODERN', name: 'Modern Tema', desc: 'Şık kart tasarımı', color: '#6366f1', icon: '✨' },
        { key: 'SIGNATURE', name: 'Signature Tema', desc: 'Premium lüks görünüm', color: '#d4af37', icon: '👑' },
    ];
    const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
    const [restaurantColor, setRestaurantColor] = useState('#ff6e01');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);

    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        subtitle: '',
        timing: '',
        description: '',
        address: '',
        instagram: '',
        facebook: '',
        whatsapp: '',
        website: '',
        youtube: '',
        allowCallWaiter: '1',
        allowOnTableOrder: '1',
        allowTakeawayOrder: '1',
        allowHotelOrder: '0',
        allowDeliveryOrder: '1',
        deliveryCharge: '0',
        sendOrderNotification: '1'
    });

    useEffect(() => {
        const fetchData = async () => {

            try {
                const res = await fetch('/api/restaurant/settings');
                if (res.ok) {
                    const data = await res.json();
                    const s = data.settings || {};
                    setAvailableFeatures(data.availableFeatures || []);
                    setSelectedTemplate(data.theme || 'LITE');
                    if (s.restaurantColor) setRestaurantColor(s.restaurantColor);
                    if (data.logoUrl) setLogoPreview(data.logoUrl);
                    if (s.coverUrl) setCoverPreview(s.coverUrl);
                    setFormData({
                        name: data.name || '',
                        slug: data.slug || '',
                        subtitle: s.subtitle || '',
                        timing: s.timing || '',
                        description: s.description || '',
                        address: s.address || '',
                        instagram: s.instagram || '',
                        facebook: s.facebook || '',
                        whatsapp: s.whatsapp || '',
                        website: s.website || '',
                        youtube: s.youtube || '',
                        allowCallWaiter: s.allowCallWaiter ? '1' : '0',
                        allowOnTableOrder: s.allowOnTableOrder ? '1' : '0',
                        allowTakeawayOrder: s.allowTakeawayOrder ? '1' : '0',
                        allowHotelOrder: s.allowHotelOrder ? '1' : '0',
                        allowDeliveryOrder: s.allowDeliveryOrder ? '1' : '0',
                        deliveryCharge: s.deliveryCharge ? String(s.deliveryCharge) : '0',
                        sendOrderNotification: s.sendOrderNotification ? '1' : '0'
                    });
                }
            } catch (e) { console.error("Settings fetch error", e); }
            finally { setPageLoading(false); }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const checkSlugAvailability = async () => {
        if (!formData.slug) return;
        setSlugStatus('checking');
        // Simulated check - in real app would call API
        setTimeout(() => {
            setSlugStatus('available');
        }, 800);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setNotification(null);
        try {
            const body = { ...formData, restaurant_template: selectedTemplate, restaurantColor, logoUrl: logoPreview, coverUrl: coverPreview };
            const res = await fetch('/api/restaurant/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                setNotification({ type: 'success', message: 'Restoran bilgileri başarıyla güncellendi!' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setNotification({ type: 'error', message: data.error || 'Bir hata oluştu.' });
            }
        } catch {
            setNotification({ type: 'error', message: 'Bağlantı hatası.' });
        } finally {
            setLoading(false);
        }
    };

    const openLivePreview = () => {
        const url = `/r/${formData.slug}`;
        window.open(url, 'live-preview', `toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=${window.screen.height},top=0,left=0`);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (type === 'logo') setLogoPreview(ev.target?.result as string);
                else setCoverPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">YÜKLENİYOR...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 20 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-0 left-1/2 z-[9999] flex items-center gap-3 px-8 py-4 rounded-[24px] shadow-2xl backdrop-blur-md border ${notification.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-rose-500/90 text-white border-rose-400/50'}`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="text-xs font-black tracking-widest uppercase leading-none">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="bg-white border-b-2 border-gray-50 pt-16 pb-12 px-8 md:px-12 relative z-30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <Link href="/dashboard" className="hover:text-orange-500 transition-colors">PANEL</Link>
                                <ChevronRight size={10} className="text-gray-300" />
                                <span className="text-orange-500">RESTORAN BİLGİLERİ</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-900 rounded-[32px] flex items-center justify-center shadow-2xl shadow-gray-900/20 transform-gpu hover:scale-110 transition-transform duration-500">
                                    <Store size={36} className="text-orange-500" strokeWidth={1.5} />
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">RESTORAN PROFİLİ</h1>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">PROFİL YÖNETİMİ</span>
                                        <div className="h-1 w-1 bg-gray-300 rounded-full" />
                                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] bg-orange-50 px-3 py-1 rounded-full border border-orange-100">{formData.name.toUpperCase() || 'YENİ İŞLETME'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={openLivePreview}
                                className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-5 rounded-[24px] text-[10px] font-black tracking-widest hover:border-gray-900 transition-all active:scale-95 group"
                            >
                                <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                                CANLI ÖNİZLEME
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-gray-900 text-white px-8 py-5 rounded-[24px] flex items-center gap-3 text-[10px] font-black tracking-widest shadow-xl shadow-gray-900/10 hover:bg-orange-500 transition-all active:scale-95 border-b-4 border-black/20"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {loading ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 md:p-12 lg:p-16">
                <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Core Info */}
                        <div className="lg:col-span-8 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/5 border-2 border-slate-50 overflow-hidden group"
                            >
                                <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-[18px] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Store size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">TEMEL İŞLETME BİLGİLERİ</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 italic font-black text-orange-500 text-xs">
                                        01
                                    </div>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                RESTORAN ADI <span className="text-orange-500">*</span>
                                            </label>
                                            <div className="flex gap-4">
                                                <div
                                                    className="w-16 h-16 rounded-[22px] border-4 border-gray-50 flex-shrink-0 cursor-pointer hover:scale-105 transition-all flex items-center justify-center shadow-lg relative overflow-hidden group/color"
                                                    style={{ backgroundColor: restaurantColor }}
                                                    onClick={() => colorInputRef.current?.click()}
                                                >
                                                    <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 transition-colors flex items-center justify-center">
                                                        <Palette size={20} className="text-white opacity-0 group-hover/color:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                                <input
                                                    ref={colorInputRef}
                                                    type="color"
                                                    value={restaurantColor}
                                                    onChange={e => setRestaurantColor(e.target.value)}
                                                    className="sr-only"
                                                />
                                                <input
                                                    type="text" name="name" value={formData.name}
                                                    onChange={handleChange}
                                                    className="flex-1 px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-orange-500 focus:bg-white transition-all outline-none uppercase placeholder:text-gray-300 shadow-inner"
                                                    placeholder="İŞLETME ADINI GİRİNİZ"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                BAĞLANTI ADRESİ (SLUG) <span className="text-orange-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text" name="slug" value={formData.slug}
                                                    onChange={handleChange}
                                                    onBlur={checkSlugAvailability}
                                                    className={`w-full px-8 py-5 bg-gray-50 border-2 rounded-[24px] text-xs font-black tracking-widest focus:border-orange-500 focus:bg-white transition-all outline-none lowercase shadow-inner ${slugStatus === 'available' ? 'border-emerald-100 text-emerald-600' :
                                                        slugStatus === 'taken' ? 'border-rose-100 text-rose-600' : 'border-gray-100 text-gray-900'
                                                        }`}
                                                    placeholder="restoran-adiniz"
                                                    required
                                                />
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                                    {slugStatus === 'checking' && <Loader2 size={16} className="animate-spin text-gray-400" />}
                                                    {slugStatus === 'available' && <CheckCircle2 size={16} className="text-emerald-500" />}
                                                    {slugStatus === 'taken' && <AlertCircle size={16} className="text-rose-500" />}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-6">
                                                <Globe size={12} className="text-gray-300" />
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">URL: MESADİJİTAL.COM/R/</span>
                                                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-orange-100">{formData.slug || '...'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">SLOGAN / ALT BAŞLIK</label>
                                            <input
                                                type="text" name="subtitle" value={formData.subtitle}
                                                onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-orange-500 focus:bg-white transition-all outline-none uppercase placeholder:text-gray-300 shadow-inner"
                                                placeholder="LEZZETİN YENİ ADRESİ..."
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">ÇALIŞMA SAATLERİ</label>
                                            <input
                                                type="text" name="timing" value={formData.timing}
                                                onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-orange-500 focus:bg-white transition-all outline-none uppercase placeholder:text-gray-300 shadow-inner"
                                                placeholder="08:00 - 23:00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">İŞLETME AÇIKLAMASI</label>
                                        <textarea
                                            name="description" value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-8 py-8 bg-gray-50 border-2 border-gray-100 rounded-[32px] text-xs font-black text-gray-900 focus:border-orange-500 focus:bg-white transition-all outline-none uppercase placeholder:text-gray-300 min-h-[160px] shadow-inner resize-none leading-relaxed"
                                            placeholder="İŞLETMENİZ HAKKINDA BİLGİ VERİN..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                            <MapPin size={12} className="text-orange-500 font-bold" /> ADRES BİLGİSİ
                                        </label>
                                        <input
                                            type="text" name="address" value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-orange-500 focus:bg-white transition-all outline-none uppercase placeholder:text-gray-300 shadow-inner"
                                            placeholder="TAM ADRESİNİZİ GİRİNİZ"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/5 border-2 border-slate-50 overflow-hidden group"
                            >
                                <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-[18px] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Smartphone size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">SOSYAL MEDYA & İLETİŞİM</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 italic font-black text-orange-500 text-xs">
                                        02
                                    </div>
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-pink-500">
                                                <Instagram size={14} className="text-pink-100 group-focus-within/social:text-pink-500 transition-colors" /> INSTAGRAM
                                            </div>
                                            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-pink-500 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                                placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-4 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-blue-600">
                                                <Facebook size={14} className="text-blue-100 group-focus-within/social:text-blue-600 transition-colors" /> FACEBOOK
                                            </div>
                                            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-blue-600 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                                placeholder="https://facebook.com/..." />
                                        </div>
                                        <div className="space-y-4 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-emerald-500">
                                                <MessageCircle size={14} className="text-emerald-100 group-focus-within/social:text-emerald-500 transition-colors" /> WHATSAPP
                                            </div>
                                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                                placeholder="+90 5XX XXX XX XX" />
                                        </div>
                                        <div className="space-y-4 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-gray-900">
                                                <Globe size={14} className="text-gray-100 group-focus-within/social:text-gray-900 transition-colors" /> WEB SİTESİ
                                            </div>
                                            <input type="text" name="website" value={formData.website} onChange={handleChange}
                                                className="w-full px-8 py-5 bg-gray-50 border-2 border-gray-100 rounded-[24px] text-xs font-black text-gray-900 focus:border-gray-900 focus:bg-white outline-none transition-all shadow-inner uppercase"
                                                placeholder="www.isletmeniz.com" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Visuals & Templates */}
                        <div className="lg:col-span-4 space-y-10">
                            {/* Images Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/5 border-2 border-slate-50 overflow-hidden group"
                            >
                                <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-[18px] shadow-lg group-hover:rotate-12 transition-transform duration-500">
                                            <ImageIcon size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">MATERYALLER</h3>
                                    </div>
                                    <Target size={18} className="text-gray-200" />
                                </div>
                                <div className="p-10 space-y-10">
                                    {/* Logo Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">KURUMSAL LOGO</label>
                                        <div className="relative group/upload overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all duration-500">
                                            <div className="w-32 h-32 rounded-[24px] bg-white mx-auto shadow-2xl border-4 border-gray-50 flex items-center justify-center overflow-hidden mb-6 group-hover/upload:scale-110 transition-transform duration-500 relative">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={40} className="text-gray-100" />
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Plus size={24} className="text-white" />
                                                </div>
                                            </div>
                                            <label className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[9px] font-black tracking-widest cursor-pointer hover:bg-orange-500 transition-all shadow-lg shadow-gray-900/10">
                                                <Upload size={14} /> GÜNCELLE
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cover Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">KAPAK GÖRSELİ</label>
                                        <div className="relative group/upload overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] p-6 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50/30 transition-all duration-500">
                                            <div className="w-full h-32 rounded-[24px] bg-white mx-auto shadow-xl border-4 border-gray-50 flex items-center justify-center overflow-hidden mb-6 group-hover/upload:scale-[1.02] transition-transform duration-500 relative">
                                                {coverPreview ? (
                                                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <ImageIcon size={32} className="text-gray-100" />
                                                        <span className="text-[8px] font-black text-gray-200">1200x400 ÖNERİLİR</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Plus size={24} className="text-white" />
                                                </div>
                                            </div>
                                            <label className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 text-white rounded-2xl text-[9px] font-black tracking-widest cursor-pointer hover:bg-orange-500 transition-all shadow-lg shadow-gray-900/10">
                                                <Upload size={14} /> DEĞİŞTİR
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Theme Selection */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/5 border-2 border-slate-50 overflow-hidden group"
                            >
                                <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/20">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-900 text-white p-3 rounded-[18px] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                            <Palette size={20} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">GÖRÜNÜM TEMASI</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 italic font-black text-orange-500 text-xs">
                                        03
                                    </div>
                                </div>
                                <div className="p-10 space-y-4">
                                    {AVAILABLE_THEMES.map((theme) => {
                                        const isPremiumTheme = theme.key !== 'LITE' && theme.key !== 'CLASSIC';
                                        const isLocked = isPremiumTheme && !availableFeatures.includes('Premium Tema') && !availableFeatures.includes('Pro Tema');
                                        const isActive = selectedTemplate === theme.key;

                                        return (
                                            <motion.div
                                                key={theme.key}
                                                whileHover={!isLocked ? { scale: 1.02, x: 4 } : {}}
                                                whileTap={!isLocked ? { scale: 0.98 } : {}}
                                                className={`relative p-6 rounded-[28px] border-2 transition-all cursor-pointer flex items-center gap-5 ${isActive ? 'border-orange-500 bg-orange-50/30' :
                                                    isLocked ? 'border-gray-100 bg-gray-50 opacity-60 grayscale cursor-not-allowed' :
                                                        'border-gray-50 hover:border-gray-900 hover:bg-gray-50/50'
                                                    }`}
                                                onClick={() => {
                                                    if (!isLocked) setSelectedTemplate(theme.key);
                                                    else setNotification({ type: 'error', message: 'BU TEMA İÇİN PAKETİNİZİ YÜKSELTMELİSİNİZ' });
                                                }}
                                            >
                                                <div className="w-16 h-16 rounded-[20px] bg-white shadow-xl border-2 border-gray-100 flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-transform">
                                                    {theme.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-orange-600' : 'text-gray-900'}`}>{theme.name}</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter leading-tight mt-1">{theme.desc}</p>
                                                </div>
                                                {isLocked ? (
                                                    <div className="bg-gray-900 text-white p-2 rounded-xl shadow-lg">
                                                        <Lock size={12} strokeWidth={3} />
                                                    </div>
                                                ) : isActive && (
                                                    <div className="bg-orange-500 text-white p-2 rounded-xl shadow-lg animate-bounce-subtle">
                                                        <CheckCircle2 size={12} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Permissions Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[40px] shadow-2xl shadow-gray-900/5 border-2 border-slate-50 overflow-hidden group"
                    >
                        <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-gray-50/20">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-900 text-white p-3 rounded-[18px] shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <Settings2 size={20} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em]">SİSTEM VE İZİN AYARLARI</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 italic font-black text-orange-500 text-xs">
                                04
                            </div>
                        </div>
                        <div className="p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[
                                    { label: 'GARSON ÇAĞIRMA', name: 'allowCallWaiter', req: 'Garson Çağrı Sistemi', icon: <Activity size={16} /> },
                                    { label: 'MASADA SİPARİŞ', name: 'allowOnTableOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Smartphone size={16} /> },
                                    { label: 'GEL-AL SİPARİŞ', name: 'allowTakeawayOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <ShoppingBag size={16} /> },
                                    { label: 'ODAYA SİPARİŞ', name: 'allowHotelOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Briefcase size={16} /> },
                                    { label: 'ADRESE TESLİMAT', name: 'allowDeliveryOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <MapPin size={16} /> },
                                    { label: 'ANLIK BİLDİRİM', name: 'sendOrderNotification', req: null, icon: <Activity size={16} /> },
                                ].map((s) => {
                                    const isLocked = s.req && !availableFeatures.includes(s.req) && !(s.req === 'Gelişmiş Sipariş Yönetimi' && availableFeatures.includes('Sipariş Alma'));
                                    return (
                                        <div key={s.name} className={`space-y-4 p-8 rounded-[32px] border-2 transition-all ${isLocked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-50 hover:border-gray-900 hover:shadow-xl hover:shadow-gray-200/50'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-[16px] ${isLocked ? 'bg-gray-200 text-gray-400' : 'bg-orange-50 text-orange-500 shadow-sm'}`}>
                                                        {s.icon}
                                                    </div>
                                                    <span className="text-[10px] font-black tracking-widest text-gray-900 uppercase">{s.label}</span>
                                                </div>
                                                {isLocked && <Lock size={14} className="text-gray-400" />}
                                            </div>
                                            <div className="relative">
                                                <select
                                                    name={s.name}
                                                    // @ts-ignore
                                                    value={isLocked ? "0" : formData[s.name]}
                                                    onChange={(e) => { if (!isLocked) handleChange(e); }}
                                                    className={`w-full px-6 py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer ${isLocked ? 'bg-gray-100 border-gray-100 cursor-not-allowed text-gray-400' : 'bg-gray-50 border-gray-100 focus:border-gray-900 focus:bg-white'}`}
                                                    disabled={!!isLocked}
                                                >
                                                    <option value="1">✓ AKTİF</option>
                                                    <option value="0">✕ PASİF</option>
                                                </select>
                                                {!isLocked && <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="space-y-4 p-8 rounded-[32px] border-2 border-gray-50 bg-white hover:border-gray-900 hover:shadow-xl hover:shadow-gray-200/50 transition-all group/charge">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-[16px] bg-blue-50 text-blue-500 shadow-sm group-hover/charge:scale-110 transition-transform">
                                            <DollarSign size={16} />
                                        </div>
                                        <span className="text-[10px] font-black tracking-widest text-gray-900 uppercase">TESLİMAT ÜCRETİ</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number" name="deliveryCharge"
                                            value={formData.deliveryCharge} onChange={handleChange}
                                            className="w-full px-8 py-4 border-2 border-gray-100 bg-gray-50 rounded-2xl text-xs font-black text-gray-900 focus:border-gray-900 focus:bg-white outline-none transition-all shadow-inner"
                                        />
                                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs font-black text-gray-300">₺</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>

                {/* Footer Section */}
                <div className="max-w-7xl mx-auto mt-24 text-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-gray-100" />
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">© {new Date().getFullYear()} QRlamenü — TÜM HAKLARI SAKLIDIR</p>
                        <div className="h-px w-12 bg-gray-100" />
                    </div>
                    <div className="flex items-center justify-center gap-8 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                        <Instagram size={20} className="cursor-pointer hover:text-pink-500 transition-colors" />
                        <Facebook size={20} className="cursor-pointer hover:text-blue-600 transition-colors" />
                        <Globe size={20} className="cursor-pointer hover:text-gray-900 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}
