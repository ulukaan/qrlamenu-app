"use client";
import React, { useState, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Info, Search, Loader2 } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/logs');
                if (!res.ok) throw new Error('Loglar yüklenemedi');
                const data = await res.json();
                setLogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const getLogColor = (level: string) => {
        switch (level) {
            case 'SUCCESS': return '#4caf50';
            case 'ERROR': return '#f44336';
            case 'WARNING': return '#ffc107';
            default: return '#aaa';
        }
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Sistem Logları & Monitor</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Platform genelinde gerçekleşen kritik olayları, API trafiklerini ve sistem hatalarını gerçek zamanlı izleyin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button className="hover:scale-105 active:scale-95 transition-all" style={{ padding: '14px 28px', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <Info size={20} strokeWidth={2.5} /> Rehber
                    </button>
                    <button className="hover:scale-105 active:scale-95 transition-all" style={{ background: '#ff7a21', color: '#fff', padding: '14px 28px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}>
                        <Terminal size={20} strokeWidth={2.5} /> Terminali Temizle
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Sophisticated Dark Terminal Viewer */}
                    <div className="card" style={{ border: 'none', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#cbd5e1', padding: '40px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', minHeight: '650px', maxHeight: '75vh', overflowY: 'auto', position: 'relative' }}>
                        {/* Glassmorphism Terminal Header */}
                        <div style={{ position: 'sticky', top: '-40px', left: 0, right: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', zIndex: 10, padding: '0 0 24px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '24px', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '0.1em' }}>
                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="animate-pulse" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }} /> SUCCESS
                                </span>
                                <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 12px #f43f5e' }} /> ERROR
                                </span>
                                <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 12px #f59e0b' }} /> WARNING
                                </span>
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.8 }}>
                                LIVE MONITORING • QRlamenü OS V2.5
                            </div>
                        </div>

                        {/* Log Stream Area */}
                        <div style={{ fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace', fontSize: '0.9rem', lineHeight: '1.8' }}>
                            {loading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#64748b', padding: '100px 0' }}>
                                    <Loader2 size={48} className="animate-spin text-orange-500" />
                                    <span style={{ fontWeight: '800', fontSize: '1rem', letterSpacing: '0.05em' }}>SİSTEM KAYITLARI ANALİZ EDİLİYOR...</span>
                                </div>
                            ) : error ? (
                                <div style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.2)', fontWeight: '800' }}>
                                    <span style={{ color: '#fff' }}>[SYSTEM_CRITICAL_FAILURE]</span> {error}
                                </div>
                            ) : logs.length === 0 ? (
                                <div style={{ color: '#64748b', textAlign: 'center', padding: '100px 0' }}>
                                    <Terminal size={56} style={{ marginBottom: '24px', opacity: 0.2 }} />
                                    <p style={{ fontWeight: '800', fontSize: '1rem' }}>Aktif bir sistem kaydı bulunamadı. Platform şu anda stabil.</p>
                                </div>
                            ) : logs.map((log) => (
                                <div key={log.id} style={{ marginBottom: '10px', display: 'flex', gap: '16px', padding: '10px 16px', borderRadius: '10px', transition: 'background 0.2s' }} className="hover:bg-white/5 group">
                                    <span style={{ color: '#475569', fontWeight: '700', flexShrink: 0, fontSize: '0.8rem' }}>[{new Date(log.createdAt).toLocaleTimeString('tr-TR')}]</span>
                                    <span style={{ color: getLogColor(log.level), fontWeight: '900', minWidth: '94px', flexShrink: 0, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{log.level}</span>
                                    <span style={{ color: log.level === 'ERROR' ? '#fecaca' : '#f1f5f9', fontWeight: '500' }}>{log.message}</span>
                                    {log.category && <span style={{ color: '#334155', fontSize: '0.75rem', fontWeight: '900', marginLeft: 'auto', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '6px' }}>#{log.category}</span>}
                                </div>
                            ))}

                            <div className="animate-pulse" style={{ color: '#ff7a21', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px', paddingLeft: '16px' }}>
                                <span style={{ color: '#ff7a21', fontSize: '1.2rem' }}>█</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '900', letterSpacing: '0.1em' }}>GERÇEK ZAMANLI VERİ AKIŞI BEKLENİYOR...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Health Monitor */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '32px', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', background: '#fff' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: '900', marginBottom: '28px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b' }}>Sistem Sağlığı</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="hover:scale-[1.02] hover:shadow-lg">
                                <div style={{ background: '#ecfdf5', color: '#10b981', padding: '12px', borderRadius: '16px', border: '1px solid #d1fae5' }}><CheckCircle size={22} strokeWidth={2.5} /></div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATABASE</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>Bağlı / Stabil</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="hover:scale-[1.02] hover:shadow-lg">
                                <div style={{ background: '#fef2f2', color: '#f43f5e', padding: '12px', borderRadius: '16px', border: '1px solid #fee2e2' }}><AlertTriangle size={22} strokeWidth={2.5} /></div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HATALAR</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>{logs.filter(l => l.level === 'ERROR').length} Bekleyen</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="hover:scale-[1.02] hover:shadow-lg">
                                <div style={{ background: '#f1f5f9', color: '#475569', padding: '12px', borderRadius: '16px', border: '1px solid #e2e8f0' }}><Terminal size={22} strokeWidth={2.5} /></div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API GECİKME</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: '900', color: '#111827' }}>42ms <span style={{ color: '#10b981', fontSize: '0.8rem' }}>(Mükemmel)</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,122,33,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                                <div style={{ background: 'rgba(255,122,33,0.1)', padding: '10px', borderRadius: '12px' }}>
                                    <Shield size={22} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.02em' }}>Güvenlik Durumu</h3>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '500' }}>
                                Son 24 saat içinde <span style={{ color: '#fff', fontWeight: '900' }}>0</span> yetkisiz erişim girişimi tespit edildi. Sistem koruması aktif.
                            </p>
                            <button className="hover:scale-105 active:scale-95 transition-all" style={{ width: '100%', marginTop: '32px', padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', fontWeight: '900', cursor: 'pointer' }}>
                                Denetim Geçmişini Görüntüle
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
