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
} from 'lucide-react';
import Link from 'next/link';

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

    // ===== Styles =====
    const pageStyle: React.CSSProperties = { padding: '0' };
    const headerStyle: React.CSSProperties = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem'
    };
    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '14px', border: '1px solid #e8ecf1',
        overflow: 'hidden', marginBottom: '20px',
    };
    const cardHeaderStyle: React.CSSProperties = {
        padding: '14px 20px', borderBottom: '1px solid #f0f1f3',
        display: 'flex', alignItems: 'center', gap: '10px', background: '#fafbfc',
    };
    const cardTitleStyle: React.CSSProperties = {
        margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e',
    };
    const cardBodyStyle: React.CSSProperties = { padding: '20px' };
    const gridStyle: React.CSSProperties = {
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
    };
    const fieldStyle: React.CSSProperties = { marginBottom: '0' };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#444',
        marginBottom: '6px',
    };
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0',
        borderRadius: '8px', fontSize: '0.85rem', outline: 'none',
        background: '#fafafa', boxSizing: 'border-box', transition: 'border 0.2s',
    };
    const selectStyle: React.CSSProperties = {
        ...inputStyle, cursor: 'pointer',
    };
    const btnStyle: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '11px 24px', borderRadius: '8px', border: 'none',
        background: '#ff6e01', color: '#fff', fontWeight: 700,
        fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
    };
    const noticeStyle: React.CSSProperties = {
        background: '#fff8f0', border: '1px solid #ffe0b2', borderRadius: '10px',
        padding: '14px 18px', marginBottom: '20px', fontSize: '0.84rem',
        color: '#b45309', display: 'flex', alignItems: 'center', gap: '10px',
        lineHeight: 1.5,
    };
    const inputIconWrap: React.CSSProperties = {
        position: 'relative',
    };
    const iconStyle: React.CSSProperties = {
        position: 'absolute', left: '12px', top: '50%',
        transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none',
    };
    const inputWithIconStyle: React.CSSProperties = {
        ...inputStyle, paddingLeft: '38px',
    };
    const smallTextStyle: React.CSSProperties = {
        fontSize: '0.72rem', color: '#999', marginTop: '4px',
    };
    const errorTextStyle: React.CSSProperties = {
        fontSize: '0.78rem', color: '#ef4444', marginTop: '6px',
        display: 'flex', alignItems: 'center', gap: '4px',
    };
    const multiSelectWrap: React.CSSProperties = {
        display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px',
        overflowY: 'auto', padding: '8px', border: '1px solid #e0e0e0',
        borderRadius: '8px', background: '#fafafa',
    };
    const chipStyle = (active: boolean): React.CSSProperties => ({
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem',
        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        border: active ? '1px solid #ff6e01' : '1px solid #e0e0e0',
        background: active ? 'rgba(255,110,1,0.08)' : '#fff',
        color: active ? '#ff6e01' : '#666',
    });
    const notificationStyle = (type: string): React.CSSProperties => ({
        position: 'fixed', top: '20px', right: '20px',
        padding: '14px 20px', borderRadius: '10px', zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '0.85rem', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        background: type === 'success' ? '#f0fdf4' : '#fef2f2',
        color: type === 'success' ? '#16a34a' : '#dc2626',
        border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        animation: 'slideIn 0.3s ease-out',
    });

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#f8f9fb',
            }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff6e01' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            {/* Notification */}
            {notification && (
                <div style={notificationStyle(notification.type)}>
                    {notification.type === 'success'
                        ? <CheckCircle2 size={18} />
                        : <AlertCircle size={18} />}
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div style={headerStyle}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>Hesap Ayarları</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <span>›</span>
                    <span>Hesap Ayarları</span>
                </div>
            </div>

            <div style={{ padding: '0 2rem', paddingBottom: '3rem' }}>
                {/* Notice */}
                <div style={noticeStyle}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                    <span>
                        <strong>Önemli Not:</strong> Plan yükseltme yapabilmek için lütfen aşağıda yer alan fatura detaylarını doldurunuz.
                        Doldurduysanız{' '}
                        <Link href="/uyelik-planlari" style={{ color: '#ff6e01', fontWeight: 700, textDecoration: 'none' }}>
                            ÜYELİK PLAN AYARLARI İÇİN TIKLAYIN
                        </Link>
                    </span>
                </div>

                {/* ========== HESAP AYARLARI ========== */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <Settings size={18} color="#ff6e01" />
                        <h3 style={cardTitleStyle}>Hesap Ayarları</h3>
                    </div>
                    <div style={cardBodyStyle}>
                        <div style={gridStyle}>
                            {/* Username */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Kullanıcı Adı *</label>
                                <div style={inputIconWrap}>
                                    <User size={15} style={iconStyle} />
                                    <input type="text" value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        style={inputWithIconStyle} placeholder="Kullanıcı adı" />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>E-Mail Adresiniz *</label>
                                <div style={inputIconWrap}>
                                    <Mail size={15} style={iconStyle} />
                                    <input type="email" value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        style={inputWithIconStyle} placeholder="E-posta adresi" />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Yeni Şifre</label>
                                <div style={inputIconWrap}>
                                    <Lock size={15} style={iconStyle} />
                                    <input type="password" value={password}
                                        onChange={e => handlePasswordChange(e.target.value)}
                                        style={inputWithIconStyle} placeholder="Yeni şifre (boş bırakın değiştirmek istemiyorsanız)" />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Şifreyi Onayla</label>
                                <div style={inputIconWrap}>
                                    <Lock size={15} style={iconStyle} />
                                    <input type="password" value={confirmPassword}
                                        onChange={e => handleConfirmPasswordChange(e.target.value)}
                                        style={inputWithIconStyle} placeholder="Şifreyi tekrar girin" />
                                </div>
                            </div>
                        </div>

                        {/* Password error */}
                        {passwordError && (
                            <div style={errorTextStyle}>
                                <AlertCircle size={13} /> {passwordError}
                            </div>
                        )}

                        <div style={{ ...gridStyle, marginTop: '16px' }}>
                            {/* Phone */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Telefon</label>
                                <div style={inputIconWrap}>
                                    <Phone size={15} style={iconStyle} />
                                    <input type="text" value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                        style={inputWithIconStyle} placeholder="+90 5xx xxx xx xx" />
                                </div>
                            </div>

                            {/* Currency */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Para Birimi</label>
                                <select value={currency} onChange={e => setCurrency(e.target.value)} style={selectStyle}>
                                    {CURRENCIES.map(c => (
                                        <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                </select>
                                <div style={smallTextStyle}>Bu para birimi menüde kullanılacaktır.</div>
                            </div>

                            {/* Menu Layout */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Menü Düzeni</label>
                                <select value={menuLayout} onChange={e => setMenuLayout(e.target.value)} style={selectStyle}>
                                    <option value="both">Her İki Düzen</option>
                                    <option value="grid">Izgara Düzeni</option>
                                    <option value="list">Liste Düzeni</option>
                                </select>
                            </div>

                            {/* Default Language */}
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Varsayılan Dil</label>
                                <select value={defaultMenuLanguage}
                                    onChange={e => setDefaultMenuLanguage(e.target.value)}
                                    style={selectStyle}>
                                    {LANGUAGES.map(l => (
                                        <option key={l.value} value={l.value}>{l.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Menu Languages Multi-select */}
                        <div style={{ marginTop: '16px' }}>
                            <label style={labelStyle}>Menü Dilleri</label>
                            <div style={multiSelectWrap}>
                                {LANGUAGES.map(l => (
                                    <span key={l.value}
                                        onClick={() => handleLanguageToggle(l.value)}
                                        style={chipStyle(menuLanguages.includes(l.value))}>
                                        {l.label}
                                    </span>
                                ))}
                            </div>
                            <div style={smallTextStyle}>Çoklu dil menüsü için birden fazla seçenek seçin.</div>
                        </div>

                        {/* Language Popup */}
                        <div style={{ ...gridStyle, marginTop: '16px' }}>
                            <div style={fieldStyle}>
                                <label style={labelStyle}>Menü Açılmadan Dil Seçimi İstensin Mi?</label>
                                <select value={languageSelectorPopup ? '1' : '0'}
                                    onChange={e => setLanguageSelectorPopup(e.target.value === '1')}
                                    style={selectStyle}>
                                    <option value="0">Hayır</option>
                                    <option value="1">Evet</option>
                                </select>
                            </div>
                        </div>

                        {/* Save button */}
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={saveAccount} disabled={saving} style={{
                                ...btnStyle,
                                opacity: saving ? 0.7 : 1,
                            }}>
                                {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========== FATURA DETAYLARI ========== */}
                <div style={cardStyle}>
                    <div style={cardHeaderStyle}>
                        <CreditCard size={18} color="#ff6e01" />
                        <h3 style={cardTitleStyle}>Fatura Detayları</h3>
                        <span style={{ fontSize: '0.72rem', color: '#999', marginLeft: 'auto' }}>
                            Plan Yükseltme Yapabilmek İçin Lütfen Doldurunuz
                        </span>
                    </div>
                    <div style={cardBodyStyle}>
                        {/* Notice */}
                        <div style={{
                            ...noticeStyle, marginBottom: '16px',
                            background: '#f0f7ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
                        }}>
                            <FileText size={16} style={{ flexShrink: 0 }} />
                            Bu detaylar fatura ve ödemelerde kullanılacaktır.
                        </div>

                        {/* Billing Type */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Tür</label>
                            <select value={billingType} onChange={e => setBillingType(e.target.value)} style={selectStyle}>
                                <option value="personal">Bireysel</option>
                                <option value="business">Kurumsal</option>
                            </select>
                        </div>

                        {/* Personal: TC Kimlik */}
                        {billingType === 'personal' && (
                            <div style={{ marginBottom: '16px' }}>
                                <label style={labelStyle}>TC Kimlik No *</label>
                                <input type="text" value={billingTcNo}
                                    onChange={e => setBillingTcNo(e.target.value)}
                                    style={inputStyle} placeholder="TC Kimlik numaranız" />
                            </div>
                        )}

                        {/* Business fields */}
                        {billingType === 'business' && (
                            <React.Fragment>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={labelStyle}>Firma Adı *</label>
                                    <input type="text" value={billingCompanyName}
                                        onChange={e => setBillingCompanyName(e.target.value)}
                                        style={inputStyle} placeholder="Firma adı" />
                                </div>
                                <div style={gridStyle}>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Vergi Dairesi *</label>
                                        <input type="text" value={billingTaxDaire}
                                            onChange={e => setBillingTaxDaire(e.target.value)}
                                            style={inputStyle} placeholder="Vergi dairesi" />
                                    </div>
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={labelStyle}>Vergi Numarası *</label>
                                        <input type="text" value={billingTaxId}
                                            onChange={e => setBillingTaxId(e.target.value)}
                                            style={inputStyle} placeholder="Vergi numarası" />
                                    </div>
                                </div>
                            </React.Fragment>
                        )}

                        {/* Common fields */}
                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Ad & Soyad *</label>
                            <div style={inputIconWrap}>
                                <User size={15} style={iconStyle} />
                                <input type="text" value={billingName}
                                    onChange={e => setBillingName(e.target.value)}
                                    style={inputWithIconStyle} placeholder="Ad ve soyad" />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Adres *</label>
                            <div style={inputIconWrap}>
                                <MapPin size={15} style={iconStyle} />
                                <input type="text" value={billingAddress}
                                    onChange={e => setBillingAddress(e.target.value)}
                                    style={inputWithIconStyle} placeholder="Tam adres" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <label style={labelStyle}>İl *</label>
                                <input type="text" value={billingCity}
                                    onChange={e => setBillingCity(e.target.value)}
                                    style={inputStyle} placeholder="İl" />
                            </div>
                            <div>
                                <label style={labelStyle}>İlçe *</label>
                                <input type="text" value={billingState}
                                    onChange={e => setBillingState(e.target.value)}
                                    style={inputStyle} placeholder="İlçe" />
                            </div>
                            <div>
                                <label style={labelStyle}>Posta Kodu *</label>
                                <input type="text" value={billingZipcode}
                                    onChange={e => setBillingZipcode(e.target.value)}
                                    style={inputStyle} placeholder="34000" />
                            </div>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={labelStyle}>Ülke *</label>
                            <select value={billingCountry}
                                onChange={e => setBillingCountry(e.target.value)}
                                style={selectStyle}>
                                {COUNTRIES.map(c => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Save Billing */}
                        <button onClick={saveBilling} disabled={savingBilling} style={{
                            ...btnStyle,
                            opacity: savingBilling ? 0.7 : 1,
                        }}>
                            {savingBilling ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                            {savingBilling ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ textAlign: 'center', padding: '16px 24px', color: '#bbb', fontSize: '0.75rem' }}>
                {new Date().getFullYear()} QRlamenü — Tüm Hakları Saklıdır.
            </div>

            {/* Keyframe & responsive */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
            `}</style>
        </div>
    );
}
