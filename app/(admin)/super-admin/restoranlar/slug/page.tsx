"use client";
import React from 'react';
import { Search, Globe, Shield, ExternalLink, RefreshCw } from 'lucide-react';

export default function SlugYonetimi() {
    const [tenants, setTenants] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchTenants = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/admin/slug');
                if (!res.ok) throw new Error('Domain verileri yüklenemedi');
                const data = await res.json();
                setTenants(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    return (
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '100%' }}>
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.03em' }}>Domain & Slug Yönetimi</h2>
                    <p style={{ color: '#666', marginTop: '4px', fontSize: '0.95rem' }}>Erişim adresleri ve özel alan adı yönlendirmeleri.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Globe size={18} /> Yeni Eşleme Ekle
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', margin: 0 }}>Aktif Yönlendirmeler</h3>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Slug veya domain ara..."
                                    style={{ padding: '10px 16px 10px 36px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', width: '220px', outline: 'none' }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Restoran</th>
                                        <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Erişim Slug</th>
                                        <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Özel Domain</th>
                                        <th style={{ padding: '16px 32px', textAlign: 'left', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>SSL</th>
                                        <th style={{ padding: '16px 32px', textAlign: 'right', fontSize: '0.7rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center' }}>
                                                <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto', color: '#ff7a21' }} />
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#ef4444', fontWeight: '700' }}>{error}</td>
                                        </tr>
                                    ) : tenants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#94a3b8', fontWeight: '600' }}>Kayıtlı yönlendirme bulunamadı.</td>
                                        </tr>
                                    ) : tenants.map((row) => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }} className="table-row-hover">
                                            <td style={{ padding: '20px 32px' }}>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b' }}>{row.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>ID: {row.id.substring(0, 8)}...</div>
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff7a21', fontSize: '0.85rem', fontWeight: '800', background: '#fff7f2', padding: '6px 12px', borderRadius: '8px', border: '1px solid #ffe0cc', width: 'fit-content' }}>
                                                    <Globe size={14} /> /r/{row.slug}
                                                </div>
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                {row.customDomain ? (
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        {row.customDomain} <ExternalLink size={12} color="#94a3b8" />
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontStyle: 'italic' }}>Tanımlanmamış</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '20px 32px' }}>
                                                {row.customDomain ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.7rem', fontWeight: '900', background: '#f0fdf4', padding: '4px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                                                        <Shield size={12} /> SSL AKTİF
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    <button style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Ziyaret Et"><ExternalLink size={16} /></button>
                                                    <button style={{ height: '36px', padding: '0 16px', borderRadius: '8px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '800', fontSize: '0.8rem', cursor: 'pointer' }}>Yönet</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Domain Özeti</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>Toplam Kayıt</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>{tenants.length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>Özel Domain</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ff7a21' }}>{tenants.filter(t => t.customDomain).length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8' }}>Aktif SSL</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#4ade80' }}>{tenants.filter(t => t.customDomain).length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '24px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <Shield size={20} color="#ff7a21" style={{ marginTop: '2px' }} />
                            <div>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: '800', color: '#1e293b' }}>SSL & Güvenlik</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', lineHeight: '1.5' }}>
                                    Tüm özel domain yönlendirmeleri için **Let's Encrypt** SSL sertifikaları sistem tarafından otomatik olarak oluşturulur ve 3 ayda bir yenilenir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
