"use client";

import React, { useState, useEffect } from 'react';
import {
    Settings,
    ChevronRight,
    User,
    Mail,
    Lock,
    Phone,
    DollarSign,
    LayoutGrid,
    Globe,
    FileText,
    Building2,
    MapPin,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader2,
    CreditCard,
    Smartphone,
    ShoppingBag,
    Briefcase,
    Settings2,
    ChevronDown,
    Languages,
    MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { MobileMenuToggle, ProfileDropdown } from '@/components/HeaderActions';
import { LoadingScreen } from '@/components/ui/loading-screen';

// Currency list
const CURRENCIES = [
    { value: 'TRY', label: 'TRY (₺)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'AZN', label: 'AZN (₼)' },
    { value: 'RUB', label: 'RUB (₽)' },
    { value: 'SAR', label: 'SAR (SAR)' },
    { value: 'GEL', label: 'GEL (₾)' },
    { value: 'KZT', label: 'KZT (₸)' },
    { value: 'CHF', label: 'CHF (CHF)' },
    { value: 'SEK', label: 'SEK (kr)' },
    { value: 'BGN', label: 'BGN (лв.)' },
    { value: 'BHD', label: 'BHD (BHD)' },
    { value: 'IQD', label: 'IQD (ع.د)' },
    { value: 'MKD', label: 'MKD (MKD)' },
    { value: 'Lei', label: 'Lei (Lei)' },
];

// Language list
const LANGUAGES = [
    { value: 'tr', label: 'Türkçe' },
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'ar', label: 'العربية' },
    { value: 'ru', label: 'Русский' },
    { value: 'es', label: 'Español' },
    { value: 'it', label: 'Italiano' },
    { value: 'az', label: 'Azərbaycan' },
    { value: 'fa', label: 'فارسی' },
    { value: 'ku', label: 'Kurdî' },
    { value: 'nl', label: 'Nederlands' },
    { value: 'ja', label: '日本語' },
    { value: 'zh', label: '中文' },
    { value: 'ka', label: 'ქართული' },
    { value: 'pl', label: 'Polski' },
    { value: 'ro', label: 'Română' },
    { value: 'sr', label: 'Srpski' },
    { value: 'bg', label: 'Български' },
    { value: 'sq', label: 'Shqip' },
    { value: 'he', label: 'עברית' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'sv', label: 'Svenska' },
    { value: 'th', label: 'ไทย' },
    { value: 'cs', label: 'Čeština' },
    { value: 'kk', label: 'Қазақ' },
    { value: 'lv', label: 'Latviešu' },
    { value: 'mk', label: 'Македонски' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'ur', label: 'اردو' },
];

// Country list (shortened)
const COUNTRIES = [
    { value: 'TR', label: 'Türkiye' },
    { value: 'US', label: 'United States' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'GE', label: 'Georgia' },
    { value: 'RU', label: 'Russia' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'SE', label: 'Sweden' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'AT', label: 'Austria' },
    { value: 'BE', label: 'Belgium' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'RO', label: 'Romania' },
    { value: 'PL', label: 'Poland' },
    { value: 'GR', label: 'Greece' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'KZ', label: 'Kazakhstan' },
    { value: 'IQ', label: 'Iraq' },
    { value: 'IR', label: 'Iran' },
    { value: 'EG', label: 'Egypt' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
    { value: 'CA', label: 'Canada' },
    { value: 'AU', label: 'Australia' },
    { value: 'KR', label: 'South Korea' },
    { value: 'MX', label: 'Mexico' },
    { value: 'AR', label: 'Argentina' },
];

export default function HesapAyarlari() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingBilling, setSavingBilling] = useState(false);

    // Notifications
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Account form
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [currency, setCurrency] = useState('TRY');
    const [menuLayout, setMenuLayout] = useState('both');
    const [menuLanguages, setMenuLanguages] = useState<string[]>([]);
    const [defaultMenuLanguage, setDefaultMenuLanguage] = useState('tr');
    const [languageSelectorPopup, setLanguageSelectorPopup] = useState(false);

    // Billing form
    const [billingType, setBillingType] = useState('personal');
    const [billingTcNo, setBillingTcNo] = useState('');
    const [billingCompanyName, setBillingCompanyName] = useState('');
    const [billingTaxDaire, setBillingTaxDaire] = useState('');
    const [billingTaxId, setBillingTaxId] = useState('');
    const [billingName, setBillingName] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [billingCity, setBillingCity] = useState('');
    const [billingState, setBillingState] = useState('');
    const [billingZipcode, setBillingZipcode] = useState('');
    const [billingCountry, setBillingCountry] = useState('TR');

    // Password validation
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        fetchAccount();
    }, []);

    const fetchAccount = async () => {
        try {
            const res = await fetch('/api/restaurant/account');
            if (res.ok) {
                const data = await res.json();
                setUsername(data.username || '');
                setEmail(data.email || '');
                setPhone(data.phone || '');
                setCurrency(data.currency || 'TRY');
                setMenuLayout(data.menuLayout || 'both');
                setMenuLanguages(data.menuLanguages || []);
                setDefaultMenuLanguage(data.defaultMenuLanguage || 'tr');
                setLanguageSelectorPopup(data.languageSelectorPopup || false);
                setBillingType(data.billingType || 'personal');
                setBillingTcNo(data.billingTcNo || '');
                setBillingCompanyName(data.billingCompanyName || '');
                setBillingTaxDaire(data.billingTaxDaire || '');
                setBillingTaxId(data.billingTaxId || '');
                setBillingName(data.billingName || '');
                setBillingAddress(data.billingAddress || '');
                setBillingCity(data.billingCity || '');
                setBillingState(data.billingState || '');
                setBillingZipcode(data.billingZipcode || '');
                setBillingCountry(data.billingCountry || 'TR');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 4000);
    };

    const handlePasswordChange = (val: string) => {
        setPassword(val);
        if (val.length > 0 && (val.length < 4 || val.length > 20)) {
            setPasswordError('Parola 4 ila 20 karakter uzunluğunda olmalıdır');
        } else if (confirmPassword && val !== confirmPassword) {
            setPasswordError('Girdiğiniz şifreler eşleşmedi');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (val: string) => {
        setConfirmPassword(val);
        if (password && val !== password) {
            setPasswordError('Girdiğiniz şifreler eşleşmedi');
        } else {
            setPasswordError('');
        }
    };

    const handleLanguageToggle = (lang: string) => {
        setMenuLanguages(prev =>
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    const saveAccount = async () => {
        if (password && password !== confirmPassword) {
            showNotification('error', 'Şifreler eşleşmiyor');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch('/api/restaurant/account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'account',
                    username, email, password, confirmPassword,
                    phone, currency, menuLayout, menuLanguages,
                    defaultMenuLanguage, languageSelectorPopup,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                showNotification('success', data.message || 'Değişiklikler kaydedildi');
                setPassword('');
                setConfirmPassword('');
            } else {
                showNotification('error', data.error || 'Hata oluştu');
            }
        } catch {
            showNotification('error', 'Bağlantı hatası');
        } finally {
            setSaving(false);
        }
    };

    const saveBilling = async () => {
        setSavingBilling(true);
        try {
            const res = await fetch('/api/restaurant/account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'billing',
                    billingType, billingTcNo, billingCompanyName,
                    billingTaxDaire, billingTaxId, billingName,
                    billingAddress, billingCity, billingState,
                    billingZipcode, billingCountry,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                showNotification('success', data.message || 'Fatura bilgileri kaydedildi');
            } else {
                showNotification('error', data.error || 'Hata oluştu');
            }
        } catch {
            showNotification('error', 'Bağlantı hatası');
        } finally {
            setSavingBilling(false);
        }
    };

    // Component styles are now handled via Tailwind CSS

    if (loading) return <LoadingScreen message="HESAP AYARLARI HAZIRLANIYOR" />;

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 left-1/2 z-[9999] flex items-center gap-3 px-6 py-3 rounded-[6px] shadow-xl backdrop-blur-md border ${notification.type === 'success' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}
                    >
                        {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        <span className="text-[11px] font-bold tracking-tight">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="bg-white border-b border-slate-100 py-4 px-6 lg:px-8 relative z-30 shadow-sm w-full">
                <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start md:items-center gap-4 md:gap-6">
                        <MobileMenuToggle />
                        <div className="space-y-4">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-tight">
                                <Link href="/dashboard" className="hover:text-slate-900 transition-colors uppercase">Panel</Link>
                                <ChevronRight size={8} className="text-slate-300" />
                                <span className="text-slate-900 uppercase">Hesap Ayarları</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-900 rounded-[6px] flex items-center justify-center shadow-lg">
                                    <User size={24} className="text-white" strokeWidth={2} />
                                </div>
                                <div className="space-y-0.5">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Hesap ve Fatura</h1>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold text-slate-400 tracking-tight">Profil Yönetimi</span>
                                        <div className="h-0.5 w-0.5 bg-slate-200 rounded-full" />
                                        <span className="text-[11px] font-bold text-slate-900 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-[4px]">Ayarlar</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ProfileDropdown />
                </div>
            </div>

            <div className="p-6 lg:p-8 flex-1 w-full mx-auto space-y-8">
                {/* Notice */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-[6px] p-4 flex items-center gap-4 shadow-sm group">
                    <div className="w-10 h-10 bg-emerald-100 rounded-[4px] flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                        <AlertCircle size={20} />
                    </div>
                    <p className="text-[12px] font-bold text-emerald-900 leading-relaxed">
                        <span className="text-emerald-600 uppercase tracking-widest">Önemli Not:</span> Plan yükseltme yapabilmek için lütfen aşağıda yer alan fatura detaylarını doldurunuz.
                        Doldurduysanız <Link href="/uyelik-planlari" className="text-slate-900 underline decoration-emerald-200 underline-offset-4 hover:decoration-emerald-400 transition-all font-black">ÜYELİK PLAN AYARLARI İÇİN TIKLAYIN</Link>
                    </p>
                </div>

                {/* ========== HESAP AYARLARI ========== */}
                <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                <Settings size={16} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Hesap Ayarları</h3>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 italic">01</div>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Kullanıcı Adı <span className="text-orange-600">*</span></label>
                                <div className="relative">
                                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="text" value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Kullanıcı adı" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">E-Mail Adresiniz <span className="text-orange-600">*</span></label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="email" value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="E-posta adresi" />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Yeni Şifre</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="password" value={password}
                                        onChange={e => handlePasswordChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Yeni şifre (boş bırakın)" />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Şifreyi Onayla</label>
                                <div className="relative">
                                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="password" value={confirmPassword}
                                        onChange={e => handleConfirmPasswordChange(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Şifreyi tekrar girin" />
                                </div>
                            </div>
                        </div>

                        {/* Password error */}
                        {passwordError && (
                            <div className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5 mt-2 ml-1 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle size={13} /> {passwordError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Telefon Numarası</label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="text" value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="5XX XXX XX XX" />
                                </div>
                            </div>

                            {/* Currency */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Para Birimi</label>
                                <div className="relative">
                                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <select value={currency}
                                        onChange={e => setCurrency(e.target.value)}
                                        className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none appearance-none cursor-pointer">
                                        {CURRENCIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={saveAccount}
                                disabled={saving}
                                className="bg-slate-900 text-white px-8 py-3 rounded-[6px] flex items-center gap-2 text-[11px] font-bold tracking-tight hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-slate-900/10"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Kaydediliyor...' : 'Hesap Bilgilerini Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========== MENÜ VARSAYILAN AYARLARI ========== */}
                <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white p-2 rounded-[4px]">
                                <LayoutGrid size={16} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Menü Varsayılan Ayarları</h3>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 italic">02</div>
                    </div>
                    <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Layout Selection */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Menü Görünüm Modu</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { value: 'grid', label: 'IZGARA' },
                                        { value: 'list', label: 'LİSTE' },
                                        { value: 'both', label: 'HER İKİSİ' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setMenuLayout(opt.value)}
                                            className={`py-3 px-2 rounded-[6px] border text-[10px] font-bold transition-all uppercase tracking-widest ${menuLayout === opt.value
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold tracking-tight ml-1 italic opacity-60">* Müşterilerinize sunulacak ön tanımlı liste görünümü.</p>
                            </div>

                            {/* Popup Selector */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dil Seçici Pop-up</label>
                                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[6px] border border-slate-100 group">
                                    <div className={`p-2 rounded-[4px] transition-colors ${languageSelectorPopup ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                                        <Globe size={16} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Pop-up Gösterimi</h4>
                                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">Giriş anında dil seçimi sorulsun mu?</p>
                                    </div>
                                    <button
                                        onClick={() => setLanguageSelectorPopup(!languageSelectorPopup)}
                                        className={`w-12 h-6 rounded-full relative transition-all duration-300 focus:outline-none ${languageSelectorPopup ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${languageSelectorPopup ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Languages size={14} className="text-slate-900" /> Aktif Menü Dilleri
                                </label>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{menuLanguages.length} Dil Seçildi</span>
                            </div>
                            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 border border-slate-100 rounded-[6px] max-h-[160px] overflow-y-auto custom-scrollbar">
                                {LANGUAGES.map((lang) => {
                                    const active = menuLanguages.includes(lang.value);
                                    return (
                                        <button
                                            key={lang.value}
                                            onClick={() => handleLanguageToggle(lang.value)}
                                            className={`px-3 py-1.5 rounded-[4px] text-[10px] font-bold transition-all border ${active
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Default Language Selector */}
                        <div className="space-y-2 max-w-xs">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Varsayılan Dil</label>
                            <div className="relative">
                                <Globe size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                <select value={defaultMenuLanguage}
                                    onChange={e => setDefaultMenuLanguage(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none appearance-none cursor-pointer">
                                    {LANGUAGES.filter(l => menuLanguages.includes(l.value) || l.value === 'tr').map(l => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={saveAccount}
                                disabled={saving}
                                className="bg-slate-900 text-white px-8 py-3 rounded-[6px] flex items-center gap-2 text-[11px] font-bold tracking-tight hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-slate-900/10"
                            >
                                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {saving ? 'Kaydediliyor...' : 'Menü Ayarlarını Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========== FATURA DETAYLARI ========== */}
                <div className="bg-white rounded-[6px] shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-600 text-white p-2 rounded-[4px]">
                                <CreditCard size={16} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Fatura Detayları</h3>
                        </div>
                        <div className="text-[10px] font-bold text-slate-300 italic">03</div>
                    </div>
                    <div className="p-6">
                        {/* Notice */}
                        <div className="bg-blue-50 border border-blue-100 rounded-[6px] p-4 flex items-center gap-4 mb-6 shadow-sm group">
                            <div className="w-10 h-10 bg-blue-100 rounded-[4px] flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[12px] font-bold text-blue-900 leading-relaxed uppercase tracking-widest">Bilgi</p>
                                <p className="text-[11px] font-bold text-blue-600 tracking-tight">Bu detaylar fatura ve ödemelerde kullanılacaktır.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Billing Type */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fatura Türü</label>
                                <div className="relative">
                                    <select value={billingType}
                                        onChange={e => setBillingType(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none appearance-none cursor-pointer">
                                        <option value="personal">Bireysel</option>
                                        <option value="business">Kurumsal</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>

                            {/* Personal: TC Kimlik */}
                            {billingType === 'personal' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">TC Kimlik No <span className="text-orange-600">*</span></label>
                                    <input type="text" value={billingTcNo}
                                        onChange={e => setBillingTcNo(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="TC Kimlik numaranız" />
                                </div>
                            )}

                            {/* Business: Company Name */}
                            {billingType === 'business' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Firma Adı <span className="text-orange-600">*</span></label>
                                    <input type="text" value={billingCompanyName}
                                        onChange={e => setBillingCompanyName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Firma adı" />
                                </div>
                            )}
                        </div>

                        {/* Business Tax Info */}
                        {billingType === 'business' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vergi Dairesi <span className="text-orange-600">*</span></label>
                                    <input type="text" value={billingTaxDaire}
                                        onChange={e => setBillingTaxDaire(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Vergi dairesi" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Vergi Numarası <span className="text-orange-600">*</span></label>
                                    <input type="text" value={billingTaxId}
                                        onChange={e => setBillingTaxId(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Vergi numarası" />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {/* Billing Name */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ad & Soyad <span className="text-orange-600">*</span></label>
                                <div className="relative">
                                    <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="text" value={billingName}
                                        onChange={e => setBillingName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Ad ve soyad" />
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Fatura Adresi <span className="text-orange-600">*</span></label>
                                <div className="relative">
                                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                    <input type="text" value={billingAddress}
                                        onChange={e => setBillingAddress(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                        placeholder="Tam adres" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İl <span className="text-orange-600">*</span></label>
                                <input type="text" value={billingCity}
                                    onChange={e => setBillingCity(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                    placeholder="İl" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">İlçe <span className="text-orange-600">*</span></label>
                                <input type="text" value={billingState}
                                    onChange={e => setBillingState(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                    placeholder="İlçe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Posta Kodu <span className="text-orange-600">*</span></label>
                                <input type="text" value={billingZipcode}
                                    onChange={e => setBillingZipcode(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none placeholder:text-slate-300"
                                    placeholder="34XXX" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Ülke <span className="text-orange-600">*</span></label>
                                <div className="relative">
                                    <select value={billingCountry}
                                        onChange={e => setBillingCountry(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] text-[12px] font-bold text-slate-900 focus:border-slate-900 transition-all outline-none appearance-none cursor-pointer">
                                        {COUNTRIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={saveBilling}
                                disabled={savingBilling}
                                className="bg-slate-900 text-white px-8 py-3 rounded-[6px] flex items-center gap-2 text-[11px] font-bold tracking-tight hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-slate-900/10"
                            >
                                {savingBilling ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {savingBilling ? 'Kaydediliyor...' : 'Fatura Bilgilerini Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="w-full mx-auto py-12 text-center">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-slate-100" />
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">© {new Date().getFullYear()} QRlamenü — Tüm Hakları Saklıdır</p>
                        <div className="h-px w-12 bg-slate-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
