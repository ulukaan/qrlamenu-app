"use client";
import React from 'react';
import { Shield, Lock, Key, Smartphone, Globe, AlertTriangle, Clock, Loader2 } from 'lucide-react';

export default function SecuritySettingsPage() {
    const [settings, setSettings] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/security');
                if (!res.ok) throw new Error('Güvenlik ayarları yüklenemedi');
                const data = await res.json();
                setSettings(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const toggleSetting = async (key: string) => {
        try {
            setSaving(true);
            const newSettings = { ...settings, [key]: !settings[key] };
            const res = await fetch('/api/admin/security', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSettings)
            });
            if (res.ok) {
                setSettings(newSettings);
            }
        } catch (err) {
            console.error('Update Setting Error:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <Loader2 size={32} className="animate-spin text-gray-400" style={{ margin: '0 auto' }} />
        </div>
    );

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Güvenlik & Erişim Kontrolü</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platform genelinde kimlik doğrulama, IP kısıtlamaları ve siber güvenlik politikalarını yapılandırın.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 24px', borderRadius: '18px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#fff', fontSize: '0.95rem', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                        <Shield size={20} strokeWidth={2.5} /> SİSTEM DURUMU: GÜVENLİ
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 420px', gap: '3.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* General Security Layers */}
                    <div className="card" style={{ border: 'none', padding: '48px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '48px' }}>
                            <div style={{ background: '#f0f9ff', color: '#0ea5e9', padding: '16px', borderRadius: '20px', border: '1px solid #e0f2fe' }}>
                                <Lock size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Zırhlı Erişim Katmanları</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>Aktif güvenlik duvarları ve doğrulama metodları.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { id: 'twoFA', title: 'Çift Faktörlü Doğrulama (2FA)', desc: 'Tüm admin ve süper admin hesapları için zorunlu kılındığında oturum güvenliğini maksimize eder.', icon: <Smartphone size={24} strokeWidth={2.5} />, active: settings?.twoFA },
                                { id: 'ipWhitelist', title: 'IP Beyaz Liste Filtresi', desc: 'Sadece yetkilendirilmiş statik IP adreslerinden gelen talepleri kabul ederek dış saldırıları engeller.', icon: <Globe size={24} strokeWidth={2.5} />, active: settings?.ipWhitelist },
                                { id: 'sessionTimeout', title: 'Akıllı Oturum Yönetimi', desc: `İnaktiflik durumunda ${settings?.sessionTimeout || 30} dakika sonra oturumu otomatik olarak sonlandırır.`, icon: <Clock size={24} strokeWidth={2.5} />, active: true, persistent: true },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '32px', padding: '36px', borderRadius: '24px', background: s.active ? '#f8fafc' : '#fff', border: '1px solid', borderColor: s.active ? '#e2e8f0' : '#f1f5f9', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', opacity: saving ? 0.6 : 1 }} className="group hover:shadow-lg hover:border-blue-200">
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: s.active ? '#0f172a' : '#f1f5f9', color: s.active ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: s.active ? '0 12px 20px -5px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.4s' }}>
                                        {s.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '1.15rem', color: '#111827', letterSpacing: '-0.01em' }}>{s.title}</p>
                                        <p style={{ margin: '8px 0 0', fontSize: '1rem', color: '#64748b', fontWeight: '500', lineHeight: '1.7' }}>{s.desc}</p>
                                    </div>
                                    {!s.persistent && (
                                        <button
                                            onClick={() => toggleSetting(s.id)}
                                            disabled={saving}
                                            style={{
                                                width: '64px',
                                                height: '36px',
                                                borderRadius: '24px',
                                                background: s.active ? '#ff7a21' : '#e2e8f0',
                                                border: 'none',
                                                position: 'relative',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                padding: '6px',
                                                boxShadow: s.active ? '0 10px 15px -3px rgba(255, 122, 33, 0.4)' : 'none'
                                            }}>
                                            <div style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                background: '#fff',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                transform: `translateX(${s.active ? '28px' : '0px'})`,
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password Policy */}
                    <div className="card" style={{ border: 'none', padding: '48px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '48px' }}>
                            <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '16px', borderRadius: '20px', border: '1px solid #ede9fe' }}>
                                <Key size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Karmaşıklık Politikası</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>Şifre kriterleri ve rotasyon kuralları.</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2', padding: '40px', borderRadius: '28px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#1f2937', letterSpacing: '-0.01em' }}>Minimum Karakter Uzunluğu</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ff7a21', letterSpacing: '-0.02em' }}>{settings?.minPasswordLength || 12} Dijit</span>
                                </div>
                                <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #ff7a21, #fb923c)', borderRadius: '7px', boxShadow: '0 0 15px rgba(255, 122, 33, 0.5)' }} />
                                </div>
                                <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.9rem', fontWeight: '800', color: '#4b5563', padding: '12px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> Büyük/Küçük Harf
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.9rem', fontWeight: '800', color: '#4b5563', padding: '12px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> Özel Karakterler
                                    </div>
                                </div>
                            </div>
                            <button className="hover:scale-105 active:scale-95 transition-all" style={{ padding: '18px 40px', borderRadius: '18px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: '900', fontSize: '1rem', alignSelf: 'flex-start', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)', cursor: 'pointer', letterSpacing: '0.02em' }}>
                                GÜVENLİK POLİTİKASINI GÜNCELLE
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    {/* Critical Actions */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', color: '#fff', borderRadius: '32px', boxShadow: '0 20px 30px -10px rgba(127, 29, 29, 0.4)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(244,63,94,0.15)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <AlertTriangle size={32} color="#f43f5e" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Kritik Müdahale</h3>
                        </div>
                        <p style={{ fontSize: '1rem', color: '#fca5a5', marginBottom: '32px', lineHeight: '1.7', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                            Bu alandaki işlemler platformun tüm erişim trafiğini ve <span style={{ color: '#fff', fontWeight: '900' }}>veri güvenliğini</span> anlık olarak etkiler.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
                            <button style={{ width: '100%', padding: '18px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', background: 'rgba(255,255,255,0.05)', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover:bg-white/10 active:scale-95">Tüm Oturumları Sonlandır</button>
                            <button style={{ width: '100%', padding: '18px', borderRadius: '18px', border: 'none', background: '#f43f5e', color: '#fff', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px -5px rgba(244, 63, 94, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover:bg-rose-500 active:scale-95">Güvenlik Kilidini Aktif Et</button>
                        </div>
                    </div>

                    {/* Health Index Card */}
                    <div className="card" style={{ border: 'none', padding: '36px', background: '#fff', borderRadius: '32px', boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.05)' }}>
                        <h4 style={{ margin: '0 0 28px 0', fontSize: '0.95rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sistem Sağlık Endeksi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { label: 'SSL Sertifikası', value: 'Aktif', color: '#10b981' },
                                { label: 'DDoS Koruması', value: '7/24 Devrede', color: '#10b981' },
                                { label: 'WAF Filtreleri', value: 'Optimize', color: '#0ea5e9' },
                                { label: 'Data Şifreleme', value: 'AES-256', color: '#6366f1' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx !== 3 ? '16px' : 0, borderBottom: idx !== 3 ? '1px solid #f1f5f9' : 'none' }}>
                                    <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '700' }}>{item.label}</span>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: item.color, background: `${item.color}10`, padding: '4px 12px', borderRadius: '8px', border: `1px solid ${item.color}20` }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
