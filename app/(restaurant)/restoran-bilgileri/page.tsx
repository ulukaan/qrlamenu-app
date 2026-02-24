"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
    FolderPlus,
    Instagram,
    Facebook,
    Globe,
    Youtube,
    MessageCircle,
    Image as ImageIcon,
    ArrowRight,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Loader2,
    Save,
    Upload,
    Eye,
    ExternalLink,
    Palette,
    Lock,
} from 'lucide-react';
import Link from 'next/link';

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

    // ===== STYLES =====
    const pageStyle: React.CSSProperties = { padding: '0' };
    const headerStyle: React.CSSProperties = {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
    };
    const cardStyle: React.CSSProperties = {
        background: '#fff', borderRadius: '14px', border: '1px solid #e8ecf1',
        overflow: 'hidden', marginBottom: '20px',
    };
    const cardHeaderStyle: React.CSSProperties = {
        padding: '16px 20px', borderBottom: '1px solid #f0f1f3',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px', background: '#fafbfc',
    };
    const cardBodyStyle: React.CSSProperties = { padding: '24px' };
    const rowStyle: string = "grid grid-cols-1 md:grid-cols-2 gap-5";
    const fullRowStyle: React.CSSProperties = { gridColumn: '1 / -1' };
    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '8px',
    };
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '10px 14px', border: '1px solid #dfe3e8',
        borderRadius: '8px', fontSize: '0.85rem', outline: 'none',
        background: '#fafafa', boxSizing: 'border-box', transition: 'border 0.2s',
    };
    const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer', appearance: 'auto' as any };
    const textareaStyle: React.CSSProperties = {
        ...inputStyle, minHeight: '120px', resize: 'vertical' as any, fontFamily: 'inherit',
    };
    const smallStyle: React.CSSProperties = { fontSize: '0.72rem', color: '#999', marginTop: '4px', display: 'block' };
    const requiredStar: React.CSSProperties = { color: '#ef4444', marginRight: '4px' };
    const btnPrimary: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '12px 28px', borderRadius: '8px', border: 'none',
        background: '#333', color: '#fff', fontWeight: 700,
        fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s',
    };
    const previewBtnStyle: React.CSSProperties = {
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '9px 18px', borderRadius: '8px', border: 'none',
        background: '#1a1a2e', color: '#fff', fontSize: '0.82rem',
        fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
        textDecoration: 'none',
    };
    const notifStyle = (t: string): React.CSSProperties => ({
        position: 'fixed', top: '20px', right: '20px', padding: '14px 20px',
        borderRadius: '10px', zIndex: 9999, display: 'flex', alignItems: 'center',
        gap: '10px', fontSize: '0.85rem', fontWeight: 600,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        background: t === 'success' ? '#f0fdf4' : '#fef2f2',
        color: t === 'success' ? '#16a34a' : '#dc2626',
        border: `1px solid ${t === 'success' ? '#bbf7d0' : '#fecaca'}`,
        animation: 'slideIn 0.3s ease-out',
    });
    const uploadBoxStyle: React.CSSProperties = {
        border: '2px dashed #dfe3e8', borderRadius: '12px', padding: '24px',
        textAlign: 'center' as any, cursor: 'pointer', transition: 'all 0.2s',
        background: '#fafbfc',
    };
    const templateCardStyle = (active: boolean): React.CSSProperties => ({
        padding: '10px', borderRadius: '12px', cursor: 'pointer',
        border: active ? '2px solid #ff6e01' : '2px solid #e8ecf1',
        background: active ? 'rgba(255,110,1,0.04)' : '#fff',
        transition: 'all 0.2s', textAlign: 'center' as any,
    });
    const templateImgStyle: React.CSSProperties = {
        width: '100%', aspectRatio: '3/4', objectFit: 'cover' as any,
        borderRadius: '8px', marginBottom: '8px', background: '#f0f0f0',
    };
    const settingRowStyle: React.CSSProperties = {
        marginBottom: '16px',
    };
    const iconLabelStyle: React.CSSProperties = {
        display: 'flex', alignItems: 'center', gap: '8px',
        fontSize: '0.82rem', fontWeight: 700, color: '#444', marginBottom: '8px',
    };
    const colorBtnStyle: React.CSSProperties = {
        width: '36px', height: '36px', borderRadius: '8px',
        border: '2px solid #ddd', cursor: 'pointer', flexShrink: 0,
        background: restaurantColor,
    };
    const slugStatusStyle: React.CSSProperties = {
        marginTop: '6px', fontSize: '0.78rem', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '4px',
    };

    if (pageLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8f9fb' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff6e01' }} />
                <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            {/* Notification */}
            {notification && (
                <div style={notifStyle(notification.type)}>
                    {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div style={headerStyle}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '500', color: '#333', margin: 0 }}>Restoran Bilgileri</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                    <Link href="/dashboard" style={{ color: '#666', textDecoration: 'none' }}>Geri</Link>
                    <span>›</span>
                    <span>Restoran Bilgileri</span>
                </div>
            </div>

            <div style={{ padding: '0 2rem', paddingBottom: '3rem' }}>
                <form onSubmit={handleSubmit}>
                    <div style={cardStyle}>
                        {/* Card Header */}
                        <div style={cardHeaderStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FolderPlus size={20} color="#ff6e01" />
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1a1a2e' }}>
                                        Restoran, Kafe veya Otel Bilgileriniz
                                    </h3>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#999' }}>
                                        Not: Restoran bilgilerinizi doldurduktan ve kayıt ettikten sonra canlı önizlemede görünecektir.
                                    </p>
                                </div>
                            </div>
                            <button type="button" onClick={openLivePreview} style={previewBtnStyle}>
                                Canlı önizleme <ArrowRight size={14} />
                            </button>
                        </div>

                        <div style={cardBodyStyle}>
                            {/* Firma Adı + Renk */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>
                                    <span style={requiredStar}>*</span>Firma Adı ve Rengi Seçin
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div
                                            style={colorBtnStyle}
                                            onClick={() => colorInputRef.current?.click()}
                                            title="Renk seçin"
                                        />
                                        <input
                                            ref={colorInputRef}
                                            type="color"
                                            value={restaurantColor}
                                            onChange={e => setRestaurantColor(e.target.value)}
                                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                        />
                                    </div>
                                    <input
                                        type="text" name="name" value={formData.name}
                                        onChange={handleChange} style={{ ...inputStyle, flex: 1 }}
                                        placeholder="Firma adını giriniz" required
                                    />
                                </div>
                            </div>

                            {/* Slug */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>
                                    <span style={requiredStar}>*</span>Firma Bağlantısı (Örnek; restoran-adiniz)
                                    <a href="#" onClick={(e) => { e.preventDefault(); }} style={{ color: '#ff6e01', fontSize: '0.72rem', marginLeft: '8px', textDecoration: 'none' }}>
                                        Örnek Gör
                                    </a>
                                </label>
                                <input
                                    type="text" name="slug" value={formData.slug}
                                    onChange={handleChange}
                                    onBlur={checkSlugAvailability}
                                    style={inputStyle} required
                                    placeholder="restoran-adiniz"
                                />
                                {slugStatus === 'checking' && (
                                    <div style={{ ...slugStatusStyle, color: '#999' }}>
                                        <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Kontrol ediliyor...
                                    </div>
                                )}
                                {slugStatus === 'available' && (
                                    <div style={{ ...slugStatusStyle, color: '#16a34a' }}>
                                        <CheckCircle2 size={13} /> Bu bağlantı kullanılabilir
                                    </div>
                                )}
                                {slugStatus === 'taken' && (
                                    <div style={{ ...slugStatusStyle, color: '#ef4444' }}>
                                        <AlertCircle size={13} /> Bu bağlantı zaten kullanımda
                                    </div>
                                )}
                                <small style={smallStyle}>Bu alana firma adını girin. Türkçe Karakter Kullanmayın (Aralara çizgi (-) izin verilir)</small>
                            </div>

                            {/* Alt Başlık + Çalışma Zamanı */}
                            <div className={rowStyle} style={{ marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Firma Alt Başlığı</label>
                                    <input type="text" name="subtitle" value={formData.subtitle}
                                        onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Çalışma Zaman Aralığı (Örnek; 08:00 - 00:00)</label>
                                    <input type="text" name="timing" value={formData.timing}
                                        onChange={handleChange} style={inputStyle} placeholder="08:00 - 00:00" />
                                </div>
                            </div>

                            {/* Açıklama */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>
                                    <span style={requiredStar}>*</span>Firma Açıklaması
                                </label>
                                <textarea
                                    name="description" value={formData.description}
                                    onChange={handleChange} style={textareaStyle}
                                    placeholder="Firma hakkında açıklama yazın..."
                                />
                            </div>

                            {/* Adres */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>
                                    <span style={requiredStar}>*</span>Adresiniz
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#bbb', pointerEvents: 'none' }} />
                                    <input type="text" name="address" value={formData.address}
                                        onChange={handleChange}
                                        style={{ ...inputStyle, paddingLeft: '38px' }}
                                        placeholder="Adres giriniz..."
                                    />
                                </div>
                            </div>

                            {/* Sosyal Medya */}
                            <div className={rowStyle} style={{ marginBottom: '20px' }}>
                                <div>
                                    <div style={iconLabelStyle}><Instagram size={15} /> Instagram (Örnek: https://instagram.com/...)</div>
                                    <input type="text" name="instagram" value={formData.instagram}
                                        onChange={handleChange} style={inputStyle} placeholder="https://www.instagram.com/..." />
                                </div>
                                <div>
                                    <div style={iconLabelStyle}><Facebook size={15} /> Facebook (Örnek: https://facebook.com/...)</div>
                                    <input type="text" name="facebook" value={formData.facebook}
                                        onChange={handleChange} style={inputStyle} placeholder="https://www.facebook.com/..." />
                                </div>
                                <div>
                                    <div style={iconLabelStyle}><MessageCircle size={15} /> WhatsApp Numarası (Örnek: +90...)</div>
                                    <input type="text" name="whatsapp" value={formData.whatsapp}
                                        onChange={handleChange} style={inputStyle} placeholder="+90 5XX XXX XX XX" />
                                </div>
                                <div>
                                    <div style={iconLabelStyle}><Globe size={15} /> İnternet Sitesi</div>
                                    <input type="text" name="website" value={formData.website}
                                        onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <div style={iconLabelStyle}><Youtube size={15} /> Youtube Sayfa Linkiniz</div>
                                    <input type="text" name="youtube" value={formData.youtube}
                                        onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>

                            {/* Logo & Kapak Resmi */}
                            <div className={rowStyle} style={{ marginBottom: '20px', borderTop: '1px solid #f0f1f3', paddingTop: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Logonuz</label>
                                    <div style={uploadBoxStyle}>
                                        <div style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            background: '#f0f0f0', margin: '0 auto 12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden',
                                        }}>
                                            {logoPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={28} color="#ccc" />
                                            )}
                                        </div>
                                        <label style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 18px', borderRadius: '8px', background: '#f0f0f0',
                                            fontSize: '0.8rem', fontWeight: 600, color: '#555', cursor: 'pointer',
                                        }}>
                                            <Upload size={14} /> Logo Yükle
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')}
                                                style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label style={labelStyle}>Firma Kapak Resmi</label>
                                    <div style={uploadBoxStyle}>
                                        <div style={{
                                            width: '100%', height: '80px', borderRadius: '8px',
                                            background: '#f0f0f0', marginBottom: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            overflow: 'hidden',
                                        }}>
                                            {coverPreview ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={28} color="#ccc" />
                                            )}
                                        </div>
                                        <label style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                            padding: '8px 18px', borderRadius: '8px', background: '#f0f0f0',
                                            fontSize: '0.8rem', fontWeight: 600, color: '#555', cursor: 'pointer',
                                        }}>
                                            <Upload size={14} /> Kapak Resmi Yükle
                                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')}
                                                style={{ display: 'none' }} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Menü Şablonu */}
                            <div style={{ borderTop: '1px solid #f0f1f3', paddingTop: '20px', marginBottom: '20px' }}>
                                <label style={labelStyle}>Menü Şablonu Seçin</label>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {AVAILABLE_THEMES.map((theme) => {
                                        const isPremiumTheme = theme.key !== 'LITE' && theme.key !== 'CLASSIC';
                                        const isLocked = isPremiumTheme && !availableFeatures.includes('Premium Tema') && !availableFeatures.includes('Pro Tema');
                                        const isActive = selectedTemplate === theme.key;

                                        return (
                                            <div key={theme.key} style={{ position: 'relative' }}>
                                                {isLocked && (
                                                    <div style={{
                                                        position: 'absolute', top: -8, right: -8, zIndex: 10,
                                                        background: '#1a1a2e', color: '#fff', fontSize: '0.65rem',
                                                        fontWeight: 700, padding: '4px 8px', borderRadius: '12px',
                                                        display: 'flex', alignItems: 'center', gap: '4px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                                                    }}>
                                                        <Lock size={10} color="#fbbf24" /> PRO
                                                    </div>
                                                )}
                                                <label style={{
                                                    padding: '10px', borderRadius: '14px',
                                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                                    border: isActive ? `2px solid ${theme.color}` : '2px solid #e8ecf1',
                                                    background: isActive ? `${theme.color}08` : '#fff',
                                                    transition: 'all 0.25s ease', textAlign: 'center' as any,
                                                    display: 'block',
                                                    opacity: isLocked ? 0.6 : 1,
                                                    filter: isLocked ? 'grayscale(80%)' : 'none'
                                                }}>
                                                    <input
                                                        type="radio" name="restaurant_template" value={theme.key}
                                                        checked={isActive}
                                                        onChange={(e) => {
                                                            if (!isLocked) setSelectedTemplate(e.target.value);
                                                            else setNotification({ type: 'error', message: 'Bu tema mevcut paketinizde bulunmamaktadır.' });
                                                        }}
                                                        disabled={isLocked}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <div style={{
                                                        aspectRatio: '3/4', borderRadius: '10px', marginBottom: '10px',
                                                        background: `linear-gradient(135deg, ${theme.color}18, ${theme.color}35)`,
                                                        display: 'flex', flexDirection: 'column' as any,
                                                        alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                        border: `1px solid ${theme.color}20`,
                                                    }}>
                                                        <span style={{ fontSize: '2.5rem' }}>{theme.icon}</span>
                                                        <span style={{
                                                            fontSize: '0.65rem', color: theme.color, fontWeight: 700,
                                                            background: '#fff', padding: '3px 10px', borderRadius: '20px',
                                                            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                                                        }}>
                                                            {theme.key}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? theme.color : '#333', marginBottom: '2px' }}>
                                                        {theme.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.68rem', color: '#999', lineHeight: 1.3 }}>
                                                        {theme.desc}
                                                    </div>
                                                    {isActive && (
                                                        <div style={{
                                                            marginTop: '6px', fontSize: '0.65rem', fontWeight: 700,
                                                            color: '#fff', background: theme.color, borderRadius: '20px',
                                                            padding: '3px 10px', display: 'inline-block',
                                                        }}>✓ Seçili</div>
                                                    )}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Ayarlar */}
                            <div style={{ borderTop: '1px solid #f0f1f3', paddingTop: '20px' }}>
                                {[
                                    { label: 'Garsonu Aramaya İzin Ver', name: 'allowCallWaiter', req: 'Garson Çağrı Sistemi' },
                                    { label: 'Masada siparişe izin ver', name: 'allowOnTableOrder', req: 'Gelişmiş Sipariş Yönetimi' },
                                    { label: 'Gel-Al siparişine izin ver', name: 'allowTakeawayOrder', req: 'Gelişmiş Sipariş Yönetimi' },
                                    { label: 'Odaya Siparişe İzin Ver', name: 'allowHotelOrder', req: 'Gelişmiş Sipariş Yönetimi' },
                                    { label: 'Adrese Teslimat siparişine izin ver', name: 'allowDeliveryOrder', req: 'Gelişmiş Sipariş Yönetimi' },
                                    { label: 'Yeni Sipariş Bildirimi Gönder', name: 'sendOrderNotification', req: null },
                                ].map((s) => {
                                    // Sipariş Alma veya Gelişmiş Sipariş Yönetimi feature kontrolü
                                    const isLocked = s.req && !availableFeatures.includes(s.req) && !(s.req === 'Gelişmiş Sipariş Yönetimi' && availableFeatures.includes('Sipariş Alma'));

                                    return (
                                        <div key={s.name} style={{ ...settingRowStyle, opacity: isLocked ? 0.6 : 1 }}>
                                            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {s.label}
                                                {isLocked && <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}><Lock size={9} /> PRO Özellik</span>}
                                            </label>
                                            <select
                                                name={s.name}
                                                // @ts-ignore
                                                value={isLocked ? "0" : formData[s.name]}
                                                onChange={(e) => {
                                                    if (!isLocked) handleChange(e);
                                                }}
                                                style={{ ...selectStyle, cursor: isLocked ? 'not-allowed' : 'pointer' }}
                                                disabled={!!isLocked}
                                            >
                                                <option value="1">Evet</option>
                                                <option value="0">Hayır</option>
                                            </select>
                                        </div>
                                    );
                                })}

                                <div style={settingRowStyle}>
                                    <label style={labelStyle}>Teslimat Ücreti</label>
                                    <input
                                        type="number" name="deliveryCharge"
                                        value={formData.deliveryCharge} onChange={handleChange}
                                        style={inputStyle}
                                    />
                                    <small style={smallStyle}>Teslimat siparişi için ek ücret. (Gönderim Ücreti Yoksa 0 Yazılı Olması Gerekiyor)</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ marginBottom: '20px' }}>
                        <button type="submit" disabled={loading} style={{
                            ...btnPrimary,
                            opacity: loading ? 0.6 : 1,
                        }}>
                            {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                            {loading ? 'Kaydediliyor...' : 'Kayıt Et'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div style={{ textAlign: 'center', padding: '12px 0', color: '#ccc', fontSize: '0.72rem', borderTop: '1px solid #eee' }}>
                    {new Date().getFullYear()} QRlamenü — Tüm Hakları Saklıdır.
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
                @keyframes slideIn { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
            `}</style>
        </div>
    );
}
