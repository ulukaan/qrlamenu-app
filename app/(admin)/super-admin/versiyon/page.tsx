"use client";
import React, { useState, useEffect } from 'react';
import { GitBranch, UploadCloud, CheckCircle, Package, Loader2 } from 'lucide-react';

export default function VersionManagementPage() {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/version');
                if (!res.ok) throw new Error('Versiyon bilgisi yüklenemedi');
                const data = await res.json();
                setConfig(data.value);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVersion();
    }, []);

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Versiyon Yönetimi & Dağıtım</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platform güncellemelerini, modül çekirdek versiyonlarını ve roll-out stratejilerini kontrol edin.</p>
                </div>
                <button className="hover:scale-105 active:scale-95 transition-all" style={{ background: '#ff7a21', color: '#fff', padding: '14px 28px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}>
                    <UploadCloud size={20} strokeWidth={2.5} /> Yeni Sürüm Yayınla
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {/* Core Version Dashboard */}
                    <div className="card" style={{ border: 'none', padding: '54px 64px', display: 'flex', gap: '56px', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '40px', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)' }}>
                        <div style={{ position: 'absolute', right: '-60px', bottom: '-60px', opacity: 0.1, transform: 'rotate(-15deg)', color: '#ff7a21' }}>
                            <Package size={340} />
                        </div>

                        {/* Glassmorphism Accents */}
                        <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '200px', height: '200px', background: 'rgba(255,122,33,0.1)', filter: 'blur(80px)', borderRadius: '50%' }}></div>

                        <div style={{ width: '140px', height: '140px', borderRadius: '36px', background: 'rgba(255,122,33,0.1)', color: '#ff7a21', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,122,33,0.25)', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1 }}>
                            <GitBranch size={64} strokeWidth={2.5} />
                        </div>

                        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                <span style={{ padding: '6px 14px', background: '#10b981', color: '#fff', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>PARETO STABLE</span>
                                <span style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '800', letterSpacing: '0.02em' }}>Build M-892.42</span>
                            </div>
                            <h3 style={{ margin: 0, fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
                                {loading ? 'Sistem taranıyor...' : `QRlamenü Core ${config?.version || 'v2.4.1'}`}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} className="animate-pulse"></div>
                                <p style={{ margin: 0, color: '#94a3b8', fontSize: '1.1rem', fontWeight: '700' }}>
                                    Son kararlı sürüm • {loading ? '...' : new Date(config?.lastUpdate || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <button className="hover:scale-105 active:scale-95 transition-all" style={{ padding: '16px 32px', borderRadius: '18px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', zIndex: 1, backdropFilter: 'blur(10px)' }}>Sürüm Detayları</button>
                    </div>

                    {/* Module Library */}
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '28px 40px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Modül Kütüphanesi & Bağımlılıklar</h3>
                        </div>
                        <div style={{ padding: '0 40px', background: '#fff' }}>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '120px' }}>
                                    <Loader2 className="animate-spin text-orange-500" size={56} />
                                    <span style={{ fontWeight: '800', color: '#94a3b8', fontSize: '1.1rem' }}>MODÜLLER ANALİZ EDİLİYOR...</span>
                                </div>
                            ) : error ? (
                                <div style={{ color: '#f43f5e', padding: '60px', textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>{error}</div>
                            ) : config?.modules?.map((row: any, i: number) => (
                                <div key={i} className="group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '36px 0', borderBottom: i < config.modules.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                                        <div style={{ background: '#f8fafc', color: '#64748b', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="group-hover:scale-110 group-hover:bg-white group-hover:shadow-md">
                                            <Package size={26} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '900', color: '#111827', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>{row.name}</p>
                                            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '800', letterSpacing: '0.05em' }}>SİSTEM ETİKETİ: <span style={{ color: '#444' }}>MOD-CORE-{row.ver.replace(/\./g, '')}</span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontSize: '1.15rem', color: '#111827', fontWeight: '900', letterSpacing: '-0.02em' }}>v{row.ver}</p>
                                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8', fontWeight: '800' }}>API V2.4+</p>
                                        </div>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: '900',
                                            padding: '10px 20px',
                                            borderRadius: '12px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.1em',
                                            background: row.status === 'Stable' ? '#ecfdf5' : '#fff7f2',
                                            color: row.status === 'Stable' ? '#10b981' : '#ff7a21',
                                            border: '1px solid currentColor',
                                            transition: 'all 0.2s',
                                            boxShadow: row.status === 'Stable' ? '0 4px 6px -1px rgba(16, 185, 129, 0.1)' : '0 4px 6px -1px rgba(255, 122, 33, 0.1)'
                                        }}>{row.status === 'Stable' ? 'KARARLI' : 'TESTTE'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Patch Tracking */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>Patch Kayıtları</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {[1, 2, 3].map((i) => (
                                <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #d1fae5', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.1)' }}>
                                        <CheckCircle size={18} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '900', color: '#111827', fontSize: '0.95rem' }}>Patch 2.4.1-{i * 42}</p>
                                        <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6', fontWeight: '500' }}>
                                            Tenant resolution katmanında slug çakışması ve session timeout hataları giderildi.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="hover:scale-105 active:scale-95 transition-all" style={{ width: '100%', padding: '16px', marginTop: '40px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '16px', fontSize: '0.95rem', fontWeight: '900', color: '#374151', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>Tüm Günlükleri İndir</button>
                    </div>

                    {/* Future Version Highlights */}
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)', color: '#fff', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <GitBranch size={22} color="#fff" strokeWidth={2.5} />
                                </div>
                                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Gelecek Sürüm: v2.5.0</h4>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', fontWeight: '500' }}>
                                Yeni sürüm şu anda <span style={{ color: '#fff', fontWeight: '900' }}>Beta Stage</span> aşamasında. Çoklu dil desteği ve gelişmiş yetkilendirme modülleri eklendi.
                            </p>
                            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                                {[1, 2, 3, 4].map(dot => <div key={dot} style={{ width: dot === 1 ? '24px' : '8px', height: '8px', borderRadius: '4px', background: dot === 1 ? '#fff' : 'rgba(255,255,255,0.2)' }}></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
