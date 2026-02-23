"use client";
import React, { useState } from 'react';
import { Search, Globe, Shield, ExternalLink, RefreshCw, X, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function SlugYonetimi() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal & Editing State
    const [editingTenant, setEditingTenant] = useState<any>(null);
    const [newSlug, setNewSlug] = useState('');
    const [newCustomDomain, setNewCustomDomain] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    React.useEffect(() => {
        fetchTenants();
    }, []);

    const handleEdit = (tenant: any) => {
        setEditingTenant(tenant);
        setNewSlug(tenant.slug);
        setNewCustomDomain(tenant.customDomain || '');
        setMessage(null);
    };

    const handleUpdate = async () => {
        if (!editingTenant) return;
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/slug', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: editingTenant.id,
                    slug: newSlug,
                    customDomain: newCustomDomain || null
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Erişim ayarları başarıyla güncellendi!' });
                fetchTenants();
                setTimeout(() => setEditingTenant(null), 1500);
            } else {
                setMessage({ type: 'error', text: data.error || 'Güncelleme başarısız oldu.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Bağlantı hatası oluştu.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ padding: '2.5rem 3.5rem', width: '100%', maxWidth: '100%' }}>
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em', margin: 0 }}>Domain & Slug Yönetimi</h2>
                    <p style={{ color: '#64748b', marginTop: '8px', fontSize: '1rem', fontWeight: '500' }}>Erişim adresleri ve özel alan adı yönlendirmeleri.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
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
                            cursor: 'pointer'
                        }}
                        className="hover:scale-105 transition-transform"
                    >
                        <Globe size={22} strokeWidth={3} /> Yeni Eşleme Ekle
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', borderRadius: '28px' }}>
                        <div style={{ padding: '32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '900', margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Aktif Yönlendirmeler</h3>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text"
                                    placeholder="Slug veya domain ara..."
                                    style={{ padding: '14px 20px 14px 44px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '280px', outline: 'none', fontWeight: '500' }}
                                />
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f8fafc' }}>
                                    <tr>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Restoran</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Erişim Slug</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Özel Domain</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SSL</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '100px', textAlign: 'center' }}>
                                                <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto', color: '#ff7a21' }} />
                                            </td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: '#ef4444', fontWeight: '800' }}>{error}</td>
                                        </tr>
                                    ) : tenants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '100px', textAlign: 'center', color: '#94a3b8', fontWeight: '700', fontSize: '1.1rem' }}>Kayıtlı yönlendirme bulunamadı.</td>
                                        </tr>
                                    ) : tenants.map((row) => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid #f8fafc' }} className="table-row-hover group">
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ fontSize: '1rem', fontWeight: '900', color: '#1e293b', marginBottom: '4px' }}>{row.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700' }}>ID: {row.id.substring(0, 12).toUpperCase()}</div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ff7a21', fontSize: '0.9rem', fontWeight: '900', background: '#fff7f2', padding: '8px 16px', borderRadius: '12px', border: '1px solid #ffe0cc' }}>
                                                    <Globe size={16} strokeWidth={2.5} /> /r/{row.slug}
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                {row.customDomain ? (
                                                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        {row.customDomain} <ExternalLink size={14} color="#94a3b8" />
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: '600', fontStyle: 'italic' }}>Tanımlanmamış</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                {row.customDomain ? (
                                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '0.7rem', fontWeight: '900', background: '#f0fdf4', padding: '6px 12px', borderRadius: '10px', border: '1px solid #dcfce7', letterSpacing: '0.05em' }}>
                                                        <Shield size={14} fill="#10b981" fillOpacity={0.2} /> SSL AKTİF
                                                    </div>
                                                ) : '-'}
                                            </td>
                                            <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                                    <button
                                                        onClick={() => window.open(`http://${row.slug}.qrlamenu.com`, '_blank')}
                                                        style={{ width: '44px', height: '44px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                        className="hover:bg-slate-50"
                                                        title="Ziyaret Et"
                                                    >
                                                        <ExternalLink size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(row)}
                                                        style={{ height: '44px', padding: '0 24px', borderRadius: '14px', border: 'none', background: '#f1f5f9', color: '#475569', fontWeight: '900', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
                                                        className="hover:bg-slate-200"
                                                    >
                                                        Yönet
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2.5rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#fff', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '900', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94a3b8' }}>Domain Özeti</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Toplam Kayıt</span>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>{tenants.length}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>Özel Domain</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ff7a21' }}>{tenants.filter(t => t.customDomain).length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#94a3b8' }}>Aktif SSL</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{tenants.filter(t => t.customDomain).length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', borderRadius: '28px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <div style={{ background: '#fff7ed', padding: '12px', borderRadius: '16px' }}>
                                <Shield size={24} color="#ff7a21" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '900', color: '#111827' }}>SSL & Güvenlik</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: '1.7', fontWeight: '500' }}>
                                    Tüm özel domain yönlendirmeleri için **Let's Encrypt** SSL sertifikaları otomatik oluşturulur.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal - Apple Style Minimalist */}
            {editingTenant && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '540px', borderRadius: '32px', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                        <div style={{ padding: '40px', position: 'relative' }}>
                            <button
                                onClick={() => setEditingTenant(null)}
                                style={{ position: 'absolute', top: '32px', right: '32px', width: '40px', height: '40px', borderRadius: '14px', background: '#f8fafc', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                className="hover:bg-slate-100 transition-colors"
                            >
                                <X size={20} strokeWidth={3} />
                            </button>

                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ width: '64px', height: '64px', background: '#fff7ed', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                                    <Globe size={32} color="#ff7a21" strokeWidth={2.5} />
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.04em' }}>Erişim Ayarları</h3>
                                <p style={{ color: '#64748b', fontWeight: '600', marginTop: '8px' }}>{editingTenant.name} için bağlantı bilgilerini güncelle.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Erişim Slug (URL Uzantısı)</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: '700', fontSize: '1rem' }}>/r/</span>
                                        <input
                                            type="text"
                                            value={newSlug}
                                            onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            style={{ width: '100%', padding: '18px 20px 18px 48px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '1.05rem', fontWeight: '800', outline: 'none', color: '#111827' }}
                                            placeholder="restoran-adi"
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', fontWeight: '600' }}>Örn: qrlamenu.com/r/{newSlug || 'restoran-adi'}</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#64748b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Özel Domain (Opsiyonel)</label>
                                    <input
                                        type="text"
                                        value={newCustomDomain}
                                        onChange={(e) => setNewCustomDomain(e.target.value.toLowerCase())}
                                        style={{ width: '100%', padding: '18px 20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '1.05rem', fontWeight: '800', outline: 'none', color: '#111827' }}
                                        placeholder="menu.restoran.com"
                                    />
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', fontWeight: '600' }}>CNAME kaydı `qrlamenu.com` adresine yönlendirilmiş olmalıdır.</p>
                                </div>

                                {message && (
                                    <div style={{
                                        padding: '16px 20px',
                                        borderRadius: '16px',
                                        background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                        color: message.type === 'success' ? '#15803d' : '#b91c1c',
                                        fontSize: '0.9rem',
                                        fontWeight: '800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        border: `1px solid ${message.type === 'success' ? '#dcfce7' : '#fee2e2'}`
                                    }}>
                                        {message.type === 'success' ? <Check size={20} strokeWidth={3} /> : <AlertCircle size={20} strokeWidth={3} />}
                                        {message.text}
                                    </div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                                    <button
                                        onClick={() => setEditingTenant(null)}
                                        style={{ height: '64px', borderRadius: '20px', border: '2px solid #f1f5f9', background: '#fff', color: '#64748b', fontSize: '1rem', fontWeight: '900', cursor: 'pointer' }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >İptal</button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        style={{
                                            height: '64px',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: '#111827',
                                            color: '#fff',
                                            fontSize: '1rem',
                                            fontWeight: '900',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)'
                                        }}
                                        className="hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={24} /> : 'Değişiklikleri Kaydet'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .table-row-hover:hover {
                    background-color: #fbfcfd;
                }
                .btn-primary:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}
