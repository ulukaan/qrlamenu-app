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
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Güvenlik & Erişim Kontrolü</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Platform genelinde kimlik doğrulama, IP kısıtlamaları ve siber güvenlik politikalarını yapılandırın.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderRadius: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#fff', fontSize: '0.9rem', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)' }}>
                        <Shield size={18} strokeWidth={2.5} /> SİSTEM DURUMU: GÜVENLİ
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* General Security Layers */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#f0f9ff', color: '#0ea5e9', padding: '12px', borderRadius: '16px', border: '1px solid #e0f2fe' }}>
                                <Lock size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Zırhlı Erişim Katmanları</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Aktif güvenlik duvarları ve doğrulama metodları.</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                { id: 'twoFA', title: 'Çift Faktörlü Doğrulama (2FA)', desc: 'Tüm admin ve süper admin hesapları için zorunlu kılındığında oturum güvenliğini maksimize eder.', icon: <Smartphone size={20} strokeWidth={2.5} />, active: settings?.twoFA },
                                { id: 'ipWhitelist', title: 'IP Beyaz Liste Filtresi', desc: 'Sadece yetkilendirilmiş statik IP adreslerinden gelen talepleri kabul ederek dış saldırıları engeller.', icon: <Globe size={20} strokeWidth={2.5} />, active: settings?.ipWhitelist },
                                { id: 'sessionTimeout', title: 'Akıllı Oturum Yönetimi', desc: `İnaktiflik durumunda ${settings?.sessionTimeout || 30} dakika sonra oturumu otomatik olarak sonlandırır.`, icon: <Clock size={20} strokeWidth={2.5} />, active: true, persistent: true },
                            ].map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', borderRadius: '20px', background: s.active ? '#f8fafc' : '#fff', border: '1px solid', borderColor: s.active ? '#e2e8f0' : '#f1f5f9', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', opacity: saving ? 0.6 : 1 }} className="group hover:shadow-lg hover:border-blue-200">
                                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: s.active ? '#0f172a' : '#f1f5f9', color: s.active ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: s.active ? '0 12px 20px -5px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.4s' }}>
                                        {s.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem', color: '#111827', letterSpacing: '-0.01em' }}>{s.title}</p>
                                        <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500', lineHeight: '1.6' }}>{s.desc}</p>
                                    </div>
                                    {!s.persistent && (
                                        <button
                                            onClick={() => toggleSetting(s.id)}
                                            disabled={saving}
                                            style={{
                                                width: '52px',
                                                height: '28px',
                                                borderRadius: '20px',
                                                background: s.active ? '#ff7a21' : '#e2e8f0',
                                                border: 'none',
                                                position: 'relative',
                                                cursor: saving ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                padding: '4px',
                                                boxShadow: s.active ? '0 10px 15px -3px rgba(255, 122, 33, 0.4)' : 'none'
                                            }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: '#fff',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                transform: `translateX(${s.active ? '24px' : '0px'})`,
                                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Password Policy */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#f5f3ff', color: '#7c3aed', padding: '12px', borderRadius: '16px', border: '1px solid #ede9fe' }}>
                                <Key size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Karmaşıklık Politikası</h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Şifre kriterleri ve rotasyon kuralları.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div style={{ gridColumn: 'span 2', padding: '28px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '900', color: '#1f2937', letterSpacing: '-0.01em' }}>Minimum Karakter Uzunluğu</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ff7a21', letterSpacing: '-0.02em' }}>{settings?.minPasswordLength || 12} Dijit</span>
                                </div>
                                <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #ff7a21, #fb923c)', borderRadius: '5px', boxShadow: '0 0 15px rgba(255, 122, 33, 0.5)' }} />
                                </div>
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#4b5563', padding: '10px 16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> Büyük/Küçük Harf
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: '800', color: '#4b5563', padding: '10px 16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} /> Özel Karakterler
                                    </div>
                                </div>
                            </div>
                            <button className="hover:scale-105 active:scale-95 transition-all" style={{ padding: '14px 32px', borderRadius: '16px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: '900', fontSize: '0.9rem', alignSelf: 'flex-start', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)', cursor: 'pointer', letterSpacing: '0.02em' }}>
                                GÜVENLİK POLİTİKASINI GÜNCELLE
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '1.5rem', height: 'fit-content' }}>
                    {/* Critical Actions */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', color: '#fff', borderRadius: '24px', boxShadow: '0 20px 30px -10px rgba(127, 29, 29, 0.4)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(244,63,94,0.15)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <AlertTriangle size={24} color="#f43f5e" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Kritik Müdahale</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#fca5a5', marginBottom: '24px', lineHeight: '1.7', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                            Bu alandaki işlemler platformun tüm erişim trafiğini ve <span style={{ color: '#fff', fontWeight: '900' }}>veri güvenliğini</span> anlık olarak etkiler.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 1 }}>
                            <button style={{ width: '100%', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', background: 'rgba(255,255,255,0.05)', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover:bg-white/10 active:scale-95">Tüm Oturumları Sonlandır</button>
                            <button style={{ width: '100%', padding: '14px', borderRadius: '16px', border: 'none', background: '#f43f5e', color: '#fff', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 10px 20px -5px rgba(244, 63, 94, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover:bg-rose-500 active:scale-95">Güvenlik Kilidini Aktif Et</button>
                        </div>
                    </div>

                    {/* Health Index Card */}
                    <div className="card" style={{ border: 'none', padding: '28px', background: '#fff', borderRadius: '24px', boxShadow: '0 15px 20px -5px rgba(0, 0, 0, 0.05)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '0.85rem', fontWeight: '900', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sistem Sağlık Endeksi</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'SSL Sertifikası', value: 'Aktif', color: '#10b981' },
                                { label: 'DDoS Koruması', value: '7/24 Devrede', color: '#10b981' },
                                { label: 'WAF Filtreleri', value: 'Optimize', color: '#0ea5e9' },
                                { label: 'Data Şifreleme', value: 'AES-256', color: '#6366f1' }
                            ].map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: idx !== 3 ? '12px' : 0, borderBottom: idx !== 3 ? '1px solid #f1f5f9' : 'none' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '700' }}>{item.label}</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: item.color, background: `${item.color}10`, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${item.color}20` }}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
