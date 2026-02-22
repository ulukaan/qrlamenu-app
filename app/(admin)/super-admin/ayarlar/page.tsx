"use client";
import React, { useState, useEffect } from 'react';
import { Settings, Save, Mail, Globe, Shield, Bell, Loader2, CheckCircle2 } from 'lucide-react';

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/settings');
                if (!res.ok) throw new Error('Ayarlar yüklenemedi');
                const data = await res.json();
                setSettings(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setMessage(null);
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi.' });
            } else {
                throw new Error('Kaydedilemedi');
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Ayarlar kaydedilirken bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin text-gray-400" style={{ margin: '0 auto' }} />
        </div>
    );

    if (!settings) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ color: '#f44336', fontWeight: '600', marginBottom: '16px' }}>Ayarlar yüklenemedi.</div>
            <button
                onClick={() => window.location.reload()}
                className="btn-primary"
                style={{ padding: '8px 16px', borderRadius: '8px' }}
            >
                Yeniden Dene
            </button>
        </div>
    );

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Global Sistem Ayarları</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platform genelini ilgilendiren teknik, iletişim ve güvenlik yapılandırmalarını merkezi olarak yönetin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="hover:scale-105 active:scale-95 transition-all"
                    style={{
                        background: '#ff7a21',
                        color: '#fff',
                        padding: '14px 32px',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '0.95rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)',
                        cursor: 'pointer',
                        opacity: saving ? 0.8 : 1
                    }}
                >
                    {saving ? <Loader2 size={20} className="animate-spin" strokeWidth={2.5} /> : <Save size={20} strokeWidth={2.5} />}
                    {saving ? 'Ayarlar Güncelleniyor...' : 'Konfigürasyonu Kaydet'}
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '20px 28px',
                    borderRadius: '20px',
                    marginBottom: '3rem',
                    background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#10b981' : '#f43f5e',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontWeight: '900',
                    fontSize: '1rem',
                    border: `1px solid ${message.type === 'success' ? '#d1fae5' : '#fee2e2'}`,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {message.type === 'success' ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <Settings size={24} strokeWidth={2.5} />}
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {/* General Settings */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ background: '#fff7f2', color: '#ff7a21', padding: '14px', borderRadius: '18px', border: '1px solid #ffedd5' }}>
                                <Globe size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Platform Kimliği & İletişim</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Marka başlığı ve kritik iletişim kanalları.</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform Marka Başlığı</label>
                                <input
                                    type="text"
                                    value={settings.platformTitle}
                                    onChange={(e) => setSettings({ ...settings, platformTitle: e.target.value })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#111827', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-md"
                                />
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sistem Kritik İletişim E-postası</label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#111827', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-md"
                                />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff7a21' }}></div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: '600' }}>Bu adres sistem bildirimleri ve kurtarma süreçleri için kullanılır.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SMTP Settings */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ background: '#f0f9ff', color: '#0ea5e9', padding: '14px', borderRadius: '18px', border: '1px solid #e0f2fe' }}>
                                <Mail size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>E-posta (SMTP) Servisi</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Giden e-posta sunucusu yapılandırması.</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SMTP Relay Host</label>
                                <input
                                    type="text"
                                    value={settings.smtpHost}
                                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#111827', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-blue-500 focus:bg-white focus:shadow-md"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Servis Portu</label>
                                <input
                                    type="number"
                                    value={settings.smtpPort}
                                    onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                                    style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '1rem', color: '#111827', fontWeight: '800', transition: 'all 0.2s', background: '#f8fafc' }}
                                    className="focus:border-blue-500 focus:bg-white focus:shadow-md"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Protokol Güvenliği</label>
                                <select style={{ width: '100%', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc', fontSize: '1rem', color: '#111827', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s' }} className="focus:border-blue-500 focus:bg-white focus:shadow-md">
                                    <option>TLS / STARTTLS</option>
                                    <option>SSL</option>
                                    <option>Yok (Güvensiz)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    {/* Maintenance Mode */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: settings.maintenanceMode ? 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)' : '#fff', color: settings.maintenanceMode ? '#fff' : 'inherit', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', transition: 'all 0.3s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                            <div style={{ background: settings.maintenanceMode ? 'rgba(255,255,255,0.1)' : '#fef2f2', padding: '10px', borderRadius: '14px', border: settings.maintenanceMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid #fee2e2' }}>
                                <Shield size={24} color={settings.maintenanceMode ? '#fff' : '#f43f5e'} strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Bakım Modu</h3>
                        </div>
                        <p style={{ fontSize: '0.95rem', color: settings.maintenanceMode ? 'rgba(255,255,255,0.7)' : '#64748b', marginBottom: '32px', lineHeight: '1.7', fontWeight: '500' }}>
                            Aktifleştirildiğinde platform genel erişime kapatılır. Sadece yetkili yöneticiler giriş yapabilir.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                            className="hover:scale-105 active:scale-95 transition-all"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: settings.maintenanceMode ? '#fff' : '#f1f5f9',
                                color: settings.maintenanceMode ? '#7f1d1d' : '#475569',
                                fontWeight: '900',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                boxShadow: settings.maintenanceMode ? '0 10px 20px -5px rgba(0,0,0,0.2)' : 'none'
                            }}
                        >
                            {settings.maintenanceMode ? 'Sistemi Çevrimiçi Yap' : 'Bakımı Başlat'}
                        </button>
                    </div>

                    {/* Notifications */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', borderRadius: '32px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#fff7f2', padding: '10px', borderRadius: '14px', border: '1px solid #ffedd5' }}>
                                <Bell size={24} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Sistem Bildirimleri</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {[
                                { id: 'reg', label: 'Yeni Kayıt Bildirimi', checked: true },
                                { id: 'fail', label: 'Hatalı Giriş Uyarısı', checked: true },
                                { id: 'backup', label: 'Auto-Backup Logları', checked: false }
                            ].map((item) => (
                                <label key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', cursor: 'pointer' }} className="group">
                                    {item.label}
                                    <div style={{ position: 'relative', width: '48px', height: '26px', background: item.checked ? '#ff7a21' : '#e2e8f0', borderRadius: '13px', transition: 'all 0.3s' }}>
                                        <div style={{ position: 'absolute', left: item.checked ? '24px' : '4px', top: '4px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                    </div>
                                    <input type="checkbox" style={{ display: 'none' }} defaultChecked={item.checked} />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Backup Widget */}
                    <div className="card" style={{ padding: '32px', background: '#f8fafc', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                                <Save size={20} color="#64748b" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Son Yedekleme</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#10b981', fontWeight: '900' }}>Bugün, 04:00 AM</p>
                                <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', fontSize: '0.75rem', color: '#64748b', fontWeight: '700' }}>
                                    CLOUD STORAGE: <span style={{ color: '#1e293b' }}>AWS S3 (FRA)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
