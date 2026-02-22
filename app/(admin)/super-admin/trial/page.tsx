"use client";
import React, { useState, useEffect } from 'react';
import { Clock, Users, Zap, CheckCircle, AlertCircle, Search, Loader2 } from 'lucide-react';

export default function TrialManagementPage() {
    const [trials, setTrials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrials = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/trial');
                if (!res.ok) throw new Error('Trial verileri yüklenemedi');
                const data = await res.json();
                setTrials(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrials();
    }, []);

    const calculateDaysLeft = (expiresAt: string) => {
        const diff = new Date(expiresAt).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    const stats = {
        activeCount: trials.length,
        urgentCount: trials.filter(t => calculateDaysLeft(t.trialExpiresAt) <= 2).length,
        conversion: "0" // Placeholder for real conversion logic if implemented
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            {/* Page Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Trial (Deneme) Yönetimi</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Sistemdeki deneme sürecindeki işletmeleri, süre aşımlarını ve müşteri dönüşüm potansiyelini analiz edin.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="İşletme adı ara..."
                            style={{ padding: '14px 24px 14px 54px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '0.95rem', width: '300px', outline: 'none', background: '#fff', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                            className="focus:border-orange-500 transition-all"
                        />
                    </div>
                    <button className="hover:scale-105 active:scale-95 transition-all" style={{ background: '#ff7a21', color: '#fff', padding: '14px 28px', borderRadius: '16px', border: 'none', fontSize: '0.95rem', fontWeight: '900', boxShadow: '0 10px 15px -3px rgba(255, 122, 33, 0.3)', cursor: 'pointer' }}>Toplu Süre Uzatımı</button>
                </div>
            </div>

            {/* Premium Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem', marginBottom: '3.5rem' }}>
                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Aktif Trial</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.activeCount}</h3>
                            <p style={{ margin: '14px 0 0 0', color: '#10b981', fontSize: '0.9rem', fontWeight: '800' }}>Canlı Süreç</p>
                        </div>
                        <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '20px', color: '#0ea5e9', border: '1px solid #e0f2fe' }}>
                            <Clock size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Kritik (48 Saat)</p>
                            <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', color: '#f43f5e', letterSpacing: '-0.05em', lineHeight: '1' }}>{loading ? '...' : stats.urgentCount}</h3>
                            <p style={{ margin: '14px 0 0 0', color: '#f43f5e', fontSize: '0.9rem', fontWeight: '800' }}>Acil Aksiyon Gerekli</p>
                        </div>
                        <div style={{ background: '#fef2f2', padding: '16px', borderRadius: '20px', color: '#f43f5e', border: '1px solid #fee2e2' }}>
                            <AlertCircle size={28} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '120px', height: '120px', background: 'rgba(52,211,153,0.1)', filter: 'blur(40px)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Dönüşüm Oranı</p>
                                <h3 style={{ margin: 0, fontSize: '2.75rem', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '1' }}>%{stats.conversion}</h3>
                                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '800', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '6px 14px', borderRadius: '10px', width: 'fit-content' }}>
                                    <Zap size={16} fill="currentColor" /> <span>Hızlı Büyüme</span>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Zap size={28} color="#10b981" strokeWidth={2.5} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', borderRadius: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', background: '#fff' }}>
                        <div style={{ padding: '28px 40px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Deneme Süreci İzleme Merkezi</h3>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşletme Profili</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Bitiş Tarihi</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kalan Süre</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hedef Paket</th>
                                        <th style={{ padding: '24px 40px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Eylemler</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#94a3b8' }}>
                                                    <Loader2 size={48} className="animate-spin text-orange-500" />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Veritabanı Senkronize Ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#f43f5e', fontWeight: '900' }}>{error}</td>
                                        </tr>
                                    ) : trials.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '120px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', color: '#cbd5e1' }}>
                                                    <Clock size={72} strokeWidth={1} />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Şu an için herhangi bir trial kaydı bulunmuyor.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : trials.map((row, idx) => {
                                        const daysLeft = calculateDaysLeft(row.trialExpiresAt);
                                        return (
                                            <tr key={row.id} style={{ borderBottom: idx < trials.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'all 0.2s' }} className="hover:bg-slate-50 group">
                                                <td style={{ padding: '32px 40px' }}>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>{row.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', marginTop: '6px' }}>Önizleme ID: <span style={{ color: '#ff7a21' }}>#{row.id.substring(0, 8).toUpperCase()}</span></div>
                                                </td>
                                                <td style={{ padding: '32px 40px', fontSize: '1rem', color: '#374151', fontWeight: '800' }}>
                                                    {new Date(row.trialExpiresAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '32px 40px' }}>
                                                    <div style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        background: daysLeft <= 3 ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        color: daysLeft <= 3 ? '#f43f5e' : '#10b981',
                                                        padding: '8px 18px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.85rem',
                                                        fontWeight: '900',
                                                        border: '1px solid currentColor',
                                                        letterSpacing: '0.02em'
                                                    }}>
                                                        <Clock size={16} strokeWidth={2.5} /> {daysLeft} GÜN KALDI
                                                    </div>
                                                </td>
                                                <td style={{ padding: '32px 40px' }}>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: '900', background: '#f8fafc', padding: '8px 16px', borderRadius: '10px', color: '#475569', border: '1px solid #e2e8f0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.plan?.name || 'STANDART PLAN'}</span>
                                                </td>
                                                <td style={{ padding: '32px 40px', textAlign: 'right' }}>
                                                    <button style={{ border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', padding: '12px 24px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '10px' }} className="hover:border-orange-500 hover:text-orange-500 hover:scale-105 active:scale-95">
                                                        Bilgilendir
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Trial Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,122,33,0.1)', filter: 'blur(60px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                                <div style={{ background: 'rgba(52,211,153,0.1)', padding: '10px', borderRadius: '14px' }}>
                                    <Zap size={24} color="#10b981" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Dönüşüm Rehberi</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ display: 'flex', gap: '18px' }}>
                                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '10px', height: 'fit-content' }}>
                                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '600' }}>
                                        Sürecin <span style={{ color: '#fff', fontWeight: '900' }}>7. gününde</span> atılan mesajlar dönüşümü %24 artırır.
                                    </p>
                                </div>

                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

                                <div style={{ display: 'flex', gap: '18px' }}>
                                    <div style={{ background: 'rgba(255,122,33,0.1)', padding: '8px', borderRadius: '10px', height: 'fit-content' }}>
                                        <CheckCircle size={20} style={{ color: '#ff7a21' }} />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7', fontWeight: '600' }}>
                                        <span style={{ color: '#ff7a21', fontWeight: '900' }}>WELCOME30</span> kodu ile son gün dönüşümlerini tetikleyin.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', borderRadius: '32px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff7f2', padding: '12px', borderRadius: '16px', border: '1px solid #ffedd5' }}>
                                <AlertCircle size={26} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em' }}>Otomatik Kısıtlama</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Süresi dolan restoranlar <span style={{ color: '#f43f5e', fontWeight: '900' }}>+7 gün</span> tolerans süresi sonunda otomatik askıya alınır.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
