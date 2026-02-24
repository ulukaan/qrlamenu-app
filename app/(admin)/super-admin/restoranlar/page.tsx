"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, Plus, Store, PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminRestoranlar() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/tenants');
            const data = await res.json();
            if (Array.isArray(data)) {
                setTenants(data);
            }
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem 3rem', width: '100%', maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#111827', letterSpacing: '-0.04em' }}>İşletme Portföy Yönetimi</h2>
                    <p style={{ color: '#6b7280', marginTop: '6px', fontSize: '0.95rem', fontWeight: '500' }}>Platformdaki tüm kayıtlı restoranları, aktif abonelikleri ve deneme süreçlerini tek panelden yönetin.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/super-admin/restoranlar/yeni" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary" style={{ padding: '12px 28px', borderRadius: '14px', fontWeight: '900', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(255, 122, 33, 0.2)' }}>
                            <PlusCircle size={20} /> Yeni İşletme Kaydı Oluştur
                        </button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                {/* Main Table Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ border: 'none', padding: 0, overflow: 'hidden', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0, color: '#111827' }}>Kayıtlı İşletmeler <span style={{ color: '#ff7a21', marginLeft: '10px', fontSize: '0.85rem', fontWeight: '800' }}>({filteredTenants.length} Toplam Kayıt)</span></h3>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        placeholder="İşletme adı veya sahip ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ padding: '12px 15px 12px 48px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '0.9rem', width: '320px', background: '#fcfcfc', outline: 'none', fontWeight: '800', transition: 'all 0.2s' }}
                                        className="focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ background: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>İşletme Profili</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mülkiyet & İletişim</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operasyonel Durum</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Abonelik Modeli</th>
                                        <th style={{ padding: '20px 32px', textAlign: 'right', fontSize: '0.75rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Yönetim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '80px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#64748b' }}>
                                                    <Loader2 size={40} className="animate-spin" style={{ color: '#ff7a21' }} />
                                                    <span style={{ fontSize: '1rem', fontWeight: '800' }}>Veritabanı senkronize ediliyor...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ padding: '100px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', color: '#cbd5e1' }}>
                                                    <Store size={64} strokeWidth={1.5} />
                                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>Kriterlere uygun kayıt bulunamadı.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredTenants.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'all 0.2s' }} className="table-row-hover">
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                                    <div style={{ width: '56px', height: '56px', background: '#fff', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', overflow: 'hidden', border: '2px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                                                        {item.logoUrl ? <img src={item.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Store size={26} />}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontWeight: '900', color: '#111827', fontSize: '1.05rem' }}>{item.name}</p>
                                                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', fontFamily: 'monospace', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>ID: {item.id.substring(0, 8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <p style={{ margin: 0, fontSize: '0.95rem', color: '#111827', fontWeight: '800' }}>{item.ownerEmail.split('@')[0].toUpperCase()}</p>
                                                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6b7280', fontWeight: '500' }}>{item.ownerEmail}</p>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    background: item.status === 'ACTIVE' ? '#ecfdf5' : item.status === 'TRIAL' ? '#fff7ed' : '#f9fafb',
                                                    color: item.status === 'ACTIVE' ? '#10b981' : item.status === 'TRIAL' ? '#ff7a21' : '#64748b',
                                                    padding: '8px 16px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '900',
                                                    border: '1px solid currentColor'
                                                }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }}></div>
                                                    {item.status === 'ACTIVE' ? 'AKTİF' : item.status === 'TRIAL' ? 'DENEME' : 'PASİF'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px 32px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#111827' }}>{item.plan?.name || 'PLAN BELİRTİLMEMİŞ'}</span>
                                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600', marginTop: '4px' }}>Kurumsal SaaS Modeli</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '24px 32px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                    <Link href={`/super-admin/restoranlar/${item.id}`} style={{ textDecoration: 'none' }}>
                                                        <button style={{ height: '42px', padding: '0 20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }} className="hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/10">
                                                            <Edit size={16} /> İncele & Düzenle
                                                        </button>
                                                    </Link>
                                                    <button style={{ width: '42px', height: '42px', borderRadius: '12px', border: 'none', background: '#fff1f2', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} className="hover:bg-rose-500 hover:text-white">
                                                        <Trash2 size={18} />
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

                {/* Right Sidebar Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'sticky', top: '2rem', height: 'fit-content' }}>
                    <div className="card" style={{ border: 'none', padding: '32px', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                            <div style={{ background: '#fff7ed', color: '#ff7a21', padding: '10px', borderRadius: '12px' }}>
                                <Filter size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111827' }}>Akıllı Filtreleme</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operasyonel Durum</label>
                                <select style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f9fafb', fontSize: '0.9rem', fontWeight: '800', color: '#111827', outline: 'none', cursor: 'pointer' }} className="focus:border-orange-400">
                                    <option>Tüm İşletmeler</option>
                                    <option>Sadece Aktifler</option>
                                    <option>Deneme Sürümündekiler</option>
                                    <option>İptal Edilmişler</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Abonelik Paketi</label>
                                <select style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f9fafb', fontSize: '0.9rem', fontWeight: '800', color: '#111827', outline: 'none', cursor: 'pointer' }} className="focus:border-orange-400">
                                    <option>Tüm Paketler</option>
                                    <option>Başlangıç (Starter)</option>
                                    <option>Profesyonel (Pro)</option>
                                    <option>Growth+</option>
                                    <option>Kurumsal (Enterprise)</option>
                                </select>
                            </div>
                            <button style={{ width: '100%', padding: '16px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '0.9rem', fontWeight: '900', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.2)', transition: 'all 0.2s' }} className="hover:bg-slate-800">
                                Filtreleri Uygula
                            </button>
                        </div>
                    </div>

                    <div className="card" style={{ border: 'none', padding: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }}></div>
                            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Anlık Ekosistem</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: '700' }}>Toplam Restoran</span>
                                <span style={{ fontSize: '1.75rem', fontWeight: '900', letterSpacing: '-0.02em' }}>{tenants.length}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#10b981', fontWeight: '900' }}>Aktif Lisanslar</span>
                                <span style={{ fontWeight: '900' }}>{tenants.filter(t => t.status === 'ACTIVE').length}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: '#ff7a21', fontWeight: '900' }}>Deneme Sürümleri</span>
                                <span style={{ fontWeight: '900' }}>{tenants.filter(t => t.status === 'TRIAL').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
