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
import { LoadingScreen } from '@/components/ui/loading-screen';

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

    const hasFeature = (keyword: string) => {
        if (!availableFeatures || availableFeatures.length === 0) return false;
        if (availableFeatures.some(f => f.toLowerCase().includes('tüm özellikler') || f.toLowerCase().includes('her şey dahil'))) {
            return true;
        }
        return availableFeatures.some(f => f.toLowerCase().includes(keyword.toLowerCase()));
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

    if (pageLoading) return <LoadingScreen message="RESTORAN VERİLERİ OKUNUYOR" />;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 10, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-12 left-1/2 z-[100] px-6 py-4 rounded-[6px] shadow-xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : <AlertCircle size={18} strokeWidth={2.5} />}
                        <span className="text-[11px] font-bold tracking-widest uppercase">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                    <span className="text-slate-900 uppercase tracking-[0.2em]">RESTORAN BİLGİLERİ</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-900 text-white p-3 rounded-[6px] shadow-sm">
                                        <Store size={20} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none uppercase">RESTORAN PROFİLİ</h1>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PROFİL YÖNETİMİ</span>
                                            <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                            <span className="text-[9px] font-bold text-slate-900 px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-[4px] uppercase tracking-widest">{formData.name || 'YENİ İŞLETME'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={openLivePreview}
                                    className="h-9 flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 px-5 rounded-[6px] text-[10px] font-bold tracking-widest hover:border-slate-900 transition-all active:scale-95 uppercase shadow-sm"
                                >
                                    <ExternalLink size={14} strokeWidth={2.5} />
                                    ÖNİZLEME
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="h-9 bg-slate-900 text-white px-6 rounded-[6px] flex items-center gap-2 text-[10px] font-bold tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-md uppercase"
                                >
                                    {loading ? <Loader2 size={14} strokeWidth={2.5} className="animate-spin" /> : <Save size={14} strokeWidth={2.5} />}
                                    {loading ? 'YÜKLENİYOR' : 'KAYDET'}
                                </button>
                            </div>
                        </div>
                        <ProfileDropdown />
                    </div>
                </div>
            </div>

            <div className="p-6 lg:p-8 flex-1 w-full mx-auto flex flex-col">
                <form onSubmit={handleSubmit} className="w-full mx-auto space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Core Info */}
                        <div className="lg:col-span-8 space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                            <Store size={15} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">TEMEL İŞLETME BİLGİLERİ</h3>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 tracking-widest">01</div>
                                </div>
                                <div className="p-5 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                Restoran Adı <span className="text-orange-600 font-bold">*</span>
                                            </label>
                                            <div className="flex gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-[4px] border border-slate-200 flex-shrink-0 cursor-pointer hover:scale-105 transition-all flex items-center justify-center relative shadow-sm overflow-hidden group/color"
                                                    style={{ backgroundColor: restaurantColor }}
                                                    onClick={() => colorInputRef.current?.click()}
                                                >
                                                    <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 transition-colors flex items-center justify-center">
                                                        <Palette size={14} className="text-white opacity-0 group-hover/color:opacity-100 transition-opacity" />
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
                                                    className="h-10 flex-1 px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none placeholder:text-slate-300 uppercase tracking-widest"
                                                    placeholder="İşletme adını giriniz"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                Slug / Bağlantı Adresi <span className="text-orange-600 font-bold">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text" name="slug" value={formData.slug}
                                                    onChange={handleChange}
                                                    onBlur={checkSlugAvailability}
                                                    className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold tracking-widest focus:bg-white focus:border-slate-900 transition-all outline-none lowercase"
                                                    placeholder="restoran-adiniz"
                                                    required
                                                />
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                    {slugStatus === 'checking' && <Loader2 size={12} className="animate-spin text-slate-400" />}
                                                    {slugStatus === 'available' && <CheckCircle2 size={12} className="text-emerald-500" />}
                                                    {slugStatus === 'taken' && <AlertCircle size={12} className="text-rose-500" />}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-1">
                                                <Globe size={11} className="text-slate-300" />
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">URL: MESADİJİTAL.COM/R/</span>
                                                <span className="text-[9px] font-bold text-[#ff6e01] uppercase tracking-widest underline decoration-1 underline-offset-4 decoration-orange-100">{formData.slug || '...'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Slogan / Alt Başlık</label>
                                            <input
                                                type="text" name="subtitle" value={formData.subtitle}
                                                onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none uppercase tracking-widest"
                                                placeholder="Lezzetin yeni adresi..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Çalışma Saatleri</label>
                                            <input
                                                type="text" name="timing" value={formData.timing}
                                                onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none uppercase tracking-widest"
                                                placeholder="08:00 - 23:00"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İşletme Açıklaması</label>
                                        <textarea
                                            name="description" value={formData.description}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-medium text-slate-700 focus:bg-white focus:border-slate-900 transition-all outline-none placeholder:text-slate-300 min-h-[80px] resize-none leading-relaxed uppercase tracking-tight"
                                            placeholder="İşletmeniz hakkında kısa bir bilgi verin..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <MapPin size={11} className="text-[#ff6e01]" /> Adres Bilgisi
                                        </label>
                                        <input
                                            type="text" name="address" value={formData.address}
                                            onChange={handleChange}
                                            className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 transition-all outline-none uppercase tracking-widest"
                                            placeholder="Tam adresinizi giriniz"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                            <Smartphone size={15} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">SOSYAL MEDYA & İLETİŞİM</h3>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 tracking-widest">02</div>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 group-focus-within/social:text-pink-500 transition-colors">
                                                <Instagram size={11} className="text-slate-300 group-focus-within/social:text-pink-500 transition-colors" /> Instagram
                                            </div>
                                            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-pink-500 outline-none transition-all uppercase tracking-widest"
                                                placeholder="https://instagram.com/..." />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 group-focus-within/social:text-blue-600 transition-colors">
                                                <Facebook size={11} className="text-slate-300 group-focus-within/social:text-blue-600 transition-colors" /> Facebook
                                            </div>
                                            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all uppercase tracking-widest"
                                                placeholder="https://facebook.com/..." />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 group-focus-within/social:text-emerald-500 transition-colors">
                                                <MessageCircle size={11} className="text-slate-300 group-focus-within/social:text-emerald-500 transition-colors" /> WhatsApp
                                            </div>
                                            <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all uppercase tracking-widest"
                                                placeholder="+90 5XX XXX XX XX" />
                                        </div>
                                        <div className="space-y-2 group/social">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 group-focus-within/social:text-slate-900 transition-colors">
                                                <Globe size={11} className="text-slate-300 group-focus-within/social:text-slate-900 transition-colors" /> Web Sitesi
                                            </div>
                                            <input type="text" name="website" value={formData.website} onChange={handleChange}
                                                className="h-10 w-full px-4 bg-slate-50/50 border border-slate-200 rounded-[6px] text-[11px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all uppercase tracking-widest"
                                                placeholder="www.isletmeniz.com" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column: Visuals & Templates */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* Images Section */}
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                            <ImageIcon size={15} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">GÖRSEL MATERYALLER</h3>
                                    </div>
                                    <Target size={14} className="text-slate-200" />
                                </div>
                                <div className="p-5 space-y-6">
                                    {/* Logo Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">KURUMSAL LOGO</label>
                                        <div className="relative group/upload overflow-hidden bg-slate-50/50 border border-dashed border-slate-200 rounded-[6px] p-5 text-center cursor-pointer hover:bg-slate-100/50 transition-all duration-300">
                                            <div className="w-20 h-20 rounded-[4px] bg-white mx-auto border border-slate-100 flex items-center justify-center overflow-hidden mb-4 relative shadow-sm">
                                                {logoPreview ? (
                                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-slate-200" />
                                                )}
                                            </div>
                                            <label className="h-9 inline-flex items-center gap-2 px-4 bg-slate-900 text-white rounded-[4px] text-[10px] font-bold tracking-widest cursor-pointer hover:bg-slate-800 transition-all shadow-md active:scale-95 uppercase">
                                                <Upload size={12} strokeWidth={2.5} /> LOGO YÜKLE
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logo')} />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cover Upload */}
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">KAPAK GÖRSELİ</label>
                                        <div className="relative group/upload overflow-hidden bg-slate-50/50 border border-dashed border-slate-200 rounded-[6px] p-5 text-center cursor-pointer hover:bg-slate-100/50 transition-all duration-300">
                                            <div className="w-full h-24 rounded-[4px] bg-white mx-auto border border-slate-100 flex items-center justify-center overflow-hidden mb-4 relative shadow-sm">
                                                {coverPreview ? (
                                                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ImageIcon size={20} className="text-slate-200" />
                                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">1200x400 ÖNERİLİR</span>
                                                    </div>
                                                )}
                                            </div>
                                            <label className="h-9 inline-flex items-center gap-2 px-4 bg-slate-900 text-white rounded-[4px] text-[10px] font-bold tracking-widest cursor-pointer hover:bg-slate-800 transition-all shadow-md active:scale-95 uppercase">
                                                <Upload size={12} strokeWidth={2.5} /> GÖRSEL YÜKLE
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'cover')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                            <Palette size={15} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">GÖRÜNÜM TEMASI</h3>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 tracking-widest">03</div>
                                </div>
                                <div className="p-3.5 space-y-2">
                                    {AVAILABLE_THEMES.map((theme) => {
                                        const isPremiumTheme = theme.key !== 'LITE' && theme.key !== 'CLASSIC';
                                        const isLocked = isPremiumTheme && !hasFeature('Premium Tema') && !hasFeature('Pro Tema');
                                        const isActive = selectedTemplate === theme.key;

                                        return (
                                            <motion.div
                                                key={theme.key}
                                                whileHover={!isLocked ? { x: 4 } : {}}
                                                className={`relative p-2.5 rounded-[6px] border transition-all cursor-pointer flex items-center gap-3 ${isActive ? 'border-[#ff6e01] bg-orange-50/30' :
                                                    isLocked ? 'border-slate-100 opacity-60 grayscale cursor-not-allowed bg-slate-50/30' :
                                                        'border-slate-100 hover:border-slate-300 bg-white'
                                                    }`}
                                                onClick={() => {
                                                    if (!isLocked) setSelectedTemplate(theme.key);
                                                    else setNotification({ type: 'error', message: 'Bu tema için paketiniz yetersiz' });
                                                }}
                                            >
                                                <div className="w-10 h-10 rounded-[4px] bg-white border border-slate-100 flex items-center justify-center text-lg shadow-sm shrink-0">
                                                    {theme.icon}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h4 className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-[#ff6e01]' : 'text-slate-900'}`}>{theme.name}</h4>
                                                    <p className="text-[9px] font-medium text-slate-400 tracking-tight mt-0.5 truncate uppercase">{theme.desc}</p>
                                                </div>
                                                {isLocked ? (
                                                    <Lock size={12} className="text-slate-300 shrink-0" />
                                                ) : isActive && (
                                                    <div className="bg-[#ff6e01] text-white p-1 rounded-full shadow-sm shrink-0">
                                                        <CheckCircle2 size={10} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                    <Settings2 size={15} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">SİSTEM VE İZİN AYARLARI</h3>
                            </div>
                            <div className="text-[9px] font-bold text-slate-300 tracking-widest">04</div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Garson Çağırma', name: 'allowCallWaiter', req: 'Garson Çağrı Sistemi', icon: <Activity size={12} /> },
                                    { label: 'Masada Sipariş', name: 'allowOnTableOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Smartphone size={12} /> },
                                    { label: 'Gel-Al Sipariş', name: 'allowTakeawayOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <ShoppingBag size={12} /> },
                                    { label: 'Odaya Sipariş', name: 'allowHotelOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <Briefcase size={12} /> },
                                    { label: 'Adrese Teslimat', name: 'allowDeliveryOrder', req: 'Gelişmiş Sipariş Yönetimi', icon: <MapPin size={12} /> },
                                    { label: 'Anlık Bildirim', name: 'sendOrderNotification', req: null, icon: <Activity size={12} /> },
                                ].map((s) => {
                                    const isLocked = s.req && !hasFeature(s.req) && !(s.req === 'Gelişmiş Sipariş Yönetimi' && hasFeature('Sipariş Alma'));
                                    return (
                                        <div key={s.name} className={`space-y-4 p-4 rounded-[6px] border transition-all ${isLocked ? 'bg-slate-50/50 border-slate-100 grayscale-[0.5] opacity-60' : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-[4px] ${isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white shadow-sm'}`}>
                                                        {s.icon}
                                                    </div>
                                                    <span className="text-[10px] font-bold tracking-widest text-slate-900 uppercase">{s.label}</span>
                                                </div>
                                                {isLocked && <Lock size={12} className="text-slate-300" />}
                                            </div>
                                            <div className="relative">
                                                <select
                                                    name={s.name}
                                                    // @ts-ignore
                                                    value={isLocked ? "0" : formData[s.name]}
                                                    onChange={(e) => { if (!isLocked) handleChange(e); }}
                                                    className={`h-9 w-full px-3 border rounded-[6px] text-[10px] font-bold tracking-widest outline-none transition-all appearance-none cursor-pointer uppercase ${isLocked ? 'bg-slate-100 border-slate-100 cursor-not-allowed text-slate-400' : 'bg-white border-slate-200 focus:border-slate-900'}`}
                                                    disabled={!!isLocked}
                                                >
                                                    <option value="1">/ AKTİF</option>
                                                    <option value="0">X PASİF</option>
                                                </select>
                                                {!isLocked && <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="space-y-4 p-4 rounded-[6px] border border-slate-100 bg-white hover:border-slate-300 transition-all shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-[4px] bg-slate-900 text-white shadow-sm">
                                            <DollarSign size={12} />
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest text-slate-900 uppercase">Teslimat Ücreti</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number" name="deliveryCharge"
                                            value={formData.deliveryCharge} onChange={handleChange}
                                            className="h-9 w-full px-4 border border-slate-200 bg-slate-50/50 rounded-[6px] text-[12px] font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all uppercase tracking-widest"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">₺</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </form>

                {/* Footer Section */}
                <div className="w-full mx-auto mt-12 py-12 text-center space-y-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-slate-200" />
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em] leading-none">© {new Date().getFullYear()} MESA DİJİTAL — BULUT TABANLI MENÜ SİSTEMİ</p>
                        <div className="h-px w-8 bg-slate-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
