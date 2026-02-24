"use client";
import React, { useState, useEffect } from 'react';
import { Database, Search, Shield, Clock, User, Info, Loader2 } from 'lucide-react';

export default function AuditLogPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuditLogs = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/audit');
                if (!res.ok) throw new Error('Denetim kayıtları yüklenemedi');
                const data = await res.json();
                setLogs(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAuditLogs();
    }, []);

    return (
        <div style={{ padding: '1.5rem 2rem', width: '100%', maxWidth: '100%' }}>
            {/* Sayfa Üst Bilgisi */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Sistem Denetim İzleri</h2>
                    <p style={{ color: '#64748b', marginTop: '4px', fontSize: '0.9rem', fontWeight: '500' }}>Platform üzerindeki kritik yönetimsel işlemlerin güvenlik kayıtları.</p>
                </div>
                <div style={{ position: 'relative', width: '420px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="Eylem, admin veya IP adresi ile filtrele..."
                        style={{ padding: '16px 24px 16px 56px', borderRadius: '18px', border: '1px solid #e2e8f0', fontSize: '1rem', width: '100%', outline: 'none', background: '#fff', fontWeight: '700', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}
                        className="focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Denetim Kayıtları */}
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                                    <Database size={18} color="#64748b" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Olay Akışı</h3>
                            </div>
                            <button className="hover:scale-105 active:scale-95 transition-all" style={{ fontSize: '0.8rem', fontWeight: '900', color: '#ff7a21', background: '#fff7ed', padding: '8px 16px', borderRadius: '10px', border: '1px solid #ffedd5', cursor: 'pointer', letterSpacing: '0.02em' }}>DIŞA AKTAR (.CSV)</button>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zaman Damgası</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aktör</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Eylem Tipi</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>İşlem Detayı</th>
                                        <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kaynak IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '100px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#64748b' }}>
                                                    <Loader2 size={56} className="animate-spin text-orange-500" />
                                                    <span style={{ fontWeight: '900', fontSize: '1.1rem', letterSpacing: '-0.02em' }}>DENETİM VERİTABANI SENKRONİZE EDİLİYOR...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '80px', textAlign: 'center', color: '#f43f5e', fontWeight: '900', fontSize: '1.2rem' }}>{error}</td>
                                        </tr>
                                    ) : logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '100px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: '900', letterSpacing: '-0.02em' }}>Henüz bir kayıt bulunmuyor.</div>
                                            </td>
                                        </tr>
                                    ) : logs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.3s' }} className="group hover:bg-slate-50/50">
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#111827', fontWeight: '900', letterSpacing: '-0.01em' }}>
                                                    <Clock size={14} style={{ color: '#94a3b8' }} strokeWidth={2.5} />
                                                    {new Date(log.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9', color: '#1e293b', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                                                        <User size={14} strokeWidth={2.5} />
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}>{log.adminEmail || 'Sistem'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: '900',
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    background: log.action.includes('CREATE') ? '#ecfdf5' : log.action.includes('UPDATE') ? '#fff7ed' : log.action.includes('DELETE') ? '#fef2f2' : '#f1f5f9',
                                                    color: log.action.includes('CREATE') ? '#10b981' : log.action.includes('UPDATE') ? '#ff7a21' : log.action.includes('DELETE') ? '#f43f5e' : '#475569',
                                                    border: '1px solid currentColor'
                                                }}>{log.action}</span>
                                            </td>
                                            <td style={{ padding: '20px 24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '300px' }}>
                                                    <Info size={14} style={{ flexShrink: 0, color: '#94a3b8' }} strokeWidth={2} />
                                                    <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>{log.details}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '900', background: '#f8fafc', padding: '3px 8px', borderRadius: '6px', border: '1px solid #f1f5f9' }}>{log.ipAddress || '-'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    {/* Log Integrity Card */}
                    <div className="card" style={{ border: 'none', padding: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', borderRadius: '24px', boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.3)', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120px', height: '120px', background: 'rgba(255,122,33,0.1)', filter: 'blur(50px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <Shield size={20} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Kayıt Bütünlüğü</h3>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.6', fontWeight: '500', position: 'relative', zIndex: 1 }}>
                            Audit logları salt-okunur olarak tutulur ve silinemez. Tüm kayıtlar <span style={{ color: '#fff', fontWeight: '900' }}>kriptografik imza</span> ile korunmaktadır.
                        </p>
                    </div>

                    {/* Quick Stats Card */}
                    <div className="card" style={{ border: 'none', padding: '24px', background: '#fff', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                        <h4 style={{ margin: '0 0 20px 0', fontSize: '1rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Search size={18} color="#64748b" /> Log Filtreleme
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zaman Aralığı</label>
                                <select style={{ padding: '12px 16px', borderRadius: '12px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '0.85rem', fontWeight: '700', color: '#111827', outline: 'none', width: '100%', cursor: 'pointer' }}>
                                    <option>Son 24 Saat</option>
                                    <option>Son 7 Gün</option>
                                    <option>Son 30 Gün</option>
                                    <option>Tüm Zamanlar</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: '16px', background: '#f0fdf4', border: '1px solid #dcfce7' }}>
                                <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: '800' }}>Bugünkü Olaylar</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#15803d' }}>{logs.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderRadius: '16px', background: '#fef2f2', border: '1px solid #fee2e2' }}>
                                <span style={{ fontSize: '0.9rem', color: '#991b1b', fontWeight: '800' }}>Kritik Değişimler</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: '900', color: '#b91c1c' }}>{logs.filter(l => l.action.includes('DELETE') || l.action.includes('PERMISSION')).length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Retention Widget */}
                    <div style={{ padding: '24px', borderRadius: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                <Database size={24} color="#64748b" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h5 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log Saklama Süresi</h5>
                                <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: '#ff7a21', fontWeight: '900' }}>Son 180 Gün Aktif</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
