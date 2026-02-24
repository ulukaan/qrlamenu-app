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

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';

export default function RestoranBilgileri() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState('LITE');

    const AVAILABLE_THEMES = [
        { key: 'LITE', name: 'Lite Tema', desc: 'Sade ve hızlı liste görünümü', color: '#ea580c', icon: '📋' },
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
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">YÜKLENİYOR...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 left-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-md shadow-xl backdrop-blur-md border ${notification.type === 'success' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[10px] font-black tracking-widest uppercase">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white border-b border-slate-100 py-4 px-6 lg:px-8 relative z-30 shadow-sm w-full">
                <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start md:items-center gap-4 md:gap-6">
                        <MobileMenuToggle />
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                <Link href="/dashboard" className="hover:text-slate-900 transition-colors">PANEL</Link>
                                <ChevronRight size={8} className="text-gray-300" />
                                <span className="text-slate-900">RESTORAN BİLGİLERİ</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-md flex items-center justify-center shadow-lg">
                                    <Store size={24} className="text-white" strokeWidth={2} />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">RESTORAN PROFİLİ</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PROFİL YÖNETİMİ</span>
                                        <div className="h-0.5 w-0.5 bg-gray-300 rounded-full" />
                                        <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">{formData.name || 'YENİ İŞLETME'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={openLivePreview}
                                className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-6 py-3 rounded-md text-[10px] font-black tracking-widest hover:border-slate-900 transition-all active:scale-95 uppercase"
                            >
                                <ExternalLink size={14} />
                                CANLI ÖNİZLEME
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-slate-900 text-white px-6 py-3 rounded-md flex items-center gap-2 text-[10px] font-black tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-md"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {loading ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                            </button>
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 lg:p-8 flex-1 w-full mx-auto flex flex-col">
                <form onSubmit={handleSubmit} className="w-full mx-auto space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Core Info */}
                        <div className="lg:col-span-8 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-md">
                                            <Store size={16} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">TEMEL İŞLETME BİLGİLERİ</h3>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 italic">01</div>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                                                RESTORAN ADI <span className="text-orange-600">*</span>
                                            </label>
                                            <div className="flex gap-4">
                                                <div
                                                    className="w-12 h-12 rounded-none border border-slate-200 flex-shrink-0 cursor-pointer hover:bg-slate-50 transition-all flex items-center justify-center relative overflow-hidden group/color"
                                                    style={{ backgroundColor: restaurantColor }}
                                                    onClick={() => colorInputRef.current?.click()}
                                                >
                                                    <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 transition-colors flex items-center justify-center">
                                                        <Palette size={16} className="text-white opacity-0 group-hover/color:opacity-100 transition-opacity" />
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
                                                    className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-gray-900 focus:border-slate-900 transition-all outline-none uppercase placeholder:text-gray-300"
                                                    placeholder="İŞLETME ADINI GİRİNİZ"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                BAĞLANTI ADRESİ (SLUG) <span className="text-orange-600">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text" name="slug" value={formData.slug}
                                                    onChange={handleChange}
                                                    onBlur={checkSlugAvailability}
                                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-[11px] font-bold tracking-widest focus:border-slate-900 transition-all outline-none lowercase"
                                                    placeholder="restoran-adiniz"
                                                    required
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {slugStatus === 'checking' && <Loader2 size={12} className="animate-spin text-gray-400" />}
                                                    {slugStatus === 'available' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                                    {slugStatus === 'taken' && <AlertCircle size={12} className="text-rose-500" />}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-6">
                                                <Globe size={12} className="text-gray-300" />
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">URL: MESADİJİTAL.COM/R/</span>
                                                <span className="text-[9px] font-black text-orange-600 uppercase tracking-widest underline decoration-2 underline-offset-4 decoration-orange-100">{formData.slug || '...'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">SLOGAN / ALT BAŞLIK</label>
                                            <input
                                                type="text" name="subtitle" value={formData.subtitle}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-gray-900 focus:border-slate-900 transition-all outline-none uppercase placeholder:text-gray-300"
                                                placeholder="LEZZETİN YENİ ADRESİ..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">ÇALIŞMA SAATLERİ</label>
                                            <input
                                                type="text" name="timing" value={formData.timing}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-[11px] font-bold text-gray-900 focus:border-slate-900 transition-all outline-none uppercase placeholder:text-gray-300"
                                                placeholder="08:00 - 23:00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">İŞLETME AÇIKLAMASI</label>
                                        <textarea
                                            name="description" value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-orange-600 transition-all outline-none uppercase placeholder:text-gray-300 min-h-[120px] resize-none leading-relaxed"
                                            placeholder="İŞLETMENİZ HAKKINDA BİLGİ VERİN..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <MapPin size={10} className="text-orange-600" /> ADRES BİLGİSİ
                                        </label>
                                        <input
                                            type="text" name="address" value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-orange-600 transition-all outline-none uppercase placeholder:text-gray-300"
                                            placeholder="TAM ADRESİNİZİ GİRİNİZ"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-none">
                                            <Smartphone size={16} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">SOSYAL MEDYA & İLETİŞİM</h3>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 italic">02</div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-pink-500">
                                                <Instagram size={12} className="text-pink-200 group-focus-within/social:text-pink-500 transition-colors" /> INSTAGRAM
                                            </div>
                                            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-pink-500 outline-none transition-all uppercase"
                                                placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-blue-600">
                                                <Facebook size={12} className="text-blue-200 group-focus-within/social:text-blue-600 transition-colors" /> FACEBOOK
                                            </div>
                                            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-blue-600 outline-none transition-all uppercase"
                                                placeholder="https://facebook.com/..." />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-emerald-500">
                                                <MessageCircle size={12} className="text-emerald-200 group-focus-within/social:text-emerald-500 transition-colors" /> WHATSAPP
                                            </div>
                                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-emerald-500 outline-none transition-all uppercase"
                                                placeholder="+90 5XX XXX XX XX" />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1 transition-colors group-focus-within/social:text-gray-900">
                                                <Globe size={12} className="text-slate-300 group-focus-within/social:text-gray-900 transition-colors" /> WEB SİTESİ
                                            </div>
                                            <input type="text" name="website" value={formData.website} onChange={handleChange}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-none text-[11px] font-bold text-gray-900 focus:border-gray-900 outline-none transition-all uppercase"
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
                                className="bg-white rounded-md shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-md">
                                            <ImageIcon size={16} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">MATERYALLER</h3>
                                    </div>
                                    <Target size={14} className="text-slate-300" />
                                </div>
                                <div className="p-6 space-y-6">
                                    {/* Logo Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">KURUMSAL LOGO</label>
                                        <div className="relative group/upload overflow-hidden bg-slate-50 border border-dashed border-slate-200 rounded-md p-4 text-center cursor-pointer hover:bg-slate-100 transition-all duration-300">
                                            <div className="w-20 h-20 rounded-md bg-white mx-auto border border-slate-200 flex items-center justify-center overflow-hidden mb-4 relative">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-slate-100" />
                                                )}
                                            </div>
                                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-[9px] font-black tracking-widest cursor-pointer hover:bg-orange-600 transition-all">
                                                <Upload size={12} /> GÜNCELLE
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cover Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">KAPAK GÖRSELİ</label>
                                        <div className="relative group/upload overflow-hidden bg-slate-50 border border-dashed border-slate-200 rounded-none p-4 text-center cursor-pointer hover:bg-slate-100 transition-all duration-300">
                                            <div className="w-full h-20 rounded-none bg-white mx-auto border border-slate-200 flex items-center justify-center overflow-hidden mb-4 relative">
                                                {coverPreview ? (
                                                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ImageIcon size={20} className="text-slate-100" />
                                                        <span className="text-[8px] font-bold text-slate-300">1200x400</span>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-md text-[9px] font-black tracking-widest cursor-pointer hover:bg-orange-600 transition-all">
                                                <Upload size={12} /> DEĞİŞTİR
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-none">
                                            <Palette size={16} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">GÖRÜNÜM TEMASI</h3>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 italic">03</div>
                                </div>
                                <div className="p-4 space-y-2">
                                    {AVAILABLE_THEMES.map((theme) => {
                                        const isPremiumTheme = theme.key !== 'LITE' && theme.key !== 'CLASSIC';
                                        const isLocked = isPremiumTheme && !availableFeatures.includes('Premium Tema') && !availableFeatures.includes('Pro Tema');
                                        const isActive = selectedTemplate === theme.key;

                                        return (
                                            <motion.div
                                                key={theme.key}
                                                whileHover={!isLocked ? { x: 4 } : {}}
                                                className={`relative p-3 rounded-none border transition-all cursor-pointer flex items-center gap-4 ${isActive ? 'border-slate-900 bg-slate-50' :
                                                    isLocked ? 'border-slate-100 opacity-60 grayscale cursor-not-allowed' :
                                                        'border-slate-200 hover:border-slate-400'
                                                    }`}
                                                onClick={() => {
                                                    if (!isLocked) setSelectedTemplate(theme.key);
                                                    else setNotification({ type: 'error', message: 'BU TEMA İÇİN PAKETİNİZİ YÜKSELTMELİSİNİZ' });
                                                }}
                                            >
                                                <div className="w-12 h-12 rounded-none bg-white border border-slate-200 flex items-center justify-center text-xl">
                                                    {theme.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-slate-900' : 'text-gray-900'}`}>{theme.name}</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight mt-1 truncate">{theme.desc}</p>
                                                </div>
                                                {isLocked ? (
                                                    <Lock size={12} className="text-slate-400" />
                                                ) : isActive && (
                                                    <CheckCircle2 size={12} className="text-slate-900" />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 text-white p-2 rounded-none">
                                    <Settings2 size={16} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">SİSTEM VE İZİN AYARLARI</h3>
                            </div>
                            <div className="text-[10px] font-black text-slate-300 italic">04</div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { label: 'GARSON ÇAĞIRMA', name: 'allowCallWaiter', req: 'Garson Çağrı Sistemi', icon: <Activity size={12} /> },
                                    { label: 'MASADA SİPARİŞ', name: 'allowOnTableOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Smartphone size={12} /> },
                                    { label: 'GEL-AL SİPARİŞ', name: 'allowTakeawayOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <ShoppingBag size={12} /> },
                                    { label: 'ODAYA SİPARİŞ', name: 'allowHotelOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Briefcase size={12} /> },
                                    { label: 'ADRESE TESLİMAT', name: 'allowDeliveryOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <MapPin size={12} /> },
                                    { label: 'ANLIK BİLDİRİM', name: 'sendOrderNotification', req: null, icon: <Activity size={12} /> },
                                ].map((s) => {
                                    const isLocked = s.req && !availableFeatures.includes(s.req) && !(s.req === 'Gelişmiş Sipariş Yönetimi' && availableFeatures.includes('Sipariş Alma'));
                                    return (
                                        <div key={s.name} className={`space-y-3 p-4 rounded-none border transition-all ${isLocked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-md ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white shadow-sm'}`}>
                                                        {s.icon}
                                                    </div>
                                                    <span className="text-[9px] font-black tracking-widest text-gray-900 uppercase">{s.label}</span>
                                                </div>
                                                {isLocked && <Lock size={10} className="text-slate-400" />}
                                            </div>
                                            <div className="relative">
                                                <select
                                                    name={s.name}
                                                    // @ts-ignore
                                                    value={isLocked ? "0" : formData[s.name]}
                                                    onChange={(e) => { if (!isLocked) handleChange(e); }}
                                                    className={`w-full px-3 py-2 border rounded-none text-[9px] font-black uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer ${isLocked ? 'bg-slate-100 border-slate-100 cursor-not-allowed text-slate-400' : 'bg-white border-slate-200 focus:border-slate-900'}`}
                                                    disabled={!!isLocked}
                                                >
                                                    <option value="1">✓ AKTİF</option>
                                                    <option value="0">✕ PASİF</option>
                                                </select>
                                                {!isLocked && <ChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="space-y-3 p-4 rounded-none border border-slate-200 bg-white hover:border-slate-400 transition-all group/charge">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-none bg-slate-900 text-white shadow-sm">
                                            <DollarSign size={12} />
                                        </div>
                                        <span className="text-[9px] font-black tracking-widest text-gray-900 uppercase">TESLİMAT ÜCRETİ</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number" name="deliveryCharge"
                                            value={formData.deliveryCharge} onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-200 bg-white rounded-none text-[11px] font-bold text-gray-900 focus:border-slate-900 outline-none transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300">₺</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>

                {/* Footer Section */}
                <div className="w-full mx-auto mt-24 text-center space-y-6">
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
        </div >
    );
}
