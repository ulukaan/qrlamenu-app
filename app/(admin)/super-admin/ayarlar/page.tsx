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
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Global Sistem Ayarları</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Platform genelini ilgilendiren teknik, iletişim ve güvenlik yapılandırmalarını merkezi olarak yönetin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="hover:scale-105 active:scale-95 transition-all"
                    style={{
                        background: '#ff7a21',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '14px',
                        border: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)',
                        cursor: 'pointer',
                        opacity: saving ? 0.8 : 1
                    }}
                >
                    {saving ? <Loader2 size={18} className="animate-spin" strokeWidth={2.5} /> : <Save size={18} strokeWidth={2.5} />}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    {/* Platform Kimliği & İletişim */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ background: '#fff7f2', color: '#ff7a21', padding: '10px', borderRadius: '14px', border: '1px solid #ffedd5' }}>
                                <Globe size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Platform Kimliği & İletişim</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Marka başlığı ve kritik iletişim kanalları.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Başlığı</label>
                                <input
                                    type="text"
                                    value={settings.platformTitle}
                                    onChange={(e) => setSettings({ ...settings, platformTitle: e.target.value })}
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,122,33,0.1)]"
                                    placeholder="Örn: QRLA Menü SaaS"
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Mail size={14} color="#64748b" /> Destek E-Posta Adresi
                                </label>
                                <input
                                    type="email"
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                                    className="focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,122,33,0.1)]"
                                    placeholder="support@domain.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dil & Bölge Ayarları */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ background: '#f0fdfa', color: '#14b8a6', padding: '10px', borderRadius: '14px', border: '1px solid #ccfbf1' }}>
                                <Globe size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Yerelleştirme</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Varsayılan lokasyon verileri.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sistem Para Birimi</label>
                                <div style={{ position: 'relative' }}>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s', appearance: 'none', cursor: 'pointer' }}
                                        className="focus:border-teal-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(20,184,166,0.1)]"
                                    >
                                        <option value="USD">USD - Amerikan Doları</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="TRY">TRY - Türk Lirası</option>
                                    </select>
                                    <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    {/* SMTP Settings */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ background: '#f0f9ff', color: '#0ea5e9', padding: '10px', borderRadius: '14px', border: '1px solid #e0f2fe' }}>
                                <Mail size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>E-posta (SMTP) Servisi</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Giden e-posta sunucusu yapılandırması.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SMTP Relay Host</label>
                                <input
                                    type="text"
                                    value={settings.smtpHost}
                                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                                    style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                                    className="focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Servis Portu</label>
                                    <input
                                        type="number"
                                        value={settings.smtpPort}
                                        onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                                        style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s' }}
                                        className="focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]"
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Protokol Güvenliği</label>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={settings.smtpSecurity}
                                            onChange={(e) => setSettings({ ...settings, smtpSecurity: e.target.value })}
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.9rem', fontWeight: '600', color: '#111827', outline: 'none', transition: 'all 0.2s', appearance: 'none', cursor: 'pointer' }}
                                            className="focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(14,165,233,0.1)]"
                                        >
                                            <option value="TLS">TLS / STARTTLS</option>
                                            <option value="SSL">SSL</option>
                                            <option value="NONE">Yok (Güvensiz)</option>
                                        </select>
                                        <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Toggles */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ background: '#fef2f2', color: '#f43f5e', padding: '10px', borderRadius: '14px', border: '1px solid #fee2e2' }}>
                                <Shield size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Sistem Kontrolleri</h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>Kritik sistem özelliklerini yönetin.</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <button
                                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderRadius: '16px',
                                    border: settings.maintenanceMode ? '2px solid #fda4af' : '2px solid #f1f5f9',
                                    background: settings.maintenanceMode ? '#fff1f2' : '#f8fafc',
                                    cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                                }}
                                className="hover:scale-[1.02]"
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: settings.maintenanceMode ? '#e11d48' : '#111827' }}>Bakım Modu (Erişim Kes)</span>
                                    <span style={{ fontSize: '0.8rem', color: settings.maintenanceMode ? '#f43f5e' : '#64748b', fontWeight: '500' }}>Aktif edildiğinde sadece Super Admin'ler sisteme girebilir.</span>
                                </div>
                                <div style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.maintenanceMode ? '#e11d48' : '#cbd5e1', position: 'relative', transition: 'all 0.3s' }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings.maintenanceMode ? '24px' : '2px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                </div>
                            </button>

                            <button
                                onClick={() => setSettings({ ...settings, RegistrationOpen: !settings.RegistrationOpen })}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderRadius: '16px',
                                    border: settings.RegistrationOpen ? '2px solid #86efac' : '2px solid #f1f5f9',
                                    background: settings.RegistrationOpen ? '#f0fdf4' : '#f8fafc',
                                    cursor: 'pointer', transition: 'all 0.2s', width: '100%'
                                }}
                                className="hover:scale-[1.02]"
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: settings.RegistrationOpen ? '#16a34a' : '#111827' }}>Yeni Restoran Kaydı</span>
                                    <span style={{ fontSize: '0.8rem', color: settings.RegistrationOpen ? '#22c55e' : '#64748b', fontWeight: '500' }}>Yeni abonelik satışına platformu aç/kapat.</span>
                                </div>
                                <div style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.RegistrationOpen ? '#16a34a' : '#cbd5e1', position: 'relative', transition: 'all 0.3s' }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: settings.RegistrationOpen ? '24px' : '2px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Backup Widget */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
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
